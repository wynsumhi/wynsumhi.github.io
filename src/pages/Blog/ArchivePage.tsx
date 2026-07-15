/**
 * 아카이브 페이지
 *
 * 블로그 글을 연도, 카테고리 기준으로 모아보는 화면입니다
 */
import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { usePosts } from "@/hooks/usePosts";
import { formatDate } from "@/utils/date";
import { removeFullTextDetails } from "@/utils/markdown";

const ALL = "all";

const ArchivePage = () => {
  const navigate = useNavigate();
  const { posts, loading, error } = usePosts();
  const [year, setYear] = useState(ALL);
  const [category, setCategory] = useState(ALL);
  const [keyword, setKeyword] = useState("");

  const publishedPosts = useMemo(
    () => posts.filter((post) => post.published),
    [posts],
  );

  const years = useMemo(
    () =>
      Array.from(
        new Set(
          publishedPosts.map((post) =>
            new Date(post.date).getFullYear().toString(),
          ),
        ),
      ).sort((a, b) => Number(b) - Number(a)),
    [publishedPosts],
  );

  const categories = useMemo(
    () =>
      Array.from(new Set(publishedPosts.map((post) => post.category))).sort(),
    [publishedPosts],
  );

  const filteredPosts = useMemo(() => {
    const lowerKeyword = keyword.trim().toLowerCase();

    return publishedPosts
      .filter((post) => {
        const visibleContent = removeFullTextDetails(post.content);
        const postYear = new Date(post.date).getFullYear().toString();
        const matchesYear = year === ALL || postYear === year;
        const matchesCategory = category === ALL || post.category === category;
        const matchesKeyword =
          lowerKeyword.length === 0 ||
          post.title.toLowerCase().includes(lowerKeyword) ||
          visibleContent.toLowerCase().includes(lowerKeyword);

        return matchesYear && matchesCategory && matchesKeyword;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [category, keyword, publishedPosts, year]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography>로딩 중...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h2" fontWeight={700} gutterBottom>
          Archives
        </Typography>
        <Typography color="text.secondary">
          작성한 글을 연도와 카테고리로 찾아봅니다.
        </Typography>
      </Box>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <TextField
          label="검색"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>연도</InputLabel>
          <Select
            label="연도"
            value={year}
            onChange={(event) => setYear(event.target.value)}
          >
            <MenuItem value={ALL}>전체</MenuItem>
            {years.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>카테고리</InputLabel>
          <Select
            label="카테고리"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <MenuItem value={ALL}>전체</MenuItem>
            {categories.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Stack spacing={1.5}>
        {filteredPosts.map((post) => (
          <Box
            key={post.id}
            onClick={() => navigate(`/blog/${post.id}`)}
            sx={{
              p: 2.5,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              cursor: "pointer",
              "&:hover": { borderColor: "primary.main" },
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              {post.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {formatDate(post.date)} · {post.category}
            </Typography>
          </Box>
        ))}
      </Stack>

      {filteredPosts.length === 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          조건에 맞는 글이 없습니다.
        </Alert>
      )}
    </Container>
  );
};

export default ArchivePage;
