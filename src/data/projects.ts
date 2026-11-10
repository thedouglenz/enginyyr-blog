/**
 * Portfolio entries shown on the homepage. To add a project: drop a
 * 1200x630 image in public/assets/projects/ and add one object below.
 * Order here is display order. Leave `href` unset for "coming-soon".
 */
export type ProjectStatus = "live" | "coming-soon";

export interface Project {
  name: string;
  /** One or two lines, taken from the project's own site. */
  description: string;
  status: ProjectStatus;
  /** Public URL (own domain or *.enginyyr.com). Omit while not live. */
  href?: string;
  /** Path under public/, e.g. /assets/projects/garrison.png */
  image?: string;
  imageAlt?: string;
}

export const PROJECTS: Project[] = [
  {
    name: "Garrison",
    description:
      "Get more done with Claude Code and Codex. Command your agent fleet from one board: see what's working, handle what needs you, and review what's ready.",
    status: "live",
    href: "https://garrison.enginyyr.com",
    image: "/assets/projects/garrison.png",
    imageAlt: "Garrison: command your agent fleet",
  },
  {
    name: "Grove",
    description:
      "The enterprise AI workflow orchestration platform. Build DAG-based workflows, route across LLM providers, deploy in your own cloud.",
    status: "live",
    href: "https://grove.enginyyr.com",
    image: "/assets/projects/grove.png",
    imageAlt: "Grove: enterprise AI workflow orchestration",
  },
  {
    name: "Massive",
    description:
      "Agent-to-agent mail for engineering teams. Carries messages between AI coding agent sessions on different people's machines, with people in charge of approval.",
    status: "live",
    href: "https://massive.enginyyr.com",
    image: "/assets/projects/massive.png",
    imageAlt: "massive: agent-to-agent mail for engineering teams",
  },
  {
    name: "Lunar Canoe",
    description:
      "A storyboard for AI video: re-roll any shot without disturbing its neighbours.",
    status: "live",
    href: "https://lunarcanoe.com",
    image: "/assets/projects/lunar-canoe.png",
    imageAlt: "Lunar Canoe: make a film shot by shot",
  },
  {
    name: "Trailhead",
    description:
      "A RAG backend that retrieves from multiple views to deliver precise, citation-backed answers from your knowledge base.",
    status: "live",
    href: "https://trailhead.enginyyr.com",
    image: "/assets/projects/trailhead.png",
    imageAlt: "Trailhead: intelligent document Q&A",
  },
  {
    name: "Orbit",
    description:
      "The daily semantic word guessing game. Find the secret word by guessing related concepts and navigating through semantic space.",
    status: "live",
    href: "https://orbit.llm-games.com",
    image: "/assets/projects/orbit.jpg",
    imageAlt: "Orbit: the daily semantic word guessing challenge",
  },
  {
    name: "Langoliers",
    description: "Not live yet.",
    status: "coming-soon",
    // href: "https://langoliers.enginyyr.com", // enable when live (no DNS record as of 2026-11-09)
  },
];
