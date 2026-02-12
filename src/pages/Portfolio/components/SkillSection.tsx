/**
 * SkillSection 컴포넌트
 *
 * 기술 스택을 카테고리별로 그룹화하여 표시합니다.
 * 각 기술의 숙련도(level 1~5)를 LinearProgress 바로 시각화합니다.
 *
 * MUI 주요 컴포넌트:
 * - Paper: 카드와 비슷한 표면(배경 + 그림자)을 제공
 * - LinearProgress: 진행률 바 (여기서는 숙련도 표시용)
 * - Grid: 반응형 레이아웃
 */
import { Box, Typography, LinearProgress, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";
import type { Skill } from "../../../types/portfolio";

/** SkillSection의 props 타입 */
interface SkillSectionProps {
  skills: Skill[]; // 카테고리별로 그룹화된 기술 스택 배열
}

const SkillSection = ({ skills }: SkillSectionProps) => {
  return (
    <Grid container spacing={3}>
      {skills.map((skillGroup) => (
        // 각 카테고리를 카드 형태로 표시
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={skillGroup.category}>
          <Paper sx={{ p: 3, height: "100%" }}>
            {/* 카테고리 제목 (예: Frontend, Backend) */}
            <Typography variant="h6" fontWeight={700} gutterBottom>
              {skillGroup.category}
            </Typography>

            {/* 해당 카테고리의 기술 목록 */}
            {skillGroup.items.map((item) => (
              <Box key={item.name} sx={{ mb: 2 }}>
                {/* 기술명과 레벨 표시 */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2">{item.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.level}/5
                  </Typography>
                </Box>

                {/* 숙련도 프로그레스 바 (level 1~5를 0~100%로 변환) */}
                <LinearProgress
                  variant="determinate" // 고정 값 표시 모드 (vs indeterminate: 무한 로딩)
                  value={(item.level / 5) * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            ))}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default SkillSection;
