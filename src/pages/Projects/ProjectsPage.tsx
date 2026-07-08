/**
 * 프로젝트 목록 페이지
 *
 * 전체 프로젝트를 카드 형태로 보여주는 화면입니다
 */
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogContent,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import GitHubIcon from "@mui/icons-material/GitHub";
import LaunchIcon from "@mui/icons-material/Launch";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SearchIcon from "@mui/icons-material/Search";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useProjects } from "@/hooks/useProjects";
import type { Project } from "@/types/portfolio";

// 프로젝트 기간 표시
const formatProjectPeriod = (start: string, end?: string) => {
  const formatMonth = (value: string) => value.replace("-", ".");

  return `${formatMonth(start)} - ${end ? formatMonth(end) : "진행 중"}`;
};

// 프로젝트 구분 표시
const projectKindLabel = {
  work: "업무 프로젝트",
  side: "사이드 프로젝트",
} as const;

type ProjectKindFilter = "all" | Project["kind"];
type ProjectSortType = "latest" | "oldest" | "title";

// 검색 비교용 텍스트
const normalizeText = (value: string) => value.toLowerCase().replace(/\s/g, "");

// 프로젝트 검색 대상
const getProjectSearchText = (project: Project) => {
  return normalizeText(
    [
      project.title,
      project.description,
      project.detail?.subtitle,
      project.detail?.problem,
      project.detail?.solution,
      ...project.tech,
    ]
      .filter(Boolean)
      .join(" "),
  );
};

// 프로젝트 정렬 기준
const sortProjects = (projects: Project[], sortType: ProjectSortType) => {
  const sortedProjects = [...projects];

  if (sortType === "title") {
    return sortedProjects.sort((a, b) => a.title.localeCompare(b.title));
  }

  return sortedProjects.sort((a, b) => {
    const aTime = new Date(`${a.period.start}-01`).getTime();
    const bTime = new Date(`${b.period.start}-01`).getTime();

    return sortType === "latest" ? bTime - aTime : aTime - bTime;
  });
};

interface DetailSectionProps {
  title: string;
  children: ReactNode;
}

const DetailSection = ({ title, children }: DetailSectionProps) => {
  return (
    <Stack spacing={1.2}>
      <Typography
        component="h3"
        sx={{
          fontSize: { xs: "1.12rem", md: "1.3rem" },
          fontWeight: 900,
          color: "#171717",
          lineHeight: 1.35,
        }}
      >
        {title}
      </Typography>
      {children}
    </Stack>
  );
};

interface DetailListProps {
  items: string[];
}

const DetailList = ({ items }: DetailListProps) => {
  return (
    <Stack component="ul" spacing={0.9} sx={{ m: 0, p: 0, listStyle: "none" }}>
      {items.map((item) => (
        <Box
          component="li"
          key={item}
          sx={{
            display: "flex",
            gap: 1.1,
            color: "#625d54",
            lineHeight: 1.75,
            "&::before": {
              content: '""',
              width: 5,
              height: 5,
              mt: "0.72em",
              flex: "0 0 auto",
              borderRadius: "50%",
              bgcolor: "#f59e0b",
            },
          }}
        >
          {item}
        </Box>
      ))}
    </Stack>
  );
};

interface InfoItemProps {
  label: string;
  value: string;
}

const InfoItem = ({ label, value }: InfoItemProps) => {
  return (
    <Box>
      <Typography sx={{ mb: 0.4, color: "#8a8175", fontSize: "0.86rem", fontWeight: 700 }}>
        {label}
      </Typography>
      <Typography sx={{ color: "#171717", fontWeight: 900, lineHeight: 1.45 }}>
        {value}
      </Typography>
    </Box>
  );
};

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
}

