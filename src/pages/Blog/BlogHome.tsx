/**
 * BlogHome 컴포넌트 (블로그 메인 페이지)
 *
 * "/" 경로에서 렌더링되는 블로그 홈 페이지입니다.
 * Notion에서 가져온 포스트 데이터를 최신순으로 9개까지 카드 형태로 표시합니다.
 *
 * 상태 처리:
 * - 로딩 중 → 로딩 메시지
 * - 에러 발생 → 에러 알림
 * - 포스트 없음 → 안내 메시지
 * - 정상 → 포스트 카드 그리드
 */
import { Container, Typography, Box, Alert } from "@mui/material";
import { usePosts } from "@/hooks/usePosts";
import PostList from "./components/PostList";

const BlogHome = () => {
  // usePosts 훅에서 포스트 데이터와 유틸리티 함수를 가져옴
  const { posts, loading, error, getRecentPosts } = usePosts();

  // 로딩 상태 처리
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography>로딩 중...</Typography>
      </Container>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
        <Typography sx={{ mt: 2 }}>
          Notion API에서 글을 가져오려면 빌드를 실행하세요.
        </Typography>
      </Container>
    );
  }

  // 최신 포스트 9개를 가져옴 (getRecentPosts는 날짜 내림차순 정렬)
  const recentPosts = getRecentPosts(9);

  // 포스트가 하나도 없는 경우
  if (posts.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h2" gutterBottom>
          Tech Blog
        </Typography>
        <Alert severity="info">
          아직 작성된 글이 없습니다. Notion에서 글을 작성해주세요!
        </Alert>
      </Container>
    );
  }

  // 정상 상태: 포스트 목록 표시
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* 페이지 헤더 */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h2" fontWeight={700} gutterBottom>
          Tech Blog
        </Typography>
        <Typography variant="body1" color="text.secondary">
          프론트엔드 개발, 학습 기록, 프로젝트 회고
        </Typography>
      </Box>

      {/* 포스트 카드 그리드 */}
      <PostList posts={recentPosts} />
    </Container>
  );
};

export default BlogHome;
