import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./styles/theme";

// 블로그 페이지
import BlogHome from "./pages/Blog/BlogHome";

// 포트폴리오 페이지
import PortfolioHome from "./pages/Portfolio/PortfolioHome";

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* MUI의 기본 CSS 리셋 및 글로벌 스타일 적용 */}
      <CssBaseline />

      {/* BrowserRouter: HTML5 History API를 사용한 라우터 */}
      <Router>
        {/* Routes: Route들을 감싸는 컨테이너 */}
        <Routes>
          {/* Route: 경로와 컴포넌트를 매칭 */}

          {/* / 경로 → 블로그 */}
          <Route path="/" element={<BlogHome />} />

          {/* /portfolio 경로 → 포트폴리오 */}
          <Route path="/portfolio" element={<PortfolioHome />} />

          {/* 404 페이지 */}
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
