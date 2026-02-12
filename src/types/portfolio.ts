/**
 * 포트폴리오 관련 타입 정의
 *
 * 포트폴리오 페이지에서 사용하는 프로젝트와 기술 스택의 타입을 정의합니다.
 * 데이터는 src/data/projects.ts, src/data/skills.ts에서 관리됩니다.
 */

/** 프로젝트 데이터 타입 */
export interface Project {
  id: string; // 프로젝트 고유 ID
  title: string; // 프로젝트 이름
  description: string; // 프로젝트 설명
  thumbnail: string; // 썸네일 이미지 URL
  tech: string[]; // 사용 기술 목록 (예: ["React", "TypeScript"])
  links: {
    github?: string; // GitHub 저장소 URL (선택)
    demo?: string; // 데모/배포 URL (선택)
  };
  period: {
    start: string; // 시작일 (예: "2026-02")
    end?: string; // 종료일 (없으면 "진행 중")
  };
}

/** 기술 스택 카테고리 타입 */
export interface Skill {
  category: "Frontend" | "Backend" | "DevOps" | "Design"; // 카테고리 분류
  items: SkillItem[]; // 해당 카테고리의 기술 목록
}

/** 개별 기술 항목 타입 */
export interface SkillItem {
  name: string; // 기술명 (예: "React", "TypeScript")
  level: 1 | 2 | 3 | 4 | 5; // 숙련도 (1=입문, 5=고급)
  icon?: string; // 아이콘 URL 또는 이름 (선택)
}
