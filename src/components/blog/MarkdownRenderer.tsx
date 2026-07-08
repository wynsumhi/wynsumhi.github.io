/**
 * 마크다운 렌더러
 *
 * Notion에서 가져온 마크다운 본문을 블로그 본문 UI로 변환합니다
 */
import type { ReactNode } from "react";
import { Box, Link, Typography } from "@mui/material";

interface MarkdownRendererProps {
  content: string;
}

interface TableBlock {
  headers: string[];
  rows: string[][];
}

// 인라인 마크다운 변환
const renderInline = (text: string): ReactNode[] => {
  const nodes: ReactNode[] = [];
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*|!?\[[^\]]*]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const value = match[0];

    if (value.startsWith("`")) {
      nodes.push(
        <Box
          component="code"
          key={`${value}-${match.index}`}
          sx={{
            px: 0.55,
            py: 0.18,
            bgcolor: "#eff6ff",
            border: "1px solid #dbeafe",
            borderRadius: "5px",
            color: "#1d4ed8",
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            fontSize: "0.88em",
          }}
        >
          {value.slice(1, -1)}
        </Box>,
      );
    } else if (value.startsWith("**")) {
      nodes.push(
        <Box component="strong" key={`${value}-${match.index}`} sx={{ color: "#0f172a" }}>
          {value.slice(2, -2)}
        </Box>,
      );
    } else if (value.startsWith("![")) {
      const imageMatch = value.match(/!\[([^\]]*)]\(([^)]+)\)/);

      if (imageMatch) {
        nodes.push(
          <Box
            component="img"
            key={`${value}-${match.index}`}
            src={imageMatch[2]}
            alt={imageMatch[1]}
            sx={{
              width: "100%",
              maxHeight: 480,
              my: 2,
              objectFit: "cover",
              borderRadius: 2,
              display: "block",
            }}
          />,
        );
      }
    } else {
      const linkMatch = value.match(/\[([^\]]+)\]\(([^)]+)\)/);

      if (linkMatch) {
        nodes.push(
          <Link
            key={`${value}-${match.index}`}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{ color: "#2563eb", fontWeight: 700 }}
          >
            {linkMatch[1]}
          </Link>,
        );
      }
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
};