const ProjectCard = ({ project, onOpen }: ProjectCardProps) => {
  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={() => onOpen(project)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(project);
        }
      }}
      sx={{
        p: 0,
        textAlign: "left",
        cursor: "pointer",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        bgcolor: "#fff",
        border: "1px solid #e8e3d8",
        borderRadius: 2,
        transition: "transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease",
        "&:focus-visible": {
          outline: "3px solid rgba(217, 119, 6, 0.34)",
          outlineOffset: 3,
        },
        "&:hover": {
          transform: "translateY(-6px)",
          borderColor: "rgba(217, 119, 6, 0.34)",
          boxShadow: "0 22px 54px rgba(45, 36, 23, 0.12)",
        },
      }}
    >
      {/* 프로젝트 이미지 */}
      <Box
        sx={{
          position: "relative",
          aspectRatio: "16 / 10",
          overflow: "hidden",
          bgcolor: "#eee8dc",
        }}
      >
        <Box
          component="img"
          src={project.thumbnail}
          alt={project.title}
          sx={{
            width: "100%",
            height: "100%",
            display: "block",
            objectFit: "cover",
            filter: "saturate(0.86)",
          }}
        />
        <Chip
          label={projectKindLabel[project.kind]}
          size="small"
          sx={{
            position: "absolute",
            top: 14,
            left: 14,
            bgcolor: "rgba(255, 255, 255, 0.86)",
            color: "#7c4a03",
            border: "1px solid rgba(217, 119, 6, 0.22)",
            fontWeight: 800,
            backdropFilter: "blur(10px)",
          }}
        />
      </Box>

      {/* 프로젝트 정보 */}
      <Stack spacing={2.2} sx={{ p: { xs: 2.4, md: 3 } }}>
        <Box>
          <Typography sx={{ color: "#8a8175", fontSize: "0.88rem", fontWeight: 700 }}>
            {formatProjectPeriod(project.period.start, project.period.end)}
          </Typography>
          <Typography variant="h5" fontWeight={800} sx={{ mt: 0.8, lineHeight: 1.35 }}>
            {project.title}
          </Typography>
        </Box>

        <Typography sx={{ color: "#625d54", lineHeight: 1.75 }}>
          {project.description}
        </Typography>

        {/* 기술 태그 */}
        <Stack direction="row" gap={0.75} flexWrap="wrap">
          {project.tech.map((tech) => (
            <Chip
              key={tech}
              label={tech}
              size="small"
              sx={{
                bgcolor: "#f4f4f5",
                color: "#52525b",
                border: "1px solid #e4e4e7",
                borderRadius: "5px",
                fontWeight: 700,
                "& .MuiChip-label": {
                  px: 1,
                },
              }}
            />
          ))}
        </Stack>

        {/* 외부 링크 */}
        <Stack direction="row" gap={1} sx={{ pt: 0.4 }}>
          {project.links.demo && (
            <Button
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<LaunchIcon />}
              onClick={(event) => event.stopPropagation()}
              sx={{ color: "#171717", fontWeight: 800 }}
            >
              사이트 보기
            </Button>
          )}
          {project.links.github && (
            <Button
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<GitHubIcon />}
              onClick={(event) => event.stopPropagation()}
              sx={{ color: "#171717", fontWeight: 800 }}
            >
              GitHub
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

const ProjectsPage = () => {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [kindFilter, setKindFilter] = useState<ProjectKindFilter>("all");
  const [selectedTech, setSelectedTech] = useState("all");
  const [sortType, setSortType] = useState<ProjectSortType>("latest");

  // 기술 필터 목록
  const techFilters = useMemo(() => {
    const techSet = new Set(projects.flatMap((project) => project.tech));

    return Array.from(techSet).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  // 화면 표시 프로젝트
  const filteredProjects = useMemo(() => {
    const normalizedKeyword = normalizeText(searchKeyword);
    const matchedProjects = projects.filter((project) => {
      const matchesKind = kindFilter === "all" || project.kind === kindFilter;
      const matchesTech = selectedTech === "all" || project.tech.includes(selectedTech);
      const matchesKeyword =
        normalizedKeyword.length === 0 ||
        getProjectSearchText(project).includes(normalizedKeyword);

      return matchesKind && matchesTech && matchesKeyword;
    });

    return sortProjects(matchedProjects, sortType);
  }, [kindFilter, projects, searchKeyword, selectedTech, sortType]);

  // 필터 적용 여부
  const hasActiveFilter =
    searchKeyword.trim().length > 0 || kindFilter !== "all" || selectedTech !== "all";

  // 필터 초기화
  const resetProjectFilters = () => {
    setSearchKeyword("");
    setKindFilter("all");
    setSelectedTech("all");
    setSortType("latest");
  };

  // 프로젝트 상세 닫기
  const closeProjectDetail = () => {
    setSelectedProject(null);
  };

  return (
    <Box sx={{ bgcolor: "#fbfbf8", color: "#171717", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ pt: { xs: 13, md: 16 }, pb: { xs: 12, md: 16 } }}>
        {/* 페이지 제목 */}
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          {/* 포트폴리오 복귀 버튼 */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(ROUTES.PORTFOLIO)}
            sx={{
              mb: 3,
              px: 0,
              color: "#625d54",
              fontWeight: 800,
              textTransform: "none",
              "&:hover": {
                bgcolor: "transparent",
                color: "#171717",
              },
            }}
          >
            포트폴리오로 돌아가기
          </Button>

          <Typography
            component="p"
            sx={{
              mb: 1.5,
              color: "#d97706",
              fontWeight: 900,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Projects
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "2.4rem", md: "4.2rem" },
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: 0,
            }}
          >
            구현 경험을 프로젝트 단위로 정리합니다.
          </Typography>
          <Typography sx={{ mt: 2.4, maxWidth: 680, color: "#625d54", lineHeight: 1.8 }}>
            업무 프로젝트와 사이드 프로젝트를 나누어 문제 해결 방식, 구현 범위,
            사용 기술을 한눈에 볼 수 있도록 구성했습니다.
          </Typography>
        </Box>

        {/* 프로젝트 탐색 도구 */}
        <Stack
          spacing={2.4}
          sx={{
            position: { md: "sticky" },
            top: { md: 86 },
            zIndex: 4,
            mb: { xs: 4, md: 5 },
            p: { xs: 2, md: 2.4 },
            bgcolor: "rgba(251, 251, 248, 0.88)",
            border: "1px solid rgba(232, 227, 216, 0.9)",
            borderRadius: 2,
            backdropFilter: "blur(18px)",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
            alignItems={{ xs: "stretch", md: "center" }}
          >
            <TextField
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              placeholder="프로젝트명, 기술, 문제 해결 키워드 검색"
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#8a8175" }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#fff",
                  borderRadius: 1.5,
                  fontWeight: 700,
                },
              }}
            />

            <Select
              value={sortType}
              onChange={(event) => setSortType(event.target.value as ProjectSortType)}
              sx={{
                minWidth: { xs: "100%", md: 150 },
                bgcolor: "#fff",
                borderRadius: 1.5,
                fontWeight: 800,
              }}
            >
              <MenuItem value="latest">최신순</MenuItem>
              <MenuItem value="oldest">오래된순</MenuItem>
              <MenuItem value="title">이름순</MenuItem>
            </Select>
          </Stack>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.4}
            alignItems={{ xs: "stretch", md: "center" }}
            justifyContent="space-between"
          >
            <ToggleButtonGroup
              exclusive
              value={kindFilter}
              onChange={(_, value: ProjectKindFilter | null) => {
                if (value) setKindFilter(value);
              }}
              sx={{
                "& .MuiToggleButton-root": {
                  px: 2,
                  py: 0.9,
                  color: "#625d54",
                  borderColor: "#e8e3d8",
                  fontWeight: 900,
                  textTransform: "none",
                  "&.Mui-selected": {
                    color: "#171717",
                    bgcolor: "#fff2cc",
                  },
                  "&.Mui-selected:hover": {
                    bgcolor: "#ffe8a3",
                  },
                },
              }}
            >
              <ToggleButton value="all">전체</ToggleButton>
              <ToggleButton value="work">업무</ToggleButton>
              <ToggleButton value="side">사이드</ToggleButton>
            </ToggleButtonGroup>

            <Typography sx={{ color: "#8a8175", fontWeight: 800 }}>
              {filteredProjects.length}개의 프로젝트
            </Typography>
          </Stack>

          {/* 기술 빠른 필터 */}
          <Stack direction="row" gap={0.8} flexWrap="wrap">
            <Chip
              label="All"
              clickable
              onClick={() => setSelectedTech("all")}
              sx={{
                bgcolor: selectedTech === "all" ? "#171717" : "#fff",
                color: selectedTech === "all" ? "#fff" : "#625d54",
                border: "1px solid #e8e3d8",
                borderRadius: "5px",
                fontWeight: 800,
              }}
            />
            {techFilters.map((tech) => (
              <Chip
                key={tech}
                label={tech}
                clickable
                onClick={() => setSelectedTech(tech)}
                sx={{
                  bgcolor: selectedTech === tech ? "#171717" : "#fff",
                  color: selectedTech === tech ? "#fff" : "#625d54",
                  border: "1px solid #e8e3d8",
                  borderRadius: "5px",
                  fontWeight: 800,
                }}
              />
            ))}
          </Stack>
        </Stack>

        {/* 프로젝트 검색 결과 */}
        <Stack spacing={3.2}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.4}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
          >
            <Typography variant="h4" fontWeight={900}>
              ✦ 프로젝트 목록
            </Typography>
            {hasActiveFilter && (
              <Button
                startIcon={<RestartAltIcon />}
                onClick={resetProjectFilters}
                sx={{
                  color: "#625d54",
                  fontWeight: 800,
                  "&:hover": {
                    bgcolor: "transparent",
                    color: "#171717",
                  },
                }}
              >
                필터 초기화
              </Button>
            )}
          </Stack>

          {filteredProjects.length > 0 ? (
            <Grid container spacing={3}>
              {filteredProjects.map((project) => (
                <Grid key={project.id} size={{ xs: 12, md: 6, lg: 4 }}>
                  <ProjectCard project={project} onOpen={setSelectedProject} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Stack
              spacing={1.4}
              alignItems="center"
              sx={{
                py: { xs: 8, md: 10 },
                px: 3,
                bgcolor: "#fff",
                border: "1px solid #e8e3d8",
                borderRadius: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="h5" fontWeight={900}>
                조건에 맞는 프로젝트가 없어요
              </Typography>
              <Typography sx={{ color: "#625d54", lineHeight: 1.7 }}>
                검색어를 줄이거나 기술 필터를 전체로 바꾸면 더 많은 프로젝트를 볼 수 있습니다.
              </Typography>
              <Button
                startIcon={<RestartAltIcon />}
                onClick={resetProjectFilters}
                sx={{ mt: 1, color: "#171717", fontWeight: 900 }}
              >
                전체 프로젝트 보기
              </Button>
            </Stack>
          )}
        </Stack>
      </Container>

      {/* 프로젝트 상세 모달 */}
      <Dialog
        open={Boolean(selectedProject)}
        onClose={closeProjectDetail}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            bgcolor: "#fffdfa",
          },
        }}
      >
        {selectedProject && (
          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ position: "relative" }}>
              <Box
                component="img"
                src={selectedProject.thumbnail}
                alt={selectedProject.title}
                sx={{
                  width: "100%",
                  height: { xs: 220, md: 340 },
                  display: "block",
                  objectFit: "cover",
                  filter: "saturate(0.9)",
                }}
              />
              <IconButton
                aria-label="프로젝트 상세 닫기"
                onClick={closeProjectDetail}
                sx={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  bgcolor: "rgba(255, 255, 255, 0.88)",
                  "&:hover": {
                    bgcolor: "#fff",
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Stack spacing={3} sx={{ p: { xs: 3, md: 4 } }}>
              <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center">
                <Chip
                  label={projectKindLabel[selectedProject.kind]}
                  size="small"
                  sx={{
                    bgcolor: "#fff7ed",
                    color: "#9a3412",
                    border: "1px solid rgba(217, 119, 6, 0.24)",
                    fontWeight: 800,
                  }}
                />
                <Typography sx={{ color: "#8a8175", fontWeight: 700 }}>
                  {formatProjectPeriod(selectedProject.period.start, selectedProject.period.end)}
                </Typography>
              </Stack>

              <Box>
                <Typography
                  component="h2"
                  sx={{
                    fontSize: { xs: "1.8rem", md: "2.5rem" },
                    fontWeight: 900,
                    lineHeight: 1.2,
                  }}
                >
                  {selectedProject.title}
                </Typography>
                {selectedProject.detail?.subtitle && (
                  <Typography sx={{ mt: 1, color: "#8a8175", fontWeight: 700 }}>
                    {selectedProject.detail.subtitle}
                  </Typography>
                )}
                <Typography sx={{ mt: 1.6, color: "#625d54", lineHeight: 1.85 }}>
                  {selectedProject.description}
                </Typography>
              </Box>

              {/* 프로젝트 상세 정보 */}
              {selectedProject.detail && (
                <Grid container spacing={{ xs: 3, md: 4 }} sx={{ pt: 1 }}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={3}>
                      {selectedProject.detail.problem && (
                        <DetailSection title="문제 정의">
                          <Typography sx={{ color: "#625d54", lineHeight: 1.85 }}>
                            {selectedProject.detail.problem}
                          </Typography>
                        </DetailSection>
                      )}

                      {selectedProject.detail.solution && (
                        <DetailSection title="해결 방안">
                          <Typography sx={{ color: "#625d54", lineHeight: 1.85 }}>
                            {selectedProject.detail.solution}
                          </Typography>
                        </DetailSection>
                      )}

                      {selectedProject.detail.results && (
                        <DetailSection title="성과 및 결과">
                          <DetailList items={selectedProject.detail.results} />
                        </DetailSection>
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={3}>
                      {selectedProject.detail.challenges && (
                        <DetailSection title="기술적 도전">
                          <DetailList items={selectedProject.detail.challenges} />
                        </DetailSection>
                      )}

                      <DetailSection title="프로젝트 정보">
                        <Grid container spacing={2.2}>
                          <Grid size={{ xs: 6 }}>
                            <InfoItem
                              label="개발 기간"
                              value={
                                selectedProject.detail.info?.duration ??
                                formatProjectPeriod(
                                  selectedProject.period.start,
                                  selectedProject.period.end,
                                )
                              }
                            />
                          </Grid>
                          {selectedProject.detail.info?.team && (
                            <Grid size={{ xs: 6 }}>
                              <InfoItem label="팀 규모" value={selectedProject.detail.info.team} />
                            </Grid>
                          )}
                          {selectedProject.detail.info?.role && (
                            <Grid size={{ xs: 12 }}>
                              <InfoItem
                                label="담당 역할"
                                value={selectedProject.detail.info.role}
                              />
                            </Grid>
                          )}
                        </Grid>
                      </DetailSection>

                      <DetailSection title="기술 스택">
                        <Stack direction="row" gap={0.75} flexWrap="wrap">
                          {selectedProject.tech.map((tech) => (
                            <Chip
                              key={tech}
                              label={tech}
                              size="small"
                              sx={{
                                bgcolor: "#f4f4f5",
                                color: "#52525b",
                                border: "1px solid #e4e4e7",
                                borderRadius: "5px",
                                fontWeight: 700,
                              }}
                            />
                          ))}
                        </Stack>
                      </DetailSection>
                    </Stack>
                  </Grid>
                </Grid>
              )}

              <Stack direction="row" gap={1} flexWrap="wrap">
                {selectedProject.links.demo && (
                  <Button
                    href={selectedProject.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    startIcon={<LaunchIcon />}
                    sx={{
                      bgcolor: "#171717",
                      fontWeight: 800,
                      "&:hover": { bgcolor: "#313131" },
                    }}
                  >
                    사이트 보기
                  </Button>
                )}
                {selectedProject.links.github && (
                  <Button
                    href={selectedProject.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    startIcon={<GitHubIcon />}
                    sx={{
                      color: "#171717",
                      borderColor: "rgba(23,23,23,0.5)",
                      fontWeight: 800,
                    }}
                  >
                    GitHub
                  </Button>
                )}
              </Stack>
            </Stack>
          </DialogContent>
        )}
      </Dialog>
    </Box>
  );
};

export default ProjectsPage;
