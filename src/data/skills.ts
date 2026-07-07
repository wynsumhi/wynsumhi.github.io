/**
 * 기술 스택 데이터
 *
 * 포트폴리오 페이지에 표시할 기술 역량 목록입니다
 */
import type { Skill } from "@/types/portfolio";

export const skills: Skill[] = [
  {
    category: "Frontend",
    items: [
      { name: "HTML/CSS/SCSS", level: 4 },
      { name: "JavaScript", level: 4 },
      { name: "TypeScript", level: 3 },
      { name: "React", level: 3 },
      { name: "Vue.js", level: 3 },
      { name: "Next.js", level: 2 },
      { name: "Tailwind CSS", level: 3 },
      { name: "Flutter/Dart", level: 2 },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js/Express", level: 2 },
      { name: "Python/Django", level: 2 },
      { name: "MySQL/PostgreSQL", level: 2 },
      { name: "REST API", level: 3 },
    ],
  },
  {
    category: "DevOps",
    items: [
      { name: "Git/GitHub", level: 3 },
      { name: "GitLab", level: 2 },
      { name: "GitHub Actions", level: 2 },
      { name: "GitHub Pages", level: 3 },
    ],
  },
  {
    category: "Design",
    items: [
      { name: "Figma", level: 4 },
      { name: "UI/UX 기획", level: 3 },
      { name: "Notion", level: 4 },
      { name: "Slack", level: 3 },
    ],
  },
];
