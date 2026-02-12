import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import fs from "fs";
import path from "path";

// Notion 클라이언트 초기화 (notion-to-md에서 사용)
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

const DATABASE_ID = process.env.NOTION_DATABASE_ID!;
const NOTION_TOKEN = process.env.NOTION_TOKEN!;

interface Post {
  id: string;
  title: string;
  category: string;
  tags: string[];
  date: string;
  published: boolean;
  thumbnail?: string;
  content: string;
}

async function fetchPosts() {
  try {
    // SDK v5의 dataSources.query()가 호환 문제가 있어 REST API 직접 호출
    const response = await fetch(
      `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
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
        }),
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Notion API 에러: ${response.status} ${errorBody}`);
    }

    const data = await response.json();
    const posts: Post[] = [];

    // 각 페이지(글)마다 처리
    for (const page of data.results) {
      if (page.object !== "page") continue;

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
          ? properties.tags.multi_select.map((tag: { name: string }) => tag.name)
          : [];

      // 날짜 추출
      const date =
        properties.date?.type === "date"
          ? properties.date.date?.start || ""
          : "";

      // published 상태 추출
      const published =
        properties.published?.type === "status"
          ? properties.published.status?.name !== "비활성"
          : true;

      // 썸네일 추출 (url 타입)
      const thumbnail =
        properties.thumbnail?.type === "url"
          ? properties.thumbnail.url || undefined
          : undefined;

      // 본문 내용을 Markdown으로 변환
      const mdBlocks = await n2m.pageToMarkdown(page.id);
      const content = n2m.toMarkdownString(mdBlocks).parent;

      posts.push({
        id: page.id,
        title,
        category,
        tags,
        date,
        published,
        thumbnail,
        content,
      });
    }

    // JSON 파일로 저장
    const outputPath = path.join(process.cwd(), "src/data/posts.json");
    fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2), "utf-8");

    console.log(`${posts.length}개의 글을 가져왔습니다!`);
    console.log("저장 위치:", outputPath);
  } catch (error) {
    console.error("에러 발생:", error);
    process.exit(1);
  }
}

fetchPosts();
