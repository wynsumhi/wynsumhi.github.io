/**
 * 블로그 관련 타입 정의
 *
 * Notion API에서 가져온 블로그 포스트 데이터의 타입을 정의합니다.
 * scripts/fetch-notion.ts가 Notion에서 데이터를 가져와 posts.json으로 저장하고,
 * 이 타입들은 해당 JSON 데이터와 1:1로 매칭됩니다.
 */

/** 블로그 포스트의 전체 데이터 타입 */
export interface Post {
  id: string; // Notion 페이지 고유 ID
  title: string; // 포스트 제목
  content: string; // 마크다운 형식의 본문 내용
  date: string; // 작성일 (YYYY-MM-DD 형식)
  category: PostCategory; // 카테고리 분류
  tags: string[]; // 태그 목록 (예: ["React", "TypeScript"])
  excerpt?: string; // 본문 요약 (선택적 필드)
  thumbnail?: string; // 썸네일 이미지 URL (선택적 필드)
  published: boolean; // 공개 여부 (true = 공개)
}

/**
 * 포스트 카테고리 타입
 * Notion 데이터베이스의 카테고리 select 필드와 매칭
 */
export type PostCategory =
  | "Frontend"
  | "Backend"
  | "DevOps"
  | "Design"
  | "etc";

/**
 * 포스트 미리보기 타입
 * 목록 페이지에서 사용 - content(본문)를 제외하고 excerpt(요약)를 필수로 가짐
 * Omit<Post, "content">: Post에서 content 필드를 제거한 타입
 */
export interface PostPreview extends Omit<Post, "content"> {
  excerpt: string;
}
