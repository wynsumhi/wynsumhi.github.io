/**
 * BlogHome 컴포넌트 (블로그 메인 페이지)
 *
 * Notion에서 가져온 블로그 글을 리스트 또는 카드 형태로 보여주는 화면입니다
 * 사용자가 선택한 보기 방식은 localStorage에 저장됩니다
 */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Collapse,
  IconButton,
  InputAdornment,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  CloseRounded,
  KeyboardDoubleArrowLeftRounded,
  KeyboardDoubleArrowRightRounded,
  KeyboardArrowLeftRounded,
  KeyboardArrowRightRounded,
  KeyboardArrowUpRounded,
  SearchOffRounded,
  SearchOutlined,
} from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePosts } from "@/hooks/usePosts";
import { getRelativeTime } from "@/utils/date";
import { cleanExcerpt, extractExcerpt, removeFullTextDetails } from "@/utils/markdown";
import type { BlogSection as PostSection, Post } from "@/types/blog";

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

// 타임라인 컬럼 폭
const TIMELINE_COLUMNS = {
  xs: "50px 18px minmax(0, 1fr)",
  md: "64px 22px minmax(0, 1fr)",
};

// 타임라인 컬럼 간격
const TIMELINE_GAP = { xs: 1.05, md: 1.35 };

// 타임라인 첫 줄 정렬 높이
const TIMELINE_HEADER_HEIGHT = { xs: 32, md: 36 };

// 연도와 타임라인 영역 분리 폭
const YEAR_GROUP_COLUMNS = {
  xs: "42px minmax(0, 1fr)",
  md: "58px minmax(0, 1fr)",
};

const LIST_INITIAL_VISIBLE_COUNT = 20;
const LIST_LOAD_MORE_COUNT = 20;
const CARD_PAGE_SIZE = 9;
const CARD_PAGE_WINDOW = 5;

type BlogSection = "all" | PostSection;

// 섹션 이름
const SECTION_LABELS: Record<BlogSection, string> = {
  all: "전체 글",
  tech: "기술 기록",
  study: "학습 노트",
  log: "회고",
  project: "프로젝트",
};

// URL 섹션 값 변환
const getBlogSection = (section: string | null): BlogSection => {
  if (section === "tech" || section === "study" || section === "log" || section === "project") return section;
  return "all";
};

// 글 섹션 분류
const getPostSection = (post: Post): PostSection => post.section ?? "tech";

// 카드 보기 아이콘
const GridViewIcon = ({ active }: { active: boolean }) => (
  <Box
    sx={{
      width: 22,
      height: 22,
      display: "grid",
      gridTemplateColumns: "repeat(2, 6px)",
      gridTemplateRows: "repeat(2, 6px)",
      gap: "4px",
      alignContent: "center",
      justifyContent: "center",
    }}
  >
    {[0, 1, 2, 3].map((item) => (
      <Box
        key={item}
        sx={{
          width: 6,
          height: 6,
          bgcolor: active ? "var(--blog-accent)" : "var(--blog-icon-muted)",
        }}
      />
    ))}
  </Box>
);

// 리스트 보기 아이콘
const ListViewIcon = ({ active }: { active: boolean }) => (
  <Box
    sx={{
      width: 23,
      height: 22,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: "3px",
    }}
  >
    {[0, 1, 2].map((item) => (
      <Box
        key={item}
        sx={{
          width: 22,
          height: 3,
          bgcolor: active ? "var(--blog-accent)" : "var(--blog-icon-muted)",
        }}
      />
    ))}
  </Box>
);

const SkeletonTone = {
  bgcolor: "var(--blog-card-soft-bg)",
} as const;

// 카드 로딩 스켈레톤
const CardSkeletonGrid = () => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: "repeat(3, minmax(0, 1fr))" },
      gridTemplateRows: { md: "repeat(3, minmax(0, 1fr))" },
      gridAutoRows: { xs: "auto", md: "minmax(0, 1fr)" },
      gap: { xs: 2, md: 1.05, lg: 1.05 },
      p: { md: "4px 5px 8px" },
      boxSizing: "border-box",
      flex: { md: "1 1 0" },
      minHeight: 0,
      overflow: { xs: "visible", md: "hidden" },
    }}
  >
    {Array.from({ length: CARD_PAGE_SIZE }).map((_, index) => (
      <Card
        key={index}
        sx={{
          height: { xs: "auto", md: "100%" },
          minHeight: 0,
          p: { xs: 2, md: 1.5, lg: 1.65 },
          pb: { xs: 1.05, md: 1.05, lg: 1.1 },
          border: "1px solid var(--blog-border)",
          borderRadius: 2.4,
          bgcolor: "var(--blog-card-bg)",
          boxShadow: "0 4px 12px rgba(15, 23, 42, 0.025)",
          overflow: "hidden",
          "@media (min-width: 900px) and (max-height: 820px)": {
            p: 1.25,
            pb: 0.72,
            borderRadius: 2,
          },
          "@media (min-width: 900px) and (max-height: 720px)": {
            p: 0.95,
            pb: 0.44,
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: { xs: 1.05, md: 1.05 } }}>
          <Skeleton animation="wave" variant="rounded" width={92} height={24} sx={SkeletonTone} />
          <Skeleton animation="wave" variant="text" width={46} height={20} sx={SkeletonTone} />
        </Box>

        <Box sx={{ minHeight: { xs: "3.2em", md: "3.48em" }, mb: { xs: 0.82, md: 0.95 } }}>
          <Skeleton animation="wave" variant="text" width="94%" height={30} sx={SkeletonTone} />
          <Skeleton animation="wave" variant="text" width="88%" height={30} sx={SkeletonTone} />
          <Skeleton animation="wave" variant="text" width="62%" height={30} sx={SkeletonTone} />
        </Box>

        <Box sx={{ mb: { xs: 0.72, md: 0.95 } }}>
          <Skeleton animation="wave" variant="text" width="96%" height={24} sx={SkeletonTone} />
          <Skeleton animation="wave" variant="text" width="78%" height={24} sx={SkeletonTone} />
        </Box>

        <Box sx={{ display: "flex", gap: 0.55 }}>
          <Skeleton animation="wave" variant="rounded" width={58} height={19} sx={SkeletonTone} />
          <Skeleton animation="wave" variant="rounded" width={70} height={19} sx={SkeletonTone} />
        </Box>
      </Card>
    ))}
  </Box>
);

