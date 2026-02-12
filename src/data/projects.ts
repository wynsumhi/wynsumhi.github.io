/**
 * 프로젝트 데이터
 *
 * 포트폴리오 페이지에 표시할 프로젝트 목록입니다.
 * 새 프로젝트를 추가하려면 이 배열에 객체를 추가하면 됩니다.
 *
 * 각 필드 설명은 src/types/portfolio.ts의 Project 인터페이스를 참고하세요.
 */
import type { Project } from "../types/portfolio";

export const projects: Project[] = [
  {
    id: "1",
    title: "포트폴리오 블로그",
    description:
      "React + TypeScript + MUI로 만든 개인 포트폴리오 및 블로그 사이트. Notion API를 활용하여 블로그 포스트를 자동으로 가져오고, GitHub Actions로 자동 배포합니다.",
    thumbnail: "https://picsum.photos/800/400?random=10",
    tech: ["React", "TypeScript", "MUI", "Vite", "Notion API"],
    links: {
      github: "https://github.com/wynsumhi",
    },
    period: {
      start: "2026-02",
    },
  },
  {
    id: "2",
    title: "할 일 관리 앱",
    description:
      "React로 만든 할 일 관리 앱. 로컬 스토리지를 활용한 데이터 저장, 카테고리 분류, 마감일 알림 기능을 포함합니다.",
    thumbnail: "https://picsum.photos/800/400?random=11",
    tech: ["React", "TypeScript", "CSS Modules"],
    links: {
      github: "https://github.com/wynsumhi",
    },
    period: {
      start: "2026-01",
      end: "2026-01",
    },
  },
  {
    id: "3",
    title: "날씨 대시보드",
    description:
      "OpenWeather API를 활용한 날씨 정보 대시보드. 도시 검색, 5일 예보, 시각화 차트를 포함합니다.",
    thumbnail: "https://picsum.photos/800/400?random=12",
    tech: ["React", "JavaScript", "Chart.js", "REST API"],
    links: {
      github: "https://github.com/wynsumhi",
    },
    period: {
      start: "2025-12",
      end: "2025-12",
    },
  },
];
