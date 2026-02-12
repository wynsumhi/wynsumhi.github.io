/**
 * 기술 스택 데이터
 *
 * 포트폴리오 페이지에 표시할 기술 스택 목록입니다.
 * level은 1(입문) ~ 5(고급)으로 숙련도를 나타냅니다.
 *
 * 새 기술을 추가하려면:
 * 1. 기존 카테고리에 items 배열에 추가하거나
 * 2. 새 카테고리 객체를 배열에 추가하면 됩니다.
 */
import type { Skill } from "../types/portfolio";

export const skills: Skill[] = [
  {
    category: "Frontend",
    items: [
      { name: "HTML/CSS", level: 3 },
      { name: "JavaScript", level: 3 },
      { name: "TypeScript", level: 2 },
      { name: "React", level: 2 },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js", level: 2 },
      { name: "Python", level: 2 },
    ],
  },
  {
    category: "DevOps",
    items: [
      { name: "Git", level: 3 },
      { name: "GitHub Actions", level: 2 },
    ],
  },
];
