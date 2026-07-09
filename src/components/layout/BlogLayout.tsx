/**
 * 블로그 레이아웃
 *
 * 블로그 화면에 왼쪽 사이드바와 본문 영역을 배치하는 구조입니다
 */
import { Box, GlobalStyles } from "@mui/material";
import Sidebar from "./Sidebar";

interface BlogLayoutProps {
  // 블로그 본문 영역
  children: React.ReactNode;
}

// 블로그 라이트모드 색상 변수
const blogThemeVariables = {
  "--blog-page-bg": "#f3f7ff",
  "--blog-content-bg": "#ffffff",
  "--blog-sidebar-bg": "#f3f7ff",
  "--blog-panel-bg": "#ffffff",
  "--blog-active-bg": "#ffffff",
  "--blog-hover-bg": "#eaf2ff",
  "--blog-heading": "#0f172a",
  "--blog-text": "#334155",
  "--blog-subtle": "#64748b",
  "--blog-muted": "#94a3b8",
  "--blog-border": "#dbeafe",
  "--blog-divider": "#e2e8f0",
  "--blog-accent": "#2563eb",
  "--blog-chip-bg": "#eff4ff",
  "--blog-chip-text": "#2563eb",
  "--blog-card-bg": "#ffffff",
  "--blog-card-soft-bg": "#f8fafc",
  "--blog-card-shadow": "rgba(15, 23, 42, 0.06)",
  "--blog-card-hover-shadow": "rgba(37, 99, 235, 0.13)",
  "--blog-search-bg": "rgba(255, 255, 255, 0.82)",
  "--blog-icon-muted": "#b7b7b7",
  "--blog-timeline-line": "#e2e8f0",
  "--blog-timeline-dot": "#cbd5e1",
  "--blog-strong": "#0f172a",
  "--blog-link": "#2563eb",
  "--blog-code-inline-bg": "#eff6ff",
  "--blog-code-inline-border": "#dbeafe",
  "--blog-code-inline-text": "#1d4ed8",
  "--blog-code-block-bg": "#0f172a",
  "--blog-code-block-text": "#e2e8f0",
  "--blog-code-block-label": "#93c5fd",
  "--blog-table-header-bg": "#eff6ff",
  "--blog-table-border": "#e2e8f0",
  "--blog-quote-bg": "#f8fbff",
  "--blog-quote-border": "#93c5fd",
  "--blog-quote-text": "#475569",
  "--blog-filter-active-bg": "#2563eb",
  "--blog-filter-active-text": "#ffffff",
  "--blog-filter-hover-bg": "#eff6ff",
  "--blog-filter-hover-active-bg": "#1d4ed8",
  "--blog-avatar-border": "#dbeafe",
  "--blog-avatar-shadow": "rgba(37, 99, 235, 0.14)",
  "--blog-sidebar-shadow": "rgba(37, 99, 235, 0.04)",
} as const;

// 블로그 다크모드 색상 변수
const blogDarkThemeVariables = {
  "--blog-page-bg": "#08111f",
  "--blog-content-bg": "#0d1726",
  "--blog-sidebar-bg": "#0a1422",
  "--blog-panel-bg": "#101b2c",
  "--blog-active-bg": "#12233a",
  "--blog-hover-bg": "#132641",
  "--blog-heading": "#e8eef7",
  "--blog-text": "#cbd5e1",
  "--blog-subtle": "#9aa8bc",
  "--blog-muted": "#728198",
  "--blog-border": "#21314a",
  "--blog-divider": "#1e293b",
  "--blog-accent": "#7db2ff",
  "--blog-chip-bg": "#132641",
  "--blog-chip-text": "#9bc4ff",
  "--blog-card-bg": "#101b2c",
  "--blog-card-soft-bg": "#111d2e",
  "--blog-card-shadow": "rgba(0, 0, 0, 0.2)",
  "--blog-card-hover-shadow": "rgba(0, 0, 0, 0.32)",
  "--blog-search-bg": "rgba(16, 27, 44, 0.86)",
  "--blog-icon-muted": "#5f6f86",
  "--blog-timeline-line": "#24344c",
  "--blog-timeline-dot": "#334862",
  "--blog-strong": "#f1f5f9",
  "--blog-link": "#9bc4ff",
  "--blog-code-inline-bg": "#172a45",
  "--blog-code-inline-border": "#2b4364",
  "--blog-code-inline-text": "#9bc4ff",
  "--blog-code-block-bg": "#060d18",
  "--blog-code-block-text": "#dce6f3",
  "--blog-code-block-label": "#9bc4ff",
  "--blog-table-header-bg": "#132641",
  "--blog-table-border": "#24344c",
  "--blog-quote-bg": "#101d30",
  "--blog-quote-border": "#3d73b7",
  "--blog-quote-text": "#b6c3d6",
  "--blog-filter-active-bg": "#7db2ff",
  "--blog-filter-active-text": "#06101f",
  "--blog-filter-hover-bg": "#152844",
  "--blog-filter-hover-active-bg": "#9bc4ff",
  "--blog-avatar-border": "#2c4261",
  "--blog-avatar-shadow": "rgba(125, 178, 255, 0.18)",
  "--blog-sidebar-shadow": "rgba(0, 0, 0, 0.28)",
} as const;

