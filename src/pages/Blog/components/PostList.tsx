/**
 * PostList 컴포넌트
 *
 * 포스트 배열을 받아 반응형 그리드 레이아웃으로 PostCard를 렌더링합니다.
 * - xs(모바일): 1열 (12/12 = 100%)
 * - sm(태블릿): 2열 (6/12 = 50%)
 * - md(데스크탑): 3열 (4/12 = 33%)
 *
 * MUI의 Grid 시스템은 12칸 기반이므로, size 값이 12를 어떻게 나누느냐에 따라 열 수가 결정됩니다.
 */
import Grid from "@mui/material/Grid";
import type { Post } from "../../../types/blog";
import PostCard from "./PostCard";

/** PostList의 props 타입 */
interface PostListProps {
  posts: Post[]; // 표시할 포스트 배열
}

const PostList = ({ posts }: PostListProps) => {
  return (
    // container: 이 Grid가 컨테이너 역할을 함 (자식 Grid를 배치)
    // spacing: 카드 사이의 간격 (3 = 24px)
    <Grid container spacing={3}>
      {posts.map((post) => (
        // size: MUI 7의 반응형 그리드 크기 설정
        // xs=12(모바일에서 전체 너비), sm=6(2열), md=4(3열)
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
          <PostCard post={post} />
        </Grid>
      ))}
    </Grid>
  );
};

export default PostList;
