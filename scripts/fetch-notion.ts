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
type ProjectKind = "work" | "side";

// Notion 데이터베이스 설정
const DATABASES: Array<{
  section: BlogSection;
  databaseId?: string;
}> = [
  {
    section: "tech",
    databaseId: process.env.NOTION_TECH_DATABASE_ID,
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

interface Project {
  id: string;
  kind: ProjectKind;
  title: string;
  description: string;
  thumbnail: string;
  tech: string[];
  links: {
    github?: string;
    demo?: string;
  };
  period: {
    start: string;
    end?: string;
  };
  detail?: {
    subtitle?: string;
    problem?: string;
    solution?: string;
    results?: string[];
    challenges?: string[];
    info?: {
      duration?: string;
      team?: string;
      role?: string;
    };
  };
}

interface NotionPage {
  id: string;
  object: string;
  properties: Record<string, NotionProperty>;
}

type NotionProperty =
  | {
      type: "title";
      title: Array<{ plain_text: string }>;
    }
  | {
      type: "select";
      select?: { name: string };
    }
  | {
      type: "multi_select";
      multi_select: Array<{ name: string }>;
    }
  | {
      type: "rich_text";
      rich_text: Array<{ plain_text: string }>;
    }
  | {
      type: "date";
      date?: { start: string; end?: string };
    }
  | {
      type: "status";
      status?: { name: string };
    }
  | {
      type: "checkbox";
      checkbox?: boolean;
    }
  | {
      type: "url";
      url?: string;
    }
  | {
      type: "number";
      number?: number;
    }
  | {
      type: string;
      [key: string]: unknown;
    };

// 속성 이름 조회
const getProperty = (properties: NotionPage["properties"], names: string[]) => {
  const normalizedNames = names.map((name) => name.toLowerCase());

  return Object.entries(properties).find(([name]) =>
    normalizedNames.includes(name.toLowerCase()),
  )?.[1];
};

const getTitleText = (properties: NotionPage["properties"], names: string[]) => {
  const property = getProperty(properties, names);

  return property?.type === "title"
    ? property.title.map((text) => text.plain_text).join("").trim()
    : "";
};

const getText = (properties: NotionPage["properties"], names: string[]) => {
  const property = getProperty(properties, names);

  if (property?.type === "rich_text") {
    return property.rich_text.map((text) => text.plain_text).join("").trim();
  }

  if (property?.type === "title") {
    return property.title.map((text) => text.plain_text).join("").trim();
  }

  if (property?.type === "select") {
    return property.select?.name ?? "";
  }

  if (property?.type === "url") {
    return property.url ?? "";
  }

  return "";
};

const getSelectName = (properties: NotionPage["properties"], names: string[]) => {
  const property = getProperty(properties, names);

  return property?.type === "select" ? property.select?.name ?? "" : "";
};

const getMultiSelectNames = (properties: NotionPage["properties"], names: string[]) => {
  const property = getProperty(properties, names);

  return property?.type === "multi_select"
    ? property.multi_select.map((tag) => tag.name)
    : [];
};

const getDateRange = (properties: NotionPage["properties"], names: string[]) => {
  const property = getProperty(properties, names);

  return property?.type === "date" ? property.date : undefined;
};

const getNumber = (properties: NotionPage["properties"], names: string[]) => {
  const property = getProperty(properties, names);

  return property?.type === "number" ? property.number : undefined;
};

const getList = (properties: NotionPage["properties"], names: string[]) =>
  getText(properties, names)
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

// 공개 여부 추출
const getPublished = (properties: NotionPage["properties"]) => {
  const property = getProperty(properties, ["published", "Published", "발행", "공개"]);
  const unpublishedNames = [
    "false",
    "no",
    "off",
    "비공개",
    "비활성",
    "비게시",
    "미발행",
    "숨김",
    "draft",
    "private",
    "unpublished",
    "hidden",
  ];

  if (!property) return true;
  if (property.type === "checkbox") return property.checkbox === true;

  if (property.type === "status") {
    const statusName = property.status?.name.toLowerCase() ?? "";
    return !unpublishedNames.includes(statusName);
  }

  if (property.type === "select") {
    const selectName = property.select?.name.toLowerCase() ?? "";
    return !unpublishedNames.includes(selectName);
  }

  return true;
};

// Notion DB 페이지 목록 조회
async function fetchDatabasePages(
  databaseId: string,
  sorts?: Array<{ property: string; direction: "ascending" | "descending" }>,
) {
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
          ...(sorts ? { sorts } : {}),
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
  const title = getTitleText(properties, ["title", "Title", "제목"]);

  // 카테고리 추출
  const categoryProperty = getProperty(properties, ["category", "Category", "카테고리"]);
  const category =
    categoryProperty?.type === "select"
      ? categoryProperty.select?.name || ""
      : "";

  // 태그 추출
  const tags = getMultiSelectNames(properties, ["tags", "Tags", "태그"]);

  // 날짜 추출
  const dateProperty = getProperty(properties, ["date", "Date", "날짜"]);
  const date =
    dateProperty?.type === "date" ? dateProperty.date?.start || "" : "";

  // published 상태 추출
  const published = getPublished(properties);

  if (!published) {
    return null;
  }

  // 썸네일 추출
  const thumbnailProperty = getProperty(properties, ["thumbnail", "Thumbnail", "썸네일"]);
  const thumbnail =
    thumbnailProperty?.type === "url"
      ? thumbnailProperty.url || undefined
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

const normalizeProjectKind = (kind: string): ProjectKind => {
  const normalizedKind = kind.toLowerCase();

  if (["side", "사이드", "개인", "personal"].includes(normalizedKind)) {
    return "side";
  }

  return "work";
};

const toMonth = (date?: string) => date?.slice(0, 7) ?? "";

function toProject(page: NotionPage): Project | null {
  if (page.object !== "page") return null;

  const properties = page.properties;
  const published = getPublished(properties);

  if (!published) {
    return null;
  }

  const title = getTitleText(properties, ["title", "Title", "제목", "프로젝트명", "Name"]);
  const dateRange = getDateRange(properties, ["period", "Period", "기간", "date", "Date", "날짜"]);
  const start = getText(properties, ["start", "Start", "시작일"]) || toMonth(dateRange?.start);
  const end = getText(properties, ["end", "End", "종료일"]) || toMonth(dateRange?.end);
  const demo = getText(properties, ["demo", "Demo", "배포", "데모", "site", "Site", "URL"]);
  const github = getText(properties, ["github", "GitHub", "깃허브", "repo", "Repository"]);
  const tech = getMultiSelectNames(properties, [
    "tech",
    "Tech",
    "기술",
    "기술스택",
    "stack",
    "Stack",
    "tags",
    "Tags",
    "태그",
  ]);

  if (!title || !start) {
    return null;
  }

  return {
    id: getText(properties, ["id", "ID", "slug", "Slug"]) || page.id,
    kind: normalizeProjectKind(
      getSelectName(properties, ["kind", "Kind", "구분", "type", "Type", "category", "Category", "카테고리"]),
    ),
    title,
    description: getText(properties, ["description", "Description", "설명", "요약"]),
    thumbnail: getText(properties, ["thumbnail", "Thumbnail", "썸네일", "image", "Image"]) || "",
    tech,
    links: {
      ...(github ? { github } : {}),
      ...(demo ? { demo } : {}),
    },
    period: {
      start,
      ...(end ? { end } : {}),
    },
    detail: {
      subtitle: getText(properties, ["subtitle", "Subtitle", "부제", "한줄소개"]),
      problem: getText(properties, ["problem", "Problem", "문제", "문제정의"]),
      solution: getText(properties, ["solution", "Solution", "해결", "해결방안"]),
      results: getList(properties, ["results", "Results", "성과", "결과"]),
      challenges: getList(properties, ["challenges", "Challenges", "도전", "기술적도전"]),
      info: {
        duration: getText(properties, ["duration", "Duration", "개발기간"]),
        team: getText(properties, ["team", "Team", "팀", "팀규모"]),
        role: getText(properties, ["role", "Role", "역할", "담당"]),
      },
    },
  };
}

const cleanProjects = (projects: Project[]) =>
  projects
    .map((project) => ({
      ...project,
      detail: project.detail
        ? {
            ...project.detail,
            results: project.detail.results?.length ? project.detail.results : undefined,
            challenges: project.detail.challenges?.length ? project.detail.challenges : undefined,
            info:
              project.detail.info?.duration || project.detail.info?.team || project.detail.info?.role
                ? project.detail.info
                : undefined,
          }
        : undefined,
    }))
    .map((project) => ({
      ...project,
      detail:
        project.detail?.subtitle ||
        project.detail?.problem ||
        project.detail?.solution ||
        project.detail?.results ||
        project.detail?.challenges ||
        project.detail?.info
          ? project.detail
          : undefined,
    }));

const createProjectsSource = (projects: Project[]) => `/**
 * 프로젝트 데이터
 *
 * Notion 프로젝트 데이터베이스에서 자동 생성됩니다.
 */
import type { Project } from "@/types/portfolio";

export const projects: Project[] = ${JSON.stringify(projects, null, 2)};
`;

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
      const pages = await fetchDatabasePages(database.databaseId!, [
        {
          property: "date",
          direction: "descending",
        },
      ]);
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

    if (process.env.NOTION_PROJECT_DATABASE_ID) {
      const projectPages = await fetchDatabasePages(process.env.NOTION_PROJECT_DATABASE_ID);
      if (projectPages.length === 0) {
        console.log("프로젝트 데이터베이스에 페이지가 없어 기존 프로젝트 파일을 유지합니다.");
        return;
      }

      const projects = cleanProjects(
        projectPages
          .map(toProject)
          .filter((project): project is Project => Boolean(project))
          .sort((a, b) => {
            const orderA = getNumber(
              projectPages.find((page) => page.id === a.id)?.properties ?? {},
              ["order", "Order", "순서"],
            );
            const orderB = getNumber(
              projectPages.find((page) => page.id === b.id)?.properties ?? {},
              ["order", "Order", "순서"],
            );

            if (orderA !== undefined || orderB !== undefined) {
              return (orderA ?? Number.MAX_SAFE_INTEGER) - (orderB ?? Number.MAX_SAFE_INTEGER);
            }

            return new Date(b.period.start).getTime() - new Date(a.period.start).getTime();
          }),
      );
      if (projects.length === 0) {
        console.log("변환 가능한 프로젝트가 없어 기존 프로젝트 파일을 유지합니다.");
        return;
      }

      const projectsOutputPath = path.join(process.cwd(), "src/data/projects.ts");
      fs.writeFileSync(projectsOutputPath, createProjectsSource(projects), "utf-8");

      console.log(`${projects.length}개의 프로젝트를 가져왔습니다.`);
      console.log("저장 위치:", projectsOutputPath);
    }
  } catch (error) {
    console.error("에러 발생:", error);
    process.exit(1);
  }
}

fetchPosts();
