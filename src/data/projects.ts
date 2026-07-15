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
    title: "GS EPS 기업 홈페이지 구축",
    description:
      "방문자가 기업 정보를 자연스럽게 따라갈 수 있도록 반응형 화면과 스크롤 인터랙션을 구현했습니다.",
    thumbnail: "/assets/projects/gseps-homepage.jpg",
    tech: [
      "HTML",
      "CSS",
      "SCSS",
      "JavaScript",
      "GSAP",
      "ScrollTrigger",
      "Swiper",
      "PHP Template",
      "MySQL",
      "ProgressBar.js",
    ],
    links: {
      demo: "https://www.gseps.com/",
    },
    period: {
      start: "2023-04",
      end: "2023-10",
    },
    detail: {
      subtitle: "GS EPS 공식 홈페이지 전체 퍼블리싱 및 인터랙션 구현",
      problem:
        "기업 소개형 웹사이트 특성상 정보량이 많고 기획·디자인 변경이 반복되어, 전체 화면의 마크업과 스타일링, 인터랙션을 안정적으로 유지하면서도 다양한 해상도에 대응해야 했습니다.",
      solution:
        "전체 화면 마크업과 스타일링을 담당하고, GSAP 패럴랙스 스크롤과 차트·슬라이더 기반 동적 UI를 구현했습니다. 변경이 잦은 화면은 SCSS 공통 구조로 정리해 유지보수성을 높이고, Figma 기준으로 기획·디자인과 인터랙션 방향을 조율했습니다.",
      results: [
        "웹 페이지 전체 퍼블리싱 및 프론트엔드 동적 기능 구현 전담",
        "반복적인 기획·디자인 변경에도 전체 화면 구현을 안정적으로 완료",
        "GSAP 기반 메인 페이지 패럴랙스 스크롤 인터랙션 구현",
        "디바이스 해상도를 고려한 반응형 웹 구현",
      ],
      challenges: [
        "Google Charts, Slick Slider 등 라이브러리 활용 반응형 페이지 구현",
        "SCSS 기반 컴포넌트화로 관리자 페이지 제어와 유지보수성 고려",
        "Figma를 활용한 기획자·디자이너 협업 및 사용자 경험 개선",
      ],
      info: {
        duration: "2023.04 - 2023.10",
        team: "개발 4명",
        role: "프론트엔드 전담",
      },
    },
  },
  {
    id: "okcc-homepage",
    kind: "work",
    title: "재외동포협력센터 OKCC",
    description:
      "이미지 중심 화면을 웹 표준 구조로 바꿔 사용자가 정보를 더 안정적으로 탐색할 수 있게 개선했습니다.",
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
      subtitle: "공공기관 웹사이트 퍼블리싱 및 코드 품질 개선",
      problem:
        "기존 화면이 이미지 중심으로 구성되어 있어 콘텐츠 수정과 유지보수가 어렵고, 웹 접근성·표준 측면에서도 개선이 필요한 상태였습니다.",
      solution:
        "콘텐츠를 의미 있는 HTML 구조로 재정리하고, 디바이스별 해상도에 맞춰 적응형 스타일을 적용했습니다. 필요한 영역에는 Slick Slider 기반 동적 UI를 더해 정적인 화면의 사용성을 보완했습니다.",
      results: [
        "이미지 대체 중심 페이지를 의미 있는 마크업 구조로 개선",
        "웹 표준과 접근성을 고려한 코드 품질 향상",
        "유지보수 효율을 높이는 퍼블리싱 구조 개선",
      ],
      challenges: [
        "디바이스 해상도를 고려한 적응형 웹 구현",
        "Slick Slider 등 라이브러리 활용 동적 페이지 구현",
        "공공기관 페이지 특성에 맞는 접근성 및 표준 준수",
      ],
      info: {
        duration: "2022.10 - 2024.06",
        role: "퍼블리싱 지원",
      },
    },
  },
  {
    id: "internal-pool",
    kind: "work",
    title: "사내 인력풀 홈페이지 구축",
    description:
      "관리자가 인력 정보를 빠르게 등록하고 확인할 수 있도록 입력·계산·파일 처리 흐름을 구현했습니다.",
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
      start: "2024-08",
      end: "2025-01",
    },
    detail: {
      subtitle: "사내 인력 관리 시스템 화면 구성 및 동적 기능 구현",
      problem:
        "사내 인력 정보를 체계적으로 관리하기 위해 파일 등록, 상태 확인, 경력 계산, 주소 검색 등 다양한 업무 흐름을 한 화면 경험 안에서 안정적으로 처리해야 했습니다.",
      solution:
        "Thymeleaf 기반 SSR 환경에서 전체 화면 구성과 동적 UI를 담당했습니다. 파일 다운로드·첨부, 조건별 스타일, 경력 년차·등급 자동계산, 카카오 주소 검색을 화면 흐름에 맞게 연결했습니다.",
      results: [
        "사내 인력 관리 시스템 구축으로 업무 효율성 향상",
        "서비스 기획부터 개발, 사내 발표까지 전 과정 경험",
        "PPT·Excel 다운로드 및 첨부파일 등록 기능 구현",
        "경력 년차와 경력 등급 자동계산 기능 구현",
      ],
      challenges: [
        "상태를 확인해 조건에 따른 CSS를 적용하는 동적 화면 처리",
        "카카오 API를 활용한 주소 검색 및 등록 기능 구현",
        "Spring Boot 환경에서 Thymeleaf 기반 백엔드 SSR 협업",
      ],
      info: {
        duration: "2024.08 - 2025.01",
        team: "4명",
        role: "프론트엔드 전담",
      },
    },
  },
  {
    id: "buildtalk-translation",
    kind: "work",
    title: "빌드톡 번역앱 구축",
    description:
      "사용자가 AI 통번역 기능을 쉽게 이해할 수 있도록 앱 흐름과 화면 구조를 프로토타입으로 구체화했습니다.",
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
      subtitle: "AI 통번역 모바일 서비스 화면 구성 기획 및 UX/UI 설계",
      problem:
        "AI 통번역 앱의 기능 흐름을 실제 사용자가 이해하기 쉽게 구성하고, 개발팀과 이해관계자가 같은 화면 흐름을 기준으로 논의할 수 있는 프로토타입이 필요했습니다.",
      solution:
        "Miro로 사용자 시나리오를 정리하고 Figma 프로토타입을 제작해 기능 흐름을 시각화했습니다. Flutter 위젯 구조를 이해하며 개발팀과 화면 전환과 기본 구성에 대해 협업했습니다.",
      results: [
        "서비스 기획 및 UX/UI 설계를 주도해 실제 앱 출시 완료",
        "서비스 사업성을 인정받아 후속 투자 유치에 기여",
        "Figma 기반 프로토타입 제작으로 팀 내 화면 이해도 향상",
      ],
      challenges: [
        "Miro를 사용한 사용자 경험 흐름 정리와 UI 개선 협업",
        "Flutter 위젯 기반 모바일 화면 구성 이해",
        "투자자와 개발팀 모두가 이해할 수 있는 화면 흐름 구체화",
      ],
      info: {
        duration: "2023.10 - 2024.03",
        team: "4명",
        role: "서비스 기획 및 UI 프로토타입",
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
    id: "the-interview",
    kind: "side",
    title: "The interview - AI 음성 인터뷰 매거진",
    description:
      "음성 답변과 AI 후속 질문이 끊기지 않도록 실시간 인터뷰 흐름을 설계한 AI 인터뷰 플랫폼입니다.",
    thumbnail: "/assets/projects/the-interview.jpg",
    tech: [
      "Next.js",
      "TypeScript",
      "Zustand",
      "TanStack Query",
      "Axios",
      "WebSocket",
      "STOMP",
      "SockJS",
      "Framer Motion",
    ],
    links: {
      github: "https://github.com/wynsumhi/the-interview",
    },
    period: {
      start: "2026-02",
      end: "2026-04",
    },
    detail: {
      subtitle: "RAG 기반 실시간 AI 음성 인터뷰 플랫폼",
      problem:
        "사용자의 음성 답변이 AI 후속 질문으로 자연스럽게 이어져야 했고, 실시간 통신과 음성 감지 상태가 어긋나면 인터뷰 흐름이 쉽게 끊기는 문제가 있었습니다.",
      solution:
        "STOMP + SockJS 기반 WebSocket topic 구독으로 AI 질문과 TTS 오디오를 실시간 수신했습니다. MediaRecorder와 Web Audio API로 녹음·음량 감지를 제어하고, Zustand로 인터뷰 상태 전이를 관리했습니다.",
      results: [
        "평균 응답 지연 시간 12초에서 4초로 67% 단축",
        "삼성청년 SW·AI 아카데미 14기 특화 프로젝트 우수상",
        "TanStack Query 기반 페이지네이션·무한 스크롤과 캐시 갱신 흐름 구현",
      ],
      challenges: [
        "AI 답변 종료 기준 불일치로 인한 청크 누락 문제 해결",
        "CONNECTING_AI, AI_SPEAKING, WAITING_AI 등 인터뷰 상태 머신 관리",
        "음성 감지 기반 녹음 UI와 자동 종료 흐름 제어",
      ],
      info: {
        duration: "2026.02 - 2026.04",
        team: "5명",
        role: "프론트엔드 전담",
      },
    },
  },
  {
    id: "drawrun",
    kind: "side",
    title: "DrawRun - GPS Drawing 기반 러닝 앱",
    description:
      "AI가 생성한 그림 경로를 실제 러닝 코스로 완성하고 유사도 기반 랭킹으로 동기를 부여하는 모바일 앱입니다.",
    thumbnail: "/assets/projects/drawrun.jpg",
    tech: [
      "Flutter",
      "Dart",
      "Riverpod",
      "Dio",
      "GoRouter",
      "Naver Map SDK",
      "Geolocator",
      "Pedometer",
    ],
    links: {
      github: "https://github.com/wynsumhi/draw-running-app",
    },
    period: {
      start: "2026-04",
      end: "2026-05",
    },
    detail: {
      subtitle: "GPS Drawing 기반 러닝 챌린지 앱",
      problem:
        "짧은 개발 기간과 낯선 Flutter 환경에서 지도, 위치, API, 센서 데이터가 동시에 동작해야 했고, 팀원들이 안정적으로 기능을 확장할 수 있는 구조가 필요했습니다.",
      solution:
        "Feature 단위로 data, domain, presentation 계층을 나누고 Riverpod ViewModel로 지도 노드, 경로 저장, API 응답 흐름을 관리했습니다. 위치·네트워크·지도·센서 모듈을 분리해 팀원이 확장하기 쉬운 구조를 만들었습니다.",
      results: [
        "삼성청년 SW·AI 아카데미 14기 자율 프로젝트 우수상",
        "Naver Map 기반 코스 에디터와 도로 추종 경로 구현",
        "GPS·고도·케이던스 기반 실시간 러닝 화면 구현",
      ],
      challenges: [
        "Flutter Feature-based Architecture와 3-layer 구조 도입",
        "Riverpod + Repository 패턴으로 상태/API 책임 분리",
        "지도 SDK 타입을 앱 도메인에 직접 퍼뜨리지 않도록 shared 변환 모듈 구성",
      ],
      info: {
        duration: "2026.04 - 2026.05",
        team: "6명",
        role: "프론트엔드 개발 리더",
      },
    },
  },
  {
    id: "tour-random-platform",
    kind: "side",
    title: "공공 관광데이터 API 활용 위치 기반 장소 추천 플랫폼",
    description:
      "카테고리 필터링과 위치 기반 랜덤 추천으로 새로운 장소를 발견하는 공공 관광데이터 API 활용 플랫폼입니다.",
    thumbnail: "https://picsum.photos/800/400?random=17",
    tech: ["Vue.js", "Django", "REST API"],
    links: {
      github: "https://github.com/wynsumhi/jigukkang",
    },
    period: {
      start: "2025-05",
      end: "2025-05",
    },
    detail: {
      subtitle: "공공 관광데이터 기반 위치 추천 서비스",
      problem:
        "공공 관광데이터를 단순 목록으로 보여주는 대신, 사용자가 현재 위치와 관심 카테고리를 기준으로 탐색할 수 있는 경험이 필요했습니다.",
      solution:
        "Vue 기반 화면에서 카테고리 필터와 위치 기반 추천 흐름을 구성하고, Django API와 연동해 장소 데이터를 탐색 가능한 형태로 제공했습니다.",
      results: [
        "공공 데이터 활용 프로젝트 우수상",
        "위치 기반 장소 추천 흐름 구현",
        "프론트엔드와 백엔드 API 연동 경험 확보",
      ],
      challenges: [
        "공공 API 데이터 구조를 사용자 탐색 흐름에 맞게 정리",
        "카테고리 필터와 랜덤 추천 UX 구성",
      ],
      info: {
        duration: "2025.05",
        team: "2명",
        role: "프론트엔드 구현 및 API 연동",
      },
    },
  },
  {
    id: "festival-map-platform",
    kind: "side",
    title: "지역 축제 정보 디지털 전환 플랫폼",
    description:
      "종이 팜플렛과 흩어진 축제 정보를 실시간 인터랙티브 지도로 통합해, 현장에서 바로 탐색할 수 있도록 만든 축제 정보 플랫폼입니다.",
    thumbnail: "https://picsum.photos/800/400?random=18",
    tech: ["React", "TypeScript", "Map UI"],
    links: {
      github: "https://github.com/wynsumhi/pammap",
    },
    period: {
      start: "2025-06",
      end: "2025-06",
    },
    detail: {
      subtitle: "축제 정보 탐색을 위한 인터랙티브 지도 서비스",
      problem:
        "축제 현장의 정보가 종이 팜플렛과 여러 채널에 흩어져 있어 방문자가 위치와 일정을 즉시 파악하기 어려웠습니다.",
      solution:
        "지도 중심 UI로 장소와 프로그램 정보를 통합하고, 현장에서 빠르게 탐색할 수 있도록 정보 우선순위와 화면 흐름을 정리했습니다.",
      results: [
        "현장 탐색 중심의 지도형 정보 구조 설계",
        "흩어진 축제 정보를 한 화면에서 확인하는 사용자 흐름 구성",
      ],
      challenges: [
        "오프라인 정보 구조를 디지털 지도 경험으로 전환",
        "방문자의 즉시 탐색을 고려한 UI 우선순위 정리",
      ],
      info: {
        duration: "2025.06",
        team: "6명",
        role: "프론트엔드 구현",
      },
    },
  },
  {
    id: "miml",
    kind: "side",
    title: "MIML - Music is my Life",
    description:
      "팬덤을 위한 소통 및 공연 정보 관리 시스템입니다. React 기반 화면과 Node.js 서버를 연동해 커뮤니티 중심 기능을 구현했습니다.",
    thumbnail: "https://picsum.photos/800/400?random=19",
    tech: ["React", "Node.js", "Tailwind CSS", "MySQL", "Yarn"],
    links: {},
    period: {
      start: "2024-12",
      end: "2024-12",
    },
    detail: {
      subtitle: "팬덤 커뮤니티와 공연 정보 관리 서비스",
      problem:
        "팬덤 활동에 필요한 소통과 공연 정보가 흩어져 있어, 커뮤니티 사용자가 필요한 정보를 한 흐름에서 확인하기 어려웠습니다.",
      solution:
        "React 화면과 Node.js 기반 서버를 연결해 팬덤 커뮤니티와 공연 정보 관리 기능을 구성했습니다.",
      results: [
        "React 기반 사용자 화면 구현",
        "Node.js와 MySQL 기반 데이터 연동 경험",
        "2인 협업 프로젝트 수행",
      ],
      challenges: [
        "커뮤니티 흐름에 맞는 화면 구성",
        "서버 데이터와 프론트 UI 연동",
      ],
      info: {
        duration: "2024.12",
        team: "2명",
        role: "프론트엔드 구현",
      },
    },
  },
  {
    id: "kcal-cal",
    kind: "side",
    title: "Kcal-cal - CRUD 풀스택 프로젝트",
    description:
      "크롤링 데이터를 활용해 칼로리를 측정하고 관리할 수 있도록 제작한 웹 서비스입니다. Node.js, Express, MySQL 기반 CRUD 흐름을 구현했습니다.",
    thumbnail: "https://picsum.photos/800/400?random=21",
    tech: ["HTML", "CSS", "JavaScript", "Node.js", "Express", "EJS", "MySQL"],
    links: {
      github: "https://github.com/wynsumhi/mysql-npc",
    },
    period: {
      start: "2022-11",
      end: "2022-11",
    },
    detail: {
      subtitle: "관계형 데이터베이스 기반 CRUD 웹 서비스",
      problem:
        "사용자가 음식 정보를 확인하고 칼로리 데이터를 관리할 수 있도록, 데이터 저장과 조회 흐름이 필요했습니다.",
      solution:
        "Express 라우팅과 EJS 템플릿을 활용해 화면과 서버를 연결하고, MySQL 기반 CRUD 기능을 구현했습니다.",
      results: [
        "Node.js와 Express 기반 서버 라우팅 구현",
        "MySQL 데이터베이스를 활용한 CRUD 기능 구현",
        "5인 팀 프로젝트 수행",
      ],
      challenges: [
        "관계형 데이터 모델링과 화면 데이터 연결",
        "서버 라우팅과 템플릿 렌더링 흐름 이해",
      ],
      info: {
        duration: "2022.11",
        team: "5명",
        role: "프론트엔드 및 CRUD 구현",
      },
    },
  },
  {
    id: "dnema",
    kind: "side",
    title: "D.nema - 영화 추천 웹사이트",
    description:
      "DOM을 활용해 속성값을 랜덤으로 변경하고 사용자에게 영화를 추천하는 프론트엔드 프로젝트입니다.",
    thumbnail: "https://picsum.photos/800/400?random=22",
    tech: ["HTML", "CSS", "JavaScript", "Node.js", "Express", "EJS"],
    links: {
      github: "https://github.com/wynsumhi/d-nema-ncp",
    },
    period: {
      start: "2022-10",
      end: "2022-10",
    },
    detail: {
      subtitle: "JavaScript DOM 기반 영화 추천 서비스",
      problem:
        "정적인 영화 목록이 아니라 사용자의 선택과 랜덤 요소를 활용해 가볍게 탐색할 수 있는 화면이 필요했습니다.",
      solution:
        "JavaScript DOM 조작과 이벤트 처리를 활용해 영화 추천 UI를 구성하고, Node.js 환경에서 화면을 렌더링했습니다.",
      results: [
        "DOM 기반 인터랙션 구현",
        "랜덤 추천 흐름과 화면 상태 변경 구현",
        "포스코 x 코딩온 웹 프로젝트 대상",
      ],
      challenges: [
        "사용자 이벤트에 따른 UI 상태 변경",
        "Express와 EJS 기반 화면 구성",
      ],
      info: {
        duration: "2022.10",
        team: "4명",
        role: "프론트엔드 구현",
      },
    },
  },
  {
    id: "rolling-paper",
    kind: "side",
    title: "미니프로젝트 롤링페이퍼",
    description:
      "예비 개발자인 수강생들에게 메시지를 남길 수 있는 연말맞이 롤링페이퍼 미니 프로젝트입니다.",
    thumbnail: "https://picsum.photos/800/400?random=23",
    tech: ["HTML", "CSS", "SCSS", "JavaScript", "jQuery", "Node.js", "MySQL"],
    links: {},
    period: {
      start: "2022-12",
      end: "2022-12",
    },
    detail: {
      subtitle: "메시지 작성과 조회를 위한 미니 웹 서비스",
      problem:
        "여러 사용자가 메시지를 작성하고 확인할 수 있는 간단한 참여형 웹 경험이 필요했습니다.",
      solution:
        "메시지 작성, 저장, 조회 흐름을 구성하고 SCSS로 화면 스타일을 정리했습니다.",
      results: [
        "메시지 작성 및 조회 화면 구현",
        "Node.js와 MySQL 기반 데이터 저장 흐름 경험",
        "5인 미니 프로젝트 수행",
      ],
      challenges: [
        "참여형 서비스의 입력 흐름 구성",
        "팀 내 화면과 데이터 역할 분담",
      ],
      info: {
        duration: "2022.12",
        team: "5명",
        role: "프론트엔드 구현",
      },
    },
  },
  {
    id: "foodville-renewal",
    kind: "side",
    title: "웹표준과 접근성을 고려한 웹사이트 리뉴얼",
    description:
      "기존 XHTML 기반 웹사이트를 웹 표준에 맞는 의미론적 태그와 구조로 개선한 리뉴얼 프로젝트입니다.",
    thumbnail: "https://picsum.photos/800/400?random=24",
    tech: ["HTML", "CSS", "JavaScript", "PHP", "jQuery", "JSON", "AJAX"],
    links: {},
    period: {
      start: "2021-11",
      end: "2021-12",
    },
    detail: {
      subtitle: "웹 표준 기반 마크업 리뉴얼",
      problem:
        "오래된 XHTML 구조로 제작된 웹사이트는 유지보수성과 접근성 측면에서 개선이 필요했습니다.",
      solution:
        "의미론적 HTML 구조를 적용하고, CSS와 JavaScript를 분리해 유지보수하기 쉬운 구조로 정리했습니다.",
      results: [
        "웹 표준 기반 마크업 구조 개선",
        "접근성과 유지보수성을 고려한 페이지 리뉴얼",
        "개인 프로젝트 수행",
      ],
      challenges: [
        "기존 구조 분석 후 의미론적 마크업으로 재구성",
        "정적 페이지와 동적 스크립트의 역할 분리",
      ],
      info: {
        duration: "2021.11 - 2021.12",
        team: "개인",
        role: "기획 및 퍼블리싱",
      },
    },
  },
  {
    id: "mobile-corporate",
    kind: "side",
    title: "기업형 Mobile 웹사이트",
    description:
      "다양한 모바일 디바이스 해상도를 고려해 UI가 안정적으로 변경되는 기업형 모바일 웹사이트입니다.",
    thumbnail: "https://picsum.photos/800/400?random=25",
    tech: ["HTML", "CSS", "JavaScript", "PHP", "jQuery", "JSON", "AJAX"],
    links: {},
    period: {
      start: "2021-12",
      end: "2021-12",
    },
    detail: {
      subtitle: "모바일 해상도 대응 웹사이트",
      problem:
        "모바일 기기별 해상도 차이에 따라 콘텐츠 비율과 UI 배치가 깨지지 않도록 대응해야 했습니다.",
      solution:
        "모바일 기준 레이아웃을 구성하고, 화면 폭 변화에 따라 UI가 자연스럽게 재배치되도록 스타일을 조정했습니다.",
      results: [
        "모바일 중심 반응형 화면 구현",
        "다양한 해상도에 대응하는 UI 구성",
        "개인 프로젝트 수행",
      ],
      challenges: [
        "모바일 화면에서 정보 밀도와 가독성 균형 조정",
        "해상도별 레이아웃 안정성 확보",
      ],
      info: {
        duration: "2021.12",
        team: "개인",
        role: "퍼블리싱",
      },
    },
  },
  {
    id: "kakao-friends-responsive",
    kind: "side",
    title: "카카오프렌즈 반응형 웹사이트",
    description:
      "다양한 기기 해상도에 따라 UI가 변경되도록 구현한 반응형 웹사이트 프로젝트입니다.",
    thumbnail: "https://picsum.photos/800/400?random=26",
    tech: ["HTML", "CSS", "JavaScript", "jQuery"],
    links: {},
    period: {
      start: "2022-01",
      end: "2022-01",
    },
    detail: {
      subtitle: "반응형 UI 전환 연습 프로젝트",
      problem:
        "데스크톱과 모바일 환경에서 동일한 콘텐츠가 다른 UI 구조로 자연스럽게 전환되어야 했습니다.",
      solution:
        "미디어쿼리와 jQuery 인터랙션을 활용해 해상도별 UI 전환과 메뉴 동작을 구현했습니다.",
      results: [
        "해상도별 반응형 레이아웃 구현",
        "모바일 메뉴와 인터랙션 구성",
        "개인 프로젝트 수행",
      ],
      challenges: [
        "디바이스별 콘텐츠 노출 방식 조정",
        "반응형 레이아웃 전환 시 시각적 일관성 유지",
      ],
      info: {
        duration: "2022.01",
        team: "개인",
        role: "퍼블리싱",
      },
    },
  },
  {
    id: "diptyque-bootstrap",
    kind: "side",
    title: "Bootstrap 기반 반응형 웹사이트",
    description:
      "Bootstrap 프레임워크를 활용해 반응형 레이아웃과 컴포넌트 구조를 구현한 웹사이트 프로젝트입니다.",
    thumbnail: "https://picsum.photos/800/400?random=27",
    tech: ["HTML", "CSS", "JavaScript", "jQuery", "Bootstrap"],
    links: {},
    period: {
      start: "2022-01",
      end: "2022-01",
    },
    detail: {
      subtitle: "Bootstrap 컴포넌트 기반 웹사이트",
      problem:
        "프레임워크 기반 레이아웃 시스템을 이해하고, 빠르게 반응형 화면을 구성하는 경험이 필요했습니다.",
      solution:
        "Bootstrap 그리드와 컴포넌트를 활용해 일관된 UI와 반응형 레이아웃을 구현했습니다.",
      results: [
        "Bootstrap 기반 반응형 화면 구현",
        "프레임워크 컴포넌트 사용 경험 확보",
        "개인 프로젝트 수행",
      ],
      challenges: [
        "프레임워크 기본 스타일과 커스텀 스타일의 균형 조정",
        "컴포넌트 기반 화면 구성 방식 이해",
      ],
      info: {
        duration: "2022.01",
        team: "개인",
        role: "퍼블리싱",
      },
    },
  },
  {
    id: "muji-wordpress",
    kind: "side",
    title: "WordPress 기반 반응형 웹사이트",
    description:
      "널리 사용되는 오픈소스 CMS인 WordPress를 활용해 반응형 웹사이트를 구축한 프로젝트입니다.",
    thumbnail: "https://picsum.photos/800/400?random=28",
    tech: ["HTML", "CSS", "JavaScript", "jQuery", "WordPress"],
    links: {},
    period: {
      start: "2022-03",
      end: "2022-03",
    },
    detail: {
      subtitle: "CMS 기반 반응형 웹사이트 구축",
      problem:
        "CMS 환경에서 콘텐츠 관리 구조와 화면 퍼블리싱이 어떻게 연결되는지 이해할 필요가 있었습니다.",
      solution:
        "WordPress 테마 구조를 활용해 콘텐츠 관리가 가능한 반응형 웹사이트를 구성했습니다.",
      results: [
        "WordPress 기반 웹사이트 구축",
        "CMS 콘텐츠 구조와 화면 템플릿 이해",
        "개인 프로젝트 수행",
      ],
      challenges: [
        "CMS 템플릿 구조와 프론트엔드 화면 연결",
        "관리 가능한 콘텐츠 구조를 고려한 퍼블리싱",
      ],
      info: {
        duration: "2022.03",
        team: "개인",
        role: "퍼블리싱",
      },
    },
  },
  {
    id: "portfolio-blog",
    kind: "side",
    title: "개인 포트폴리오 블로그",
    description:
      "React와 TypeScript로 만든 개인 포트폴리오입니다. 포트폴리오와 학습 기록을 분리하고, Notion API와 GitHub Actions를 활용해 정적 배포 환경에서도 콘텐츠를 갱신할 수 있도록 구성했습니다.",
    thumbnail: "https://picsum.photos/800/400?random=20",
    tech: ["React", "TypeScript", "MUI", "Vite", "Notion API", "GitHub Actions"],
    links: {
      github: "https://github.com/wynsumhi/wynsumhi.github.io",
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
