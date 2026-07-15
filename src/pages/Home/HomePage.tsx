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
  Tooltip,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import ApiIcon from "@mui/icons-material/Api";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BoltIcon from "@mui/icons-material/Bolt";
import CachedIcon from "@mui/icons-material/Cached";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import DownloadIcon from "@mui/icons-material/Download";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import HttpIcon from "@mui/icons-material/Http";
import HubIcon from "@mui/icons-material/Hub";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { createElement, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { CONFIG } from "@/constants/config";
import { usePosts } from "@/hooks/usePosts";
import { useProjects } from "@/hooks/useProjects";
import { formatDate } from "@/utils/date";
import { extractExcerpt } from "@/utils/markdown";

const strengths = [
  {
    title: "UX/UI Implementation",
    description:
      "사용자가 정보를 읽고 행동으로 이어가기까지의 흐름을 고려해 화면을 설계합니다.",
  },
  {
    title: "Scalable Structure",
    description:
      "컴포넌트 재사용성, 상태 흐름, 데이터 구조를 고려해 변경에 대응하기 쉬운 구조를 지향합니다.",
  },
  {
    title: "Product Thinking",
    description:
      "디자인, 기획, 백엔드와의 협업 과정에서 요구사항을 조율하고 제품 관점에서 화면의 우선순위를 판단합니다.",
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

// 핵심 역량 아이콘 색상
const skillIconColors = ["#f59e0b", "#fb923c", "#eab308", "#d97706"];

// 핵심 역량 로고 경로
const skillLogoMap: Record<string, string> = {
  HTML5: "/assets/skills/html5-original.svg",
  "CSS3·SCSS": "/assets/skills/css3-original.svg",
  "JavaScript(ES6+)": "/assets/skills/javascript-original.svg",
  TypeScript: "/assets/skills/typescript-original.svg",
  React: "/assets/skills/react-original.svg",
  "Next.js": "/assets/skills/nextjs-original.svg",
  "Vue.js": "/assets/skills/vuejs-original.svg",
  "Tailwind CSS": "/assets/skills/tailwindcss-plain.svg",
};

const skillMuiIconMap: Record<string, typeof TipsAndUpdatesIcon> = {
  Vite: BoltIcon,
  MUI: DashboardCustomizeIcon,
  Zustand: HubIcon,
  "TanStack Query": CachedIcon,
  Axios: HttpIcon,
  "REST API": ApiIcon,
  GSAP: AutoFixHighIcon,
};

const skillCapabilityMap: Record<string, string> = {
  React: "컴포넌트 기반 UI와 페이지 상태 흐름을 구현할 수 있습니다.",
  TypeScript: "props, API 응답, 공통 타입을 정의해 안정적인 코드를 작성할 수 있습니다.",
  "JavaScript(ES6+)": "DOM 제어, 비동기 처리, 인터랙션 로직을 구현할 수 있습니다.",
  "Next.js": "라우팅, 페이지 구성, SSR/CSR 흐름을 고려한 화면을 만들 수 있습니다.",
  Vite: "빠른 개발 환경과 정적 빌드 기반의 프론트엔드 프로젝트를 구성할 수 있습니다.",
  MUI: "디자인 시스템 기반의 반응형 UI와 커스텀 컴포넌트를 만들 수 있습니다.",
  Zustand: "가벼운 전역 상태와 화면 간 공유 상태를 설계할 수 있습니다.",
  "TanStack Query": "서버 데이터 캐싱, 로딩, 재요청 흐름을 관리할 수 있습니다.",
  Axios: "공통 API 클라이언트, 에러 처리, 인증 흐름을 구성할 수 있습니다.",
  HTML5: "시맨틱 구조와 접근성을 고려한 마크업을 작성할 수 있습니다.",
  "CSS3·SCSS": "반응형 레이아웃, 상태별 스타일, 유지보수 가능한 스타일 구조를 만들 수 있습니다.",
  "REST API": "API 요청, 응답 가공, 에러/로딩 상태를 화면과 연결할 수 있습니다.",
  "Tailwind CSS": "유틸리티 클래스 기반으로 빠르게 반응형 UI를 구성할 수 있습니다.",
  "Vue.js": "Composition API 기반 화면과 상태 흐름을 구성할 수 있습니다.",
  GSAP: "스크롤, 전환, 시각적 인터랙션 애니메이션을 구현할 수 있습니다.",
};

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
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
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

  // 블로그 새 탭 열기
  const openBlogRoute = (path: string) => {
    window.open(path, "_blank", "noopener,noreferrer");
  };

  // 첫 클릭은 미리보기 액션을 열고, 같은 글을 한 번 더 누르면 상세로 이동
  const handlePostPreviewClick = (postId: string) => {
    if (expandedPostId === postId) {
      openBlogRoute(`/blog/${postId}`);
      return;
    }

    setExpandedPostId(postId);
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
                  startIcon={<DownloadIcon />}
                  href="/portfolio_kimhyuna.pdf"
                  download
                  sx={{
                    color: "#ffffff",
                    bgcolor: "#171717",
                    "&:hover": { bgcolor: "#313131" },
                  }}
                >
                  포트폴리오 PDF
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PersonOutlineIcon />}
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
                  이력서 PDF
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>

        {/* 다음 섹션 이동 힌트 */}
        <Button
          aria-label="다음 섹션으로 이동"
          onClick={() => scrollToSection("home-focus")}
          sx={{
            position: "absolute",
            left: "50%",
            bottom: { xs: 24, md: 34 },
            transform: "translateX(-50%)",
            zIndex: 4,
            minWidth: "auto",
            width: 88,
            height: 108,
            p: 0,
            color: "rgba(23, 23, 23, 0.56)",
            bgcolor: "transparent",
            textTransform: "none",
            flexDirection: "column",
            gap: 0,
            "&:hover": {
              bgcolor: "transparent",
              color: "#171717",
            },
            "@keyframes heroScrollCue": {
              "0%, 100%": {
                transform: "translateY(0)",
              },
              "50%": {
                transform: "translateY(4px)",
              },
            },
          }}
        >
          <Box
            component="img"
            src="/assets/scroll-mouse.png"
            alt=""
            aria-hidden
            sx={{
              width: 52,
              height: 52,
              objectFit: "contain",
              opacity: 0.74,
              animation: "heroScrollCue 1.7s ease-in-out infinite",
            }}
          />
          <Typography
            component="span"
            sx={{
              mt: 2.1,
              fontSize: "0.68rem",
              fontWeight: 500,
              lineHeight: 1,
              letterSpacing: "0.12em",
              color: "rgba(23, 23, 23, 0.42)",
            }}
          >
            scroll down
          </Typography>
        </Button>

        {/* 섹션 목차 배경 도형 */}
        <Box
          sx={{
            display: "none",
            "@media (min-width: 1720px)": {
              display: "block",
            },
            position: "absolute",
            top: "54%",
            right: 86,
            transform: "translateY(-50%)",
            width: 650,
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
          spacing={1}
          sx={{
            display: "none",
            "@media (min-width: 1720px)": {
              display: isBlogPassed ? "none" : "flex",
            },
            position: isSectionNavPinned ? "fixed" : "absolute",
            top: "calc(54vh - 78px)",
            right: 88,
            width: 137,
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
                  lineHeight: 0.76,
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

      {/* 핵심 역량 */}
      <Container
        id="home-focus"
        maxWidth="lg"
        component="section"
        sx={{ py: { xs: 12, md: 20 } }}
      >
        <Grid container spacing={{ xs: 3, md: 5 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h3" fontWeight={800}>
              핵심 역량
            </Typography>
            <Typography sx={{ mt: 1.5, color: "#625d54", lineHeight: 1.8 }}>
              사용자 흐름, 확장 가능한 구조, 협업 관점을 바탕으로 화면을 설계합니다.
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

      {/* 기술 스택 */}
      <Container
        id="home-skills"
        maxWidth="lg"
        component="section"
        sx={{ py: { xs: 12, md: 20 } }}
      >
        <Grid container spacing={{ xs: 4, md: 8 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h3" fontWeight={800}>
              기술 스택
            </Typography>
            <Typography sx={{ mt: 1.5, color: "#625d54", lineHeight: 1.8 }}>
              UI 구현, 상태 흐름, API 연동, 반응형 대응까지 프로젝트 요구사항에
              맞춰 기술을 조합하고 확장합니다.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack direction="row" gap={1.2} flexWrap="wrap">
              {skills.flatMap((skill) => skill.items).slice(0, 15).map((skill, index) => {
                const logoSrc = skillLogoMap[skill.name];
                const SkillIcon = skillMuiIconMap[skill.name] ?? TipsAndUpdatesIcon;
                const fallbackColor = skillIconColors[index % skillIconColors.length];

                return (
                  <Tooltip
                    key={skill.name}
                    title={skillCapabilityMap[skill.name] ?? "프로젝트 요구사항에 맞춰 활용할 수 있습니다."}
                    arrow
                    placement="top"
                  >
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 1.05,
                        minHeight: 48,
                        px: 1.75,
                        py: 0.8,
                        bgcolor: "#fffaf0",
                        border: "1px solid rgba(245, 158, 11, 0.24)",
                        borderRadius: 999,
                        boxShadow: "0 12px 28px rgba(217, 119, 6, 0.08)",
                        color: "#3f3425",
                        fontWeight: 800,
                        fontSize: "0.95rem",
                        cursor: "default",
                      }}
                    >
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 30,
                          height: 30,
                          borderRadius: "10px",
                          bgcolor: "#ffffff",
                          border: "1px solid rgba(245, 158, 11, 0.16)",
                          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.55)",
                          color: fallbackColor,
                          flexShrink: 0,
                        }}
                      >
                        {logoSrc ? (
                          <Box
                            component="img"
                            src={logoSrc}
                            alt=""
                            aria-hidden="true"
                            sx={{
                              display: "block",
                              width: 21,
                              height: 21,
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          createElement(SkillIcon, { sx: { fontSize: 16 } })
                        )}
                      </Box>
                      {skill.name}
                    </Box>
                  </Tooltip>
                );
              })}
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
            onClick={() => navigate(ROUTES.PROJECTS)}
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
                      py: 2.5,
                      px: { xs: 0, md: 1.2 },
                      mx: { xs: 0, md: -1.2 },
                      borderRadius: 1.5,
                      borderTop: "1px solid rgba(217, 119, 6, 0.18)",
                      cursor: "default",
                      "&:last-of-type": {
                        borderBottom: "1px solid rgba(217, 119, 6, 0.18)",
                      },
                      transition: "background-color 0.18s ease",
                      "&:hover": { bgcolor: "rgba(245, 158, 11, 0.045)" },
                      "&:hover .project-title": { color: "#5f6f52" },
                    }}
                  >
                    <Grid
                      container
                      rowSpacing={2}
                      columnSpacing={{ xs: 2, md: 6 }}
                      alignItems="flex-start"
                    >
                      <Grid size={{ xs: 12, md: 3 }}>
                        <Typography
                          sx={{
                            color: "#777167",
                            fontSize: { xs: "0.92rem", md: "0.95rem" },
                            fontWeight: 500,
                            lineHeight: 1.5,
                          }}
                        >
                          {formatProjectPeriod(project.period.start, project.period.end)}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, md: 5 }}>
                        <Typography
                          className="project-title"
                          variant="h6"
                          fontWeight={700}
                          sx={{
                            lineHeight: 1.4,
                            transition: "color 0.2s",
                            wordBreak: "keep-all",
                          }}
                        >
                          {project.title}
                        </Typography>
                        <Typography
                          sx={{
                            mt: 0.9,
                            color: "#625d54",
                            fontSize: { xs: "0.92rem", md: "0.95rem" },
                            lineHeight: 1.7,
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: { xs: 3, md: 3 },
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {project.description}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Stack
                          direction="row"
                          gap={0.75}
                          flexWrap="wrap"
                          sx={{
                            pt: { xs: 0.25, md: 0.2 },
                            alignContent: "flex-start",
                            justifyContent: { xs: "flex-start", md: "flex-end" },
                          }}
                        >
                          {project.tech.slice(0, 5).map((tech) => (
                            <Chip
                              key={tech}
                              label={tech}
                              size="small"
                              sx={{
                                bgcolor: "#f4f4f5",
                                color: "#52525b",
                                border: "1px solid #e4e4e7",
                                borderRadius: "5px",
                                height: 24,
                                fontSize: "0.72rem",
                                fontWeight: 700,
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
        sx={{
          py: { xs: 12, md: 20 },
          minHeight: { xs: 760, md: 720 },
        }}
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
            onClick={() => openBlogRoute(ROUTES.BLOG)}
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
          {recentPosts.map((post) => {
            const isExpanded = expandedPostId === post.id;
            const previewText = post.excerpt || extractExcerpt(post.content, 120);

            return (
              <Box
                key={post.id}
                onClick={() => handlePostPreviewClick(post.id)}
                sx={{
                  py: 2.5,
                  px: { xs: 0, md: 1.2 },
                  mx: { xs: 0, md: -1.2 },
                  borderRadius: 1.5,
                  borderTop: "1px solid #e8e3d8",
                  cursor: "pointer",
                  "&:last-of-type": { borderBottom: "1px solid #e8e3d8" },
                  transition: "background-color 0.18s ease",
                  "&:hover": { bgcolor: "rgba(245, 158, 11, 0.045)" },
                  "&:hover .post-title": { color: "#5f6f52" },
                }}
              >
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <Typography
                      sx={{
                        color: "#777167",
                        fontSize: { xs: "0.92rem", md: "0.95rem" },
                        fontWeight: 500,
                        lineHeight: 1.5,
                      }}
                    >
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
                    {previewText && (
                      <Typography
                        sx={{
                          mt: 0.9,
                          color: "#625d54",
                          fontSize: { xs: "0.92rem", md: "0.95rem" },
                          lineHeight: 1.7,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {previewText}
                      </Typography>
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <Stack
                      direction="row"
                      gap={0.65}
                      flexWrap="wrap"
                      sx={{
                        pt: { xs: 0.15, md: 0.05 },
                        justifyContent: { xs: "flex-start", md: "flex-end" },
                        alignContent: "flex-start",
                      }}
                    >
                      <Chip
                        label={post.category}
                        size="small"
                        sx={{
                          bgcolor: "#f8f3e8",
                          color: "#7c4a03",
                          border: "1px solid rgba(217, 119, 6, 0.2)",
                          borderRadius: "5px",
                          height: 24,
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          "& .MuiChip-label": {
                            px: 1,
                          },
                        }}
                      />
                      {post.tags.slice(0, 2).map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{
                            bgcolor: "#f4f4f5",
                            color: "#52525b",
                            border: "1px solid #e4e4e7",
                            borderRadius: "5px",
                            height: 24,
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            "& .MuiChip-label": {
                              px: 1,
                            },
                          }}
                        />
                      ))}
                    </Stack>
                  </Grid>
                </Grid>

                <Box
                  aria-hidden={!isExpanded}
                  sx={{
                    mt: 1.35,
                    ml: { xs: 0, md: "25%" },
                    pr: { xs: 0, md: 4 },
                    height: { xs: 54, sm: 28 },
                    color: "#625d54",
                    opacity: isExpanded ? 1 : 0,
                    pointerEvents: isExpanded ? "auto" : "none",
                    transition: "opacity 0.18s ease",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.2}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: "#8a8175", lineHeight: 1.6 }}
                    >
                      한 번 더 누르면 글 상세로 이동합니다
                    </Typography>
                    <Button
                      size="small"
                      endIcon={<OpenInNewIcon />}
                      onClick={(event) => {
                        event.stopPropagation();
                        openBlogRoute(`/blog/${post.id}`);
                      }}
                      sx={{
                        minWidth: "auto",
                        p: 0,
                        color: "#171717",
                        fontWeight: 800,
                      }}
                    >
                      자세히 보기
                    </Button>
                  </Stack>
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Container>

      {/* 연락 섹션 */}
      <Box
        id="home-contact"
        component="section"
        sx={{
          bgcolor: "#171717",
          color: "#fff",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 10, md: 14 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: { xs: "center", md: "flex-end" },
              justifyContent: "space-between",
              flexDirection: "row",
              gap: { xs: 2, md: 6 },
            }}
          >
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                component="p"
                sx={{
                  mb: 1.2,
                  color: "#f7d88b",
                  fontSize: "0.78rem",
                  fontWeight: 900,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Contact
              </Typography>
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{ fontSize: { xs: "1.45rem", sm: "2rem", md: "3rem" } }}
              >
                함께 이야기해요
              </Typography>
              <Typography
                sx={{
                  mt: 1.5,
                  color: "#c9c3b8",
                  fontSize: { xs: "0.84rem", sm: "1rem" },
                  lineHeight: 1.6,
                }}
              >
                프로젝트, 채용, 협업 이야기는 편하게 남겨주세요.
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "row", md: "column" }}
              spacing={{ xs: 1.25, md: 1.2 }}
              useFlexGap
              sx={{
                width: { xs: "auto", md: "auto" },
                flexShrink: 0,
                flexWrap: "nowrap",
                justifyContent: { xs: "flex-end", md: "flex-end" },
                ml: { xs: "auto", md: 0 },
              }}
            >
              {/* 연락처 링크 */}
              <Button
                href={
                  CONFIG.PHONE
                    ? `tel:${CONFIG.PHONE.replaceAll("-", "")}`
                    : `mailto:${CONFIG.EMAIL}?subject=${encodeURIComponent(
                        "전화 연락 요청",
                      )}`
                }
                startIcon={<LocalPhoneOutlinedIcon sx={{ fontSize: 18 }} />}
                sx={{
                  display: { xs: "none", md: "inline-flex" },
                  justifyContent: "flex-start",
                  minWidth: 268,
                  px: 2,
                  py: 1.25,
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: 2,
                  color: "#fff",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "rgba(247, 216, 139, 0.7)",
                    bgcolor: "rgba(255, 255, 255, 0.06)",
                    color: "#f7d88b",
                  },
                }}
              >
                {CONFIG.PHONE}
              </Button>

              <Button
                href={`mailto:${CONFIG.EMAIL}`}
                startIcon={<EmailOutlinedIcon sx={{ fontSize: 18 }} />}
                sx={{
                  display: { xs: "none", md: "inline-flex" },
                  justifyContent: "flex-start",
                  minWidth: 268,
                  px: 2,
                  py: 1.25,
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: 2,
                  color: "#fff",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "rgba(247, 216, 139, 0.7)",
                    bgcolor: "rgba(255, 255, 255, 0.06)",
                    color: "#f7d88b",
                  },
                }}
              >
                {CONFIG.EMAIL}
              </Button>

              {/* 태블릿 이하 전화 아이콘 */}
              <Button
                href={
                  CONFIG.PHONE
                    ? `tel:${CONFIG.PHONE.replaceAll("-", "")}`
                    : `mailto:${CONFIG.EMAIL}?subject=${encodeURIComponent(
                        "전화 연락 요청",
                      )}`
                }
                aria-label="전화 연결"
                sx={{
                  display: { xs: "inline-flex", md: "none" },
                  height: 48,
                  minWidth: 48,
                  width: 48,
                  p: 0,
                  borderRadius: "50%",
                  border: "1px solid rgba(255, 255, 255, 0.34)",
                  color: "#fff",
                  "&:hover": {
                    borderColor: "#fff",
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <LocalPhoneOutlinedIcon sx={{ fontSize: 21 }} />
              </Button>

              {/* 태블릿 이하 메일 아이콘 */}
              <Button
                href={`mailto:${CONFIG.EMAIL}`}
                aria-label="메일 보내기"
                sx={{
                  display: { xs: "inline-flex", md: "none" },
                  height: 48,
                  minWidth: 48,
                  width: 48,
                  p: 0,
                  borderRadius: "50%",
                  border: "1px solid rgba(255, 255, 255, 0.34)",
                  color: "#fff",
                  "&:hover": {
                    borderColor: "#fff",
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <EmailOutlinedIcon sx={{ fontSize: 21 }} />
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* 저작권 푸터 */}
      <Box
        component="footer"
        sx={{
          bgcolor: "#2f2f2f",
          color: "rgba(255, 255, 255, 0.54)",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            minHeight: 52,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography sx={{ fontSize: "0.78rem", fontWeight: 700 }}>
            © 2026 김현아 포트폴리오
          </Typography>
          <Typography
            sx={{
              display: { xs: "none", sm: "block" },
              fontSize: "0.78rem",
              fontWeight: 700,
            }}
          >
            Frontend Developer
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
