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
        minHeight: "100vh",
        bgcolor: "#f8f9fc",
        display: "flex",
      }}
    >
      {/* 왼쪽 고정 사이드바 */}
      <Sidebar />

      {/* 사이드바 제외 본문 영역 */}
      <Box
        sx={{
          flex: 1,
          ml: "260px",
          px: { xs: 2, md: 6 },
          py: 5,
          maxWidth: "calc(100vw - 260px)",
        }}
      >
        {/* 본문 최대 너비 */}
        <Box sx={{ maxWidth: 860, mx: "auto" }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default BlogLayout;
