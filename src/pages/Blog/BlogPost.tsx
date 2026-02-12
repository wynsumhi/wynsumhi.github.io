/**
 * BlogPost 컴포넌트 (블로그 포스트 상세 페이지)
 *
 * "/blog/:id" 경로에서 렌더링됩니다.
 * URL의 :id 파라미터로 해당 포스트를 찾아 전체 내용을 표시합니다.
 *
 * 동작 흐름:
 * 1. useParams로 URL에서 포스트 ID 추출
 * 2. usePosts로 전체 포스트 데이터 로드
 * 3. ID가 일치하는 포스트를 찾아 렌더링
 *
 * 상태 처리: 로딩 → 에러 → 포스트 없음 → 정상 표시
 */
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { usePosts } from "../../hooks/usePosts";
import { formatDate, getRelativeTime } from "../../utils/date";

const BlogPost = () => {
  // useParams: URL의 동적 파라미터를 객체로 추출 (예: /blog/abc → { id: "abc" })
  const { id } = useParams<{ id: string }>();
  // useNavigate: 프로그래밍 방식으로 페이지 이동
  const navigate = useNavigate();
  const { posts, loading, error } = usePosts();

  // 로딩 상태
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography>로딩 중...</Typography>
      </Container>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  // ID로 포스트 찾기 - posts 배열에서 id가 일치하는 포스트를 검색
  const post = posts.find((p) => p.id === id);

  // 포스트를 찾지 못한 경우 (잘못된 ID이거나 삭제된 포스트)
  if (!post) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="warning">포스트를 찾을 수 없습니다.</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          블로그 홈으로 돌아가기
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      {/* 뒤로가기 버튼 */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
        sx={{ mb: 3 }}
      >
        목록으로
      </Button>

      {/* 썸네일 이미지 - 있을 때만 표시 */}
      {post.thumbnail && (
        <Box
          component="img"
          src={post.thumbnail}
          alt={post.title}
          sx={{
            width: "100%",
            maxHeight: 400,
            objectFit: "cover", // 이미지 비율 유지하면서 영역 채우기
            borderRadius: 2,
            mb: 4,
          }}
        />
      )}

      {/* 카테고리 칩 */}
      <Chip
        label={post.category}
        color="primary"
        sx={{ mb: 2, fontWeight: 600 }}
      />

      {/* 포스트 제목 */}
      <Typography variant="h3" fontWeight={700} gutterBottom>
        {post.title}
      </Typography>

      {/* 날짜 정보 (절대 날짜 + 상대 시간) */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {formatDate(post.date)} · {getRelativeTime(post.date)}
      </Typography>

      {/* 태그 목록 */}
      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 3 }}>
        {post.tags.map((tag) => (
          <Chip key={tag} label={tag} size="small" variant="outlined" />
        ))}
      </Box>

      {/* 구분선 */}
      <Divider sx={{ mb: 4 }} />

      {/* 본문 내용 - 마크다운 텍스트를 줄바꿈 유지하며 표시 */}
      <Box
        sx={{
          "& p": { mb: 2, lineHeight: 1.8 },
          whiteSpace: "pre-wrap", // 줄바꿈(\n)을 그대로 유지
          wordBreak: "break-word", // 긴 단어가 있을 때 줄바꿈
          typography: "body1", // MUI의 body1 타이포그래피 스타일 적용
        }}
      >
        {post.content}
      </Box>
    </Container>
  );
};

export default BlogPost;
