/**
 * 블로그 사이드바
 *
 * 블로그 화면에서 프로필, 메뉴, 외부 링크를 보여주는 왼쪽 고정 영역입니다
 */
import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  CodeOutlined,
  Download,
  EmailOutlined,
  GitHub,
  HistoryRounded,
  HomeRounded,
  LinkedIn,
  MenuBookRounded,
  OpenInNew,
  PersonOutline,
  WorkOutlineRounded,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { CONFIG } from "@/constants/config";
import { ROUTES } from "@/constants/routes";
import { usePosts } from "@/hooks/usePosts";
import type { BlogSection } from "@/types/blog";

type SidebarSection = "all" | BlogSection;

// 블로그 사이드 메뉴 목록
const navItems = [
  {
    label: "ALL POST",
    icon: <HomeRounded fontSize="small" />,
    path: ROUTES.BLOG,
    section: "all",
  },
  {
    label: "TECH",
    icon: <CodeOutlined fontSize="small" />,
    path: `${ROUTES.BLOG}?section=tech`,
    section: "tech",
  },
  {
    label: "STUDY",
    icon: <MenuBookRounded fontSize="small" />,
    path: `${ROUTES.BLOG}?section=study`,
    section: "study",
  },
  {
    label: "PROJECT",
    icon: <WorkOutlineRounded fontSize="small" />,
    path: `${ROUTES.BLOG}?section=project`,
    section: "project",
  },
  {
    label: "LOG",
    icon: <HistoryRounded fontSize="small" />,
    path: `${ROUTES.BLOG}?section=log`,
    section: "log",
  },
];

