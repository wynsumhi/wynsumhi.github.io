/**
 * Navbar 컴포넌트 (네비게이션 바)
 *
 * 모든 페이지 상단에 표시되는 공통 헤더입니다.
 * 사이트 제목, 페이지 이동 링크, GitHub 외부 링크를 포함합니다.
 *
 * 주요 MUI 컴포넌트:
 * - AppBar: 상단 고정 바 (position="sticky"로 스크롤 시에도 유지)
 * - Toolbar: AppBar 내부의 레이아웃 컨테이너
 * - Container: 최대 너비를 제한하여 중앙 정렬
 */
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { CONFIG } from "@/constants/config";

const Navbar = () => {
  // useNavigate: 프로그래밍 방식으로 페이지 이동
  const navigate = useNavigate();
  // useLocation: 현재 URL 경로 정보를 가져옴
  const location = useLocation();

  // 네비게이션 메뉴 항목 정의 (label: 표시 텍스트, path: 이동 경로)
  const navItems = [
    { label: "블로그", path: ROUTES.HOME },
    { label: "포트폴리오", path: ROUTES.PORTFOLIO },
  ];

  return (
    <AppBar
      position="sticky" // 스크롤해도 상단에 고정
      color="default"
      elevation={1} // 그림자 깊이 (0=없음, 24=최대)
      sx={{ bgcolor: "background.default" }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters // 기본 좌우 패딩 제거
          sx={{ justifyContent: "space-between" }}
        >
          {/* 사이트 제목 - 클릭하면 홈(블로그)으로 이동 */}
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ cursor: "pointer", color: "primary.main" }}
            onClick={() => navigate(ROUTES.HOME)}
          >
            {CONFIG.SITE_TITLE}
          </Typography>

          {/* 네비게이션 링크들 */}
          <Box sx={{ display: "flex", gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  // 현재 경로와 일치하면 강조 표시
                  fontWeight: location.pathname === item.path ? 700 : 400,
                  color:
                    location.pathname === item.path
                      ? "primary.main"
                      : "text.secondary",
                }}
              >
                {item.label}
              </Button>
            ))}

            {/* GitHub 외부 링크 */}
            <Button
              href={CONFIG.GITHUB_URL}
              target="_blank" // 새 탭에서 열기
              rel="noopener noreferrer" // 보안: 새 탭에서 원래 페이지 접근 차단
              sx={{ color: "text.secondary" }}
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
