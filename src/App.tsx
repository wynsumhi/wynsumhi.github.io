/**
 * App 컴포넌트 (앱의 최상위 컴포넌트)
 *
 * 역할:
 * 1. ThemeProvider: MUI 테마(색상, 폰트 등)를 전체 앱에 적용
 * 2. CssBaseline: 브라우저별 기본 스타일 차이를 리셋
 * 3. BrowserRouter + Routes: URL 경로에 따라 적절한 페이지 컴포넌트를 렌더링
 * 4. Navbar: 일반 페이지에 표시되는 상단 네비게이션 바
 *
 * 라우트 구조:
 *   /           → /portfolio 이동
 *   /blog       → BlogHome (블로그 홈)
 *   /blog/:id   → BlogPost (블로그 포스트 상세)
 *   /archives   → ArchivePage (블로그 아카이브)
 *   /portfolio  → HomePage (포트폴리오)
 *   /*          → 404 페이지
 */
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "@/styles/theme";
import { ROUTES } from "@/constants/routes";

// 공통 레이아웃 컴포넌트
import Navbar from "@/components/layout/Navbar";
import BlogLayout from "@/components/layout/BlogLayout";

// 페이지 컴포넌트
import HomePage from "@/pages/Home/HomePage";
import BlogHome from "@/pages/Blog/BlogHome";
import BlogPost from "@/pages/Blog/BlogPost";
import ArchivePage from "@/pages/Blog/ArchivePage";

const BlogRoutes = () => (
  <BlogLayout>
    <Routes>
      {/* 블로그 홈 */}
      <Route path="/blog" element={<BlogHome />} />

      {/* 블로그 포스트 상세 */}
      <Route path="/blog/:id" element={<BlogPost />} />

      {/* 블로그 아카이브 */}
      <Route path="/archives" element={<ArchivePage />} />

      {/* 블로그 경로 404 */}
      <Route path="*" element={<div>404 - 페이지를 찾을 수 없습니다</div>} />
    </Routes>
  </BlogLayout>
);

const MainRoutes = () => (
  <>
    {/* 상단 네비게이션 */}
    <Navbar />

    <Routes>
      {/* 포트폴리오 기본 경로 */}
      <Route path="/" element={<Navigate to={ROUTES.PORTFOLIO} replace />} />

      {/* 포트폴리오 홈 */}
      <Route path="/portfolio" element={<HomePage />} />

      {/* 위 경로에 매칭되지 않는 모든 URL → 404 */}
      <Route path="*" element={<div>404 - 페이지를 찾을 수 없습니다</div>} />
    </Routes>
  </>
);

const AppRoutes = () => {
  const location = useLocation();

  // 블로그 레이아웃 적용 경로
  const isBlogLayout =
    location.pathname.startsWith(ROUTES.BLOG) ||
    location.pathname === ROUTES.ARCHIVES;

  return isBlogLayout ? <BlogRoutes /> : <MainRoutes />;
};

function App() {
  return (
    // ThemeProvider: 하위 모든 MUI 컴포넌트에 커스텀 테마 적용
    <ThemeProvider theme={theme}>
      {/* CssBaseline: CSS 리셋 + MUI 글로벌 스타일 */}
      <CssBaseline />

      {/* Router: HTML5 History API 기반 클라이언트 사이드 라우팅 */}
      <Router>
        {/* 경로별 레이아웃 선택 */}
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default App;