// 리스트 로딩 스켈레톤
const ListSkeleton = () => (
  <Box>
    {Array.from({ length: 7 }).map((_, index) => (
      <Box
        key={index}
        sx={{
          display: "grid",
          gridTemplateColumns: TIMELINE_COLUMNS,
          gap: TIMELINE_GAP,
          minHeight: { xs: 136, md: 148 },
          mb: 2.4,
        }}
      >
        <Skeleton animation="wave" variant="text" width={48} height={28} sx={{ ...SkeletonTone, justifySelf: "end" }} />
        <Box sx={{ display: "flex", justifyContent: "center", pt: { xs: "10.5px", md: "12.5px" } }}>
          <Skeleton animation="wave" variant="circular" width={11} height={11} sx={SkeletonTone} />
        </Box>
        <Box
          sx={{
            mx: { xs: -0.6, md: -0.8 },
            px: { xs: 2.4, md: 3.6 },
            pt: { xs: 0.9, md: 1.05 },
            pb: { xs: 1.65, md: 2.05 },
          }}
        >
          <Skeleton animation="wave" variant="text" width="72%" height={34} sx={SkeletonTone} />
          <Skeleton animation="wave" variant="text" width="94%" height={24} sx={{ ...SkeletonTone, mt: 1.2 }} />
          <Skeleton animation="wave" variant="text" width="62%" height={24} sx={SkeletonTone} />
          <Box sx={{ display: "flex", gap: 0.6, mt: 1.2 }}>
            <Skeleton animation="wave" variant="rounded" width={64} height={22} sx={SkeletonTone} />
            <Skeleton animation="wave" variant="rounded" width={72} height={22} sx={SkeletonTone} />
          </Box>
        </Box>
      </Box>
    ))}
  </Box>
);

