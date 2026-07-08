/**
 * Navbar 컴포넌트
 *
 * 일반 페이지 상단에서 주요 경로와 외부 링크를 제공하는 네비게이션입니다
 */
import { AppBar, Toolbar, Button, Container, Box, Stack, IconButton } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ROUTES } from "@/constants/routes";
import { CONFIG } from "@/constants/config";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // 포트폴리오 화면 네비게이션 배경
  const isPortfolioPage = location.pathname === ROUTES.PORTFOLIO;

  // 헤더 아이콘 hover 색상
  const portfolioHoverColor = "#6b7280";
  const portfolioHoverFilter =
    "brightness(0) saturate(100%) invert(44%) sepia(8%) saturate(641%) hue-rotate(176deg) brightness(94%) contrast(89%)";
  const isTransparentNav = isPortfolioPage && !isScrolled;

  useEffect(() => {
    // 홈 화면 스크롤 배경
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  return (
    <AppBar
      position={isPortfolioPage ? "fixed" : "sticky"}
      elevation={0}
      sx={{
        bgcolor: isTransparentNav ? "transparent" : "rgba(251, 251, 248, 0.9)",
        color: "#171717",
        borderBottom: "1px solid",
        borderColor: isTransparentNav ? "transparent" : "rgba(232, 227, 216, 0.7)",
        backdropFilter: isTransparentNav ? "none" : "blur(14px)",
        boxShadow: "none",
        top: 0,
        transition: "background-color 0.2s ease, border-color 0.2s ease, backdrop-filter 0.2s ease",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 64, md: 72 },
            position: "relative",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {/* 좌측 브랜드 그룹 */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={0}
            sx={{
              mr: "auto",
              flexShrink: 0,
              height: 32,
            }}
          >
            {/* 포트폴리오 이동 로고 */}
            <Box
              component="button"
              type="button"
              aria-label="포트폴리오로 이동"
              onClick={() => navigate(ROUTES.PORTFOLIO)}
              sx={{
                p: 0,
                border: 0,
                bgcolor: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                height: 32,
              }}
            >
              <Box
                component="img"
                src="/assets/hi.svg"
                alt="HYUNA"
                sx={{
                  display: "block",
                  flexShrink: 0,
                }}
              />
            </Box>

            {/* 포트폴리오 이동 버튼 */}
            <Button
              onClick={() => {
                navigate(ROUTES.PORTFOLIO);
              }}
              sx={{
                minWidth: "auto",
                pl: 0.8,
                pr: 0,
                py: 0,
                color: "#171717",
                fontWeight: 900,
                fontSize: "1.52rem",
                lineHeight: 0.9,
                alignSelf: "center",
                transform: "translateY(1.5px)",
                "&:hover": {
                  bgcolor: "transparent",
                  color: "#171717",
                  fontWeight: 900,
                },
              }}
            >
              Portfolio
            </Button>
          </Stack>

          {/* 외부 링크 */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
              height: 32,
            }}
          >
            <IconButton
              href={CONFIG.GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub 열기"
              sx={{
                width: 32,
                height: 32,
                p: 0,
                color: "#171717",
                borderRadius: "50%",
                alignItems: "center",
                transition: "color 0.2s ease",
                "&:hover": {
                  bgcolor: "transparent",
                  color: isPortfolioPage ? portfolioHoverColor : "#171717",
                },
              }}
            >
              <GitHubIcon
                sx={{
                  fontSize: { xs: 23, md: 24 },
                  display: "block",
                }}
              />
            </IconButton>
            <IconButton
              href="https://wynsumhi.notion.site/Frontend-Developer-HYUNA-131bdef722b680578ea1c1fb0781226e?pvs=74"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Notion 이력서 열기"
              sx={{
                width: 32,
                height: 32,
                p: 0,
                color: "#171717",
                borderRadius: "50%",
                alignItems: "center",
                transition: "color 0.2s ease",
                "&:hover": {
                  bgcolor: "transparent",
                  color: isPortfolioPage ? portfolioHoverColor : "#171717",
                },
                "&:hover .notion-icon": {
                  filter: isPortfolioPage ? portfolioHoverFilter : "none",
                },
              }}
            >
              <Box
                className="notion-icon"
                component="img"
                src="/assets/notion-trimmed.png"
                alt=""
                aria-hidden
                sx={{
                  width: 24,
                  height: 24,
                  aspectRatio: "1 / 1",
                  display: "block",
                  objectFit: "contain",
                  transition: "filter 0.2s ease",
                }}
              />
            </IconButton>
            <IconButton
              href={ROUTES.BLOG}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Blog 새 탭으로 열기"
              sx={{
                width: 32,
                height: 32,
                p: 0,
                color: "#171717",
                borderRadius: "50%",
                alignItems: "center",
                "&:hover": {
                  bgcolor: "transparent",
                },
                "&:hover .blog-icon": {
                  filter: isPortfolioPage ? portfolioHoverFilter : "none",
                },
              }}
            >
              <Box
                className="blog-icon"
                component="img"
                src="/assets/blog.png"
                alt=""
                aria-hidden
                sx={{
                  width: 23,
                  height: 23,
                  display: "block",
                  objectFit: "contain",
                  transform: "translateX(0.75px)",
                  transition: "filter 0.2s ease",
                }}
              />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
