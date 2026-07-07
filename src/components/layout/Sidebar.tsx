/**
 * 블로그 사이드바
 *
 * 블로그 화면에서 프로필, 메뉴, 외부 링크를 보여주는 왼쪽 고정 영역입니다
 */
import { useState } from "react";
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
  ArchiveOutlined,
  DarkModeOutlined,
  EmailOutlined,
  GitHub,
  HomeOutlined,
  LightModeOutlined,
  PersonOutline,
  WorkOutline,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { CONFIG } from "@/constants/config";
import { ROUTES } from "@/constants/routes";

// 블로그 사이드 메뉴 목록
const navItems = [
  { label: "HOME", icon: <HomeOutlined fontSize="small" />, path: ROUTES.HOME },
  { label: "BLOG", icon: <ArticleOutlined fontSize="small" />, path: ROUTES.BLOG },
  {
    label: "ARCHIVES",
    icon: <ArchiveOutlined fontSize="small" />,
    path: ROUTES.ARCHIVES,
  },
  {
    label: "PORTFOLIO",
    icon: <WorkOutline fontSize="small" />,
    path: ROUTES.PORTFOLIO,
  },
  {
    label: "RESUME",
    icon: <PersonOutline fontSize="small" />,
    path: ROUTES.RESUME,
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);

  // 현재 메뉴 활성 상태 확인
  const isActivePath = (path: string) => {
    // 블로그 상세 페이지 포함
    if (path === ROUTES.BLOG) return location.pathname.startsWith(ROUTES.BLOG);

    // 현재 경로 일치 확인
    return location.pathname === path;
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
        bgcolor: "white",
        borderRight: "1px solid #edf0f7",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 5,
        zIndex: 100,
        boxShadow: "2px 0 20px rgba(0,0,0,0.04)",
      }}
    >
      {/* 프로필 영역 */}
      <Box sx={{ textAlign: "center", mb: 4, px: 3 }}>
        <Avatar
          src="/avatar.png"
          alt={CONFIG.SITE_TITLE}
          onClick={() => navigate(ROUTES.HOME)}
          sx={{
            width: 88,
            height: 88,
            mx: "auto",
            mb: 2,
            border: "3px solid #e8ecf7",
            boxShadow: "0 4px 16px rgba(37,99,235,0.15)",
            cursor: "pointer",
            transition: "transform 0.3s ease",
            "&:hover": { transform: "scale(1.05)" },
          }}
        />

        {/* 홈 이동 로고 */}
        <Box
          component="img"
          src="/assets/hi.svg"
          alt="HYUNA"
          onClick={() => navigate(ROUTES.HOME)}
          sx={{
            width: 34,
            height: "auto",
            mx: "auto",
            display: "block",
            cursor: "pointer",
            transition: "transform 0.2s",
            "&:hover": { transform: "translateY(-1px)" },
          }}
        />

        {/* 한 줄 소개 */}
        <Typography
          variant="caption"
          sx={{
            color: "#94a3b8",
            fontSize: "0.78rem",
            lineHeight: 1.5,
            display: "block",
            mt: 0.5,
          }}
        >
          Portfolio & Tech Blog
        </Typography>
      </Box>

      <Divider sx={{ width: "80%", mb: 3, borderColor: "#edf0f7" }} />

      {/* 사이드 메뉴 목록 */}
      <List sx={{ width: "100%", px: 2, flex: 1 }}>
        {navItems.map((item) => {
          const isActive = isActivePath(item.path);

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
                bgcolor: isActive ? "#eff4ff" : "transparent",
                "&::before": isActive
                  ? {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: "20%",
                      height: "60%",
                      width: 3,
                      bgcolor: "#2563eb",
                      borderRadius: "0 2px 2px 0",
                    }
                  : {},
                "&:hover": {
                  bgcolor: isActive ? "#eff4ff" : "#f8faff",
                  "& .nav-label": { color: "#2563eb" },
                  "& .nav-icon": { color: "#2563eb" },
                },
                transition: "all 0.2s ease",
              }}
            >
              {/* 메뉴 아이콘 */}
              <ListItemIcon
                className="nav-icon"
                sx={{
                  minWidth: 32,
                  color: isActive ? "#2563eb" : "#94a3b8",
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
                  color: isActive ? "#2563eb" : "#64748b",
                  sx: { transition: "color 0.2s" },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* 하단 링크 영역 */}
      <Box sx={{ display: "flex", gap: 0.5, mt: 2, alignItems: "center" }}>
        <Tooltip title={darkMode ? "라이트 모드" : "다크 모드"} placement="top">
          <IconButton
            size="small"
            onClick={() => setDarkMode(!darkMode)}
            sx={{
              color: "#94a3b8",
              "&:hover": { color: "#2563eb", bgcolor: "#eff4ff" },
              transition: "all 0.2s",
            }}
          >
            {darkMode ? (
              <LightModeOutlined fontSize="small" />
            ) : (
              <DarkModeOutlined fontSize="small" />
            )}
          </IconButton>
        </Tooltip>

        <Typography sx={{ color: "#cbd5e1", fontSize: "0.6rem" }}>·</Typography>

        <Tooltip title="GitHub" placement="top">
          <IconButton
            size="small"
            component="a"
            href={CONFIG.GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: "#94a3b8",
              "&:hover": { color: "#1e293b", bgcolor: "#f1f5f9" },
              transition: "all 0.2s",
            }}
          >
            <GitHub fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="이메일" placement="top">
          <IconButton
            size="small"
            component="a"
            href={`mailto:${CONFIG.EMAIL}`}
            sx={{
              color: "#94a3b8",
              "&:hover": { color: "#1e293b", bgcolor: "#f1f5f9" },
              transition: "all 0.2s",
            }}
          >
            <EmailOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Sidebar;
