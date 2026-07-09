import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import fs from "fs";
import path from "path";
import { removeFullTextDetails } from "../src/utils/markdown";

// Notion 클라이언트 초기화 (notion-to-md에서 사용)
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

const NOTION_TOKEN = process.env.NOTION_TOKEN!;

type BlogSection = "tech" | "study" | "log";

// Notion 데이터베이스 설정
const DATABASES: Array<{
  section: BlogSection;
  databaseId?: string;
}> = [
  {
    section: "tech",
    databaseId: process.env.NOTION_TECH_DATABASE_ID || process.env.NOTION_DATABASE_ID,
  },
  {
    section: "study",
    databaseId: process.env.NOTION_STUDY_DATABASE_ID,
  },
  {
    section: "log",
    databaseId: process.env.NOTION_LOG_DATABASE_ID,
  },
];

interface Post {
  id: string;
  title: string;
  section: BlogSection;
  category: string;
  tags: string[];
  date: string;
  published: boolean;
  thumbnail?: string;
  content: string;
}

interface NotionPage {
  id: string;
  object: string;
  properties: {
    title?: {
      type: "title";
      title: Array<{ plain_text: string }>;
    };
    category?: {
      type: "select";
      select?: { name: string };
    };
    tags?: {
      type: "multi_select";
      multi_select: Array<{ name: string }>;
    };
    date?: {
      type: "date";
      date?: { start: string };
    };
    published?: {
      type: "status" | "checkbox";
      status?: { name: string };
      checkbox?: boolean;
    };
    thumbnail?: {
      type: "url";
      url?: string;
    };
  };
}

// Notion DB 페이지 목록 조회
async function fetchDatabasePages(databaseId: string) {
  const pages: NotionPage[] = [];
  let startCursor: string | undefined;

  do {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NOTION_TOKEN}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sorts: [
            {
              property: "date",
              direction: "descending",
            },
          ],
          start_cursor: startCursor,
        }),
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Notion API 에러: ${response.status} ${errorBody}`);
    }

    const data = await response.json();
    pages.push(...data.results);
    startCursor = data.has_more ? data.next_cursor : undefined;
  } while (startCursor);

  return pages;
}

// Notion 페이지 변환
async function toPost(page: NotionPage, section: BlogSection): Promise<Post | null> {
  if (page.object !== "page") return null;

  const properties = page.properties;

  // 제목 추출
  const title =
    properties.title?.type === "title"
      ? properties.title.title[0]?.plain_text || ""
      : "";

  // 카테고리 추출
  const category =
    properties.category?.type === "select"
      ? properties.category.select?.name || ""
      : "";

  // 태그 추출
  const tags =
    properties.tags?.type === "multi_select"
      ? properties.tags.multi_select.map((tag) => tag.name)
      : [];

  // 날짜 추출
  const date =
    properties.date?.type === "date" ? properties.date.date?.start || "" : "";

  // published 상태 추출
  const published =
    properties.published?.type === "status"
      ? properties.published.status?.name !== "비활성"
      : properties.published?.type === "checkbox"
        ? properties.published.checkbox === true
        : true;

  // 썸네일 추출
  const thumbnail =
    properties.thumbnail?.type === "url"
      ? properties.thumbnail.url || undefined
      : undefined;

  // 본문 내용을 Markdown으로 변환
  const mdBlocks = await n2m.pageToMarkdown(page.id);
  const content = removeFullTextDetails(n2m.toMarkdownString(mdBlocks).parent);

  return {
    id: page.id,
    title,
    section,
    category,
    tags,
    date,
    published,
    thumbnail,
    content,
  };
}

async function fetchPosts() {
  try {
    if (!NOTION_TOKEN) {
      throw new Error("NOTION_TOKEN이 필요합니다.");
    }

    const activeDatabases = DATABASES.filter((database) => database.databaseId);

    if (activeDatabases.length === 0) {
      throw new Error("Notion 데이터베이스 ID가 필요합니다.");
    }

    const posts: Post[] = [];

    // 섹션별 데이터베이스 조회
    for (const database of activeDatabases) {
      const pages = await fetchDatabasePages(database.databaseId!);
      const sectionPosts = await Promise.all(
        pages.map((page) => toPost(page, database.section)),
      );

      posts.push(...sectionPosts.filter((post): post is Post => Boolean(post)));
    }

    // 최신순 정렬
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // JSON 파일로 저장
    const outputPath = path.join(process.cwd(), "src/data/posts.json");
    fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2), "utf-8");

    console.log(`${posts.length}개의 글을 가져왔습니다.`);
    console.log("저장 위치:", outputPath);
  } catch (error) {
    console.error("에러 발생:", error);
    process.exit(1);
  }
}

fetchPosts();
