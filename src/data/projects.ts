/**
 * 프로젝트 데이터
 *
 * 포트폴리오 페이지와 홈 화면에서 사용하는 대표 프로젝트 목록입니다
 */
import type { Project } from "@/types/portfolio";

export const projects: Project[] = [
  {
    id: "gseps-homepage",
    title: "GSEPS 홈페이지 구축",
    description:
      "기획/디자인 문서를 기준으로 전체 웹 페이지 마크업과 동적 UI를 구현했습니다. 반응형 레이아웃, Google Charts, Slick Slider, GSAP 기반 인터랙션을 적용해 서비스 소개 화면의 완성도를 높였습니다.",
    thumbnail: "https://picsum.photos/800/400?random=10",
    tech: ["HTML", "SCSS", "JavaScript", "GSAP", "Google Charts"],
    links: {
      demo: "https://www.gseps.com/",
    },
    period: {
      start: "2023-04",
      end: "2023-10",
    },
  },
  {
    id: "buildtalk-app",
    title: "BuildTalk 앱 구축",
    description:
      "사용자 흐름을 정리하고 UI 기획과 프로토타입 제작에 참여했습니다. Flutter 기반 화면 구조를 이해하며 모바일 서비스의 사용성과 화면 전환 흐름을 함께 설계했습니다.",
    thumbnail: "https://picsum.photos/800/400?random=11",
    tech: ["Flutter", "Dart", "Figma", "Miro", "UI/UX"],
    links: {
      demo: "https://play.google.com/store/apps/details?id=it.buildtec.buildtalk&hl=ko",
    },
    period: {
      start: "2023-10",
      end: "2024-03",
    },
  },
  {
    id: "okocc-homepage",
    title: "OKOCC 홈페이지 지원",
    description:
      "웹 표준을 기준으로 반응형 페이지와 동적 UI를 구현했습니다. 라이브러리를 활용한 슬라이드/콘텐츠 영역을 구성하고 유지보수 가능한 마크업 구조를 정리했습니다.",
    thumbnail: "https://picsum.photos/800/400?random=12",
    tech: ["HTML", "CSS", "JavaScript", "Responsive Web", "Slick Slider"],
    links: {
      demo: "https://okocc.or.kr/homepage/index.do",
    },
    period: {
      start: "2024-04",
      end: "2024-06",
    },
  },
  {
    id: "platform-homepage",
    title: "사내 플랫폼 홈페이지 구축",
    description:
      "관리자가 데이터를 등록하고 확인할 수 있는 플랫폼 화면을 구현했습니다. 파일 업로드, 조건별 스타일 처리, 경력/급여 계산, 카카오 API 기반 주소 검색 등 업무 흐름에 필요한 기능을 화면에 연결했습니다.",
    thumbnail: "https://picsum.photos/800/400?random=13",
    tech: ["JavaScript", "Thymeleaf", "Spring Boot", "Kakao API", "SSR"],
    links: {},
    period: {
      start: "2024-08",
      end: "2025-01",
    },
  },
  {
    id: "portfolio-blog",
    title: "개인 포트폴리오 블로그",
    description:
      "React와 TypeScript로 만든 개인 포트폴리오입니다. Notion API로 Tech Blog 글을 가져오고 GitHub Actions를 통해 GitHub Pages에 배포합니다.",
    thumbnail: "https://picsum.photos/800/400?random=14",
    tech: ["React", "TypeScript", "MUI", "Vite", "Notion API"],
    links: {
      github: "https://github.com/wynsumhi",
    },
    period: {
      start: "2026-02",
    },
  },
];
