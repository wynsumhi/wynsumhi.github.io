/**
 * ProjectCard 컴포넌트
 *
 * 개별 프로젝트를 카드 형태로 표시합니다.
 * 썸네일, 제목, 기간, 설명, 기술 태그, 링크(GitHub/Demo)를 포함합니다.
 *
 * MUI Card 컴포넌트 구조:
 *   Card → CardMedia (이미지) + CardContent (텍스트 콘텐츠)
 */
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  Button,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LaunchIcon from "@mui/icons-material/Launch";
import type { Project } from "@/types/portfolio";

/** ProjectCard의 props 타입 */
interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Card
      sx={{
        height: "100%", // 그리드에서 동일 높이 유지
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
    >
      {/* 프로젝트 썸네일 이미지 */}
      <CardMedia
        component="img"
        height="200"
        image={project.thumbnail}
        alt={project.title}
        sx={{ objectFit: "cover" }}
      />

      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        {/* 프로젝트 제목 */}
        <Typography variant="h6" fontWeight={700} gutterBottom>
          {project.title}
        </Typography>

        {/* 프로젝트 기간 (시작일 ~ 종료일 또는 "진행 중") */}
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
          {project.period.start} ~ {project.period.end || "진행 중"}
        </Typography>

        {/* 프로젝트 설명 */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, flexGrow: 1 }}
        >
          {project.description}
        </Typography>

        {/* 사용 기술 태그 목록 */}
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 2 }}>
          {project.tech.map((t) => (
            <Chip key={t} label={t} size="small" variant="outlined" />
          ))}
        </Box>

        {/* 외부 링크 버튼 (GitHub, Demo) */}
        <Box sx={{ display: "flex", gap: 1 }}>
          {project.links.github && (
            <Button
              size="small"
              startIcon={<GitHubIcon />}
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Button>
          )}
          {project.links.demo && (
            <Button
              size="small"
              startIcon={<LaunchIcon />}
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
            >
              Demo
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
