import { SITE } from "./src/config";
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import rehypeMermaid from 'rehype-mermaid';
import addMermaidClass from './add-mermaid-classname';

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [tailwind({
    applyBaseStyles: false,
  }), react(), sitemap(), mdx()],
  markdown: {
    remarkPlugins: [
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    rehypePlugins: [
      addMermaidClass,
      [rehypeMermaid, {
        strategy: 'img-svg',
        dark: true
      }],
    ],
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "min-light", dark: "night-owl" },
      wrap: true,
    },
  },
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  scopedStyleStrategy: "where",
  build: {
    format: "directory"
  },
  experimental: {
    contentLayer: true,
  },
});