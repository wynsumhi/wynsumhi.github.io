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
import { useEffect, useMemo, useRef, useState } from "react";
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

// 빠른 필터는 자주 탐색할 대표 기술만 노출하고, 나머지는 검색으로 찾는다.
const FEATURED_TECH_FILTERS = [
  "TypeScript",
  "React",
  "Next.js",
  "MUI",
  "Vue.js",
  "Flutter",
  "Tailwind CSS",
  "Figma",
];

const FILTER_CONTROL_HEIGHT = 44;

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
          transform: "translateY(-2px)",
          borderColor: "rgba(217, 119, 6, 0.34)",
          boxShadow: "0 10px 24px rgba(45, 36, 23, 0.1)",
          "& .project-card-title": {
            color: "#7c4a03",
          },
          "& .project-card-image": {
            transform: "scale(1.025)",
          },
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
            transition: "transform 0.35s ease",
          }}
          className="project-card-image"
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
      <Stack spacing={1.55} sx={{ p: { xs: 2.2, md: 2.4 } }}>
        <Box>
          <Typography
            sx={{
              color: "#777167",
              fontSize: { xs: "0.84rem", md: "0.88rem" },
              fontWeight: 600,
              lineHeight: 1.45,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {formatProjectPeriod(project.period.start, project.period.end)}
          </Typography>
          <Typography
            className="project-card-title"
            variant="h6"
            fontWeight={800}
            sx={{
              mt: 0.75,
              color: "#171717",
              fontSize: { xs: "1.05rem", md: "1.14rem" },
              lineHeight: 1.38,
              transition: "color 0.2s",
              wordBreak: "keep-all",
            }}
          >
            {project.title}
          </Typography>
        </Box>

        <Typography
          sx={{
            color: "#625d54",
            fontSize: { xs: "0.92rem", md: "0.95rem" },
            lineHeight: 1.7,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
          }}
        >
          {project.description}
        </Typography>

        {/* 기술 태그 */}
        <Stack
          direction="row"
          gap={0.7}
          flexWrap="wrap"
          sx={{
            pt: 0.1,
            alignContent: "flex-start",
          }}
        >
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
                height: 24,
                fontSize: "0.72rem",
                fontWeight: 700,
                "& .MuiChip-label": {
                  px: 1,
                },
              }}
            />
          ))}
        </Stack>

        {/* 외부 링크 */}
        <Stack direction="row" gap={1} sx={{ pt: 0.25 }}>
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
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;

      if (currentScrollY < 120) {
        setIsFilterVisible(true);
      } else if (currentScrollY > lastScrollY + 8) {
        setIsFilterVisible(false);
      } else if (currentScrollY < lastScrollY - 8) {
        setIsFilterVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    lastScrollYRef.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 기술 필터 목록
  const techFilters = useMemo(() => {
    const techSet = new Set(projects.flatMap((project) => project.tech));

    return FEATURED_TECH_FILTERS.filter((tech) => techSet.has(tech));
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
      <Container maxWidth="lg" sx={{ pt: { xs: 9.5, sm: 10.5, md: 12 }, pb: { xs: 9, md: 14 }, px: { xs: 2, sm: 3 } }}>
        {/* 포트폴리오 복귀 버튼 */}
        <Box sx={{ mb: { xs: 2, md: 2.4 } }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(ROUTES.PORTFOLIO)}
            sx={{
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
        </Box>

        {/* 프로젝트 탐색 도구 */}
        <Stack
          spacing={1.2}
          sx={{
            position: { md: "sticky" },
            top: { md: 76 },
            zIndex: 4,
            mb: { xs: 2.6, md: 3.5 },
            p: { xs: 1.15, sm: 1.35, md: 1.5 },
            bgcolor: "rgba(251, 251, 248, 0.94)",
            border: "1px solid rgba(232, 227, 216, 0.9)",
            borderRadius: 2,
            backdropFilter: "blur(18px)",
            opacity: { xs: 1, md: isFilterVisible ? 1 : 0 },
            pointerEvents: { xs: "auto", md: isFilterVisible ? "auto" : "none" },
            transform: {
              xs: "none",
              md: isFilterVisible ? "translateY(0)" : "translateY(calc(-100% - 18px))",
            },
            transition: "transform 0.22s ease, opacity 0.18s ease",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 0.85, sm: 1 }}
            alignItems={{ xs: "stretch", sm: "center" }}
            sx={{ flexWrap: { sm: "wrap", md: "nowrap" } }}
          >
            <ToggleButtonGroup
              exclusive
              value={kindFilter}
              onChange={(_, value: ProjectKindFilter | null) => {
                if (value) setKindFilter(value);
              }}
              sx={{
                flexShrink: 0,
                height: FILTER_CONTROL_HEIGHT,
                width: { xs: "100%", sm: "auto" },
                "& .MuiToggleButtonGroup-grouped": {
                  flex: { xs: 1, sm: "0 0 auto" },
                },
                "& .MuiToggleButton-root": {
                  minWidth: { xs: 0, sm: 62 },
                  height: FILTER_CONTROL_HEIGHT,
                  px: { xs: 1, md: 1.45 },
                  py: 0,
                  color: "#625d54",
                  borderColor: "#e8e3d8",
                  fontSize: "0.84rem",
                  fontWeight: 900,
                  lineHeight: 1,
                  textTransform: "none",
                  whiteSpace: "nowrap",
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
                flex: "1 1 280px",
                minWidth: { xs: 0, sm: 260 },
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#fff",
                  borderRadius: 1.5,
                  fontWeight: 700,
                  height: FILTER_CONTROL_HEIGHT,
                },
                "& .MuiInputBase-input": {
                  height: FILTER_CONTROL_HEIGHT,
                  boxSizing: "border-box",
                  py: 0,
                },
              }}
            />

            <Select
              value={sortType}
              onChange={(event) => setSortType(event.target.value as ProjectSortType)}
              sx={{
                width: { xs: "100%", sm: 132 },
                flexShrink: 0,
                height: FILTER_CONTROL_HEIGHT,
                bgcolor: "#fff",
                borderRadius: 1.5,
                fontSize: "0.86rem",
                fontWeight: 800,
                "& .MuiSelect-select": {
                  height: FILTER_CONTROL_HEIGHT,
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  py: 0,
                },
              }}
            >
              <MenuItem value="latest">최신순</MenuItem>
              <MenuItem value="oldest">오래된순</MenuItem>
              <MenuItem value="title">이름순</MenuItem>
            </Select>
          </Stack>

          {/* 기술 빠른 필터 */}
          <Stack
            direction="row"
            gap={{ xs: 0.55, sm: 0.65 }}
            sx={{
              flexWrap: "wrap",
              pt: { xs: 0.15, sm: 0 },
              "& .MuiChip-root": {
                flexShrink: 0,
              },
            }}
          >
            <Chip
              label="All"
              clickable
              onClick={() => setSelectedTech("all")}
              sx={{
                height: { xs: 26, sm: 28 },
                bgcolor: selectedTech === "all" ? "#171717" : "#fff",
                color: selectedTech === "all" ? "#fff" : "#625d54",
                border: "1px solid #e8e3d8",
                borderRadius: "5px",
                fontSize: { xs: "0.72rem", sm: "0.76rem" },
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
                  height: { xs: 26, sm: 28 },
                  bgcolor: selectedTech === tech ? "#171717" : "#fff",
                  color: selectedTech === tech ? "#fff" : "#625d54",
                  border: "1px solid #e8e3d8",
                  borderRadius: "5px",
                  fontSize: { xs: "0.72rem", sm: "0.76rem" },
                  fontWeight: 800,
                }}
              />
            ))}
          </Stack>
        </Stack>

        {/* 프로젝트 검색 결과 */}
        <Stack spacing={2.6}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.4}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
          >
            <Typography sx={{ color: "#8a8175", fontWeight: 850 }}>
              {filteredProjects.length}개의 프로젝트
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