// 날짜 중심 리스트 뷰
const ListView = ({ posts }: { posts: Post[] }) => {
  const navigate = useNavigate();
  const groupedPosts = useMemo(() => {
    const groups = new Map<string, Post[]>();

    posts.forEach((post) => {
      const year = new Date(post.date).getFullYear().toString();
      groups.set(year, [...(groups.get(year) ?? []), post]);
    });

    return [...groups.entries()];
  }, [posts]);

  return (
    <Box>
      {groupedPosts.map(([year, yearPosts]) => (
        <Box
          key={year}
          sx={{
            display: "grid",
            gridTemplateColumns: YEAR_GROUP_COLUMNS,
            columnGap: { xs: 1.4, md: 2.4 },
            alignItems: "start",
            mb: { xs: 6, md: 7 },
          }}
        >
          {/* 스티키 연도 */}
          <Box
            sx={{
              position: "sticky",
              top: { xs: 16, md: 24 },
              zIndex: 2,
              height: TIMELINE_HEADER_HEIGHT,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              pointerEvents: "none",
            }}
          >
            <Typography
              sx={{
                textAlign: "right",
                color: "var(--blog-subtle)",
                fontSize: { xs: "0.82rem", md: "0.92rem" },
                fontWeight: 760,
                lineHeight: 1,
                letterSpacing: "0.01em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {year}
            </Typography>
          </Box>

          {/* 연도별 글 목록 */}
          <Box sx={{ minWidth: 0 }}>
            {yearPosts.map((post, idx) => {
              const date = new Date(post.date);
              const day = date.getDate().toString().padStart(2, "0");
              const month = MONTHS[date.getMonth()];

              return (
                <Box
                  key={post.id}
                  onClick={() => navigate(`/blog/${post.id}`)}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: TIMELINE_COLUMNS,
                    gap: TIMELINE_GAP,
                    minHeight: { xs: 136, md: 148 },
                    cursor: "pointer",
                    "&:hover .post-title": { color: "var(--blog-accent)" },
                    "&:hover .post-content": {
                      bgcolor: "var(--blog-card-bg)",
                      boxShadow: "0 18px 46px var(--blog-card-shadow)",
                      borderColor: "var(--blog-border)",
                    },
                  }}
                >
                  {/* 날짜 */}
                  <Box
                    sx={{
                      height: TIMELINE_HEADER_HEIGHT,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      textAlign: "right",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "var(--blog-subtle)",
                        fontSize: { xs: "0.88rem", md: "1.02rem" },
                        fontWeight: 700,
                        lineHeight: 1,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {day} {month}
                    </Typography>
                  </Box>

                {/* 타임라인 축 */}
                <Box
                  sx={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: "50%",
                      top: idx === 0 ? { xs: "16px", md: "18px" } : 0,
                      bottom: idx === yearPosts.length - 1 ? 34 : 0,
                      width: 2,
                      bgcolor: "var(--blog-timeline-line)",
                      transform: "translateX(-50%)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: { xs: "10.5px", md: "12.5px" },
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 1,
                      width: 11,
                      height: 11,
                      borderRadius: "50%",
                      bgcolor: "var(--blog-timeline-dot)",
                      border: "2px solid var(--blog-timeline-line)",
                    }}
                  />
                </Box>

                {/* 포스트 내용 */}
                <Box
                  className="post-content"
                  sx={{
                    mt: { xs: -0.9, md: -1.05 },
                    mx: { xs: -0.6, md: -0.8 },
                    mb: 2.4,
                    px: { xs: 2.4, md: 3.6 },
                    pt: { xs: 0.9, md: 1.05 },
                    pb: { xs: 1.65, md: 2.05 },
                    border: "1px solid transparent",
                    borderRadius: 2.4,
                    transition: "background-color 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                  }}
                >
                  {/* 제목과 작성 시점 */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      minHeight: TIMELINE_HEADER_HEIGHT,
                      mb: 1.2,
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      className="post-title"
                      sx={{
                        color: "var(--blog-heading)",
                        fontSize: { xs: "1.08rem", md: "1.3rem" },
                        fontWeight: 850,
                        lineHeight: 1.08,
                        transition: "color 0.2s",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {post.title}
                    </Typography>
                    <Typography
                      sx={{
                        flexShrink: 0,
                        color: "var(--blog-muted)",
                        fontSize: "0.82rem",
                        fontWeight: 800,
                        lineHeight: 1,
                      }}
                    >
                      {getRelativeTime(post.date)}
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      maxWidth: 860,
                      color: "var(--blog-subtle)",
                      fontSize: "0.92rem",
                      lineHeight: 1.75,
                      mb: 1.3,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {cleanExcerpt(post.excerpt || extractExcerpt(post.content, 150))}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 0.6, flexWrap: "wrap" }}>
                    <Chip
                      label={post.category}
                      size="small"
                      sx={{
                        height: 22,
                        bgcolor: "var(--blog-chip-bg)",
                        color: "var(--blog-chip-text)",
                        fontSize: "0.7rem",
                        fontWeight: 800,
                      }}
                    />
                  </Box>
                </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

// 카드 날짜 표시
const formatCardDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (Number.isNaN(date.getTime())) return "";
  if (diffDays <= 30) return getRelativeTime(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
};

// 카드 페이지 번호는 현재 페이지 주변만 노출해 탐색 부담을 줄임
const getCardPageNumbers = (currentPage: number, totalPages: number) => {
  const pageCount = Math.min(CARD_PAGE_WINDOW, totalPages);
  const halfWindow = Math.floor(pageCount / 2);
  const startPage = Math.min(
    Math.max(currentPage - halfWindow, 1),
    Math.max(totalPages - pageCount + 1, 1),
  );

  return Array.from({ length: pageCount }, (_, index) => startPage + index);
};

// 미리보기 카드 뷰
const CardView = ({ posts }: { posts: Post[] }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: "repeat(3, minmax(0, 1fr))" },
        gridTemplateRows: { md: "repeat(3, minmax(0, 1fr))" },
        gridAutoRows: { xs: "auto", md: "minmax(0, 1fr)" },
        gap: { xs: 1.6, sm: 1.8, md: 1.05, lg: 1.05 },
        p: { md: "4px 5px 8px" },
        boxSizing: "border-box",
        flex: { md: "1 1 0" },
        height: { md: "auto" },
        maxHeight: { md: "none" },
        overflow: { xs: "visible", md: "hidden" },
        minHeight: 0,
        "@media (min-width: 900px) and (max-height: 820px)": {
          gridTemplateRows: "repeat(3, minmax(0, 1fr))",
          gridAutoRows: "minmax(0, 1fr)",
          gap: 0.82,
        },
        "@media (min-width: 900px) and (max-height: 720px)": {
          gap: 0.68,
        },
        "@media (min-width: 900px) and (min-height: 900px)": {
          gridTemplateRows: "repeat(3, minmax(0, 1fr))",
          gridAutoRows: "minmax(0, 1fr)",
        },
      }}
    >
      {posts.map((post) => (
        <Card
          key={post.id}
          onClick={() => navigate(`/blog/${post.id}`)}
          sx={{
            minHeight: 0,
            height: { xs: "auto", md: "100%" },
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
            p: { xs: 1.85, sm: 2, md: 1.5, lg: 1.65 },
            pb: { xs: 1.55, sm: 1.7, md: 1.05, lg: 1.1 },
            bgcolor: "var(--blog-card-bg)",
            boxShadow: "0 4px 12px rgba(15, 23, 42, 0.025)",
            border: "1px solid var(--blog-border)",
            borderRadius: 2.4,
            overflow: "hidden",
            position: "relative",
            zIndex: 0,
            transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              zIndex: 2,
              borderColor: "rgba(37, 99, 235, 0.3)",
              boxShadow: "0 8px 20px rgba(37, 99, 235, 0.1)",
              "& .card-title": { color: "var(--blog-accent)" },
              "& .card-thumbnail": {
                transform: "scale(1.03)",
              },
            },
            "@media (min-width: 900px) and (max-height: 820px)": {
              p: 1.25,
              pb: 0.72,
              borderRadius: 2,
            },
            "@media (min-width: 900px) and (max-height: 720px)": {
              p: 0.95,
              pb: 0.44,
            },
            "@media (min-width: 900px) and (max-width: 1100px) and (max-height: 760px)": {
              p: 0.82,
              pb: 0.36,
            },
          }}
        >
            {/* 썸네일 이미지 */}
            {post.thumbnail ? (
              <Box
                sx={{
                mb: { xs: 1.15, md: 0.75 },
                  flex: { md: "0 0 auto" },
                  overflow: "hidden",
                  borderRadius: 1.8,
                  width: "100%",
                  height: { xs: 132, sm: 128, md: "clamp(42px, 6dvh, 66px)" },
                  bgcolor: "var(--blog-card-soft-bg)",
                  "@media (min-width: 900px) and (max-height: 780px)": {
                    height: "clamp(34px, 5dvh, 48px)",
                    mb: 0.6,
                  },
                  "@media (min-width: 900px) and (max-height: 760px)": {
                    display: "none",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={post.thumbnail}
                  alt={post.title}
                  className="card-thumbnail"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.35s ease",
                  }}
                />
              </Box>
            ) : null}

            <CardContent
              sx={{
                flex: "1 1 auto",
                display: "flex",
                flexDirection: "column",
                p: 0,
                minHeight: 0,
              }}
            >
              {/* 카드 메타 정보 */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  mb: { xs: 0.9, md: 1.05 },
                  minHeight: { xs: 26, md: 22 },
                  width: "100%",
                  flexShrink: 0,
                  "@media (min-width: 900px) and (max-height: 820px)": {
                    mb: 0.68,
                    minHeight: 21,
                  },
                  "@media (min-width: 900px) and (max-height: 720px)": {
                    mb: 0.4,
                    minHeight: 20,
                  },
                  "@media (min-width: 900px) and (max-width: 1100px) and (max-height: 760px)": {
                    mb: 0.28,
                    minHeight: 19,
                  },
                }}
              >
                <Chip
                  label={post.category}
                  size="small"
                  sx={{
                    height: { xs: 25, md: 22 },
                    fontSize: { xs: "0.72rem", md: "0.68rem" },
                    fontWeight: 850,
                    bgcolor: "var(--blog-chip-bg)",
                    color: "var(--blog-chip-text)",
                    borderRadius: 999,
                    maxWidth: "64%",
                    "& .MuiChip-label": {
                      px: { xs: 1.05, md: 1.15 },
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                    "@media (min-width: 900px) and (max-height: 760px)": {
                      height: 20,
                      fontSize: "0.62rem",
                    },
                    "@media (min-width: 900px) and (max-width: 1100px) and (max-height: 760px)": {
                      height: 18,
                      fontSize: "0.58rem",
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: "var(--blog-muted)",
                    fontSize: { xs: "0.74rem", md: "0.7rem" },
                    fontWeight: 850,
                    lineHeight: 1,
                    pt: 0.1,
                    flexShrink: 0,
                    fontVariantNumeric: "tabular-nums",
                    "@media (min-width: 900px) and (max-height: 760px)": {
                      fontSize: "0.66rem",
                    },
                    "@media (min-width: 900px) and (max-width: 1100px) and (max-height: 760px)": {
                      fontSize: "0.62rem",
                    },
                  }}
                >
                  {formatCardDate(post.date)}
                </Typography>
              </Box>

              {/* 제목 */}
              <Typography
                className="card-title"
                sx={{
                  fontSize: { xs: "1.02rem", sm: "1.08rem", md: "1.3rem", lg: "1.3rem" },
                  fontWeight: 850,
                  color: "var(--blog-heading)",
                  lineHeight: { xs: 1.34, md: 1.16 },
                  mb: { xs: 0.72, md: 0.95 },
                  pl: { xs: 0.45, md: 0.55 },
                  width: "100%",
                  boxSizing: "border-box",
                  transition: "color 0.2s",
                  flexShrink: 0,
                  wordBreak: "keep-all",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  minHeight: { xs: "2.68em", sm: "4.02em", md: "3.48em" },
                  maxHeight: { xs: "4.02em", md: "3.48em" },
                  "@media (min-width: 900px) and (max-height: 920px)": {
                    fontSize: "1.2rem",
                    lineHeight: 1.16,
                    mb: 0.76,
                    minHeight: "3.48em",
                    maxHeight: "3.48em",
                  },
                  "@media (min-width: 900px) and (max-height: 820px)": {
                    fontSize: "1.08rem",
                    lineHeight: 1.14,
                    mb: 0.5,
                    minHeight: "3.42em",
                    maxHeight: "3.42em",
                  },
                  "@media (min-width: 900px) and (max-height: 720px)": {
                    fontSize: "0.96rem",
                    lineHeight: 1.14,
                    mb: 0.34,
                    minHeight: "3.42em",
                    maxHeight: "3.42em",
                  },
                  "@media (min-width: 900px) and (max-width: 1100px) and (max-height: 760px)": {
                    fontSize: "0.9rem",
                    lineHeight: 1.13,
                    mb: 0.32,
                    minHeight: "3.39em",
                    maxHeight: "3.39em",
                  },
                }}
              >
                {post.title}
              </Typography>

              {/* 요약 */}
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: "0.84rem", sm: "0.88rem", md: "0.95rem", lg: "1rem" },
                  color: "var(--blog-subtle)",
                  lineHeight: { xs: 1.58, md: 1.5 },
                  minHeight: 0,
                  flexShrink: 0,
                  pl: { xs: 0.45, md: 0.55 },
                  width: "100%",
                  boxSizing: "border-box",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: { xs: 2, sm: 3, md: 2 },
                  WebkitBoxOrient: "vertical",
                  mb: { xs: 0.85, md: 0.95 },
                  "@media (min-width: 900px) and (max-height: 920px)": {
                    fontSize: "0.88rem",
                    lineHeight: 1.38,
                    WebkitLineClamp: 2,
                    mb: 0.72,
                  },
                  "@media (min-width: 900px) and (min-height: 980px)": {
                    WebkitLineClamp: 3,
                    mb: 1.15,
                  },
                  "@media (min-width: 900px) and (min-height: 1120px)": {
                    WebkitLineClamp: 3,
                    mb: 1.2,
                  },
                  "@media (min-width: 900px) and (max-height: 820px)": {
                    fontSize: "0.8rem",
                    lineHeight: 1.3,
                    WebkitLineClamp: 2,
                    mb: 0.42,
                  },
                  "@media (min-width: 900px) and (max-height: 720px)": {
                    fontSize: "0.74rem",
                    lineHeight: 1.24,
                    WebkitLineClamp: 1,
                    mb: 0.28,
                  },
                  "@media (min-width: 900px) and (max-height: 680px)": {
                    display: "none",
                  },
                  "@media (min-width: 900px) and (max-width: 1100px) and (max-height: 760px)": {
                    display: "none",
                  },
                }}
              >
                {cleanExcerpt(post.excerpt || extractExcerpt(post.content, 120))}
              </Typography>

            </CardContent>
        </Card>
      ))}
    </Box>
  );
};

type PostCollectionProps = {
  posts: Post[];
  viewMode: "list" | "card";
};

// 보기 방식에 맞게 많은 글을 나눠 보여주는 목록 래퍼
const PostCollection = ({ posts, viewMode }: PostCollectionProps) => {
  const [visibleCount, setVisibleCount] = useState(LIST_INITIAL_VISIBLE_COUNT);
  const [cardPage, setCardPage] = useState(1);
  const isListView = viewMode === "list";
  const visibleListPosts = posts.slice(0, visibleCount);
  const hasMoreListPosts = visibleCount < posts.length;
  const nextListCount = Math.min(LIST_LOAD_MORE_COUNT, posts.length - visibleCount);
  const totalCardPages = Math.ceil(posts.length / CARD_PAGE_SIZE);
  const cardPageNumbers = getCardPageNumbers(cardPage, totalCardPages);
  const cardPagePosts = posts.slice(
    (cardPage - 1) * CARD_PAGE_SIZE,
    cardPage * CARD_PAGE_SIZE,
  );

  useEffect(() => {
    setCardPage((current) => Math.min(current, Math.max(totalCardPages, 1)));
  }, [totalCardPages]);

  const handleLoadMoreList = () => {
    setVisibleCount((current) =>
      Math.min(current + LIST_LOAD_MORE_COUNT, posts.length),
    );
  };

  const handleCardPageChange = (page: number) => {
    setCardPage(page);
  };

  return (
    <Box
      sx={
        isListView
          ? undefined
          : {
              flex: { xs: "0 0 auto", md: 1 },
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              overflow: { xs: "visible", md: "hidden" },
            }
      }
    >
      {isListView ? (
        <>
          <ListView posts={visibleListPosts} />

          {hasMoreListPosts && (
            <Box
              sx={{
                mt: { xs: 3.5, md: 5 },
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                onClick={handleLoadMoreList}
                variant="outlined"
                sx={{
                  minWidth: 168,
                  px: 2.6,
                  py: 1.05,
                  borderRadius: 999,
                  borderColor: "var(--blog-border)",
                  color: "var(--blog-subtle)",
                  bgcolor: "var(--blog-card-bg)",
                  fontSize: "0.82rem",
                  fontWeight: 850,
                  boxShadow: "0 14px 36px var(--blog-card-shadow)",
                  "&:hover": {
                    borderColor: "var(--blog-accent)",
                    bgcolor: "var(--blog-chip-bg)",
                    color: "var(--blog-accent)",
                  },
                }}
              >
                더보기 {nextListCount}개 · {visibleListPosts.length}/{posts.length}
              </Button>
            </Box>
          )}
        </>
      ) : (
        <>
          <CardView posts={cardPagePosts} />

          {totalCardPages > 1 && (
            <Box
              sx={{
                mt: { xs: 1.8, md: "clamp(0.45rem, 1.45dvh, 1.15rem)" },
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                justifyContent: "center",
                gap: { xs: 0.65, sm: "clamp(0.32rem, 0.7dvh, 0.55rem)" },
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: { xs: 0.02, sm: 0.12 },
                  px: { xs: 0.35, md: 0.45 },
                  py: 0.25,
                  borderRadius: 2,
                  bgcolor: "transparent",
                }}
              >
                <Tooltip title="첫 페이지" placement="top">
                  <span>
                    <IconButton
                      aria-label="첫 페이지"
                      disabled={cardPage === 1}
                      onClick={() => handleCardPageChange(1)}
                      sx={{
                        width: { xs: 26, md: "clamp(22px, 3.2dvh, 26px)" },
                        height: { xs: 26, md: "clamp(22px, 3.2dvh, 26px)" },
                        borderRadius: 1.25,
                        color: "var(--blog-muted)",
                        "&:hover": {
                          bgcolor: "var(--blog-card-soft-bg)",
                          color: "var(--blog-heading)",
                        },
                        "&.Mui-disabled": {
                          color: "var(--blog-muted)",
                          opacity: 0.35,
                        },
                      }}
                    >
                      <KeyboardDoubleArrowLeftRounded fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>

                <Tooltip title="이전 페이지" placement="top">
                  <span>
                    <IconButton
                      aria-label="이전 페이지"
                      disabled={cardPage === 1}
                      onClick={() => handleCardPageChange(cardPage - 1)}
                      sx={{
                        width: { xs: 26, md: "clamp(22px, 3.2dvh, 26px)" },
                        height: { xs: 26, md: "clamp(22px, 3.2dvh, 26px)" },
                        borderRadius: 1.25,
                        color: "var(--blog-muted)",
                        "&:hover": {
                          bgcolor: "var(--blog-card-soft-bg)",
                          color: "var(--blog-heading)",
                        },
                        "&.Mui-disabled": {
                          color: "var(--blog-muted)",
                          opacity: 0.35,
                        },
                      }}
                    >
                      <KeyboardArrowLeftRounded fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>

                {cardPageNumbers.map((page) => {
                  const isCurrentPage = page === cardPage;

                  return (
                    <IconButton
                      key={page}
                      aria-label={`${page} 페이지`}
                      aria-current={isCurrentPage ? "page" : undefined}
                      onClick={() => handleCardPageChange(page)}
                      sx={{
                        minWidth: { xs: 28, md: "clamp(23px, 3.3dvh, 28px)" },
                        height: { xs: 26, md: "clamp(22px, 3.2dvh, 26px)" },
                        px: 0,
                        borderRadius: 1.25,
                        color: isCurrentPage ? "var(--blog-heading)" : "var(--blog-muted)",
                        bgcolor: isCurrentPage ? "var(--blog-card-soft-bg)" : "transparent",
                        border: isCurrentPage ? "1px solid var(--blog-border)" : "1px solid transparent",
                        boxShadow: "none",
                        fontSize: { xs: "0.8rem", md: "clamp(0.72rem, 1.7dvh, 0.8rem)" },
                        fontWeight: isCurrentPage ? 900 : 760,
                        transition:
                          "background-color 0.18s ease, color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease",
                        "&:hover": {
                          bgcolor: "var(--blog-card-soft-bg)",
                          color: "var(--blog-heading)",
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      {page}
                    </IconButton>
                  );
                })}

                <Tooltip title="다음 페이지" placement="top">
                  <span>
                    <IconButton
                      aria-label="다음 페이지"
                      disabled={cardPage === totalCardPages}
                      onClick={() => handleCardPageChange(cardPage + 1)}
                      sx={{
                        width: { xs: 26, md: "clamp(22px, 3.2dvh, 26px)" },
                        height: { xs: 26, md: "clamp(22px, 3.2dvh, 26px)" },
                        borderRadius: 1.25,
                        color: "var(--blog-muted)",
                        "&:hover": {
                          bgcolor: "var(--blog-card-soft-bg)",
                          color: "var(--blog-heading)",
                        },
                        "&.Mui-disabled": {
                          color: "var(--blog-muted)",
                          opacity: 0.35,
                        },
                      }}
                    >
                      <KeyboardArrowRightRounded fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>

                <Tooltip title="마지막 페이지" placement="top">
                  <span>
                    <IconButton
                      aria-label="마지막 페이지"
                      disabled={cardPage === totalCardPages}
                      onClick={() => handleCardPageChange(totalCardPages)}
                      sx={{
                        width: { xs: 26, md: "clamp(22px, 3.2dvh, 26px)" },
                        height: { xs: 26, md: "clamp(22px, 3.2dvh, 26px)" },
                        borderRadius: 1.25,
                        color: "var(--blog-muted)",
                        "&:hover": {
                          bgcolor: "var(--blog-card-soft-bg)",
                          color: "var(--blog-heading)",
                        },
                        "&.Mui-disabled": {
                          color: "var(--blog-muted)",
                          opacity: 0.35,
                        },
                      }}
                    >
                      <KeyboardDoubleArrowRightRounded fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>

              <Typography
                sx={{
                  px: 0,
                  py: 0,
                  borderRadius: 0,
                  bgcolor: "transparent",
                  color: "var(--blog-muted)",
                  fontSize: "0.7rem",
                  fontWeight: 760,
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                {cardPage} / {totalCardPages} 페이지
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

// 긴 목록에서 상단으로 빠르게 돌아가기 위한 버튼
const ScrollTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setIsVisible(window.scrollY > 420);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <Tooltip title="맨 위로" placement="left">
      <IconButton
        aria-label="맨 위로 이동"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        sx={{
          position: "fixed",
          right: { xs: 18, md: 34 },
          bottom: { xs: 18, md: 32 },
          zIndex: 30,
          width: 46,
          height: 46,
          bgcolor: "var(--blog-card-bg)",
          color: "var(--blog-accent)",
          border: "1px solid var(--blog-border)",
          boxShadow: "0 18px 44px var(--blog-card-shadow)",
          "&:hover": {
            bgcolor: "var(--blog-chip-bg)",
          },
        }}
      >
        <KeyboardArrowUpRounded />
      </IconButton>
    </Tooltip>
  );
};

type BlogHomeContentProps = {
  activeSection: BlogSection;
};

// 블로그 목록 본문
const BlogHomeContent = ({ activeSection }: BlogHomeContentProps) => {
  const searchFilterRef = useRef<HTMLDivElement | null>(null);

  // 저장된 보기 방식 초기값
  const [viewMode, setViewMode] = useState<"list" | "card">(
    () => (localStorage.getItem("blogViewMode") as "list" | "card") || "list",
  );
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.blogViewMode = viewMode;

    return () => {
      delete document.documentElement.dataset.blogViewMode;
    };
  }, [viewMode]);

  useEffect(() => {
    if (!isSearchOpen) return;

    const closeSearchOnOutsideClick = (event: PointerEvent) => {
      const target = event.target;

      if (
        target instanceof Node &&
        searchFilterRef.current?.contains(target)
      ) {
        return;
      }

      setIsSearchOpen(false);
    };

    document.addEventListener("pointerdown", closeSearchOnOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", closeSearchOnOutsideClick);
    };
  }, [isSearchOpen]);

  // 블로그 글 데이터 조회
  const { posts, loading, error } = usePosts();

  // 현재 섹션 글 목록
  const sectionPosts = useMemo(() => {
    const publishedPosts = [...posts]
      .filter((post) => post.published)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (activeSection === "all") return publishedPosts;
    return publishedPosts.filter((post) => getPostSection(post) === activeSection);
  }, [posts, activeSection]);

  // 카테고리 필터 목록
  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(new Set(sectionPosts.map((post) => post.category).filter(Boolean))),
    ];
  }, [sectionPosts]);

  // 화면 표시 포스트
  const filteredPosts = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return [...sectionPosts]
      .filter((post) => {
        const visibleContent = removeFullTextDetails(post.content);
        const matchesCategory =
          selectedCategory === "All" || post.category === selectedCategory;
        const searchableText = [
          SECTION_LABELS[getPostSection(post)],
          post.title,
          post.excerpt,
          visibleContent,
          post.category,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        const matchesKeyword = keyword.length === 0 || searchableText.includes(keyword);

        return matchesCategory && matchesKeyword;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sectionPosts, searchKeyword, selectedCategory]);

  // 보기 방식 저장
  const handleViewChange = (mode: "list" | "card") => {
    setViewMode(mode);
    localStorage.setItem("blogViewMode", mode);
  };

  // 검색 적용 상태
  const hasActiveSearch = searchKeyword.trim().length > 0;

  // 필터 적용 상태
  const hasActiveFilter = selectedCategory !== "All";

  // 검색 또는 필터 적용 상태
  const hasActiveCondition = hasActiveSearch || hasActiveFilter;

  // 표시 개수를 초기화할 조건 키
  const collectionKey = [
    activeSection,
    viewMode,
    searchKeyword.trim().toLowerCase(),
    selectedCategory,
  ].join("|");

  // 목록 제목
  const listTitle = (() => {
    if (selectedCategory !== "All") return `${selectedCategory} (${filteredPosts.length})`;
    if (hasActiveSearch) return `검색 결과 (${filteredPosts.length})`;
    return `${SECTION_LABELS[activeSection]} (${filteredPosts.length})`;
  })();

  // 필터 초기화
  const resetFilters = () => {
    setSearchKeyword("");
    setSelectedCategory("All");
  };

  // 로딩 상태 화면
  if (loading)
    return (
      <Box
        sx={{
          height: "100%",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: { xs: "visible", md: viewMode === "card" ? "hidden" : "visible" },
        }}
      >
        {viewMode === "card" ? <CardSkeletonGrid /> : <ListSkeleton />}
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

  return (
    <Box
      sx={{
        height: { xs: "auto", md: "100%" },
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflow: { xs: "visible", md: viewMode === "card" ? "hidden" : "visible" },
      }}
    >
      {/* 목록 헤더 영역 */}
      <Box
        ref={searchFilterRef}
        sx={{
          pb: viewMode === "card" ? { xs: 1.6, sm: 1.9, md: "clamp(0.8rem, 1.8dvh, 1.35rem)" } : 2.2,
          mb: viewMode === "card" ? { xs: 2.2, sm: 2.7, md: "clamp(0.9rem, 2.4dvh, 2.2rem)" } : 4,
          borderBottom: "1px solid var(--blog-divider)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {/* 검색과 목록 제목 */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.8,
              minWidth: 0,
            }}
          >
            <Tooltip title="검색과 필터" placement="top">
              <IconButton
                onClick={() => setIsSearchOpen((current) => !current)}
                sx={{
                  width: 30,
                  height: 30,
                  p: 0,
                  color: isSearchOpen || hasActiveCondition ? "var(--blog-accent)" : "var(--blog-muted)",
                  bgcolor: isSearchOpen || hasActiveCondition ? "var(--blog-chip-bg)" : "transparent",
                  "&:hover": {
                    bgcolor: "var(--blog-chip-bg)",
                    color: "var(--blog-accent)",
                  },
                }}
              >
                <SearchOutlined fontSize="small" />
              </IconButton>
            </Tooltip>

            <Typography
              component="p"
              sx={{
                color: "var(--blog-text)",
                fontSize: { xs: "0.98rem", md: "1.08rem" },
                fontWeight: 760,
                lineHeight: 1.25,
                letterSpacing: 0,
                whiteSpace: "nowrap",
              }}
            >
              {listTitle}
            </Typography>
          </Box>

          {/* 목록 도구 */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 0.45,
            }}
          >
            {/* 보기 전환 도구 */}
            <Tooltip title="리스트 뷰" placement="top">
              <IconButton
                onClick={() => handleViewChange("list")}
                sx={{
                  width: 30,
                  height: 30,
                  p: 0,
                  color: viewMode === "list" ? "var(--blog-accent)" : "var(--blog-icon-muted)",
                  "&:hover": {
                    bgcolor: "transparent",
                    color: "var(--blog-accent)",
                  },
                }}
              >
                <ListViewIcon active={viewMode === "list"} />
              </IconButton>
            </Tooltip>

            <Tooltip title="카드 뷰" placement="top">
              <IconButton
                onClick={() => handleViewChange("card")}
                sx={{
                  width: 30,
                  height: 30,
                  p: 0,
                  color: viewMode === "card" ? "var(--blog-accent)" : "var(--blog-icon-muted)",
                  "&:hover": {
                    bgcolor: "transparent",
                    color: "var(--blog-accent)",
                  },
                }}
              >
                <GridViewIcon active={viewMode === "card"} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* 접이식 검색/필터 패널 */}
        <Collapse in={isSearchOpen} timeout="auto" unmountOnExit>
          <Box
            sx={{
              mt: 1.8,
              p: { xs: 1.8, md: 2.2 },
              bgcolor: "var(--blog-search-bg)",
              border: "1px solid var(--blog-border)",
              borderRadius: 2.5,
              boxShadow: "0 18px 48px var(--blog-card-shadow)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: { xs: 1, sm: 2 },
                mb: 2,
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "stretch", sm: "center" },
              }}
            >
              <TextField
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                placeholder="제목, 본문, 카테고리 검색"
                size="small"
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchOutlined sx={{ color: "var(--blog-muted)", fontSize: 19 }} />
                      </InputAdornment>
                    ),
                    endAdornment: hasActiveSearch ? (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="검색어 지우기"
                          onClick={() => setSearchKeyword("")}
                          edge="end"
                          size="small"
                          sx={{ color: "var(--blog-muted)" }}
                        >
                          <CloseRounded fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  },
                }}
                sx={{
                  maxWidth: { sm: 380 },
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "var(--blog-card-bg)",
                    borderRadius: 999,
                    fontWeight: 700,
                    pr: hasActiveSearch ? 0.6 : 1.6,
                    "& fieldset": {
                      borderColor: "var(--blog-border)",
                    },
                    "&:hover fieldset": {
                      borderColor: "var(--blog-accent)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "var(--blog-accent)",
                      borderWidth: 1,
                    },
                  },
                }}
              />

              {hasActiveCondition && (
                <Chip
                  clickable
                  label="초기화"
                  onClick={resetFilters}
                  size="small"
                  sx={{
                    bgcolor: "var(--blog-card-soft-bg)",
                    color: "var(--blog-subtle)",
                    border: "1px solid var(--blog-divider)",
                    fontWeight: 800,
                  }}
                />
              )}
            </Box>

            {/* 카테고리 필터 */}
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ mb: 1, color: "var(--blog-muted)", fontSize: "0.72rem", fontWeight: 900 }}>
                CATEGORY
              </Typography>
              <Box sx={{ display: "flex", gap: 0.8, flexWrap: "wrap" }}>
                {categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    clickable
                    onClick={() => setSelectedCategory(category)}
                    sx={{
                      bgcolor: selectedCategory === category ? "var(--blog-filter-active-bg)" : "var(--blog-card-bg)",
                      color: selectedCategory === category ? "var(--blog-filter-active-text)" : "var(--blog-subtle)",
                      border: "1px solid var(--blog-border)",
                      fontWeight: 800,
                      "&:hover": {
                        bgcolor: selectedCategory === category ? "var(--blog-filter-hover-active-bg)" : "var(--blog-filter-hover-bg)",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>

          </Box>
        </Collapse>
      </Box>

      {/* 포스트 목록 */}
      {filteredPosts.length === 0 ? (
        <Box
          sx={{
            mt: { xs: 3, md: 4 },
            px: { xs: 2.4, md: 3 },
            py: { xs: 3.2, md: 4 },
            borderRadius: 3,
            bgcolor: "var(--blog-card-bg)",
            border: "1px solid var(--blog-border)",
            boxShadow: "0 18px 46px var(--blog-card-shadow)",
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 1.6,
          }}
        >
          {/* 빈 결과 아이콘 */}
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              bgcolor: "var(--blog-chip-bg)",
              color: "var(--blog-accent)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <SearchOffRounded sx={{ fontSize: 21 }} />
          </Box>

          {/* 빈 결과 안내 */}
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              sx={{
                color: "var(--blog-heading)",
                fontSize: { xs: "0.98rem", md: "1.06rem" },
                fontWeight: 820,
                lineHeight: 1.35,
                mb: 0.45,
              }}
            >
              조건에 맞는 글이 없어요
            </Typography>
            <Typography
              sx={{
                color: "var(--blog-subtle)",
                fontSize: "0.86rem",
                lineHeight: 1.65,
              }}
            >
              검색어를 줄이거나 카테고리 조건을 다시 조정해보세요
            </Typography>
          </Box>

          {hasActiveCondition && (
            <Chip
              clickable
              label="조건 초기화"
              onClick={resetFilters}
              sx={{
                display: { xs: "none", sm: "inline-flex" },
                bgcolor: "var(--blog-chip-bg)",
                color: "var(--blog-chip-text)",
                border: "1px solid var(--blog-border)",
                fontWeight: 800,
                "&:hover": {
                  bgcolor: "var(--blog-filter-hover-bg)",
                },
              }}
            />
          )}
        </Box>
      ) : (
        <PostCollection
          key={collectionKey}
          posts={filteredPosts}
          viewMode={viewMode}
        />
      )}

      {viewMode === "list" && <ScrollTopButton />}
    </Box>
  );
};

// 블로그 목록 메인 화면
const BlogHome = () => {
  const [searchParams] = useSearchParams();
  const activeSection = getBlogSection(searchParams.get("section"));

  return <BlogHomeContent key={activeSection} activeSection={activeSection} />;
};

export default BlogHome;
