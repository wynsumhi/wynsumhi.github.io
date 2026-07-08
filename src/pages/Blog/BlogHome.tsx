/**
 * BlogHome 컴포넌트 (블로그 메인 페이지)
 *
 * Notion에서 가져온 블로그 글을 리스트 또는 카드 형태로 보여주는 화면입니다
 * 사용자가 선택한 보기 방식은 localStorage에 저장됩니다
 */
import { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Alert,
  IconButton,
  Tooltip,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import {
  GridViewOutlined, // 카드 뷰 아이콘
  ViewListOutlined, // 리스트 뷰 아이콘
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { usePosts } from "@/hooks/usePosts";
import { getRelativeTime } from "@/utils/date";
import { extractExcerpt } from "@/utils/markdown";
import type { Post } from "@/types/blog";

// 날짜 표시에 사용하는 월 이름 약자 배열
// 인덱스 0 = 1월(Jan), 11 = 12월(Dec)
// new Date().getMonth()는 0~11을 반환하므로 배열 인덱스와 그대로 매핑됨
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// 날짜 중심 리스트 뷰
const ListView = ({ posts }: { posts: Post[] }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {posts.map((post, idx) => {
        // 날짜 파싱
        const date = new Date(post.date);
        const day = date.getDate().toString().padStart(2, "0");
        // padStart(2, "0"): 한 자리 숫자 앞에 0을 붙임 (예: 5 → "05")
        const month = MONTHS[date.getMonth()];

        return (
          <Box
            key={post.id}
            onClick={() => navigate(`/blog/${post.id}`)}
            sx={{
              display: "flex",
              gap: 2.5,
              py: 2.5,
              px: 2,
              borderRadius: 2,
              cursor: "pointer",
              // 마지막 항목에는 하단 구분선 없음
              borderBottom:
                idx < posts.length - 1 ? "1px solid #f1f5f9" : "none",
              "&:hover": {
                bgcolor: "#f8faff",
                // 자식 요소의 className으로 hover 스타일 제어
                "& .post-title": { color: "#2563eb" },
              },
              transition: "all 0.2s ease",
            }}
          >
            {/* 날짜 컬럼 — 일(숫자) + 월(영문) */}
            <Box
              sx={{ flexShrink: 0, width: 48, textAlign: "center", pt: 0.3 }}
            >
              <Typography
                sx={{
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: "#1e293b",
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                  // tabular-nums: 숫자 너비를 고정해서 정렬이 맞게 함 (01, 10, 31 등)
                }}
              >
                {day}
              </Typography>
              <Typography
                sx={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 500 }}
              >
                {month}
              </Typography>
            </Box>

            {/* 세로 구분선 */}
            <Box
              sx={{
                width: "1px",
                bgcolor: "#e2e8f0",
                flexShrink: 0,
                borderRadius: 1,
              }}
            />

            {/* 콘텐츠 영역 */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {/* 카테고리 칩 */}
              <Chip
                label={post.category}
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  bgcolor: "#eff4ff",
                  color: "#2563eb",
                  mb: 0.8,
                }}
              />
              {/* 제목 */}
              <Typography
                className="post-title" // 부모 hover에서 이 className을 타겟팅
                sx={{
                  fontSize: "0.98rem",
                  fontWeight: 600,
                  color: "#1e293b",
                  lineHeight: 1.4,
                  mb: 0.5,
                  transition: "color 0.2s",
                  // 2줄 말줄임 처리
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {post.title}
              </Typography>
              {/* 요약 */}
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.82rem",
                  color: "#64748b",
                  lineHeight: 1.5,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  mb: 1,
                }}
              >
                {/* excerpt가 있으면 사용, 없으면 content에서 120자 추출 */}
                {post.excerpt || extractExcerpt(post.content, 120)}
              </Typography>
              {/* 태그 목록 */}
              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                {post.tags.slice(0, 3).map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 20,
                      fontSize: "0.68rem",
                      color: "#64748b",
                      borderColor: "#e2e8f0",
                      "&:hover": {
                        borderColor: "#2563eb",
                        color: "#2563eb",
                        bgcolor: "#eff4ff",
                      },
                      transition: "all 0.2s",
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

// 썸네일 중심 카드 뷰
const CardView = ({ posts }: { posts: Post[] }) => {
  const navigate = useNavigate();

  return (
    // Grid container: 내부 Grid item들을 격자 형태로 배치
    <Grid container spacing={3}>
      {posts.map((post) => (
        // size: xs=12(모바일 1열), sm=6(태블릿 2열)
        <Grid size={{ xs: 12, sm: 6 }} key={post.id}>
          <Card
            onClick={() => navigate(`/blog/${post.id}`)}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              cursor: "pointer",
              border: "1px solid #e2e8f0",
              boxShadow: "none",
              borderRadius: 3,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-6px)", // 위로 떠오르는 효과
                boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
                borderColor: "#cbd5e1",
                "& .card-title": { color: "#2563eb" },
              },
            }}
          >
            {/* 썸네일 이미지 — 없으면 상단에 파란 줄로 대체 */}
            {post.thumbnail ? (
              <CardMedia
                component="img"
                height="180"
                image={post.thumbnail}
                alt={post.title}
                sx={{ objectFit: "cover" }}
              />
            ) : (
              // 썸네일이 없을 때 카드 상단에 파란 강조 줄 표시
              <Box
                sx={{
                  height: 8,
                  bgcolor: "#2563eb",
                  borderRadius: "12px 12px 0 0",
                }}
              />
            )}

            <CardContent
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                p: 2.5,
              }}
            >
              {/* 카테고리 + 상대 시간 */}
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Chip
                  label={post.category}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    bgcolor: "#eff4ff",
                    color: "#2563eb",
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ color: "#94a3b8", fontSize: "0.72rem", ml: "auto" }}
                >
                  {getRelativeTime(post.date)}
                </Typography>
              </Box>

              {/* 제목 */}
              <Typography
                className="card-title"
                sx={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "#1e293b",
                  lineHeight: 1.4,
                  mb: 1,
                  transition: "color 0.2s",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {post.title}
              </Typography>

              {/* 요약 */}
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.82rem",
                  color: "#64748b",
                  lineHeight: 1.6,
                  flexGrow: 1, // 남은 공간을 차지해서 태그를 항상 하단에 고정
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  mb: 1.5,
                }}
              >
                {post.excerpt || extractExcerpt(post.content, 120)}
              </Typography>

              {/* 태그 */}
              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                {post.tags.slice(0, 3).map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 20,
                      fontSize: "0.68rem",
                      color: "#64748b",
                      borderColor: "#e2e8f0",
                    }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

// 블로그 목록 메인 화면
const BlogHome = () => {
  // 저장된 보기 방식 초기값
  const [viewMode, setViewMode] = useState<"list" | "card">(
    () => (localStorage.getItem("blogViewMode") as "list" | "card") || "list",
  );

  // 블로그 글 데이터 조회
  const { posts, loading, error, getRecentPosts } = usePosts();

  // 보기 방식 저장
  const handleViewChange = (mode: "list" | "card") => {
    setViewMode(mode);
    localStorage.setItem("blogViewMode", mode);
  };

  // 로딩 상태 화면
  if (loading)
    return (
      <Box sx={{ py: 8 }}>
        <Typography color="text.secondary">로딩 중...</Typography>
      </Box>
    );

  // 에러 상태 화면
  if (error)
    return (
      <Box sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  // 빈 목록 상태 화면
  if (posts.length === 0)
    return (
      <Box sx={{ py: 8 }}>
        <Alert severity="info">
          아직 작성된 글이 없습니다. Notion에서 글을 작성해주세요!
        </Alert>
      </Box>
    );

  // 최신 글 목록
  const recentPosts = getRecentPosts(20);

  return (
    <Box>
      {/* 목록 헤더 영역 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 3,
          mb: 3,
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        {/* 왼쪽 목록 제목 */}
        <Typography
          component="h1"
          sx={{
            color: "#111111",
            fontSize: { xs: "1.22rem", md: "1.4rem" },
            fontWeight: 650,
            lineHeight: 1,
          }}
        >
          전체 글 ({posts.length})
        </Typography>

        {/* 오른쪽 보기 전환 */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.4,
          }}
        >
          {/* 리스트 뷰 버튼 */}
          <Tooltip title="리스트 뷰" placement="top">
            <IconButton
              onClick={() => handleViewChange("list")}
              sx={{
                width: 34,
                height: 34,
                p: 0,
                color: viewMode === "list" ? "#111111" : "#b7b7b7",
                "&:hover": {
                  bgcolor: "transparent",
                  color: "#111111",
                },
              }}
            >
              <ViewListOutlined sx={{ fontSize: 30 }} />
            </IconButton>
          </Tooltip>

          {/* 카드 뷰 버튼 */}
          <Tooltip title="카드 뷰" placement="top">
            <IconButton
              onClick={() => handleViewChange("card")}
              sx={{
                width: 34,
                height: 34,
                p: 0,
                color: viewMode === "card" ? "#111111" : "#b7b7b7",
                "&:hover": {
                  bgcolor: "transparent",
                  color: "#111111",
                },
              }}
            >
              <GridViewOutlined sx={{ fontSize: 28 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* ── 포스트 렌더링 ── */}
      {/*
        viewMode에 따라 ListView 또는 CardView 중 하나를 렌더링
        삼항 연산자: 조건 ? 참일 때 : 거짓일 때
      */}
      {viewMode === "list" ? (
        <ListView posts={recentPosts} />
      ) : (
        <CardView posts={recentPosts} />
      )}
    </Box>
  );
};

export default BlogHome;
