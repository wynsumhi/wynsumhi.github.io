/**
 * usePosts 커스텀 훅
 *
 * Notion API에서 가져온 블로그 포스트 데이터(posts.json)를 로드하고
 * 필터링, 검색 등의 유틸리티 함수를 제공합니다.
 *
 * 사용법:
 *   const { posts, loading, error, getRecentPosts } = usePosts();
 *
 * 데이터 흐름:
 *   Notion → fetch-notion.ts → posts.json → usePosts (동적 import) → 컴포넌트
 */
import { useState, useEffect } from "react";
import type { Post, PostCategory } from "@/types/blog";

export const usePosts = () => {
  // posts: 로드된 포스트 배열, loading: 로딩 상태, error: 에러 메시지
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 컴포넌트 마운트 시 포스트 데이터를 비동기로 로드
  useEffect(() => {
    const loadPosts = async () => {
      try {
        // 동적 import: 빌드 시 코드 스플리팅되어 필요할 때만 JSON을 로드
        const data = await import("@/data/posts.json");
        // data.default: ES 모듈의 기본 내보내기 (JSON 배열)
        // JSON 동적 import 시 TS가 추론하는 타입과 Post[]가 완전히 일치하지 않으므로
        // unknown을 거쳐 안전하게 변환 (빌드 시점에 fetch-notion이 올바른 구조를 보장)
        setPosts(data.default as unknown as Post[]);
      } catch (err) {
        console.error("포스트 데이터 로드 실패:", err);
        setError("포스트 데이터를 불러오는 데 실패했습니다.");
        setPosts([]); // 에러 시 빈 배열로 초기화
      } finally {
        // try든 catch든 항상 실행 - 로딩 완료 처리
        setLoading(false);
      }
    };

    loadPosts();
  }, []); // 빈 의존성 배열 = 컴포넌트 최초 마운트 시 1회만 실행

  /** 카테고리별 필터링 (예: "Frontend" 카테고리의 포스트만 가져오기) */
  const getPostsByCategory = (category: PostCategory) => {
    return posts.filter((post) => post.category === category);
  };

  /** 특정 태그를 포함하는 포스트 필터링 */
  const getPostsByTag = (tag: string) => {
    return posts.filter((post) => post.tags.includes(tag));
  };

  /** 최신순으로 정렬하여 상위 N개 반환 (기본값: 5개) */
  const getRecentPosts = (limit: number = 5) => {
    return [...posts] // 원본 배열을 변경하지 않기 위해 복사본 사용
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  /** 키워드로 제목 + 본문 검색 (대소문자 구분 없음) */
  const searchPosts = (keyword: string) => {
    const lowerKeyword = keyword.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerKeyword) ||
        post.content.toLowerCase().includes(lowerKeyword),
    );
  };

  return {
    posts, // 전체 포스트 배열
    loading, // 로딩 중 여부
    error, // 에러 메시지 (없으면 null)
    getPostsByCategory, // 카테고리 필터
    getPostsByTag, // 태그 필터
    getRecentPosts, // 최신 포스트
    searchPosts, // 키워드 검색
  };
};
