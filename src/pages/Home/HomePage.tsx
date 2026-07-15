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
  Collapse,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import ApiIcon from "@mui/icons-material/Api";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DownloadIcon from "@mui/icons-material/Download";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
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
import { cleanExcerpt, extractExcerpt } from "@/utils/markdown";

const strengths = [
  {
    number: "01",
    point: "Experience",
    title: "사용자 경험과 접근성 고려",
    description:
      "정보 구조와 CTA 흐름을 기준으로 화면을 설계하고, SEO와 접근성을 함께 개선합니다.",
    image: "/assets/focus/focus-ui-flow-transparent.png",
  },
  {
    number: "02",
    point: "Structure",
    title: "확장 가능한 화면 구조 설계",
    description:
      "컴포넌트 재사용성, 상태 관리, API 연동 책임을 나누어 변경에 강한 구조를 만듭니다.",
    image: "/assets/focus/focus-structure-transparent.png",
  },
  {
    number: "03",
    point: "Product Thinking",
    title: "프로덕트 관점에서의 협업",
    description:
      "기획, 디자인, 개발 사이에서 요구사항을 조율하고 사용자 가치 기준으로 우선순위를 판단합니다.",
    image: "/assets/focus/focus-collaboration-transparent.png",
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
  Vite: "/assets/skills/vite-logo.png",
  MUI: "/assets/skills/mui-logo.png",
  Zustand: "/assets/skills/zustand-logo.png",
  "TanStack Query": "/assets/skills/tanstack-query-logo.png",
  Axios: "/assets/skills/axios-logo.png",
  GSAP: "/assets/skills/gsap-logo.png",
};

const skillMuiIconMap: Record<string, typeof TipsAndUpdatesIcon> = {
  "REST API": ApiIcon,
};

const skillLogoSxMap: Record<string, { width: number; height: number }> = {
  MUI: { width: 23, height: 23 },
  Zustand: { width: 22, height: 22 },
  "TanStack Query": { width: 23, height: 23 },
  Axios: { width: 24, height: 24 },
  GSAP: { width: 25, height: 18 },
};

const skillCapabilityMap: Record<string, string> = {
  React: "컴포넌트 기반 UI와 페이지 상태 흐름을 구현할 수 있습니다.",
  TypeScript:
    "props, API 응답, 공통 타입을 정의해 안정적인 코드를 작성할 수 있습니다.",
  "JavaScript(ES6+)":
    "DOM 제어, 비동기 처리, 인터랙션 로직을 구현할 수 있습니다.",
  "Next.js":
    "라우팅, 페이지 구성, SSR/CSR 흐름을 고려한 화면을 만들 수 있습니다.",
  Vite: "빠른 개발 환경과 정적 빌드 기반의 프론트엔드 프로젝트를 구성할 수 있습니다.",
  MUI: "디자인 시스템 기반의 반응형 UI와 커스텀 컴포넌트를 만들 수 있습니다.",
  Zustand: "가벼운 전역 상태와 화면 간 공유 상태를 설계할 수 있습니다.",
  "TanStack Query": "서버 데이터 캐싱, 로딩, 재요청 흐름을 관리할 수 있습니다.",
  Axios: "공통 API 클라이언트, 에러 처리, 인증 흐름을 구성할 수 있습니다.",
  HTML5: "시맨틱 구조와 접근성을 고려한 마크업을 작성할 수 있습니다.",
  "CSS3·SCSS":
    "반응형 레이아웃, 상태별 스타일, 유지보수 가능한 스타일 구조를 만들 수 있습니다.",
  "REST API":
    "API 요청, 응답 가공, 에러/로딩 상태를 화면과 연결할 수 있습니다.",
  "Tailwind CSS":
    "유틸리티 클래스 기반으로 빠르게 반응형 UI를 구성할 수 있습니다.",
  "Vue.js": "Composition API 기반 화면과 상태 흐름을 구성할 수 있습니다.",
  GSAP: "스크롤, 전환, 시각적 인터랙션 애니메이션을 구현할 수 있습니다.",
};

// 프로젝트 기간 표시
const formatProjectPeriod = (start: string, end?: string) => {
  const formatMonth = (value: string) => value.replace("-", ".");

  return `${formatMonth(start)} - ${end ? formatMonth(end) : "진행 중"}`;
};

// 긴 설명을 문장 단위로 나눠 빠르게 훑을 수 있게 표시
const splitSemanticSentences = (text: string) =>
  text
    .split(/(?<=\.)\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

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
  const [activeSectionId, setActiveSectionId] = useState(
    sectionNavItems[0].sectionId,
  );
  const [isBlogPassed, setIsBlogPassed] = useState(false);
  const [isSectionNavPinned, setIsSectionNavPinned] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(
    null,
  );
  const { getRecentPosts, loading, error } = usePosts();
  const { projects, skills } = useProjects();

  // 홈 노출 데이터
  const recentPosts = getRecentPosts(3);
  const workProjects = projects
    .filter((project) => project.kind === "work")
    .slice(0, 2);
  const sideProjects = projects
    .filter((project) => project.kind === "side")
    .slice(0, 1);

  // 섹션 스크롤 이동
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  // 블로그 새 탭 열기
  const openBlogRoute = (path: string) => {
    window.open(path, "_blank", "noopener,noreferrer");
  };

  const handleProjectPreviewClick = (projectId: string) => {
    setExpandedProjectId((currentId) =>
      currentId === projectId ? null : projectId,
    );
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
                  fontSize: {
                    xs: "1.55rem",
                    sm: "2.4rem",
                    md: "3.35rem",
                    lg: "3.8rem",
                  },
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
                  <Box component="span" sx={highlightTextSx}>
                    사용자 경험
                  </Box>
                  을 기술로 구현하는
                </Box>
                <Box
                  component="span"
                  sx={{ display: "block", whiteSpace: "nowrap" }}
                >
                  개발자{" "}
                  <Box component="span" sx={highlightTextSx}>
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
                    bgcolor: "#f7f3ec",
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
        <Grid container spacing={{ xs: 4, md: 8 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h3" fontWeight={800}>
              핵심 역량
            </Typography>
            <Typography sx={{ mt: 1.5, color: "#625d54", lineHeight: 1.8 }}>
              사용자 흐름과 확장 가능한 구조, 협업 관점을 바탕으로 화면을
              설계하고 구현합니다.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container spacing={{ xs: 2.2, md: 2.4 }}>
              {strengths.map((item) => (
                <Grid size={{ xs: 12, sm: 4 }} key={item.title}>
                  <Box
                    sx={{
                      height: "100%",
                      minHeight: { xs: 0, sm: 380, md: 400 },
                      p: { xs: 2.2, sm: 2.4, md: 2.5 },
                      display: "flex",
                      flexDirection: { xs: "row", sm: "column" },
                      alignItems: { xs: "flex-start", sm: "stretch" },
                      gap: { xs: 2, sm: 0 },
                      bgcolor: "#ffffff",
                      border: "1px solid #ebe6dc",
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: "0 18px 44px rgba(23, 23, 23, 0.04)",
                      transition:
                        "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        borderColor: "rgba(217, 119, 6, 0.24)",
                        boxShadow: "0 24px 54px rgba(23, 23, 23, 0.07)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: { xs: 86, sm: "100%" },
                        height: { xs: 86, sm: 142, md: 150, lg: 164 },
                        flex: { xs: "0 0 86px", sm: "initial" },
                        mb: { xs: 0, sm: 2.05, md: 2.2 },
                        pb: { xs: 0, sm: 1.9, md: 2 },
                        pr: { xs: 1.9, sm: 0 },
                        borderRight: {
                          xs: "1px solid rgba(138, 129, 117, 0.14)",
                          sm: "none",
                        },
                        borderBottom: {
                          xs: "none",
                          sm: "1px solid rgba(138, 129, 117, 0.14)",
                        },
                        borderRadius: 1.5,
                        bgcolor: "transparent",
                      }}
                    >
                      <Box
                        component="img"
                        src={item.image}
                        alt=""
                        aria-hidden="true"
                        sx={{
                          display: "block",
                          width: { xs: "100%", sm: "92%" },
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack
                        direction="row"
                        spacing={0.9}
                        alignItems="center"
                        sx={{ mb: 1.05 }}
                      >
                        <Typography
                          component="span"
                          sx={{
                            color: "#d97706",
                            fontSize: {
                              xs: "0.74rem",
                              sm: "0.66rem",
                              lg: "0.7rem",
                            },
                            fontWeight: 900,
                            lineHeight: 1,
                          }}
                        >
                          {item.number}
                        </Typography>
                        <Typography
                          component="span"
                          sx={{
                            color: "#9a8f7d",
                            fontSize: {
                              xs: "0.72rem",
                              sm: "0.64rem",
                              lg: "0.68rem",
                            },
                            fontWeight: 800,
                            letterSpacing: 0,
                            lineHeight: 1,
                          }}
                        >
                          {item.point}
                        </Typography>
                      </Stack>
                      <Typography
                        fontWeight={850}
                        sx={{
                          color: "#171717",
                          fontSize: {
                            xs: "1.04rem",
                            sm: "1.05rem",
                            lg: "1.16rem",
                          },
                          lineHeight: 1.35,
                          wordBreak: "keep-all",
                          minHeight: { xs: 0, sm: "1.45em", lg: "1.55em" },
                          display: "flex",
                          alignItems: "flex-start",
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mt: { xs: 1.15, sm: 1.25, md: 1.3 },
                          color: "#625d54",
                          fontSize: {
                            xs: "0.88rem",
                            sm: "0.84rem",
                            lg: "0.91rem",
                          },
                          lineHeight: { xs: 1.72, sm: 1.85 },
                          wordBreak: "keep-all",
                        }}
                      >
                        {item.description}
                      </Typography>
                    </Box>
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
              <Box
                component="span"
                sx={{ display: { xs: "inline", md: "block" } }}
              >
                UI 구현, 상태 흐름, API 연동,{" "}
              </Box>
              <Box
                component="span"
                sx={{ display: { xs: "inline", md: "block" } }}
              >
                반응형 대응까지 프로젝트 요구사항에 맞춰{" "}
              </Box>
              <Box
                component="span"
                sx={{ display: { xs: "inline", md: "block" } }}
              >
                기술을 조합하고 확장합니다.
              </Box>
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack direction="row" gap={1.2} flexWrap="wrap">
              {skills
                .flatMap((skill) => skill.items)
                .slice(0, 15)
                .map((skill, index) => {
                  const logoSrc = skillLogoMap[skill.name];
                  const SkillIcon =
                    skillMuiIconMap[skill.name] ?? TipsAndUpdatesIcon;
                  const logoSize = skillLogoSxMap[skill.name] ?? {
                    width: 21,
                    height: 21,
                  };
                  const fallbackColor =
                    skillIconColors[index % skillIconColors.length];

                  return (
                    <Tooltip
                      key={skill.name}
                      title={
                        skillCapabilityMap[skill.name] ??
                        "프로젝트 요구사항에 맞춰 활용할 수 있습니다."
                      }
                      arrow
                      placement="top"
                      slotProps={{
                        tooltip: {
                          sx: {
                            px: 1.35,
                            py: 0.9,
                            bgcolor: "#171717",
                            color: "#ffffff",
                            fontSize: "0.82rem",
                            fontWeight: 700,
                            lineHeight: 1.55,
                            borderRadius: "8px",
                            boxShadow: "0 16px 34px rgba(23, 23, 23, 0.18)",
                          },
                        },
                        arrow: {
                          sx: {
                            color: "#171717",
                          },
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 1.05,
                          minHeight: 48,
                          px: 1.75,
                          py: 0.8,
                          bgcolor: "#ffffff",
                          border: "1px solid rgba(217, 119, 6, 0.16)",
                          borderRadius: 999,
                          boxShadow: "0 10px 24px rgba(23, 23, 23, 0.04)",
                          color: "#3f3425",
                          fontWeight: 800,
                          fontSize: "0.95rem",
                          cursor: "default",
                          transition:
                            "transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            bgcolor: "#fffaf0",
                            borderColor: "rgba(245, 158, 11, 0.32)",
                            boxShadow: "0 16px 34px rgba(217, 119, 6, 0.13)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            bgcolor: logoSrc
                              ? "transparent"
                              : "rgba(245, 158, 11, 0.1)",
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
                                width: logoSize.width,
                                height: logoSize.height,
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
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              gap={1.5}
            >
              <Typography variant="h3" fontWeight={800}>
                주요 프로젝트
              </Typography>
              <IconButton
                aria-label="프로젝트 전체 보기"
                onClick={() => navigate(ROUTES.PROJECTS)}
                sx={{
                  display: { xs: "inline-flex", sm: "none" },
                  width: 42,
                  height: 42,
                  color: "#171717",
                  bgcolor: "#f4f4f5",
                  "&:hover": {
                    bgcolor: "#ededee",
                  },
                }}
              >
                <ArrowForwardIcon />
              </IconButton>
            </Stack>
            <Typography sx={{ mt: 1, color: "#625d54" }}>
              전체 작업 중 주요 프로젝트를 선별해 역할과 구현 과정, 기술적
              고민을 정리했습니다.
            </Typography>
          </Box>
          <Button
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate(ROUTES.PROJECTS)}
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              color: "#171717",
              fontWeight: 700,
            }}
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
                {group.items.map((project) => {
                  const isExpanded = expandedProjectId === project.id;
                  const teamText = project.detail?.info?.team
                    ?.replace(/^개발\s*/, "")
                    .replace(/명$/, "인");
                  const projectMetaText = [teamText, project.detail?.info?.role]
                    .filter(Boolean)
                    .join(" · ");
                  const resultPoints = (project.detail?.results ?? []).slice(
                    0,
                    3,
                  );
                  const implementationPoints = (
                    project.detail?.challenges ?? []
                  ).slice(0, 3);

                  return (
                    <Box
                      key={project.id}
                      role="button"
                      tabIndex={0}
                      aria-expanded={isExpanded}
                      onClick={() => handleProjectPreviewClick(project.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          handleProjectPreviewClick(project.id);
                        }
                      }}
                      sx={{
                        py: 2.5,
                        px: { xs: 0, md: 1.2 },
                        mx: { xs: 0, md: -1.2 },
                        borderRadius: 1.5,
                        borderTop: "1px solid rgba(217, 119, 6, 0.18)",
                        cursor: "pointer",
                        bgcolor: isExpanded
                          ? "rgba(245, 158, 11, 0.045)"
                          : "transparent",
                        "&:last-of-type": {
                          borderBottom: "1px solid rgba(217, 119, 6, 0.18)",
                        },
                        transition: "background-color 0.18s ease",
                        "&:focus-visible": {
                          outline: "3px solid rgba(217, 119, 6, 0.22)",
                          outlineOffset: 3,
                        },
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
                        <Grid size={{ xs: 12, md: 2.7 }}>
                          <Typography
                            sx={{
                              color: "#777167",
                              fontSize: { xs: "0.92rem", md: "0.95rem" },
                              fontWeight: 500,
                              lineHeight: 1.5,
                            }}
                          >
                            {formatProjectPeriod(
                              project.period.start,
                              project.period.end,
                            )}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6.9 }}>
                          <Typography
                            className="project-title"
                            variant="h6"
                            fontWeight={700}
                            sx={{
                              color: isExpanded ? "#5f6f52" : "#171717",
                              lineHeight: 1.4,
                              transition: "color 0.2s",
                              wordBreak: "keep-all",
                            }}
                          >
                            {project.title}
                            {projectMetaText && (
                              <Typography
                                component="span"
                                sx={{
                                  ml: 0.85,
                                  color: "#8a8175",
                                  fontSize: { xs: "0.8rem", md: "0.8rem" },
                                  fontWeight: 700,
                                  whiteSpace: "nowrap",
                                  verticalAlign: "baseline",
                                }}
                              >
                                ({projectMetaText})
                              </Typography>
                            )}
                          </Typography>
                          <Typography
                            sx={{
                              mt: 0.95,
                              color: "#625d54",
                              fontSize: { xs: "0.92rem", md: "0.95rem" },
                              lineHeight: 1.7,
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: { xs: 2, md: 2 },
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {project.description}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 2.4 }}>
                          <Stack
                            direction="row"
                            gap={0.75}
                            flexWrap="wrap"
                            sx={{
                              pt: { xs: 0.25, md: 0.2 },
                              alignContent: "flex-start",
                              justifyContent: {
                                xs: "flex-start",
                                md: "flex-end",
                              },
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

                      <Collapse in={isExpanded} timeout={220} unmountOnExit>
                        <Grid
                          container
                          rowSpacing={2}
                          columnSpacing={{ xs: 2, md: 6 }}
                          sx={{ mt: 2.2 }}
                        >
                          <Grid
                            size={{ xs: 12, md: 2.7 }}
                            sx={{ display: { xs: "none", md: "block" } }}
                          />
                          <Grid size={{ xs: 12, md: 9.3 }}>
                            <Box
                              sx={{
                                p: { xs: 2.2, md: 2.4 },
                                border: "1px solid rgba(217, 119, 6, 0.16)",
                                borderRadius: 1.5,
                                bgcolor: "#ffffff",
                              }}
                            >
                              <Grid container spacing={{ xs: 2.2, md: 3.2 }}>
                                {project.detail?.solution && (
                                  <Grid size={{ xs: 12, md: 5 }}>
                                    <Typography
                                      sx={{
                                        mb: 0.85,
                                        color: "#7c4a03",
                                        fontSize: "0.78rem",
                                        fontWeight: 900,
                                        letterSpacing: 0,
                                      }}
                                    >
                                      담당 범위
                                    </Typography>
                                    <Typography
                                      sx={{
                                        color: "#625d54",
                                        fontSize: { xs: "0.92rem", md: "0.94rem" },
                                        lineHeight: 1.78,
                                        wordBreak: "keep-all",
                                      }}
                                    >
                                      {splitSemanticSentences(project.detail.solution).map(
                                        (sentence) => (
                                          <Box
                                            component="span"
                                            key={sentence}
                                            sx={{ display: "block" }}
                                          >
                                            {sentence}
                                          </Box>
                                        ),
                                      )}
                                    </Typography>
                                  </Grid>
                                )}
                                {(resultPoints.length > 0 ||
                                  implementationPoints.length > 0) && (
                                  <Grid size={{ xs: 12, md: 7 }}>
                                    <Typography
                                      sx={{
                                        mb: 0.85,
                                        color: "#7c4a03",
                                        fontSize: "0.78rem",
                                        fontWeight: 900,
                                        letterSpacing: 0,
                                      }}
                                    >
                                      구현·성과
                                    </Typography>
                                    <Stack
                                      component="ul"
                                      spacing={0.72}
                                      sx={{ p: 0, m: 0, listStyle: "none" }}
                                    >
                                      {[
                                        ...resultPoints,
                                        ...implementationPoints,
                                      ].map((item) => (
                                        <Box
                                          component="li"
                                          key={item}
                                          sx={{
                                            display: "flex",
                                            gap: 1,
                                            color: "#625d54",
                                            fontSize: {
                                              xs: "0.9rem",
                                              md: "0.92rem",
                                            },
                                            lineHeight: 1.66,
                                            "&::before": {
                                              content: '""',
                                              width: 4,
                                              height: 4,
                                              mt: "0.72em",
                                              flex: "0 0 auto",
                                              borderRadius: "50%",
                                              bgcolor: "#d97706",
                                            },
                                          }}
                                        >
                                          {item}
                                        </Box>
                                      ))}
                                    </Stack>
                                  </Grid>
                                )}
                              </Grid>
                            </Box>
                          </Grid>
                        </Grid>
                      </Collapse>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Container>

      {/* 최신 학습 기록 */}
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
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              gap={1.5}
            >
              <Typography variant="h3" fontWeight={800}>
                학습 기록
              </Typography>
              <IconButton
                aria-label="블로그 바로가기"
                onClick={() => openBlogRoute(ROUTES.BLOG)}
                sx={{
                  display: { xs: "inline-flex", sm: "none" },
                  width: 42,
                  height: 42,
                  color: "#171717",
                  bgcolor: "#f4f4f5",
                  "&:hover": {
                    bgcolor: "#ededee",
                  },
                }}
              >
                <OpenInNewIcon />
              </IconButton>
            </Stack>
            <Typography sx={{ mt: 1, color: "#625d54" }}>
              IT 지식을 습득하고 기록하며 문제 해결 과정을 정리합니다.
            </Typography>
          </Box>
          <Button
            endIcon={<OpenInNewIcon />}
            onClick={() => openBlogRoute(ROUTES.BLOG)}
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              color: "#171717",
              fontWeight: 700,
            }}
          >
            블로그 바로가기
          </Button>
        </Box>

        {loading && <Typography>로딩 중...</Typography>}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && recentPosts.length === 0 && (
          <Alert severity="info">아직 작성된 글이 없습니다.</Alert>
        )}

        <Stack spacing={0}>
          {recentPosts.map((post) => {
            const previewText = cleanExcerpt(
              post.excerpt || extractExcerpt(post.content, 120),
            );

            return (
              <Box
                key={post.id}
                onClick={() => openBlogRoute(`/blog/${post.id}`)}
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
                  "&:hover .post-description": {
                    opacity: 0.28,
                    filter: "blur(1.2px)",
                  },
                  "&:hover .post-action": {
                    opacity: 1,
                    transform: "translateY(-50%)",
                    pointerEvents: "auto",
                  },
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
                      sx={{
                        transition: "color 0.2s",
                      }}
                    >
                      {post.title}
                    </Typography>
                    <Box sx={{ position: "relative", mt: 0.9 }}>
                      {previewText && (
                        <Typography
                          className="post-description"
                          sx={{
                            color: "#625d54",
                            fontSize: { xs: "0.92rem", md: "0.95rem" },
                            lineHeight: 1.7,
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            transition: "opacity 0.18s ease, filter 0.18s ease",
                          }}
                        >
                          {previewText}
                        </Typography>
                      )}
                      <Button
                        className="post-action"
                        size="small"
                        endIcon={<OpenInNewIcon />}
                        sx={{
                          position: { xs: "static", sm: "absolute" },
                          left: 0,
                          top: { sm: "50%" },
                          mt: { xs: 1, sm: 0 },
                          minWidth: "auto",
                          p: 0,
                          color: "#171717",
                          fontSize: { xs: "0.82rem", md: "0.86rem" },
                          fontWeight: 500,
                          opacity: { xs: 1, sm: 0 },
                          pointerEvents: { xs: "auto", sm: "none" },
                          transform: { xs: "none", sm: "translateY(-42%)" },
                          transition: "opacity 0.18s ease, transform 0.18s ease",
                        }}
                      >
                        클릭 시 해당 글로 이동합니다.{" "}
                        <Box component="span" sx={{ fontWeight: 900 }}>
                          자세히 보기
                        </Box>
                      </Button>
                    </Box>
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
                    </Stack>
                  </Grid>
                </Grid>

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
