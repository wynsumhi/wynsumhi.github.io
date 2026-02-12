/**
 * PostCard 컴포넌트
 *
 * 블로그 포스트 하나를 카드 형태로 표시합니다.
 * 썸네일, 카테고리, 제목, 요약, 날짜, 태그를 보여주며
 * 클릭하면 해당 포스트의 상세 페이지(/blog/:id)로 이동합니다.
 */
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Post } from "../../../types/blog";
import { formatDate, getRelativeTime } from "../../../utils/date";
import { extractExcerpt } from "../../../utils/markdown";

/** PostCard의 props 타입 - 표시할 포스트 데이터를 받음 */
interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  // useNavigate: 프로그래밍 방식으로 페이지를 이동하는 React Router 훅
  const navigate = useNavigate();

  /** 카드 클릭 시 해당 포스트 상세 페이지로 이동 */
  const handleClick = () => {
    navigate(`/blog/${post.id}`);
  };

  return (
    <Card
      sx={{
        height: "100%", // 그리드 안에서 동일한 높이 유지
        display: "flex",
        flexDirection: "column",
        cursor: "pointer", // 클릭 가능하다는 것을 마우스 커서로 표시
        transition: "all 0.3s ease", // 호버 애니메이션 부드럽게
        "&:hover": {
          transform: "translateY(-8px)", // 호버 시 위로 살짝 떠오르는 효과
          boxShadow: 6, // 호버 시 그림자 강조
        },
      }}
      onClick={handleClick}
    >
      {/* 썸네일 이미지 - thumbnail이 있을 때만 표시 */}
      {post.thumbnail && (
        <CardMedia
          component="img"
          height="200"
          image={post.thumbnail}
          alt={post.title}
          sx={{
            objectFit: "cover", // 이미지 비율 유지하면서 영역 채우기
            bgcolor: "grey.200", // 이미지 로딩 전 배경색
          }}
        />
      )}

      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        {/* 카테고리 칩 (예: Frontend, Backend) */}
        <Chip
          label={post.category}
          size="small"
          sx={{
            alignSelf: "flex-start", // 왼쪽 정렬
            mb: 1,
            bgcolor: "primary.main",
            color: "white",
            fontWeight: 600,
          }}
        />

        {/* 포스트 제목 - 최대 2줄까지만 표시하고 나머지는 ... 처리 */}
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            fontWeight: 700,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2, // 2줄까지만 표시
            WebkitBoxOrient: "vertical",
            mb: 1,
          }}
        >
          {post.title}
        </Typography>

        {/* 요약(excerpt) - 최대 3줄까지 표시 */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            flexGrow: 1, // 남는 공간을 차지하여 하단 요소 위치 고정
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3, // 3줄까지만 표시
            WebkitBoxOrient: "vertical",
            mb: 2,
          }}
        >
          {/* excerpt가 있으면 사용, 없으면 content에서 마크다운 제거 후 추출 */}
          {post.excerpt || extractExcerpt(post.content)}
        </Typography>

        {/* 하단 영역: 날짜 + 태그 */}
        <Box>
          {/* 작성일과 상대 시간 (예: "2026년 2월 10일 · 1일 전") */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 1 }}
          >
            {formatDate(post.date)} · {getRelativeTime(post.date)}
          </Typography>

          {/* 태그 목록 - 최대 3개만 표시, 나머지는 +N으로 표시 */}
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            {post.tags.slice(0, 3).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem" }}
              />
            ))}
            {/* 태그가 3개 초과일 때 남은 개수 표시 */}
            {post.tags.length > 3 && (
              <Chip
                label={`+${post.tags.length - 3}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem" }}
              />
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PostCard;
