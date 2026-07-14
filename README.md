# 김현아 포트폴리오

GitHub Pages로 운영하는 개인 포트폴리오 겸 기술 블로그입니다.  
프론트엔드 포트폴리오, 프로젝트 아카이브, Notion 기반 블로그를 하나의 웹 경험으로 묶어 관리합니다.

- 배포 주소: [https://wynsumhi.github.io](https://wynsumhi.github.io)
- 포트폴리오: `/portfolio`
- 프로젝트: `/projects`
- 블로그: `/blog`

## 핵심 구성

### 포트폴리오

- 프로필, 기술 스택, 프로젝트, 블로그 미리보기, 연락처를 한 화면 흐름으로 구성
- 상단 네비게이션과 섹션 이동을 통해 포트폴리오 페이지 안에서 빠르게 탐색
- 프로젝트와 블로그 데이터를 홈 화면에서도 재사용해 최신 활동이 자연스럽게 노출되도록 설계

### 프로젝트

- 업무 프로젝트와 사이드 프로젝트를 구분해 탐색 가능
- 프로젝트명, 기술, 문제 해결 키워드 기반 검색 지원
- 기술 태그 필터, 최신순/오래된순/이름순 정렬 지원
- 상세 화면에서 문제, 해결 방식, 결과, 회고를 구조화해 프론트엔드 기여도를 설명

### 블로그

- Notion 데이터베이스를 원천 데이터로 사용하고, 빌드 전에 `src/data/posts.json`으로 변환
- Tech, Study, Project, Log 섹션을 분리해 글 성격에 따라 탐색 가능
- 카드형/리스트형 보기 전환 지원
- 카드형은 9개 단위 페이지네이션, 리스트형은 20개 단위 더보기 방식으로 구성
- 검색, 카테고리, 태그 필터를 제공하고 필터 영역 바깥 클릭 시 자연스럽게 닫힘
- 로딩 시간이 길어질 때를 대비해 카드형/리스트형 스켈레톤 UI 적용

## 프론트엔드 어필 포인트

- **반응형 레이아웃 제어**  
  카드형 블로그 화면은 뷰포트 높이에 맞춰 3x3 그리드, 페이지네이션, 푸터가 함께 보이도록 조정했습니다. 화면이 줄어들 때 제목과 요약 텍스트 크기, 줄 수, 여백을 단계적으로 조절해 내부 콘텐츠 스크롤이 생기지 않도록 설계했습니다.

- **데이터 밀도와 가독성 균형**  
  블로그 카드에서는 제목 영역을 고정 높이로 맞추고 3줄 이상은 말줄임 처리해, 카드마다 요약문 시작 위치가 흔들리지 않도록 구성했습니다. 넓은 화면에서는 요약문이 더 보이도록 여유 공간을 활용합니다.

- **사용자 흐름 중심 UI**  
  리스트형은 긴 글 탐색에 맞춰 더보기 버튼을 사용하고, 카드형은 전체 목록을 훑기 좋게 페이지네이션을 적용했습니다. Top 버튼은 필요한 스크롤 상황에서만 노출되도록 분리했습니다.

- **상태 기반 인터랙션**  
  검색/필터, 보기 모드, 페이지네이션, 태그 선택, 상세 보기 진입 등 블로그 탐색 상태를 UI 흐름에 맞춰 제어합니다. 카드 클릭은 미리보기 노출 후 한 번 더 클릭하면 상세 페이지로 이동하는 방식으로 설계했습니다.

- **Notion 기반 콘텐츠 파이프라인**  
  Notion API로 글을 가져와 정적 JSON으로 변환한 뒤 React 화면에서 렌더링합니다. 작성 도구와 배포 화면을 분리해 관리 편의성과 정적 사이트의 안정성을 함께 가져갑니다.

- **GitHub Pages SPA 대응**  
  빌드 시 `dist/index.html`을 `dist/404.html`로 복사해 새로고침이나 직접 URL 접근 시에도 React Router 경로가 유지되도록 처리했습니다.

## 기술 스택

| 영역 | 기술 |
| --- | --- |
| Core | React 19, TypeScript, Vite |
| Routing | React Router DOM |
| UI | MUI, Emotion, Pretendard |
| Content | Notion API, notion-to-md |
| Deploy | GitHub Actions, GitHub Pages |
| Tooling | ESLint, tsx, pnpm |

## 데이터 흐름

```text
Notion Database
  -> scripts/fetch-notion.ts
  -> src/data/posts.json
  -> Blog UI
  -> GitHub Pages

src/data/projects.ts
  -> Home / Projects UI
```

블로그 글은 Notion에서 가져와 `posts.json`으로 생성됩니다.  
프로젝트 데이터는 기본적으로 `src/data/projects.ts`를 직접 관리합니다.

`SYNC_NOTION_PROJECTS=true`로 설정한 상태에서 `NOTION_PROJECT_DATABASE_ID`가 있으면 프로젝트 데이터도 Notion에서 가져와 `src/data/projects.ts`를 다시 생성합니다. 수기로 관리하려면 `SYNC_NOTION_PROJECTS=false`를 유지하면 됩니다.

## 프로젝트 구조

```text
src
├─ components/layout        # Navbar, Sidebar, BlogLayout
├─ data
│  ├─ posts.json            # Notion에서 생성된 블로그 데이터
│  └─ projects.ts           # 포트폴리오 프로젝트 데이터
├─ pages
│  ├─ Home                  # 포트폴리오 홈
│  ├─ Projects              # 프로젝트 목록/상세
│  └─ Blog                  # 블로그 목록/상세/아카이브
├─ styles                   # MUI theme
├─ types                    # 공통 타입
└─ utils                    # 마크다운/텍스트 유틸

scripts
└─ fetch-notion.ts          # Notion 글/프로젝트 동기화 스크립트
```

## 실행 방법

```bash
pnpm install
pnpm dev
```

로컬 개발 서버가 실행되면 브라우저에서 `http://localhost:5173`으로 확인할 수 있습니다.

## Notion 동기화

`.env.template`을 참고해 `.env`를 생성합니다.

```bash
NOTION_TOKEN=ntn_xxxxxxxxxxxxx
NOTION_TECH_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_STUDY_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_LOG_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_PROJECT_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SYNC_NOTION_PROJECTS=false
```

블로그 글을 최신화하려면 아래 명령을 실행합니다.

```bash
pnpm fetch-notion
```

## 빌드

```bash
pnpm build
```

빌드 과정은 TypeScript 검사, Vite 빌드, GitHub Pages SPA fallback 생성을 포함합니다.

## 배포

GitHub Actions가 `main` 브랜치 push, 매주 월요일 오전 9시 KST 스케줄, 수동 실행을 기준으로 동작합니다.

배포 과정은 다음 순서로 진행됩니다.

1. 저장소 체크아웃
2. pnpm 및 Node.js 설정
3. 의존성 설치
4. Notion 글 동기화
5. 정적 빌드
6. GitHub Pages 배포

자동 배포 환경에서도 Notion 데이터를 가져오려면 GitHub repository secrets에 아래 값이 필요합니다.

- `NOTION_TOKEN`
- `NOTION_TECH_DATABASE_ID`
- `NOTION_STUDY_DATABASE_ID`
- `NOTION_LOG_DATABASE_ID`
- `NOTION_PROJECT_DATABASE_ID`

## 관리 메모

- 블로그 글은 Notion에서 작성하고 `pnpm fetch-notion` 또는 GitHub Actions 배포 과정에서 최신화합니다.
- 프로젝트 상세 내용은 `src/data/projects.ts`에서 수기로 관리합니다.
- 프로젝트까지 Notion으로 자동 동기화하려면 `SYNC_NOTION_PROJECTS=true`를 사용할 수 있지만, 이 경우 `src/data/projects.ts`가 다시 생성됩니다.
