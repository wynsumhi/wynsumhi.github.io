/**
 * PortfolioHome 컴포넌트 (포트폴리오 메인 페이지)
 *
 * "/portfolio" 경로에서 렌더링됩니다.
 * 프로젝트 카드 목록과 기술 스택 섹션을 표시합니다.
 *
 * 데이터 흐름:
 *   data/projects.ts + data/skills.ts → useProjects 훅 → 이 컴포넌트
 */
import { Container, Typography, Box, Divider } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useProjects } from "../../hooks/useProjects";
import ProjectCard from "./components/ProjectCard";
import SkillSection from "./components/SkillSection";

const PortfolioHome = () => {
  // useProjects 훅에서 프로젝트와 기술 스택 데이터를 가져옴
  const { projects, skills } = useProjects();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* 페이지 헤더 */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h2" fontWeight={700} gutterBottom>
          Portfolio
        </Typography>
        <Typography variant="body1" color="text.secondary">
          프로젝트와 기술 스택을 소개합니다.
        </Typography>
      </Box>

      {/* 프로젝트 섹션 */}
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Projects
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {projects.map((project) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
            <ProjectCard project={project} />
          </Grid>
        ))}
      </Grid>

      {/* 구분선 */}
      <Divider sx={{ my: 6 }} />

      {/* 기술 스택 섹션 */}
      <Typography variant="h4" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
        Skills
      </Typography>
      <SkillSection skills={skills} />
    </Container>
  );
};

export default PortfolioHome;
