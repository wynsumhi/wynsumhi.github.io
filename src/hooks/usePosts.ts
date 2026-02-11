import { useState, useEffect } from "react";
import postsData from "../data/posts.json";
import type { Post, PostCategory } from "../types/blog";

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 실제로는 여기서 API 호출을 하겠지만, 지금은 JSON 파일에서 데이터 불러오기
    setPosts(postsData as Post[]);
    setLoading(false);
  }, []);

  // 카테고리별 필터링
  const getPostsByCategory = (category: PostCategory) => {
    return posts.filter((post) => post.category === category);
  };

  // 태그별 필터링
  const getPostsByTag = (tag: string) => {
    return posts.filter((post) => post.tags.includes(tag));
  };

  // 최신순 정렬
  const getRecentPosts = (limit: number = 5) => {
    return posts
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  // 검색
  const searchPosts = (keyword: string) => {
    const lowerKeyword = keyword.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerKeyword) ||
        post.content.toLowerCase().includes(lowerKeyword),
    );
  };

  return {
    posts,
    loading,
    getPostsByCategory,
    getPostsByTag,
    getRecentPosts,
    searchPosts,
  };
};
