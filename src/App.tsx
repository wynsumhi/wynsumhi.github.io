/**
 * App 컴포넌트 (앱의 최상위 컴포넌트)
 *
 * 역할:
 * 1. ThemeProvider: MUI 테마(색상, 폰트 등)를 전체 앱에 적용
 * 2. CssBaseline: 브라우저별 기본 스타일 차이를 리셋
 * 3. BrowserRouter + Routes: URL 경로에 따라 적절한 페이지 컴포넌트를 렌더링
 * 4. Navbar: 모든 페이지에 공통으로 표시되는 네비게이션 바
 *
 * 라우트 구조:
 *   /           → BlogHome (블로그 홈)
 *   /blog/:id   → BlogPost (블로그 포스트 상세)
 *   /portfolio  → PortfolioHome (포트폴리오)
 *   /*          → 404 페이지
 */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./styles/theme";

// 공통 레이아웃 컴포넌트
import Navbar from "./components/layout/Navbar";

// 페이지 컴포넌트
import BlogHome from "./pages/Blog/BlogHome";
import BlogPost from "./pages/Blog/BlogPost";
import PortfolioHome from "./pages/Portfolio/PortfolioHome";

function App() {
  return (
    // ThemeProvider: 하위 모든 MUI 컴포넌트에 커스텀 테마 적용
    <ThemeProvider theme={theme}>
      {/* CssBaseline: CSS 리셋 + MUI 글로벌 스타일 */}
      <CssBaseline />

      {/* Router: HTML5 History API 기반 클라이언트 사이드 라우팅 */}
      <Router>
        {/* Navbar는 Routes 바깥에 있으므로 모든 페이지에 항상 표시됨 */}
        <Navbar />

        {/* Routes: URL 경로와 컴포넌트를 매칭 */}
        <Routes>
          {/* 블로그 홈 (메인 페이지) */}
          <Route path="/" element={<BlogHome />} />

          {/* 블로그 포스트 상세 - :id는 동적 파라미터 (URL에서 추출) */}
          <Route path="/blog/:id" element={<BlogPost />} />

          {/* 포트폴리오 페이지 */}
          <Route path="/portfolio" element={<PortfolioHome />} />

          {/* 위 경로에 매칭되지 않는 모든 URL → 404 */}
          <Route
            path="*"
            element={<div>404 - 페이지를 찾을 수 없습니다</div>}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
