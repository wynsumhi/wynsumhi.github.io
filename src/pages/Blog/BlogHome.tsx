/**
 * BlogHome 컴포넌트 (블로그 메인 페이지)
 *
 * Notion에서 가져온 블로그 글을 리스트 또는 카드 형태로 보여주는 화면입니다
 * 사용자가 선택한 보기 방식은 localStorage에 저장됩니다
 */
import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Collapse,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  CloseRounded,
  SearchOffRounded,
  SearchOutlined,
} from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePosts } from "@/hooks/usePosts";
import { getRelativeTime } from "@/utils/date";
import { extractExcerpt, removeFullTextDetails } from "@/utils/markdown";
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

type BlogSection = "all" | PostSection;

// 섹션 이름
const SECTION_LABELS: Record<BlogSection, string> = {
  all: "전체 글",
  tech: "기술 기록",
  study: "학습 노트",
  log: "회고",
};

// URL 섹션 값 변환
const getBlogSection = (section: string | null): BlogSection => {
  if (section === "tech" || section === "study" || section === "log") return section;
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

// 날짜 중심 리스트 뷰
const ListView = ({ posts }: { posts: Post[] }) => {
  const navigate = useNavigate();
  const groupedPosts = posts.reduce<Record<string, Post[]>>((groups, post) => {
    const year = new Date(post.date).getFullYear().toString();

    return {
      ...groups,
      [year]: [...(groups[year] ?? []), post],
    };
  }, {});

  return (
    <Box>
      {Object.entries(groupedPosts).map(([year, yearPosts]) => (
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
                    {post.excerpt || extractExcerpt(post.content, 150)}
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
                    {post.tags.slice(0, 5).map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{
                          height: 22,
                          color: "var(--blog-subtle)",
                          borderColor: "var(--blog-border)",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                        }}
                      />
                    ))}
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

// 미리보기 카드 뷰
const CardView = ({ posts }: { posts: Post[] }) => {
  const navigate = useNavigate();

  return (
    // Grid container: 내부 Grid item들을 격자 형태로 배치
    <Grid container spacing={{ xs: 2.2, md: 2.6 }}>
      {posts.map((post) => (
        // size: xs=12(모바일 1열), sm=6(태블릿 2열), lg=4(데스크톱 3열)
        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={post.id}>
          <Card
            onClick={() => navigate(`/blog/${post.id}`)}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              cursor: "pointer",
              p: { xs: 2.1, md: 2.4 },
              bgcolor: "var(--blog-card-bg)",
              boxShadow: "0 18px 50px var(--blog-card-shadow)",
              borderRadius: 3.5,
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 24px 64px var(--blog-card-hover-shadow)",
                "& .card-title": { color: "var(--blog-accent)" },
                "& .card-thumbnail": {
                  transform: "scale(1.03)",
                },
              },
            }}
          >
            {/* 썸네일 이미지 */}
            {post.thumbnail ? (
              <Box
                sx={{
                  mb: 2,
                  overflow: "hidden",
                  borderRadius: 2.4,
                  aspectRatio: "16 / 9",
                  bgcolor: "var(--blog-card-soft-bg)",
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
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                p: 0,
              }}
            >
              {/* 카드 메타 정보 */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1.4,
                }}
              >
                <Chip
                  label={post.category}
                  size="small"
                  sx={{
                    height: 23,
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    bgcolor: "var(--blog-chip-bg)",
                    color: "var(--blog-chip-text)",
                    borderRadius: 999,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: "var(--blog-muted)",
                    fontSize: "0.74rem",
                    fontWeight: 800,
                    ml: "auto",
                  }}
                >
                  {formatCardDate(post.date)}
                </Typography>
              </Box>

              {/* 제목 */}
              <Typography
                className="card-title"
                sx={{
                  fontSize: { xs: "1.05rem", md: "1.12rem" },
                  fontWeight: 850,
                  color: "var(--blog-heading)",
                  lineHeight: 1.45,
                  mb: 1.2,
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
                  fontSize: "0.86rem",
                  color: "var(--blog-subtle)",
                  lineHeight: 1.72,
                  flexGrow: 1,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  mb: 2,
                }}
              >
                {post.excerpt || extractExcerpt(post.content, 120)}
              </Typography>

              {/* 태그 */}
              <Box sx={{ display: "flex", gap: 0.6, flexWrap: "wrap" }}>
                {post.tags.slice(0, 3).map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: "0.7rem",
                      bgcolor: "var(--blog-card-soft-bg)",
                      color: "var(--blog-subtle)",
                      fontWeight: 700,
                      borderRadius: 999,
                    }}
                  />
                ))}
                {post.tags.length > 3 && (
                  <Chip
                    label={`+${post.tags.length - 3}`}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: "0.7rem",
                      bgcolor: "var(--blog-card-soft-bg)",
                      color: "var(--blog-muted)",
                      fontWeight: 800,
                      borderRadius: 999,
                    }}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

type BlogHomeContentProps = {
  activeSection: BlogSection;
};

// 블로그 목록 본문
const BlogHomeContent = ({ activeSection }: BlogHomeContentProps) => {
  // 저장된 보기 방식 초기값
  const [viewMode, setViewMode] = useState<"list" | "card">(
    () => (localStorage.getItem("blogViewMode") as "list" | "card") || "list",
  );
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 블로그 글 데이터 조회
  const { posts, loading, error } = usePosts();

  // 현재 섹션 글 목록
  const sectionPosts = useMemo(() => {
    const publishedPosts = posts.filter((post) => post.published);

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

  // 태그 필터 목록
  const tags = useMemo(() => {
    return ["All", ...Array.from(new Set(sectionPosts.flatMap((post) => post.tags))).sort()];
  }, [sectionPosts]);

  // 화면 표시 포스트
  const filteredPosts = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return [...sectionPosts]
      .filter((post) => {
        const visibleContent = removeFullTextDetails(post.content);
        const matchesCategory =
          selectedCategory === "All" || post.category === selectedCategory;
        const matchesTag = selectedTag === "All" || post.tags.includes(selectedTag);
        const searchableText = [
          SECTION_LABELS[getPostSection(post)],
          post.title,
          post.excerpt,
          visibleContent,
          post.category,
          ...post.tags,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        const matchesKeyword = keyword.length === 0 || searchableText.includes(keyword);

        return matchesCategory && matchesTag && matchesKeyword;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sectionPosts, searchKeyword, selectedCategory, selectedTag]);

  // 보기 방식 저장
  const handleViewChange = (mode: "list" | "card") => {
    setViewMode(mode);
    localStorage.setItem("blogViewMode", mode);
  };

  // 검색 적용 상태
  const hasActiveSearch = searchKeyword.trim().length > 0;

  // 필터 적용 상태
  const hasActiveFilter = selectedCategory !== "All" || selectedTag !== "All";

  // 검색 또는 필터 적용 상태
  const hasActiveCondition = hasActiveSearch || hasActiveFilter;

  // 목록 제목
  const listTitle = (() => {
    if (selectedCategory !== "All") return `${selectedCategory} (${filteredPosts.length})`;
    if (selectedTag !== "All") return `#${selectedTag} (${filteredPosts.length})`;
    if (hasActiveSearch) return `검색 결과 (${filteredPosts.length})`;
    return `${SECTION_LABELS[activeSection]} (${filteredPosts.length})`;
  })();

  // 필터 초기화
  const resetFilters = () => {
    setSearchKeyword("");
    setSelectedCategory("All");
    setSelectedTag("All");
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

  return (
    <Box>
      {/* 목록 헤더 영역 */}
      <Box
        sx={{
          pb: 2.2,
          mb: 4,
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
        <Collapse in={isSearchOpen || hasActiveCondition} timeout="auto" unmountOnExit>
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
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                placeholder="제목, 본문, 태그 검색"
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
                  maxWidth: { md: 380 },
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

            {/* 태그 필터 */}
            <Box>
              <Typography sx={{ mb: 1, color: "var(--blog-muted)", fontSize: "0.72rem", fontWeight: 900 }}>
                TAG
              </Typography>
              <Box sx={{ display: "flex", gap: 0.7, flexWrap: "wrap" }}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag === "All" ? "All" : `#${tag}`}
                    clickable
                    variant="outlined"
                    onClick={() => setSelectedTag(tag)}
                    sx={{
                      height: 26,
                      bgcolor: selectedTag === tag ? "var(--blog-chip-bg)" : "transparent",
                      color: selectedTag === tag ? "var(--blog-chip-text)" : "var(--blog-subtle)",
                      borderColor: selectedTag === tag ? "var(--blog-accent)" : "var(--blog-border)",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      "&:hover": {
                        borderColor: "var(--blog-accent)",
                        bgcolor: "var(--blog-chip-bg)",
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
              검색어를 줄이거나 카테고리와 태그 조건을 다시 조정해보세요
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
      ) : viewMode === "list" ? (
        <ListView posts={filteredPosts} />
      ) : (
        <CardView posts={filteredPosts} />
      )}
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
