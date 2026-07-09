/**
 * GitHub 댓글 위젯
 *
 * utterances로 GitHub Issues 기반 댓글 영역을 렌더링합니다
 */
import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { CONFIG } from "@/constants/config";

// 현재 블로그 테마에 맞는 utterances 테마
const getCommentsTheme = () => {
  return document.documentElement.dataset.blogTheme === "dark"
    ? "github-dark"
    : "github-light";
};

const GitHubComments = () => {
  const commentsRef = useRef<HTMLDivElement | null>(null);
  const [commentsTheme, setCommentsTheme] = useState(getCommentsTheme);

  useEffect(() => {
    // 블로그 다크모드 변경 감지
    const observer = new MutationObserver(() => {
      setCommentsTheme(getCommentsTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-blog-theme"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const commentsElement = commentsRef.current;

    if (!commentsElement) return;

    // utterances 스크립트 재렌더링
    commentsElement.innerHTML = "";

    const script = document.createElement("script");

    script.src = "https://utteranc.es/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("repo", CONFIG.COMMENTS_REPO);
    script.setAttribute("issue-term", "pathname");
    script.setAttribute("label", "blog-comment");
    script.setAttribute("theme", commentsTheme);

    commentsElement.appendChild(script);
  }, [commentsTheme]);

  return (
    <Box
      component="section"
      sx={{
        mt: { xs: 7, md: 9 },
        pt: { xs: 2.8, md: 3.4 },
        borderTop: "1px solid var(--blog-divider)",
      }}
    >
      {/* GitHub 로그인 댓글 영역 */}
      <Box
        ref={commentsRef}
        sx={{
          minHeight: 220,
          "& .utterances": {
            maxWidth: "100%",
            margin: 0,
          },
        }}
      />
    </Box>
  );
};

export default GitHubComments;