const BlogLayout = ({ children }: BlogLayoutProps) => {
  return (
    <>
      <GlobalStyles
        styles={{
          ":root": blogThemeVariables,
          ":root[data-blog-theme='dark']": blogDarkThemeVariables,
          // 스크롤 끝 배경색 고정
          "html, body, #root": {
            minHeight: "100%",
            backgroundColor: "var(--blog-content-bg)",
          },
          // 트랙패드 오버스크롤 배경
          body: {
            margin: 0,
            overscrollBehaviorY: "none",
          },
        }}
      />

      <Box
        sx={{
        minHeight: "100dvh",
        bgcolor: "var(--blog-page-bg)",
        display: "flex",
        color: "var(--blog-text)",
        transition: "background-color 0.25s ease, color 0.25s ease",
        "& *": {
          transitionProperty: "background-color, border-color, color, box-shadow",
          transitionDuration: "0.2s",
          transitionTimingFunction: "ease",
        },
        "html[data-blog-theme='dark'] & .MuiTypography-root": {
          color: "var(--blog-text)",
        },
        "html[data-blog-theme='dark'] & h1.MuiTypography-root, html[data-blog-theme='dark'] & h2.MuiTypography-root, html[data-blog-theme='dark'] & h3.MuiTypography-root": {
          color: "var(--blog-heading)",
        },
        "html[data-blog-theme='dark'] & .post-title, html[data-blog-theme='dark'] & .card-title": {
          color: "var(--blog-heading)",
        },
        "html[data-blog-theme='dark'] & .MuiIconButton-root": {
          color: "var(--blog-muted)",
        },
        "html[data-blog-theme='dark'] & .MuiIconButton-root:hover": {
          color: "var(--blog-accent)",
        },
        "html[data-blog-theme='dark'] & .MuiChip-root": {
          color: "var(--blog-chip-text)",
          backgroundColor: "var(--blog-chip-bg)",
          borderColor: "var(--blog-border)",
        },
        "html[data-blog-theme='dark'] & .MuiDivider-root": {
          borderColor: "var(--blog-divider)",
        },
        "html[data-blog-theme='dark'] & .MuiButton-root": {
          color: "var(--blog-subtle)",
        },
        "html[data-blog-theme='dark'] & .MuiButton-root:hover": {
          color: "var(--blog-accent)",
        },
        "html[data-blog-theme='dark'] & .MuiCard-root": {
          backgroundColor: "var(--blog-panel-bg)",
          boxShadow: "0 18px 50px rgba(0, 0, 0, 0.22)",
        },
        "html[data-blog-theme='dark'] & .MuiOutlinedInput-root": {
          backgroundColor: "var(--blog-panel-bg)",
          color: "var(--blog-text)",
        },
        "html[data-blog-theme='dark'] & .MuiOutlinedInput-notchedOutline": {
          borderColor: "var(--blog-border)",
        },
        "html[data-blog-theme='dark'] & .MuiInputBase-input": {
          color: "var(--blog-text)",
        },
        "html[data-blog-theme='dark'] & .post-content:hover": {
          backgroundColor: "var(--blog-panel-bg)",
          borderColor: "var(--blog-border)",
          boxShadow: "0 18px 46px rgba(0, 0, 0, 0.22)",
        },
        }}
      >
        {/* 왼쪽 고정 사이드바 */}
        <Sidebar />

        {/* 사이드바 제외 본문 영역 */}
        <Box
          sx={{
            flex: 1,
            ml: "260px",
            px: { xs: 2, md: 7 },
            py: { xs: 4, md: 7 },
            maxWidth: "calc(100vw - 260px)",
            minHeight: "100dvh",
            bgcolor: "var(--blog-content-bg)",
          }}
        >
          {/* 본문 최대 너비 */}
          <Box sx={{ maxWidth: 1040, mx: "auto" }}>{children}</Box>
        </Box>
      </Box>
    </>
  );
};

export default BlogLayout;