// 프로필 이미지 경로
const AVATAR_IMAGES = {
  default: "/blog-avatar.png",
  hover: "/blog-avatar-hover.png",
  dark: "/blog-avatar-dark.png",
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { posts } = usePosts();
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("blogTheme") === "dark",
  );

  // 목록 URL 섹션 값
  const currentSection: SidebarSection = (() => {
    const section = new URLSearchParams(location.search).get("section");
    if (section === "tech" || section === "study" || section === "log" || section === "project") return section;
    return "all";
  })();

  // 상세 페이지 여부
  const isBlogDetailPath =
    location.pathname.startsWith(`${ROUTES.BLOG}/`) &&
    location.pathname !== ROUTES.ARCHIVES;

  // 상세 페이지 글 ID
  const currentPostId = isBlogDetailPath
    ? decodeURIComponent(location.pathname.replace(`${ROUTES.BLOG}/`, ""))
    : null;

  // 상세 페이지 활성 섹션
  const currentPostSection = useMemo<BlogSection | null>(() => {
    if (!currentPostId) return null;

    const currentPost = posts.find((post) => post.id === currentPostId);
    return currentPost ? currentPost.section ?? "tech" : null;
  }, [posts, currentPostId]);

  // 다크모드 상태 반영
  useEffect(() => {
    const root = document.documentElement;

    if (isDarkMode) {
      root.dataset.blogTheme = "dark";
      localStorage.setItem("blogTheme", "dark");
      return;
    }

    delete root.dataset.blogTheme;
    localStorage.setItem("blogTheme", "light");
  }, [isDarkMode]);

  // 프로필 이미지 상태
  const avatarSrc = isDarkMode ? AVATAR_IMAGES.dark : AVATAR_IMAGES.default;

  // 현재 메뉴 활성 상태 확인
  const isActivePath = (section: string) => {
    // 상세 글의 섹션 활성 상태
    if (isBlogDetailPath) {
      return currentPostSection === section;
    }

    // 전체 글 활성 상태
    if (section === "all") {
      return location.pathname === ROUTES.BLOG && currentSection === "all";
    }

    // 섹션 메뉴 활성 상태
    return location.pathname === ROUTES.BLOG && currentSection === section;
  };

  // 사이드 메뉴 버튼
  const renderNavButton = (
    item: (typeof navItems)[number],
    variant: "parent" | "child" = "parent",
  ) => {
    const isActive = isActivePath(item.section);
    const isChild = variant === "child";

    return (
      <ListItemButton
        key={item.label}
        onClick={() => navigate(item.path)}
        sx={{
          borderRadius: { xs: 1.5, md: isChild ? 1.7 : 2 },
          mb: { xs: 0, md: isChild ? 0.35 : 0.5 },
          py: { xs: 0.75, md: isChild ? 0.95 : 1.2 },
          px: { xs: 1.05, md: isChild ? 1.35 : 2 },
          minHeight: { xs: 36, md: isChild ? 40 : 44 },
          minWidth: { xs: isChild ? 88 : 104, md: 0 },
          position: "relative",
          bgcolor: isActive ? "var(--blog-active-bg)" : "transparent",
          "&::before": isActive
            ? {
                content: '""',
                position: "absolute",
                left: { xs: "50%", md: isChild ? -13 : 0 },
                top: { xs: "auto", md: isChild ? "50%" : "20%" },
                bottom: { xs: 3, md: "auto" },
                width: { xs: 18, md: isChild ? 7 : 3 },
                height: { xs: 2, md: isChild ? 7 : "60%" },
                bgcolor: "var(--blog-accent)",
                borderRadius: { xs: 999, md: isChild ? "50%" : "0 2px 2px 0" },
                transform: { xs: "translateX(-50%)", md: isChild ? "translate(-50%, -50%)" : "none" },
              }
            : {},
          "&:hover": {
            bgcolor: isActive ? "var(--blog-active-bg)" : "var(--blog-hover-bg)",
            "& .nav-label": { color: "var(--blog-accent)" },
            "& .nav-icon": { color: "var(--blog-accent)" },
          },
          transition: "all 0.2s ease",
        }}
      >
        {/* 메뉴 아이콘 */}
        <ListItemIcon
          className="nav-icon"
          sx={{
            minWidth: { xs: 24, md: isChild ? 28 : 32 },
            color: isActive ? "var(--blog-accent)" : "var(--blog-muted)",
            transition: "color 0.2s",
            "& svg": {
              fontSize: { xs: 17, md: "inherit" },
            },
          }}
        >
          {item.icon}
        </ListItemIcon>

        {/* 메뉴 이름 */}
        <ListItemText
          primary={item.label}
          className="nav-label"
          primaryTypographyProps={{
            fontSize: { xs: "0.68rem", md: isChild ? "0.74rem" : "0.78rem" },
            fontWeight: isActive ? 760 : 560,
            letterSpacing: { xs: "0.02em", md: isChild ? "0.07em" : "0.08em" },
            color: isActive ? "var(--blog-accent)" : "var(--blog-subtle)",
            sx: {
              transition: "color 0.2s",
              whiteSpace: "nowrap",
            },
          }}
        />
      </ListItemButton>
    );
  };

  return (
    <Box
      component="aside"
      sx={{
        width: { xs: "100%", md: 260 },
        height: { xs: "auto", md: "100vh" },
        position: { xs: "sticky", md: "fixed" },
        top: 0,
        left: 0,
        bgcolor: "var(--blog-sidebar-bg)",
        borderRight: { xs: 0, md: "1px solid var(--blog-border)" },
        borderBottom: { xs: "1px solid var(--blog-border)", md: 0 },
        display: "flex",
        flexDirection: { xs: "row", md: "column" },
        alignItems: "center",
        py: { xs: 0.75, md: 5 },
        px: { xs: 1, md: 0 },
        zIndex: 100,
        boxShadow: {
          xs: "0 8px 24px var(--blog-sidebar-shadow)",
          md: "2px 0 22px var(--blog-sidebar-shadow)",
        },
        overflowX: { xs: "auto", md: "visible" },
        overflowY: "hidden",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* 프로필 영역 */}
      <Box sx={{ textAlign: "center", mb: 4, px: 3, display: { xs: "none", md: "block" } }}>
        <Tooltip title={isDarkMode ? "라이트 모드" : "다크 모드"} placement="right">
          <Avatar
            component="button"
            aria-label="블로그 테마 전환"
            onClick={() => setIsDarkMode((current) => !current)}
            sx={{
              width: 96,
              height: 96,
              mx: "auto",
              mb: 2,
              p: 0,
              appearance: "none",
              bgcolor: "transparent",
              border: "3px solid var(--blog-avatar-border)",
              boxShadow: "0 8px 24px var(--blog-avatar-shadow)",
              cursor: "pointer",
              overflow: "hidden",
              position: "relative",
              transition: "transform 0.3s ease, border-color 0.25s ease, box-shadow 0.25s ease",
              "& .avatar-image": {
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              },
              "& .avatar-hover-image": {
                opacity: 0,
                transition: "opacity 0.22s ease",
              },
              "&:hover, &:focus-visible": { transform: "scale(1.05)" },
              "&:hover .avatar-hover-image, &:focus-visible .avatar-hover-image": {
                opacity: 1,
              },
            }}
          >
            {/* 현재 모드 프로필 이미지 */}
            <Box
              component="img"
              className="avatar-image"
              src={avatarSrc}
              alt="Hyuna's Tech Blog"
            />

            {/* 프로필 hover 이미지 */}
            <Box
              component="img"
              className="avatar-image avatar-hover-image"
              src={AVATAR_IMAGES.hover}
              alt=""
              aria-hidden="true"
            />
          </Avatar>
        </Tooltip>

        {/* 블로그 타이틀 */}
        <Typography
          component="button"
          onClick={() => navigate(ROUTES.BLOG)}
          sx={{
            p: 0,
            border: 0,
            bgcolor: "transparent",
            color: "var(--blog-heading)",
            fontSize: "1.05rem",
            fontWeight: 900,
            letterSpacing: 0,
            cursor: "pointer",
            lineHeight: 1.25,
            "&:hover": {
              color: "var(--blog-accent)",
            },
          }}
        >
          Hyuna&apos;s Tech Blog
        </Typography>

        {/* 한 줄 소개 */}
        <Typography
          variant="caption"
          sx={{
            color: "var(--blog-muted)",
            fontSize: "0.78rem",
            lineHeight: 1.5,
            display: "block",
            mt: 0.75,
          }}
        >
          개발 기록과 문제 해결 노트
        </Typography>
      </Box>

      <Divider sx={{ width: "80%", mb: 3, borderColor: "var(--blog-border)", display: { xs: "none", md: "block" } }} />

      {/* 사이드 메뉴 목록 */}
      <List
        sx={{
          width: { xs: "max-content", md: "100%" },
          px: { xs: 0, md: 2 },
          py: { xs: 0, md: 1 },
          display: { xs: "flex", md: "block" },
          alignItems: "center",
          gap: { xs: 0.45, md: 0 },
        }}
      >
        {navItems.slice(0, 1).map((item) => renderNavButton(item))}

        {/* 섹션 하위 메뉴 */}
        <Box
          sx={{
            mt: { xs: 0, md: 0.85 },
            ml: { xs: 0, md: 2.15 },
            pl: { xs: 0, md: 1.5 },
            borderLeft: { xs: 0, md: "1px solid var(--blog-border)" },
            display: { xs: "flex", md: "block" },
            alignItems: "center",
            gap: { xs: 0.45, md: 0 },
          }}
        >
          {navItems.slice(1).map((item) => renderNavButton(item, "child"))}
        </Box>
      </List>

      {/* 포트폴리오 자료 영역 */}
      <Box sx={{ width: "100%", px: 2, mt: "auto", pb: 1.25, display: { xs: "none", md: "block" } }}>
        {/* 메뉴 구분선 */}
        <Box
          sx={{
            mx: 2,
            mb: 1.2,
            borderTop: "1px solid var(--blog-border)",
          }}
        />

        {/* 포트폴리오 바로가기 */}
        <ListItemButton
          component="a"
          href={ROUTES.PORTFOLIO}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            borderRadius: 2,
            mb: 0.5,
            py: 1,
            px: 2,
            color: "var(--blog-subtle)",
            "&:hover": {
              bgcolor: "var(--blog-active-bg)",
              color: "var(--blog-accent)",
              "& .resource-end-icon": { color: "var(--blog-accent)" },
            },
          }}
        >
          <ListItemText
            primary="포트폴리오 바로가기"
            primaryTypographyProps={{
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: 0,
            }}
          />
          <ListItemIcon
            className="resource-end-icon"
            sx={{
              minWidth: 0,
              ml: 1,
              color: "var(--blog-muted)",
              transition: "color 0.2s",
            }}
          >
            <OpenInNew sx={{ fontSize: 17 }} />
          </ListItemIcon>
        </ListItemButton>

        {/* 포트폴리오 PDF 다운로드 */}
        <ListItemButton
          component="a"
          href="/portfolio_kimhyuna.pdf"
          download="portfolio_kimhyuna.pdf"
          sx={{
            borderRadius: 2,
            mb: 0.5,
            py: 1,
            px: 2,
            color: "var(--blog-subtle)",
            "&:hover": {
              bgcolor: "var(--blog-active-bg)",
              color: "var(--blog-accent)",
              "& .resource-end-icon": { color: "var(--blog-accent)" },
            },
          }}
        >
          <ListItemText
            primary="포트폴리오 PDF"
            primaryTypographyProps={{
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: 0,
            }}
          />
          <ListItemIcon
            className="resource-end-icon"
            sx={{
              minWidth: 0,
              ml: 1,
              color: "var(--blog-muted)",
              transition: "color 0.2s",
            }}
          >
            <Download sx={{ fontSize: 18 }} />
          </ListItemIcon>
        </ListItemButton>

        {/* 이력서 PDF 다운로드 */}
        <ListItemButton
          component="a"
          href="/resume_kimhyuna.pdf"
          download="resume_kimhyuna.pdf"
          sx={{
            borderRadius: 2,
            py: 1,
            px: 2,
            color: "var(--blog-subtle)",
            "&:hover": {
              bgcolor: "var(--blog-active-bg)",
              color: "var(--blog-accent)",
              "& .resource-end-icon": { color: "var(--blog-accent)" },
            },
          }}
        >
          <ListItemText
            primary="이력서 PDF"
            primaryTypographyProps={{
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: 0,
            }}
          />
          <ListItemIcon
            className="resource-end-icon"
            sx={{
              minWidth: 0,
              ml: 1,
              color: "var(--blog-muted)",
              transition: "color 0.2s",
            }}
          >
            <PersonOutline sx={{ fontSize: 18 }} />
          </ListItemIcon>
        </ListItemButton>
      </Box>

      {/* 하단 링크 영역 */}
      <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.75, mt: 2.4, alignItems: "center" }}>
        <Tooltip title="GitHub" placement="top">
          <IconButton
            size="small"
            component="a"
            href={CONFIG.GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub 열기"
            sx={{
              width: 32,
              height: 32,
              p: 0,
              color: "var(--blog-muted)",
              "&:hover": { color: "var(--blog-accent)", bgcolor: "transparent" },
              transition: "color 0.2s",
            }}
          >
            <GitHub sx={{ fontSize: 22, display: "block" }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="LinkedIn" placement="top">
          <IconButton
            size="small"
            component="a"
            href={CONFIG.LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn 열기"
            sx={{
              width: 32,
              height: 32,
              p: 0,
              color: "var(--blog-muted)",
              "&:hover": { color: "var(--blog-accent)", bgcolor: "transparent" },
              transition: "color 0.2s",
            }}
          >
            <LinkedIn sx={{ fontSize: 22, display: "block" }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="이메일" placement="top">
          <IconButton
            size="small"
            component="a"
            href={`mailto:${CONFIG.EMAIL}`}
            aria-label="메일 보내기"
            sx={{
              width: 32,
              height: 32,
              p: 0,
              color: "var(--blog-muted)",
              "&:hover": { color: "var(--blog-accent)", bgcolor: "transparent" },
              transition: "color 0.2s",
            }}
          >
            <EmailOutlined sx={{ fontSize: 22, display: "block" }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Sidebar;
