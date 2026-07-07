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
      "패럴랙스 스크롤링을 이용한 반응형 웹 프로젝트입니다. 전체 페이지 퍼블리싱과 동적 UI 구현을 담당했고, GSAP, Google Charts, Slick Slider를 활용해 소개형 웹사이트의 인터랙션과 시각 요소를 구현했습니다.",
    thumbnail: "https://picsum.photos/800/400?random=10",
    tech: [
      "HTML",
      "CSS",
      "SCSS",
      "JavaScript",
      "GSAP",
      "Google Charts",
      "Slick Slider",
    ],
    links: {
      demo: "https://www.gseps.com/",
    },
    period: {
      start: "2023-04",
      end: "2023-10",
    },
  },
  {
    id: "okcc-homepage",
    title: "재외동포협력센터 OKCC",
    description:
      "기존 이미지 중심 구조와 불필요한 코드를 개선하고, 웹 표준과 접근성을 고려한 구조로 페이지를 정리했습니다. 반응형 화면과 유지보수 가능한 마크업 구조를 중심으로 퍼블리싱을 지원했습니다.",
    thumbnail: "https://picsum.photos/800/400?random=11",
    tech: ["HTML", "CSS", "JavaScript", "Photoshop", "Responsive Web"],
    links: {
      demo: "https://okocc.or.kr/homepage/index.do",
    },
    period: {
      start: "2022-10",
      end: "2024-06",
    },
  },
  {
    id: "internal-pool",
    title: "사내 인력풀 홈페이지 구축",
    description:
      "사내 인력 관리와 업체 관리를 효율화하기 위한 웹페이지입니다. 파일 업로드, 조건별 스타일 처리, 경력/급여 계산, 카카오 API 기반 주소 검색 등 업무 흐름에 필요한 기능을 구현했습니다.",
    thumbnail: "https://picsum.photos/800/400?random=12",
    tech: [
      "Spring Boot",
      "Java",
      "Thymeleaf",
      "MariaDB",
      "HTML",
      "CSS",
      "Kakao API",
    ],
    links: {},
    period: {
      start: "2024-01",
      end: "2025-01",
    },
  },
  {
    id: "buildtalk-translation",
    title: "빌드톡 번역앱 구축",
    description:
      "ChatGPT를 이용한 AI 통번역 앱 서비스입니다. 사용자 흐름 정리, UI 기획, Figma 프로토타입 제작에 참여했고 Flutter/Dart 기반 모바일 화면 구조를 이해하며 협업했습니다.",
    thumbnail: "https://picsum.photos/800/400?random=13",
    tech: ["Flutter", "Dart", "Figma", "Miro", "ChatGPT"],
    links: {
      demo: "https://play.google.com/store/apps/details?id=it.buildtec.buildtalk&hl=ko",
    },
    period: {
      start: "2023-10",
      end: "2024-03",
    },
  },
  {
    id: "sosoco-mall",
    title: "SOSOCO 쇼핑몰 홈페이지 제작",
    description:
      "고도몰 기반 쇼핑몰 홈페이지 제작 프로젝트입니다. 2인 프로젝트로 HTML, CSS, JavaScript, PHP를 활용해 쇼핑몰 화면 구성과 퍼블리싱 작업을 진행했습니다.",
    thumbnail: "https://picsum.photos/800/400?random=14",
    tech: ["HTML", "CSS", "JavaScript", "PHP", "Godomall"],
    links: {},
    period: {
      start: "2023-04",
      end: "2023-06",
    },
  },
  {
    id: "portfolio-blog",
    title: "개인 포트폴리오 블로그",
    description:
      "React와 TypeScript로 만든 개인 포트폴리오입니다. Notion API로 Tech Blog 글을 가져오고 GitHub Actions를 통해 GitHub Pages에 배포합니다.",
    thumbnail: "https://picsum.photos/800/400?random=15",
    tech: ["React", "TypeScript", "MUI", "Vite", "Notion API"],
    links: {
      github: "https://github.com/wynsumhi",
    },
    period: {
      start: "2026-02",
    },
  },
];
