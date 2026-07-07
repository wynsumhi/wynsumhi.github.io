/**
 * Navbar 컴포넌트
 *
 * 일반 페이지 상단에서 주요 경로와 외부 링크를 제공하는 네비게이션입니다
 */
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Stack,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { CONFIG } from "@/constants/config";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 상단 메뉴 목록
  const navItems = [
    { label: "Blog", path: ROUTES.BLOG },
    { label: "Portfolio", path: ROUTES.PORTFOLIO },
    { label: "Resume", path: ROUTES.RESUME },
  ];

  // 현재 메뉴 활성 상태 확인
  const isActivePath = (path: string) => {
    if (path === ROUTES.BLOG) return location.pathname.startsWith(ROUTES.BLOG);
    return location.pathname === path;
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "rgba(251, 251, 248, 0.9)",
        color: "#171717",
        borderBottom: "1px solid #e8e3d8",
        backdropFilter: "blur(14px)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 64, md: 72 },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {/* 홈 이동 로고 */}
          <Typography
            fontWeight={800}
            onClick={() => navigate(ROUTES.HOME)}
            sx={{
              cursor: "pointer",
              letterSpacing: "0.08em",
              fontSize: { xs: "0.95rem", md: "1rem" },
              whiteSpace: "nowrap",
            }}
          >
            HYUNA
          </Typography>

          {/* 주요 메뉴 */}
          <Stack
            component="nav"
            direction="row"
            spacing={{ xs: 0.2, sm: 1 }}
            sx={{
              overflowX: "auto",
              maxWidth: { xs: "calc(100vw - 120px)", sm: "none" },
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  minWidth: "auto",
                  px: { xs: 1, sm: 1.5 },
                  color: isActivePath(item.path) ? "#171717" : "#69645c",
                  fontWeight: isActivePath(item.path) ? 900 : 700,
                  fontSize: "0.88rem",
                  "&:hover": { bgcolor: "rgba(23,23,23,0.05)" },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>

          {/* 외부 링크 */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Button
              href={CONFIG.GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "#171717",
                fontWeight: 800,
                border: "1px solid #171717",
                borderRadius: 999,
                px: 2,
                py: 0.6,
                "&:hover": { bgcolor: "#171717", color: "#fff" },
              }}
            >
              GitHub
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
