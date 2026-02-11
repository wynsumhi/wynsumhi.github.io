import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import fs from "fs";
import path from "path";

// Notion 클라이언트 초기화
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

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
    // Notion 데이터베이스 쿼리
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: "Published",
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: "Date",
          direction: "descending", // 최신순
        },
      ],
    });

    const posts: Post[] = [];

    // 각 페이지(글)마다 처리
    for (const page of response.results) {
      if (!("properties" in page)) continue;

      const properties = page.properties;

      // 제목 추출
      const title =
        properties.Name?.type === "title"
          ? properties.Name.title[0]?.plain_text || ""
          : "";

      // 카테고리 추출
      const category =
        properties.Category?.type === "select"
          ? properties.Category.select?.name || ""
          : "";

      // 태그 추출
      const tags =
        properties.Tags?.type === "multi_select"
          ? properties.Tags.multi_select.map((tag) => tag.name)
          : [];

      // 날짜 추출
      const date =
        properties.Date?.type === "date"
          ? properties.Date.date?.start || ""
          : "";

      // 썸네일 추출
      const thumbnail =
        properties.Thumbnail?.type === "files" &&
        properties.Thumbnail.files.length > 0
          ? properties.Thumbnail.files[0].type === "external"
            ? properties.Thumbnail.files[0].external.url
            : properties.Thumbnail.files[0].file.url
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
        published: true,
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
