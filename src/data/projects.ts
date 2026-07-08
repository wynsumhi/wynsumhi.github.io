/**
 * 프로젝트 데이터
 *
 * 포트폴리오 페이지와 홈 화면에서 사용하는 대표 프로젝트 목록입니다
 */
import type { Project } from "@/types/portfolio";

export const projects: Project[] = [
  {
    id: "gseps-homepage",
    kind: "work",
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
    detail: {
      subtitle: "에너지 기업 소개형 웹사이트 구축",
      problem:
        "기업 소개 페이지 특성상 정보량이 많고 시각 요소가 다양해, 사용자가 핵심 내용을 자연스럽게 따라갈 수 있는 화면 흐름이 필요했습니다.",
      solution:
        "패럴랙스 스크롤과 차트, 슬라이더를 조합해 섹션별 주목도를 나누고 반응형 화면에서도 콘텐츠 흐름이 유지되도록 퍼블리싱했습니다.",
      results: [
        "전체 페이지 퍼블리싱 구조 구현",
        "GSAP 기반 인터랙션 적용",
        "Google Charts와 Slick Slider 연동",
      ],
      challenges: [
        "스크롤 인터랙션과 반응형 레이아웃 동시 제어",
        "차트와 슬라이더가 포함된 소개형 UI 구성",
      ],
      info: {
        duration: "2023.04 - 2023.10",
        role: "프론트엔드 퍼블리싱",
      },
    },
  },
  {
    id: "okcc-homepage",
    kind: "work",
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
    detail: {
      subtitle: "공공기관 홈페이지 구조 개선",
      problem:
        "이미지 중심 구조와 불필요한 코드로 인해 유지보수와 접근성 측면에서 개선이 필요한 상태였습니다.",
      solution:
        "웹 표준을 고려한 마크업 구조로 정리하고, 다양한 화면에서 안정적으로 읽히는 반응형 퍼블리싱을 지원했습니다.",
      results: [
        "기존 페이지 구조 정리",
        "반응형 화면 대응",
        "유지보수 가능한 마크업 개선",
      ],
      challenges: [
        "기존 코드 구조 분석",
        "공공기관 페이지 특성에 맞는 접근성 고려",
      ],
      info: {
        duration: "2022.10 - 2024.06",
        role: "프론트엔드 퍼블리싱",
      },
    },
  },
  {
    id: "internal-pool",
    kind: "work",
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
    detail: {
      subtitle: "사내 인력 관리 업무 도구 구축",
      problem:
        "인력과 업체 정보를 수기로 관리하는 과정에서 반복 입력과 계산, 파일 관리에 많은 시간이 필요했습니다.",
      solution:
        "파일 업로드, 조건별 스타일 처리, 경력/급여 계산, 주소 검색 기능을 화면 흐름에 맞게 구현해 업무 입력 과정을 줄였습니다.",
      results: [
        "파일 업로드 UI 구현",
        "경력 및 급여 계산 로직 화면 연동",
        "카카오 주소 검색 API 적용",
      ],
      challenges: [
        "업무 조건에 따른 동적 화면 처리",
        "관리자 입력 흐름에 맞춘 폼 구성",
        "Spring Boot와 Thymeleaf 기반 화면 협업",
      ],
      info: {
        duration: "2024.01 - 2025.01",
        role: "프론트엔드 구현",
      },
    },
  },
  {
    id: "buildtalk-translation",
    kind: "work",
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
    detail: {
      subtitle: "AI 통번역 모바일 서비스 기획 및 화면 협업",
      problem:
        "통번역 앱의 사용자 흐름과 모바일 화면 구조를 명확히 정리해 개발 협업에 전달할 필요가 있었습니다.",
      solution:
        "사용자 흐름을 정리하고 Figma 프로토타입을 제작해, 기능 이해와 화면 전환 구조를 함께 맞췄습니다.",
      results: [
        "사용자 흐름 정리",
        "Figma 프로토타입 제작",
        "Flutter/Dart 기반 화면 구조 협업",
      ],
      challenges: [
        "AI 통번역 서비스의 사용자 시나리오 정리",
        "모바일 앱 화면 흐름 이해",
      ],
      info: {
        duration: "2023.10 - 2024.03",
        role: "UI 기획 및 화면 협업",
      },
    },
  },
  {
    id: "sosoco-mall",
    kind: "work",
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
    detail: {
      subtitle: "고도몰 기반 쇼핑몰 화면 제작",
      problem:
        "쇼핑몰 상품 탐색과 구매 흐름에 맞는 화면 구성이 필요했고, 고도몰 환경에 맞춰 퍼블리싱해야 했습니다.",
      solution:
        "HTML, CSS, JavaScript, PHP를 활용해 쇼핑몰 화면을 구성하고 2인 프로젝트 흐름에 맞춰 작업을 분담했습니다.",
      results: [
        "쇼핑몰 주요 화면 퍼블리싱",
        "고도몰 환경 기반 화면 제작",
        "2인 협업 프로젝트 수행",
      ],
      challenges: [
        "쇼핑몰 플랫폼 구조에 맞춘 마크업",
        "상품 페이지 중심 UI 구성",
      ],
      info: {
        duration: "2023.04 - 2023.06",
        team: "2명",
        role: "프론트엔드 퍼블리싱",
      },
    },
  },
  {
    id: "portfolio-blog",
    kind: "side",
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
    detail: {
      subtitle: "개인 포트폴리오와 Tech Blog 통합 구축",
      problem:
        "포트폴리오와 학습 기록을 한 사이트에서 보여주되, 각각의 역할이 섞이지 않도록 구조를 나눌 필요가 있었습니다.",
      solution:
        "React와 TypeScript 기반으로 포트폴리오 화면을 구성하고, Notion API로 블로그 데이터를 가져와 GitHub Pages에 배포하는 흐름을 만들었습니다.",
      results: [
        "포트폴리오와 블로그 라우팅 분리",
        "Notion 기반 Tech Blog 데이터 연동",
        "GitHub Pages 배포 구조 구성",
      ],
      challenges: [
        "포트폴리오와 블로그의 사용자 흐름 분리",
        "정적 배포 환경에서 Notion 데이터 반영",
        "반응형 UI와 인터랙션 구성",
      ],
      info: {
        duration: "2026.02 - 진행 중",
        role: "기획 · 디자인 · 프론트엔드 개발",
      },
    },
  },
];
