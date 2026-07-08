/**
 * 블로그 사이드바
 *
 * 블로그 화면에서 프로필, 메뉴, 외부 링크를 보여주는 왼쪽 고정 영역입니다
 */
import { useEffect, useState } from "react";
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
  ArticleOutlined,
  AutoStoriesOutlined,
  CodeOutlined,
  Download,
  EditNoteOutlined,
  EmailOutlined,
  GitHub,
  LinkedIn,
  OpenInNew,
  PersonOutline,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { CONFIG } from "@/constants/config";
import { ROUTES } from "@/constants/routes";

// 블로그 사이드 메뉴 목록
const navItems = [
  {
    label: "ALL POST",
    icon: <ArticleOutlined fontSize="small" />,
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
    icon: <AutoStoriesOutlined fontSize="small" />,
    path: `${ROUTES.BLOG}?section=study`,
    section: "study",
  },
  {
    label: "LOG",
    icon: <EditNoteOutlined fontSize="small" />,
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
  const currentSection = new URLSearchParams(location.search).get("section") ?? "all";
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("blogTheme") === "dark",
  );
  const [isAvatarHover, setIsAvatarHover] = useState(false);

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
  const avatarSrc = isDarkMode
    ? AVATAR_IMAGES.dark
    : isAvatarHover
      ? AVATAR_IMAGES.hover
      : AVATAR_IMAGES.default;

  // 현재 메뉴 활성 상태 확인
  const isActivePath = (section: string) => {
    // 전체 글 활성 상태
    if (section === "all") {
      return (
        (location.pathname === ROUTES.BLOG && currentSection === "all") ||
        (location.pathname.startsWith(`${ROUTES.BLOG}/`) &&
          !location.pathname.startsWith(ROUTES.ARCHIVES))
      );
    }

    // 섹션 메뉴 활성 상태
    return location.pathname === ROUTES.BLOG && currentSection === section;
  };

  return (
    <Box
      component="aside"
      sx={{
        width: 260,
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        bgcolor: "var(--blog-sidebar-bg)",
        borderRight: "1px solid var(--blog-border)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 5,
        zIndex: 100,
        boxShadow: "2px 0 22px var(--blog-sidebar-shadow)",
      }}
    >
      {/* 프로필 영역 */}
      <Box sx={{ textAlign: "center", mb: 4, px: 3 }}>
        <Tooltip title={isDarkMode ? "라이트 모드" : "다크 모드"} placement="right">
          <Avatar
            component="button"
            src={avatarSrc}
            alt="Hyuna's Tech Blog"
            onClick={() => setIsDarkMode((current) => !current)}
            onMouseEnter={() => setIsAvatarHover(true)}
            onMouseLeave={() => setIsAvatarHover(false)}
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
              transition: "transform 0.3s ease, border-color 0.25s ease, box-shadow 0.25s ease",
              "& img": {
                objectFit: "cover",
              },
              "&:hover": { transform: "scale(1.05)" },
            }}
          />
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

      <Divider sx={{ width: "80%", mb: 3, borderColor: "var(--blog-border)" }} />

      {/* 사이드 메뉴 목록 */}
      <List sx={{ width: "100%", px: 2 }}>
        {navItems.map((item) => {
          const isActive = isActivePath(item.section);

          return (
            <ListItemButton
              key={item.label}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                py: 1.2,
                px: 2,
                position: "relative",
                bgcolor: isActive ? "var(--blog-active-bg)" : "transparent",
                "&::before": isActive
                  ? {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: "20%",
                      height: "60%",
                      width: 3,
                      bgcolor: "var(--blog-accent)",
                      borderRadius: "0 2px 2px 0",
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
                  minWidth: 32,
                  color: isActive ? "var(--blog-accent)" : "var(--blog-muted)",
                  transition: "color 0.2s",
                }}
              >
                {item.icon}
              </ListItemIcon>

              {/* 메뉴 이름 */}
              <ListItemText
                primary={item.label}
                className="nav-label"
                primaryTypographyProps={{
                  fontSize: "0.78rem",
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: "0.08em",
                  color: isActive ? "var(--blog-accent)" : "var(--blog-subtle)",
                  sx: { transition: "color 0.2s" },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* 포트폴리오 자료 영역 */}
      <Box sx={{ width: "100%", px: 2, mt: "auto", pb: 1.25 }}>
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
      <Box sx={{ display: "flex", gap: 0.75, mt: 2.4, alignItems: "center" }}>
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