// 표 구문 확인
const parseTableBlock = (lines: string[], startIndex: number): TableBlock | null => {
  const headerLine = lines[startIndex];
  const separatorLine = lines[startIndex + 1];

  if (!headerLine?.includes("|") || !/^\s*\|?\s*:?-{3,}:?\s*\|/.test(separatorLine ?? "")) {
    return null;
  }

  const toCells = (line: string) =>
    line
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((cell) => cell.trim());

  const headers = toCells(headerLine);
  const rows: string[][] = [];

  for (let index = startIndex + 2; index < lines.length; index += 1) {
    if (!lines[index].includes("|") || lines[index].trim() === "") break;
    rows.push(toCells(lines[index]));
  }

  return { headers, rows };
};

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  const lines = content.split(/\r?\n/);
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      index += 1;
      continue;
    }

    // 코드블록
    if (trimmedLine.startsWith("```")) {
      const language = trimmedLine.replace("```", "").trim();
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }

      blocks.push(
        <Box
          component="pre"
          key={`code-${index}`}
          sx={{
            my: 3,
            p: { xs: 2, md: 2.4 },
            overflowX: "auto",
            bgcolor: "#0f172a",
            borderRadius: 2,
            color: "#e2e8f0",
            fontSize: "0.9rem",
            lineHeight: 1.75,
          }}
        >
          {language && (
            <Box component="span" sx={{ display: "block", mb: 1, color: "#93c5fd" }}>
              {language}
            </Box>
          )}
          <Box component="code">{codeLines.join("\n")}</Box>
        </Box>,
      );

      index += 1;
      continue;
    }

    // 표
    const tableBlock = parseTableBlock(lines, index);

    if (tableBlock) {
      blocks.push(
        <Box key={`table-${index}`} sx={{ my: 3, overflowX: "auto" }}>
          <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
            <Box component="thead">
              <Box component="tr">
                {tableBlock.headers.map((header) => (
                  <Box
                    component="th"
                    key={header}
                    sx={{
                      p: 1.4,
                      bgcolor: "#eff6ff",
                      border: "1px solid #dbeafe",
                      color: "#1e3a8a",
                      textAlign: "left",
                      fontWeight: 800,
                    }}
                  >
                    {renderInline(header)}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box component="tbody">
              {tableBlock.rows.map((row, rowIndex) => (
                <Box component="tr" key={`${row.join("-")}-${rowIndex}`}>
                  {row.map((cell, cellIndex) => (
                    <Box
                      component="td"
                      key={`${cell}-${cellIndex}`}
                      sx={{
                        p: 1.4,
                        border: "1px solid #e2e8f0",
                        color: "#475569",
                        lineHeight: 1.65,
                      }}
                    >
                      {renderInline(cell)}
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>,
      );

      index += tableBlock.rows.length + 2;
      continue;
    }

    // 이미지
    const imageMatch = trimmedLine.match(/^!\[([^\]]*)]\(([^)]+)\)$/);

    if (imageMatch) {
      blocks.push(
        <Box
          component="img"
          key={`image-${index}`}
          src={imageMatch[2]}
          alt={imageMatch[1]}
          sx={{
            width: "100%",
            maxHeight: 520,
            my: 3,
            objectFit: "cover",
            borderRadius: 2,
            display: "block",
          }}
        />,
      );
      index += 1;
      continue;
    }

    // 제목
    const headingMatch = trimmedLine.match(/^(#{1,6})\s(.+)$/);

    if (headingMatch) {
      const level = headingMatch[1].length;
      const fontSize = ["2rem", "1.6rem", "1.32rem", "1.12rem", "1rem", "0.95rem"][
        level - 1
      ];

      blocks.push(
        <Typography
          component={`h${level}` as "h1"}
          key={`heading-${index}`}
          sx={{
            mt: level <= 2 ? 4.4 : 3.2,
            mb: 1.4,
            color: "#0f172a",
            fontSize,
            fontWeight: 860,
            lineHeight: 1.35,
          }}
        >
          {renderInline(headingMatch[2])}
        </Typography>,
      );

      index += 1;
      continue;
    }

    // 인용문
    if (trimmedLine.startsWith(">")) {
      const quoteLines: string[] = [];

      while (index < lines.length && lines[index].trim().startsWith(">")) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }

      blocks.push(
        <Box
          key={`quote-${index}`}
          sx={{
            my: 3,
            pl: 2.2,
            py: 1,
            borderLeft: "3px solid #93c5fd",
            color: "#475569",
            bgcolor: "#f8fbff",
            borderRadius: "0 10px 10px 0",
            lineHeight: 1.8,
          }}
        >
          {quoteLines.map((quote) => (
            <Typography key={quote} sx={{ lineHeight: 1.8 }}>
              {renderInline(quote)}
            </Typography>
          ))}
        </Box>,
      );
      continue;
    }

    // 리스트
    if (/^[-*]\s+/.test(trimmedLine) || /^\d+\.\s+/.test(trimmedLine)) {
      const isOrdered = /^\d+\.\s+/.test(trimmedLine);
      const items: string[] = [];

      while (
        index < lines.length &&
        (isOrdered ? /^\d+\.\s+/.test(lines[index].trim()) : /^[-*]\s+/.test(lines[index].trim()))
      ) {
        items.push(lines[index].trim().replace(isOrdered ? /^\d+\.\s+/ : /^[-*]\s+/, ""));
        index += 1;
      }

      blocks.push(
        <Box
          component={isOrdered ? "ol" : "ul"}
          key={`list-${index}`}
          sx={{
            my: 2,
            pl: 3,
            color: "#334155",
            "& li": {
              mb: 0.8,
              lineHeight: 1.8,
            },
          }}
        >
          {items.map((item) => (
            <Box component="li" key={item}>
              {renderInline(item)}
            </Box>
          ))}
        </Box>,
      );
      continue;
    }

    // 구분선
    if (/^---+$/.test(trimmedLine)) {
      blocks.push(
        <Box
          key={`divider-${index}`}
          sx={{ my: 4, borderTop: "1px solid #e2e8f0" }}
        />,
      );
      index += 1;
      continue;
    }

    // 문단
    const paragraphLines = [trimmedLine];
    index += 1;

    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,6})\s/.test(lines[index].trim()) &&
      !lines[index].trim().startsWith("```") &&
      !lines[index].trim().startsWith(">") &&
      !/^[-*]\s+/.test(lines[index].trim()) &&
      !/^\d+\.\s+/.test(lines[index].trim())
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    blocks.push(
      <Typography
        key={`paragraph-${index}`}
        sx={{
          mb: 2,
          color: "#334155",
          fontSize: "0.98rem",
          lineHeight: 1.9,
          wordBreak: "break-word",
        }}
      >
        {renderInline(paragraphLines.join(" "))}
      </Typography>,
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 860,
        "& > :first-of-type": {
          mt: 0,
        },
      }}
    >
      {blocks}
    </Box>
  );
};

export default MarkdownRenderer;
