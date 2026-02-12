export const extractExcerpt = (
  markdown: string,
  length: number = 150,
): string => {
  if (!markdown) return "";

  // Markdown 제거하고 본문만 추출
  const plain = markdown
    .replace(/#{1,6}\s/g, "") // 헤더 제거
    .replace(/\*\*(.+?)\*\*/g, "$1") // bold 제거
    .replace(/\[(.+?)\]\(.+?\)/g, "$1") // 링크 제거
    .trim();

  return plain.length > length ? plain.substring(0, length) + "..." : plain;
};
