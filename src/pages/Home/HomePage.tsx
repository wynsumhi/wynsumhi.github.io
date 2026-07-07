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
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { createElement } from "react";
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
    left: "-0.04em",
    right: "-0.04em",
    bottom: "0.02em",
    height: "0.58em",
    bgcolor: "rgba(255, 190, 124, 0.48)",
    zIndex: -1,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    right: "-0.12em",
    bottom: "0.03em",
    width: "0.28em",
    height: "0.56em",
    bgcolor: "rgba(255, 170, 98, 0.36)",
    borderRadius: "45% 30% 35% 45%",
    transform: "rotate(-2deg)",
    zIndex: -1,
  },
};

const HomePage = () => {
  const navigate = useNavigate();
  const { getRecentPosts, loading, error } = usePosts();
  const { projects, skills } = useProjects();

  // 홈 노출 데이터
  const recentPosts = getRecentPosts(3);
  const featuredProjects = projects.slice(0, 3);
  const mainSkills = skills.flatMap((skill) => skill.items).slice(0, 10);

  // 섹션 스크롤 이동
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box sx={{ bgcolor: "#fbfbf8", color: "#171717" }}>
      {/* 첫 화면 소개 */}
      <Box
        component="section"
        sx={{
          position: "relative",
          minHeight: { xs: "calc(100vh - 64px)", md: "calc(100vh - 72px)" },
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          borderBottom: "1px solid #e8e3d8",
          bgcolor: "#f6f3ee",
        }}
      >
        {/* Spline 배경 */}
        <Box sx={{ position: "absolute", inset: 0 }}>
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

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
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
                sx={{ mt: 4 }}
              >
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => scrollToSection("home-projects")}
                  sx={{
                    color: "#ffffff",
                    bgcolor: "#171717",
                    "&:hover": { bgcolor: "#313131" },
                  }}
                >
                  포트폴리오 보기
                </Button>
                <Button
                  variant="outlined"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate(ROUTES.BLOG)}
                  sx={{
                    color: "#171717",
                    borderColor: "rgba(23,23,23,0.72)",
                    "&:hover": {
                      borderColor: "#171717",
                      bgcolor: "rgba(23,23,23,0.06)",
                    },
                  }}
                >
                  Tech Blog 보기
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 현재 집중하는 것 */}
      <Container
        maxWidth="lg"
        component="section"
        sx={{ py: { xs: 8, md: 12 } }}
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

      <Divider sx={{ borderColor: "#e8e3d8" }} />

      {/* 핵심 역량 */}
      <Container
        maxWidth="lg"
        component="section"
        sx={{ py: { xs: 9, md: 14 } }}
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
              {mainSkills.map((skill) => (
                <Chip
                  key={skill.name}
                  label={skill.name}
                  variant="outlined"
                  sx={{
                    bgcolor: "#fff",
                    borderColor: "#d8d1c4",
                    color: "#393631",
                  }}
                />
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <Divider sx={{ borderColor: "#e8e3d8" }} />

      {/* 대표 프로젝트 */}
      <Container
        id="home-projects"
        maxWidth="lg"
        component="section"
        sx={{ py: { xs: 9, md: 14 } }}
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
              프론트엔드 구현 경험을 프로젝트 단위로 정리합니다.
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

        <Stack spacing={0}>
          {featuredProjects.map((project) => (
            <Box
              key={project.id}
              sx={{
                py: 3,
                borderTop: "1px solid #e8e3d8",
                "&:last-of-type": { borderBottom: "1px solid #e8e3d8" },
              }}
            >
              <Grid container spacing={3} alignItems="center">
                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography color="#777167">
                    {project.period.start}
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
                      <Chip key={tech} label={tech} size="small" />
                    ))}
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Stack>
      </Container>

      <Divider sx={{ borderColor: "#e8e3d8" }} />

      {/* 최신 블로그 글 */}
      <Container
        maxWidth="lg"
        component="section"
        sx={{ py: { xs: 9, md: 14 } }}
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
              Notion에 기록한 학습과 문제 해결 과정을 모아둡니다.
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
      <Box component="section" sx={{ bgcolor: "#171717", color: "#fff" }}>
        <Container maxWidth="lg" sx={{ py: { xs: 9, md: 12 } }}>
          <Typography variant="h3" fontWeight={800}>
            함께 이야기해요
          </Typography>
          <Typography sx={{ mt: 1.5, color: "#c9c3b8" }}>
            프로젝트, 채용, 협업 이야기는 편하게 메일로 남겨주세요.
          </Typography>
          <Button
            href={`mailto:${CONFIG.EMAIL}`}
            variant="contained"
            sx={{
              mt: 3,
              bgcolor: "#fff",
              color: "#171717",
              "&:hover": { bgcolor: "#f2f0ea" },
            }}
          >
            이메일 보내기
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
