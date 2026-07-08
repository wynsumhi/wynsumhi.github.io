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
  Typography,
  Box,
  Chip,
  Button,
  Divider,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MarkdownRenderer from "@/components/blog/MarkdownRenderer";
import { ROUTES } from "@/constants/routes";
import { usePosts } from "@/hooks/usePosts";
import { formatDate, getRelativeTime } from "@/utils/date";

const BlogPost = () => {
  // useParams: URL의 동적 파라미터를 객체로 추출 (예: /blog/abc → { id: "abc" })
  const { id } = useParams<{ id: string }>();
  // useNavigate: 프로그래밍 방식으로 페이지 이동
  const navigate = useNavigate();
  const { posts, loading, error } = usePosts();

  // 로딩 상태
  if (loading) {
    return (
      <Box sx={{ maxWidth: 900, mx: "auto", py: 8 }}>
        <Typography>로딩 중...</Typography>
      </Box>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <Box sx={{ maxWidth: 900, mx: "auto", py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // ID로 포스트 찾기 - posts 배열에서 id가 일치하는 포스트를 검색
  const post = posts.find((p) => p.id === id);

  // 포스트를 찾지 못한 경우 (잘못된 ID이거나 삭제된 포스트)
  if (!post) {
    return (
      <Box sx={{ maxWidth: 900, mx: "auto", py: 8 }}>
        <Alert severity="warning">포스트를 찾을 수 없습니다.</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(ROUTES.BLOG)}
          sx={{ mt: 2 }}
        >
          블로그 홈으로 돌아가기
        </Button>
      </Box>
    );
  }

  // 유효한 날짜 정보
  const hasDate = Boolean(post.date) && !Number.isNaN(new Date(post.date).getTime());

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", py: { xs: 1.5, md: 2.5 } }}>
      {/* 뒤로가기 버튼 */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(ROUTES.BLOG)}
        sx={{
          mb: { xs: 2.4, md: 3 },
          px: 0,
          color: "#64748b",
          fontWeight: 800,
          fontSize: "0.86rem",
          "&:hover": {
            bgcolor: "transparent",
            color: "#2563eb",
          },
        }}
      >
        목록으로
      </Button>

      <Box
        component="article"
        sx={{
          color: "#334155",
        }}
      >
        {/* 썸네일 이미지 */}
        {post.thumbnail && (
          <Box
            component="img"
            src={post.thumbnail}
            alt={post.title}
            sx={{
              width: "100%",
              maxHeight: 430,
              objectFit: "cover",
              borderRadius: 3,
              display: "block",
              mb: { xs: 3, md: 4 },
            }}
          />
        )}

        <Box>
          {/* 포스트 헤더 */}
          <Box sx={{ mb: { xs: 3.2, md: 4 } }}>
            <Box sx={{ display: "flex", gap: 0.8, flexWrap: "wrap", mb: 2 }}>
              {post.category && (
                <Chip
                  label={post.category}
                  size="small"
                  sx={{
                    height: 24,
                    bgcolor: "#eff4ff",
                    color: "#2563eb",
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    borderRadius: 999,
                  }}
                />
              )}
              {post.tags.slice(0, 4).map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{
                    height: 24,
                    bgcolor: "#f8fafc",
                    color: "#64748b",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    borderRadius: 999,
                  }}
                />
              ))}
            </Box>

            {/* 포스트 제목 */}
            <Typography
              component="h1"
              sx={{
                color: "#0f172a",
                fontSize: { xs: "1.9rem", md: "2.55rem" },
                fontWeight: 880,
                lineHeight: 1.22,
                letterSpacing: 0,
                mb: 1.4,
              }}
            >
              {post.title || "제목 없음"}
            </Typography>

            {/* 날짜 정보 */}
            {hasDate && (
              <Typography
                sx={{
                  color: "#94a3b8",
                  fontSize: "0.86rem",
                  fontWeight: 700,
                }}
              >
                {formatDate(post.date)} · {getRelativeTime(post.date)}
              </Typography>
            )}
          </Box>

          {/* 구분선 */}
          <Divider sx={{ mb: { xs: 3.2, md: 4 }, borderColor: "#e2e8f0" }} />

          {/* 마크다운 본문 */}
          <MarkdownRenderer content={post.content ?? ""} />
        </Box>
      </Box>
    </Box>
  );
};

export default BlogPost;
