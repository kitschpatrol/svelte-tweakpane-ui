import { componentMenu, fontPreloadLinks } from "./src/utils/config-helpers";
import starlight from "@astrojs/starlight";
import svelte from "@astrojs/svelte";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [
    // https://starlight.astro.build/reference/configuration/
    starlight({
      components: {
        EditLink: "./src/components/docs/CustomEditLink.astro",
        MarkdownContent: "./src/components/docs/CustomMarkdownContent.astro",
        TableOfContents: "./src/components/docs/CustomTableOfContents.astro",
      },
      customCss: ["./src/style.css"],
      description: "A Svelte Tweakpane UI component library.",
      editLink: {
        baseUrl:
          "https://github.com/kitschpatrol/svelte-tweakpane-ui/edit/main/docs/",
      },
      head: fontPreloadLinks([
        "/fonts/Inter-VF.roman-latin.woff2",
        "/fonts/Inter-VF.italic-latin.woff2",
        "/fonts/FiraCode-VF.woff2",
      ]),
      sidebar: [
        {
          label: "Overview",
          link: "/docs",
        },
        {
          label: "Getting Started",
          link: "/docs/getting-started",
        },
        {
          label: "Themes",
          link: "/docs/themes",
        },
        {
          label: "Utilities",
          link: "/docs/utilities",
        },
        ...componentMenu(),
      ],
      social: {
        github: "https://github.com/kitschpatrol/svelte-tweakpane-ui",
      },
      title: "svelte-tweakpane-ui",
    }),
    svelte(),
  ],
  // pending https://github.com/withastro/starlight/pull/1023
  // trailingSlash: "never",
});
