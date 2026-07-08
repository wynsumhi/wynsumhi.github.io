/**
 * 홈 페이지
 *
 * 첫 진입 화면에서 소개, 핵심 역량, 대표 작업, 최신 글을 보여주는 화면입니다
 */
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DownloadIcon from "@mui/icons-material/Download";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { createElement, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { CONFIG } from "@/constants/config";
import { usePosts } from "@/hooks/usePosts";
import { useProjects } from "@/hooks/useProjects";
import { formatDate } from "@/utils/date";

const strengths = [
  {
    title: "UI/UX를 고려한 화면 구현",
    description:
      "사용자 경험을 기술로 구현한다는 관점으로 화면 흐름과 인터랙션을 설계합니다.",
  },
  {
    title: "웹 표준 기반 마크업",
    description:
      "HTML, CSS, SCSS, JavaScript로 반응형 웹 페이지와 동적 UI를 안정적으로 만듭니다.",
  },
  {
    title: "기록하며 성장하는 개발",
    description:
      "Notion 기반 Tech Blog에 학습 과정과 문제 해결 과정을 남기며 성장합니다.",
  },
];

const splineSceneUrl =
  "https://prod.spline.design/WhFeS8gDdkksYQKA/scene.splinecode";

const sectionNavItems = [
  { label: "Hero", sectionId: "home-hero" },
  { label: "Focus", sectionId: "home-focus" },
  { label: "Skill", sectionId: "home-skills" },
  { label: "Project", sectionId: "home-projects" },
  { label: "Blog", sectionId: "home-blog" },
];

// 프로젝트 기간 표시
const formatProjectPeriod = (start: string, end?: string) => {
  const formatMonth = (value: string) => value.replace("-", ".");

  return `${formatMonth(start)} - ${end ? formatMonth(end) : "진행 중"}`;
};

// 형광펜 강조 스타일
const highlightTextSx = {
  position: "relative",
  display: "inline-block",
  color: "#050505",
  px: 0.16,
  zIndex: 0,
  "&::before": {
    content: '""',
    position: "absolute",
    left: "-0.02em",
    right: "-0.02em",
    bottom: "0",
    height: "0.78em",
    bgcolor: "rgba(255, 255, 255, 0.54)",
    zIndex: -1,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    right: "-0.06em",
    bottom: "0.01em",
    width: "0.24em",
    height: "0.76em",
    bgcolor: "rgba(255, 255, 255, 0.38)",
    borderRadius: 0,
    transform: "rotate(-2deg)",
    zIndex: -1,
  },
};

const HomePage = () => {
  const navigate = useNavigate();
  const splineWrapperRef = useRef<HTMLDivElement | null>(null);
  const [activeSectionId, setActiveSectionId] = useState(sectionNavItems[0].sectionId);
  const [isBlogPassed, setIsBlogPassed] = useState(false);
  const [isSectionNavPinned, setIsSectionNavPinned] = useState(false);
  const { getRecentPosts, loading, error } = usePosts();
  const { projects, skills } = useProjects();

  // 홈 노출 데이터
  const recentPosts = getRecentPosts(3);
  const workProjects = projects.filter((project) => project.kind === "work").slice(0, 2);
  const sideProjects = projects.filter((project) => project.kind === "side").slice(0, 1);

  // 섹션 스크롤 이동
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const splineWrapper = splineWrapperRef.current;

    if (!splineWrapper) return;

    // Spline 휠 입력 차단
    const stopSplineWheel = (event: WheelEvent) => {
      event.stopPropagation();
    };

    splineWrapper.addEventListener("wheel", stopSplineWheel, {
      capture: true,
      passive: true,
    });

    return () => {
      splineWrapper.removeEventListener("wheel", stopSplineWheel, {
        capture: true,
      });
    };
  }, []);

  useEffect(() => {
    const sectionElements = sectionNavItems
      .map((item) => document.getElementById(item.sectionId))
      .filter((element): element is HTMLElement => Boolean(element));

    if (sectionElements.length === 0) return;

    // 현재 섹션 감지
    const handleScroll = () => {
      const nextSection = sectionElements.reduce((current, section) => {
        const sectionTop = section.getBoundingClientRect().top;

        if (sectionTop <= window.innerHeight * 0.35) return section;
        return current;
      }, sectionElements[0]);

      setActiveSectionId(nextSection.id);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const blogSection = document.getElementById("home-blog");

    if (!blogSection) return;

    // Blog 이후 스크롤 감지
    const handleBlogScroll = () => {
      const blogTop = blogSection.offsetTop;
      const hideLine = blogTop + 24;

      setIsBlogPassed(window.scrollY > hideLine);
      setIsSectionNavPinned(window.scrollY > 0);
    };

    handleBlogScroll();
    window.addEventListener("scroll", handleBlogScroll, { passive: true });
    window.addEventListener("resize", handleBlogScroll);

    return () => {
      window.removeEventListener("scroll", handleBlogScroll);
      window.removeEventListener("resize", handleBlogScroll);
    };
  }, []);

  return (
    <Box sx={{ bgcolor: "#fbfbf8", color: "#171717" }}>
      {/* 첫 화면 소개 */}
      <Box
        id="home-hero"
        component="section"
        sx={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          borderBottom: "1px solid #e8e3d8",
          bgcolor: "#f6f3ee",
        }}
      >
        {/* Spline 배경 */}
        <Box ref={splineWrapperRef} sx={{ position: "absolute", inset: 0 }}>
          {createElement("spline-viewer", {
            url: splineSceneUrl,
            style: {
              width: "100%",
              height: "100%",
              display: "block",
            },
          } as Record<string, unknown>)}
        </Box>

        {/* 배경 가독성 레이어 */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(246,243,238,0.72) 0%, rgba(246,243,238,0.38) 38%, rgba(246,243,238,0) 72%)",
            pointerEvents: "none",
          }}
        />

        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          <Grid container spacing={{ xs: 5, md: 8 }} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: "1.55rem", sm: "2.4rem", md: "3.35rem", lg: "3.8rem" },
                  fontWeight: 800,
                  lineHeight: 1.28,
                  letterSpacing: 0,
                  color: "rgba(20,20,20,0.68)",
                }}
              >
                <Box
                  component="span"
                  sx={{ display: "block", whiteSpace: "nowrap" }}
                >
                  안녕하세요,
                </Box>
                <Box
                  component="span"
                  sx={{ display: "block", whiteSpace: "nowrap" }}
                >
                  <Box
                    component="span"
                    sx={highlightTextSx}
                  >
                    사용자 경험
                  </Box>
                  을 기술로 구현하는
                </Box>
                <Box
                  component="span"
                  sx={{ display: "block", whiteSpace: "nowrap" }}
                >
                  개발자{" "}
                  <Box
                    component="span"
                    sx={highlightTextSx}
                  >
                    김현아
                  </Box>
                  입니다.
                </Box>
              </Typography>
              <Typography
                sx={{
                  mt: 3,
                  maxWidth: 680,
                  color: "rgba(20,20,20,0.68)",
                  fontSize: { xs: "1rem", md: "1.12rem" },
                  lineHeight: 1.8,
                }}
              >
                디자인 관점에서 화면의 흐름을 이해하고, 프론트엔드 코드로 실제
                서비스에 맞는 UI를 구현합니다.
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{ mt: 4, pointerEvents: "auto" }}
              >
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => scrollToSection("home-focus")}
                  sx={{
                    color: "#ffffff",
                    bgcolor: "#171717",
                    "&:hover": { bgcolor: "#313131" },
                  }}
                >
                  더 알아보기
                </Button>
                <Button
                  variant="outlined"
                  endIcon={<DownloadIcon />}
                  href="/resume_kimhyuna.pdf"
                  download
                  sx={{
                    color: "#171717",
                    borderColor: "rgba(23,23,23,0.72)",
                    "&:hover": {
                      borderColor: "#171717",
                      bgcolor: "rgba(23,23,23,0.06)",
                    },
                  }}
                >
                  이력서 다운로드
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>

        {/* 섹션 목차 배경 도형 */}
        <Box
          sx={{
            display: {
              xs: "none",
              lg: "block",
            },
            position: "absolute",
            top: "54%",
            right: { lg: 58, xl: 86 },
            transform: "translateY(-50%)",
            width: { lg: 560, xl: 650 },
            aspectRatio: "673 / 455",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          <Box
            component="img"
            src="/assets/section-nav-panel.svg"
            alt=""
            aria-hidden
            sx={{
              width: "100%",
              height: "100%",
              display: "block",
              opacity: 0.92,
              filter: "drop-shadow(0 24px 70px rgba(0,0,0,0.08))",
              pointerEvents: "none",
            }}
          />
        </Box>

        {/* 섹션 목차 버튼 */}
        <Stack
          component="nav"
          spacing={{ lg: 0.72, xl: 1 }}
          sx={{
            display: {
              xs: "none",
              lg: isBlogPassed ? "none" : "flex",
            },
            position: isSectionNavPinned ? "fixed" : "absolute",
            top: { lg: "calc(54vh - 62px)", xl: "calc(54vh - 78px)" },
            right: { lg: 64, xl: 88 },
            width: { lg: 118, xl: 137 },
            zIndex: 3,
            pointerEvents: "auto",
          }}
        >
          {sectionNavItems.map((item) => {
            const isActive = activeSectionId === item.sectionId;

            return (
              <Button
                key={item.sectionId}
                onClick={() => scrollToSection(item.sectionId)}
                sx={{
                  minWidth: 0,
                  justifyContent: "flex-start",
                  gap: 1.25,
                  px: 0,
                  color: isActive ? "#171717" : "rgba(23,23,23,0.34)",
                  fontSize: "0.78rem",
                  fontWeight: isActive ? 800 : 700,
                  lineHeight: { lg: 0.68, xl: 0.76 },
                  "&:hover": {
                    bgcolor: "transparent",
                    color: "#171717",
                  },
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    border: isActive ? "none" : "2px solid rgba(23,23,23,0.24)",
                    bgcolor: isActive ? "#f59e0b" : "transparent",
                    flexShrink: 0,
                  }}
                />
                {item.label}
              </Button>
            );
          })}
        </Stack>
      </Box>

      {/* 현재 집중하는 것 */}
      <Container
        id="home-focus"
        maxWidth="lg"
        component="section"
        sx={{ py: { xs: 12, md: 20 } }}
      >
        <Grid container spacing={{ xs: 3, md: 5 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h3" fontWeight={800}>
              현재 집중하는 것
            </Typography>
            <Typography sx={{ mt: 1.5, color: "#625d54", lineHeight: 1.8 }}>
              지금의 학습 방향과 실무에서 더 깊게 다듬고 있는 기준입니다.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container spacing={2}>
              {strengths.map((item) => (
                <Grid size={{ xs: 12, md: 4 }} key={item.title}>
                  <Box
                    sx={{
                      height: "100%",
                      p: 3,
                      bgcolor: "#ffffff",
                      border: "1px solid #ebe6dc",
                      borderRadius: 2,
                    }}
                  >
                    <Typography fontWeight={700}>{item.title}</Typography>
                    <Typography
                      variant="body2"
                      sx={{ mt: 1.5, color: "#625d54", lineHeight: 1.75 }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>

      {/* 핵심 역량 */}
      <Container
        id="home-skills"
        maxWidth="lg"
        component="section"
        sx={{ py: { xs: 12, md: 20 } }}
      >
        <Grid container spacing={{ xs: 4, md: 8 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h3" fontWeight={800}>
              핵심 역량
            </Typography>
            <Typography sx={{ mt: 1.5, color: "#625d54", lineHeight: 1.8 }}>
              실무 프로젝트에서 쌓은 웹 구현 경험과 Notion에 정리한 학습 기록을
              바탕으로 프론트엔드 역량을 확장하고 있습니다.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack direction="row" gap={1} flexWrap="wrap">
              {skills.flatMap((skill) => skill.items).slice(0, 10).map((skill) => (
                <Chip
                  key={skill.name}
                  label={skill.name}
                  sx={{
                    bgcolor: "#fff7ed",
                    border: "1px solid rgba(245, 158, 11, 0.28)",
                    color: "#7c2d12",
                    fontWeight: 700,
                    "& .MuiChip-label": {
                      px: 1.4,
                    },
                  }}
                />
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* 대표 프로젝트 */}
      <Container
        id="home-projects"
        maxWidth="lg"
        component="section"
        sx={{ py: { xs: 12, md: 20 } }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h3" fontWeight={800}>
              프로젝트
            </Typography>
            <Typography sx={{ mt: 1, color: "#625d54" }}>
              약 20여 개의 프로젝트를 구현하며 쌓은 프론트엔드 경험을 정리합니다.
            </Typography>
          </Box>
          <Button
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate(ROUTES.PORTFOLIO)}
            sx={{ color: "#171717", fontWeight: 700 }}
          >
            전체 보기
          </Button>
        </Box>

        <Stack spacing={{ xs: 5, md: 7 }}>
          {[
            { title: "✦ 업무 프로젝트", items: workProjects },
            { title: "✦ 사이드 프로젝트", items: sideProjects },
          ].map((group) => (
            <Box key={group.title}>
              {/* 프로젝트 그룹 제목 */}
              <Typography
                component="h4"
                sx={{
                  mb: 1.5,
                  color: "#d97706",
                  fontSize: "0.95rem",
                  fontWeight: 800,
                }}
              >
                {group.title}
              </Typography>

              <Stack spacing={0}>
                {group.items.map((project) => (
                  <Box
                    key={project.id}
                    sx={{
                      py: 3,
                      borderTop: "1px solid rgba(217, 119, 6, 0.18)",
                      "&:last-of-type": {
                        borderBottom: "1px solid rgba(217, 119, 6, 0.18)",
                      },
                    }}
                  >
                    <Grid container spacing={3} alignItems="center">
                      <Grid size={{ xs: 12, md: 3 }}>
                        <Typography color="#777167">
                          {formatProjectPeriod(project.period.start, project.period.end)}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, md: 5 }}>
                        <Typography variant="h5" fontWeight={700}>
                          {project.title}
                        </Typography>
                        <Typography sx={{ mt: 1, color: "#625d54", lineHeight: 1.7 }}>
                          {project.description}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Stack direction="row" gap={0.75} flexWrap="wrap">
                          {project.tech.slice(0, 5).map((tech) => (
                            <Chip
                              key={tech}
                              label={tech}
                              size="small"
                              sx={{
                                bgcolor: "#f5e8c7",
                                color: "#6f4f12",
                                border: 0,
                                borderRadius: "5px",
                                fontWeight: 800,
                                "& .MuiChip-label": {
                                  px: 1,
                                },
                              }}
                            />
                          ))}
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Container>

      {/* 최신 블로그 글 */}
      <Container
        id="home-blog"
        maxWidth="lg"
        component="section"
        sx={{ py: { xs: 12, md: 20 } }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h3" fontWeight={800}>
              Tech Blog
            </Typography>
            <Typography sx={{ mt: 1, color: "#625d54" }}>
              IT 지식을 습득하고 기록하며 문제 해결 과정을 정리합니다.
            </Typography>
          </Box>
          <Button
            endIcon={<OpenInNewIcon />}
            onClick={() => navigate(ROUTES.BLOG)}
            sx={{ color: "#171717", fontWeight: 700 }}
          >
            블로그로 이동
          </Button>
        </Box>

        {loading && <Typography>로딩 중...</Typography>}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && recentPosts.length === 0 && (
          <Alert severity="info">아직 작성된 글이 없습니다.</Alert>
        )}

        <Stack spacing={0}>
          {recentPosts.map((post) => (
            <Box
              key={post.id}
              onClick={() => navigate(`/blog/${post.id}`)}
              sx={{
                py: 2.5,
                borderTop: "1px solid #e8e3d8",
                cursor: "pointer",
                "&:last-of-type": { borderBottom: "1px solid #e8e3d8" },
                "&:hover .post-title": { color: "#5f6f52" },
              }}
            >
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography color="#777167">
                    {formatDate(post.date)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 7 }}>
                  <Typography
                    className="post-title"
                    variant="h6"
                    fontWeight={700}
                    sx={{ transition: "color 0.2s" }}
                  >
                    {post.title}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                  <Typography color="#777167">{post.category}</Typography>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Stack>
      </Container>

      {/* 연락 섹션 */}
      <Box
        id="home-contact"
        component="section"
        sx={{ bgcolor: "#171717", color: "#fff" }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 11, md: 16 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
              gap: { xs: 2, md: 6 },
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{ fontSize: { xs: "1.6rem", sm: "2rem", md: "3rem" } }}
              >
                함께 이야기해요
              </Typography>
              <Typography
                sx={{
                  mt: 1.5,
                  color: "#c9c3b8",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  lineHeight: 1.6,
                }}
              >
                프로젝트, 채용, 협업 이야기는 편하게 남겨주세요.
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={1.25}
              sx={{
                width: { xs: "auto", md: "auto" },
                flexShrink: 0,
                ml: "auto",
              }}
            >
              {/* 모바일 전화 아이콘 */}
              <Button
                href={
                  CONFIG.PHONE
                    ? `tel:${CONFIG.PHONE.replaceAll("-", "")}`
                    : `mailto:${CONFIG.EMAIL}?subject=${encodeURIComponent(
                        "전화 연락 요청",
                      )}`
                }
                variant="outlined"
                sx={{
                  display: { xs: "inline-flex", md: "none" },
                  height: 48,
                  minWidth: 48,
                  width: 48,
                  p: 0,
                  borderRadius: "50%",
                  borderColor: "rgba(255, 255, 255, 0.34)",
                  color: "#fff",
                  "&:hover": {
                    borderColor: "#fff",
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <LocalPhoneOutlinedIcon sx={{ fontSize: 21 }} />
              </Button>

              {/* 모바일 메일 아이콘 */}
              <Button
                href={`mailto:${CONFIG.EMAIL}`}
                variant="outlined"
                sx={{
                  display: { xs: "inline-flex", md: "none" },
                  height: 48,
                  minWidth: 48,
                  width: 48,
                  p: 0,
                  borderRadius: "50%",
                  borderColor: "rgba(255, 255, 255, 0.34)",
                  color: "#fff",
                  "&:hover": {
                    borderColor: "#fff",
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <EmailOutlinedIcon sx={{ fontSize: 21 }} />
              </Button>

              {/* 데스크톱 전화 연결 */}
              <Button
                href={
                  CONFIG.PHONE
                    ? `tel:${CONFIG.PHONE.replaceAll("-", "")}`
                    : `mailto:${CONFIG.EMAIL}?subject=${encodeURIComponent(
                        "전화 연락 요청",
                      )}`
                }
                startIcon={<LocalPhoneOutlinedIcon sx={{ fontSize: 20 }} />}
                sx={{
                  display: { xs: "none", md: "inline-flex" },
                  height: 48,
                  px: 2.4,
                  borderRadius: 999,
                  border: "1px solid rgba(255, 255, 255, 0.28)",
                  color: "#fff",
                  bgcolor: "rgba(255, 255, 255, 0.06)",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  textTransform: "none",
                  letterSpacing: 0.2,
                  whiteSpace: "nowrap",
                  transition: "border-color 0.2s ease, background-color 0.2s ease",
                  "&:hover": {
                    borderColor: "#fff",
                    bgcolor: "rgba(255, 255, 255, 0.12)",
                  },
                }}
              >
                {CONFIG.PHONE}
              </Button>

              <Button
                href={`mailto:${CONFIG.EMAIL}`}
                startIcon={<EmailOutlinedIcon />}
                sx={{
                  display: { xs: "none", md: "inline-flex" },
                  height: 48,
                  px: 2.4,
                  borderRadius: 999,
                  border: "1px solid rgba(255, 255, 255, 0.28)",
                  bgcolor: "rgba(255, 255, 255, 0.06)",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  textTransform: "none",
                  letterSpacing: 0.2,
                  whiteSpace: "nowrap",
                  transition: "border-color 0.2s ease, background-color 0.2s ease",
                  "&:hover": {
                    borderColor: "#fff",
                    bgcolor: "rgba(255, 255, 255, 0.12)",
                  },
                }}
              >
                {CONFIG.EMAIL}
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
