/**
 * 이력서 페이지
 *
 * PDF 이력서 다운로드와 연락 링크를 제공하는 화면입니다
 */
import { Box, Button, Card, CardContent, Container, Stack, Typography } from "@mui/material";
import { CONFIG } from "@/constants/config";

const ResumePage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" fontWeight={700} gutterBottom>
          Resume
        </Typography>
        <Typography color="text.secondary">
          이력서는 PDF로 내려받을 수 있게 준비합니다.
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            HYUNA Resume
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            최신 이력서를 파일로 확인하고, 추가 문의는 이메일로 연락해주세요.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Button variant="contained" href="/resume.pdf" download>
              PDF 다운로드
            </Button>
            <Button variant="outlined" href={`mailto:${CONFIG.EMAIL}`}>
              이메일 보내기
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ResumePage;
