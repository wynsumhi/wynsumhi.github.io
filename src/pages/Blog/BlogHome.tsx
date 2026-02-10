import { Box, Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const BlogHome = () => {
  // useNavigate: 프로그래밍 방식으로 페이지 이동
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" gutterBottom>
          HYUNA's Tech Blog
        </Typography>

        <Typography variant="body1" sx={{ mb: 4 }}>
          프론트엔드 개발, 학습 기록, 프로젝트 회고 등을 작성합니다.
        </Typography>

        {/* 포트폴리오로 이동하는 버튼 */}
        <Button variant="outlined" onClick={() => navigate("/portfolio")}>
          포트폴리오 보러가기 →
        </Button>

        {/* 여기에 블로그 글 목록 등 추가 */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">최근 글</Typography>
          {/* 블로그 글 리스트 */}
        </Box>
      </Container>
    </Box>
  );
};

export default BlogHome;
