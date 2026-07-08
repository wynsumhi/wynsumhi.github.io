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
      { name: "HTML5", level: 4 },
      { name: "CSS3·SCSS", level: 4 },
      { name: "JavaScript(ES6+)", level: 4 },
      { name: "TypeScript", level: 3 },
      { name: "React", level: 3 },
      { name: "Next.js", level: 2 },
      { name: "Vue.js", level: 3 },
      { name: "Tailwind CSS", level: 3 },
      { name: "GSAP", level: 3 },
      { name: "Chart.js", level: 2 },
      { name: "Flutter/Dart", level: 2 },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js/Express", level: 2 },
      { name: "Django REST Framework", level: 2 },
      { name: "Java/Spring Boot", level: 2 },
      { name: "MySQL", level: 2 },
      { name: "PostgreSQL", level: 2 },
      { name: "MariaDB", level: 2 },
      { name: "REST API", level: 3 },
    ],
  },
  {
    category: "DevOps",
    items: [
      { name: "GitHub", level: 3 },
      { name: "GitLab", level: 2 },
      { name: "GitHub Actions", level: 2 },
      { name: "GitHub Pages", level: 3 },
      { name: "Postman", level: 3 },
      { name: "VSCode", level: 4 },
    ],
  },
  {
    category: "Design",
    items: [
      { name: "Figma", level: 4 },
      { name: "Photoshop", level: 3 },
      { name: "Illustrator", level: 3 },
      { name: "Zeplin", level: 3 },
      { name: "Adobe XD", level: 2 },
      { name: "Notion", level: 4 },
      { name: "Slack/Teams", level: 3 },
    ],
  },
];
