/**
 * useProjects 커스텀 훅
 *
 * 포트폴리오 페이지에서 사용하는 프로젝트 및 기술 스택 데이터를 제공합니다.
 *
 * usePosts와 달리 정적 데이터(TypeScript 파일)를 직접 import하므로
 * 비동기 로딩이 필요 없고 loading/error 상태도 없습니다.
 *
 * 사용법:
 *   const { projects, skills } = useProjects();
 */
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";

export const useProjects = () => {
  return {
    projects, // 프로젝트 목록 (Project[] 타입)
    skills, // 기술 스택 목록 (Skill[] 타입)
  };
};
