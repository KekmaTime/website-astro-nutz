import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Zacherina",
  EMAIL: "22am014@sctce.ac.in",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Zacherina is a software engineer who loves breaking and building things.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "Random thoughts and interesting ideas worth sharing.",
};

export const WORK: Metadata = {
  TITLE: "Experience",
  DESCRIPTION: "My professional journey and experiences.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "Cool Projects ig idk man.",
};

export const SOCIALS: Socials = [
  { 
    NAME: "discord",
    HREF: "https://discordapp.com/users/1093592290959818764"
  },
  { 
    NAME: "github",
    HREF: "https://github.com/kekmatime"
  },
  { 
    NAME: "linkedin",
    HREF: "https://www.linkedin.com/in/ananth-prathap"
  }
];
