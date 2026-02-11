export interface Post {
  id: string;
  title: string;
  category: string;
  tags: string[];
  date: string;
  published: boolean;
  thumbnailUrl?: string;
  content: string;
}

export interface PostPreview extends Omit<Post, "content"> {
  excerpt: string; //  요약만 있고 전체 내용은 없음
}

export type PostCategory =
  | "Frontend"
  | "Backend"
  | "DevOps"
  | "Design"
  | "Tutorial"
  | "Opinion";
