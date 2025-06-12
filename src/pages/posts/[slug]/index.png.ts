import { getCollection, type CollectionEntry } from "astro:content";
import { OGImageRoute } from "astro-og-canvas";
import { SITE } from "@config";

// Get all posts
const posts = await getCollection("blog");

// Map posts to a list of slug's
const paths = posts.map((p: CollectionEntry<"blog">) => p.slug);

// Generate OG images for each post
export const { getStaticPaths, GET } = OGImageRoute({
  // A defined list of paths for which to generate an image
  paths: paths,

  // Use a url segment to determine the image's text
  param: "slug",

  // Provide a function to fetch the text for a given path
  getImageOptions: async (_path: string, slug: string) => {
    const post = posts.find(
      (p: CollectionEntry<"blog">) => p.slug === slug
    )!;

    return {
      title: post.data.title,
      description: post.data.description,
      // There are more options, but this will do for now
      bgImage: {
        path: `./src/assets/images/og-bg.png`,
      },
      padding: 100,
      font: {
        title: {
          color: [255, 255, 255],
          size: 70,
          weight: "Bold",
          families: ["Work Sans"],
        },
        description: {
          color: [224, 224, 224],
          size: 40,
          weight: "Regular",
          families: ["Inter"],
        },
      },
      fonts: [
        `https://api.fontshare.com/v2/css?f[]=work-sans@700&display=swap`,
        `https://api.fontshare.com/v2/css?f[]=inter@400&display=swap`,
      ],
    };
  },
});

export const prerender = true;