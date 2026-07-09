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
  Breadcrumbs,
  Divider,
  Alert,
  Link as MuiLink,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import MarkdownRenderer from "@/components/blog/MarkdownRenderer";
import GitHubComments from "@/components/blog/GitHubComments";
import { ROUTES } from "@/constants/routes";
import { usePosts } from "@/hooks/usePosts";
import { formatDate, getRelativeTime } from "@/utils/date";
import type { BlogSection, Post } from "@/types/blog";

// 날짜 정렬 기준
const getPostTime = (post: Post) => {
  const time = new Date(post.date).getTime();
  return Number.isNaN(time) ? 0 : time;
};

// 섹션 표시 이름
const SECTION_LABELS: Record<BlogSection, string> = {
  tech: "Tech",
  study: "Study",
  log: "Log",
};

// 이전 데이터 기본 섹션
const getPostSection = (post: Post): BlogSection => post.section ?? "tech";

// 섹션 목록 경로
const getSectionPath = (section: BlogSection) => `${ROUTES.BLOG}?section=${section}`;

// 이전/다음 글 카드
const PostNavigationCard = ({
  label,
  post,
  direction,
  onClick,
}: {
  label: string;
  post?: Post;
  direction: "older" | "newer";
  onClick: () => void;
}) => {
  const isOlder = direction === "older";

  return (
    <Box
      component="button"
      type="button"
      disabled={!post}
      onClick={onClick}
      sx={{
        width: "100%",
        minHeight: { xs: 116, md: 132 },
        px: { xs: 2.2, md: 3 },
        py: { xs: 2.2, md: 2.7 },
        border: "1px solid var(--blog-divider)",
        borderRadius: 3,
        bgcolor: "var(--blog-panel-bg)",
        color: "var(--blog-text)",
        cursor: post ? "pointer" : "default",
        textAlign: isOlder ? "left" : "right",
        opacity: post ? 1 : 0.42,
        display: "flex",
        flexDirection: "column",
        alignItems: isOlder ? "flex-start" : "flex-end",
        gap: 1.1,
        position: "relative",
        zIndex: 0,
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        "&:hover": post
          ? {
              borderColor: "var(--blog-border)",
              boxShadow: "0 18px 46px var(--blog-card-shadow)",
              zIndex: 1,
            }
          : undefined,
        "&:hover .post-nav-title": post
          ? {
              color: "var(--blog-accent)",
            }
          : undefined,
      }}
    >
      <Typography
        sx={{
          color: "var(--blog-muted)",
          fontSize: "0.7rem",
          fontWeight: 820,
          letterSpacing: "0.08em",
          lineHeight: 1,
        }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.7,
          flexDirection: isOlder ? "row" : "row-reverse",
        }}
      >
        {isOlder ? (
          <KeyboardArrowLeftRoundedIcon sx={{ fontSize: 24, color: "var(--blog-muted)" }} />
        ) : (
          <KeyboardArrowRightRoundedIcon sx={{ fontSize: 24, color: "var(--blog-muted)" }} />
        )}
        <Typography
          className="post-nav-title"
          sx={{
            color: "var(--blog-heading)",
            fontSize: { xs: "0.98rem", md: "1.08rem" },
            fontWeight: 780,
            lineHeight: 1.45,
            wordBreak: "keep-all",
          }}
        >
          {post?.title ?? "이동할 글이 없습니다"}
        </Typography>
      </Box>
    </Box>
  );
};

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
  const publishedPosts = posts.filter((p) => p.published);
  const post = publishedPosts.find((p) => p.id === id);

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
  // 최신순 기준 이전/다음 글
  const sortedPosts = [...publishedPosts].sort((a, b) => getPostTime(b) - getPostTime(a));
  const currentPostIndex = sortedPosts.findIndex((sortedPost) => sortedPost.id === post.id);
  const newerPost = currentPostIndex > 0 ? sortedPosts[currentPostIndex - 1] : undefined;
  const olderPost =
    currentPostIndex >= 0 && currentPostIndex < sortedPosts.length - 1
      ? sortedPosts[currentPostIndex + 1]
      : undefined;
  const postSection = getPostSection(post);

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", py: { xs: 1.5, md: 2.5 } }}>
      {/* 상세 위치 네비게이션 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: { xs: 2.8, md: 3.4 },
        }}
      >
        <Breadcrumbs
          separator="›"
          sx={{
            color: "var(--blog-muted)",
            "& .MuiBreadcrumbs-separator": {
              mx: 0.8,
              color: "var(--blog-muted)",
              fontWeight: 800,
            },
          }}
        >
          <MuiLink
            component="button"
            type="button"
            aria-label="블로그 홈으로 이동"
            underline="hover"
            onClick={() => navigate(ROUTES.BLOG)}
            sx={{
              width: 28,
              height: 28,
              p: 0,
              border: 0,
              bgcolor: "transparent",
              color: "var(--blog-muted)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
              "&:hover": {
                color: "var(--blog-accent)",
              },
            }}
          >
            {/* 홈 이동 아이콘 */}
            <HomeRoundedIcon sx={{ fontSize: 22 }} />
          </MuiLink>
          <MuiLink
            component="button"
            type="button"
            underline="hover"
            onClick={() => navigate(getSectionPath(postSection))}
            sx={{
              color: "var(--blog-subtle)",
              fontSize: "0.94rem",
              fontWeight: 700,
              lineHeight: 1.35,
              p: 0,
              border: 0,
              bgcolor: "transparent",
              cursor: "pointer",
              "&:hover": {
                color: "var(--blog-accent)",
              },
            }}
          >
            {SECTION_LABELS[postSection]}
          </MuiLink>
          {post.category && (
            <Typography
              sx={{
                color: "var(--blog-muted)",
                fontSize: "0.94rem",
                fontWeight: 700,
                lineHeight: 1.35,
              }}
            >
              {post.category}
            </Typography>
          )}
        </Breadcrumbs>
      </Box>

      <Box
        component="article"
        sx={{
          color: "var(--blog-text)",
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
            {/* 포스트 제목 */}
            <Typography
              component="h1"
              sx={{
                color: "var(--blog-heading)",
                fontSize: { xs: "1.9rem", md: "2.55rem" },
                fontWeight: 880,
                lineHeight: 1.22,
                letterSpacing: 0,
                mb: 1.5,
              }}
            >
              {post.title || "제목 없음"}
            </Typography>

            {/* 날짜 정보 */}
            {hasDate && (
              <Typography
                sx={{
                  color: "var(--blog-muted)",
                  fontSize: "0.86rem",
                  fontWeight: 700,
                  mb: 2.1,
              }}
            >
              {formatDate(post.date)} · {getRelativeTime(post.date)}
            </Typography>
            )}
          </Box>

          {/* 구분선 */}
          <Divider sx={{ mb: { xs: 3.2, md: 4 }, borderColor: "var(--blog-divider)" }} />

          {/* 마크다운 본문 */}
          <MarkdownRenderer content={post.content ?? ""} />

          {/* 하단 태그 목록 */}
          {post.tags.length > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.2,
                mt: { xs: 5.5, md: 7 },
                pt: { xs: 2.5, md: 3 },
                borderTop: "1px solid var(--blog-divider)",
              }}
            >
              <LocalOfferOutlinedIcon
                sx={{
                  mt: 0.25,
                  fontSize: 22,
                  color: "var(--blog-muted)",
                }}
              />
              <Box sx={{ display: "flex", gap: 0.8, flexWrap: "wrap" }}>
                {post.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{
                      height: 26,
                      bgcolor: "var(--blog-card-soft-bg)",
                      color: "var(--blog-subtle)",
                      border: "1px solid var(--blog-divider)",
                      fontSize: "0.72rem",
                      fontWeight: 720,
                      borderRadius: 999,
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* 이전/다음 글 이동 */}
          <Box
            component="nav"
            aria-label="이전 다음 글"
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: { xs: 1.4, md: 0 },
              mt: { xs: 6.5, md: 8 },
              borderRadius: 3,
              overflow: "hidden",
              "& > button:first-of-type": {
                borderTopRightRadius: { md: 0 },
                borderBottomRightRadius: { md: 0 },
              },
              "& > button:last-of-type": {
                borderTopLeftRadius: { md: 0 },
                borderBottomLeftRadius: { md: 0 },
                ml: { md: "-1px" },
              },
            }}
          >
            <PostNavigationCard
              label="OLDER"
              post={olderPost}
              direction="older"
              onClick={() => olderPost && navigate(`/blog/${olderPost.id}`)}
            />
            <PostNavigationCard
              label="NEWER"
              post={newerPost}
              direction="newer"
              onClick={() => newerPost && navigate(`/blog/${newerPost.id}`)}
            />
          </Box>

          {/* GitHub 댓글 */}
          <GitHubComments />
        </Box>
      </Box>
    </Box>
  );
};

export default BlogPost;
