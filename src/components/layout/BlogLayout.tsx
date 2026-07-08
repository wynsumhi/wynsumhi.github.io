/**
 * 블로그 레이아웃
 *
 * 블로그 화면에 왼쪽 사이드바와 본문 영역을 배치하는 구조입니다
 */
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";

interface BlogLayoutProps {
  // 블로그 본문 영역
  children: React.ReactNode;
}

const BlogLayout = ({ children }: BlogLayoutProps) => {
  return (
    <Box
      sx={{
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
        "--blog-avatar-border": "#dbeafe",
        "--blog-avatar-shadow": "rgba(37, 99, 235, 0.14)",
        "--blog-sidebar-shadow": "rgba(37, 99, 235, 0.04)",
        minHeight: "100vh",
        bgcolor: "var(--blog-page-bg)",
        display: "flex",
        color: "var(--blog-text)",
        transition: "background-color 0.25s ease, color 0.25s ease",
        ":root[data-blog-theme='dark'] &": {
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
          "--blog-avatar-border": "#2c4261",
          "--blog-avatar-shadow": "rgba(125, 178, 255, 0.18)",
          "--blog-sidebar-shadow": "rgba(0, 0, 0, 0.28)",
        },
        "& *": {
          transitionProperty: "background-color, border-color, color, box-shadow",
          transitionDuration: "0.2s",
          transitionTimingFunction: "ease",
        },
        ":root[data-blog-theme='dark'] & .MuiTypography-root": {
          color: "var(--blog-text)",
        },
        ":root[data-blog-theme='dark'] & h1.MuiTypography-root, :root[data-blog-theme='dark'] & h2.MuiTypography-root, :root[data-blog-theme='dark'] & h3.MuiTypography-root": {
          color: "var(--blog-heading)",
        },
        ":root[data-blog-theme='dark'] & .post-title, :root[data-blog-theme='dark'] & .card-title": {
          color: "var(--blog-heading)",
        },
        ":root[data-blog-theme='dark'] & .MuiIconButton-root": {
          color: "var(--blog-muted)",
        },
        ":root[data-blog-theme='dark'] & .MuiIconButton-root:hover": {
          color: "var(--blog-accent)",
        },
        ":root[data-blog-theme='dark'] & .MuiChip-root": {
          color: "var(--blog-chip-text)",
          backgroundColor: "var(--blog-chip-bg)",
          borderColor: "var(--blog-border)",
        },
        ":root[data-blog-theme='dark'] & .MuiDivider-root": {
          borderColor: "var(--blog-divider)",
        },
        ":root[data-blog-theme='dark'] & .MuiButton-root": {
          color: "var(--blog-subtle)",
        },
        ":root[data-blog-theme='dark'] & .MuiButton-root:hover": {
          color: "var(--blog-accent)",
        },
        ":root[data-blog-theme='dark'] & .MuiCard-root": {
          backgroundColor: "var(--blog-panel-bg)",
          boxShadow: "0 18px 50px rgba(0, 0, 0, 0.22)",
        },
        ":root[data-blog-theme='dark'] & .MuiOutlinedInput-root": {
          backgroundColor: "var(--blog-panel-bg)",
          color: "var(--blog-text)",
        },
        ":root[data-blog-theme='dark'] & .MuiOutlinedInput-notchedOutline": {
          borderColor: "var(--blog-border)",
        },
        ":root[data-blog-theme='dark'] & .MuiInputBase-input": {
          color: "var(--blog-text)",
        },
        ":root[data-blog-theme='dark'] & .post-content:hover": {
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
          bgcolor: "var(--blog-content-bg)",
        }}
      >
        {/* 본문 최대 너비 */}
        <Box sx={{ maxWidth: 1040, mx: "auto" }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default BlogLayout;
