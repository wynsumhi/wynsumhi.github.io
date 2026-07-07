/**
 * 홈 페이지
 *
 * 사이트에 처음 들어온 방문자에게 소개, 프로젝트, 최신 글을 보여주는 첫 화면입니다
 */
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { CONFIG } from "@/constants/config";
import { usePosts } from "@/hooks/usePosts";
import { useProjects } from "@/hooks/useProjects";
import { formatDate } from "@/utils/date";

const HomePage = () => {
  const navigate = useNavigate();
  const { getRecentPosts, loading, error } = usePosts();
  const { projects, skills } = useProjects();

  const recentPosts = getRecentPosts(3);
  const featuredProjects = projects.slice(0, 3);
  const mainSkills = skills.flatMap((skill) => skill.items).slice(0, 8);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
      <Box sx={{ mb: 8 }}>
        <Typography
          variant="overline"
          sx={{ color: "primary.main", fontWeight: 700 }}
        >
          Frontend Developer
        </Typography>
        <Typography variant="h2" fontWeight={800} gutterBottom>
          HYUNA
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ maxWidth: 720, lineHeight: 1.6, mb: 3 }}
        >
          사용자가 이해하기 쉬운 화면과 오래 관리할 수 있는 프론트엔드
          구조를 고민합니다.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <Button variant="contained" onClick={() => navigate(ROUTES.PORTFOLIO)}>
            포트폴리오 보기
          </Button>
          <Button variant="outlined" onClick={() => navigate(ROUTES.BLOG)}>
            블로그 보기
          </Button>
          <Button variant="text" href={`mailto:${CONFIG.EMAIL}`}>
            이메일 보내기
          </Button>
        </Stack>
      </Box>

      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Skills
        </Typography>
        <Stack direction="row" gap={1} flexWrap="wrap">
          {mainSkills.map((skill) => (
            <Chip key={skill.name} label={skill.name} variant="outlined" />
          ))}
        </Stack>
      </Box>

      <Box sx={{ mb: 8 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="h4" fontWeight={700}>
            Featured Projects
          </Typography>
          <Button onClick={() => navigate(ROUTES.PORTFOLIO)}>전체 보기</Button>
        </Box>
        <Grid container spacing={3}>
          {featuredProjects.map((project) => (
            <Grid size={{ xs: 12, md: 4 }} key={project.id}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {project.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    {project.description}
                  </Typography>
                  <Stack direction="row" gap={0.5} flexWrap="wrap">
                    {project.tech.slice(0, 4).map((tech) => (
                      <Chip key={tech} label={tech} size="small" />
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="h4" fontWeight={700}>
            Recent Posts
          </Typography>
          <Button onClick={() => navigate(ROUTES.BLOG)}>전체 보기</Button>
        </Box>

        {loading && <Typography>로딩 중...</Typography>}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && recentPosts.length === 0 && (
          <Alert severity="info">아직 작성된 글이 없습니다.</Alert>
        )}
        <Stack spacing={1.5}>
          {recentPosts.map((post) => (
            <Card
              key={post.id}
              onClick={() => navigate(`/blog/${post.id}`)}
              sx={{ cursor: "pointer" }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={700}>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(post.date)} · {post.category}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    </Container>
  );
};

export default HomePage;
