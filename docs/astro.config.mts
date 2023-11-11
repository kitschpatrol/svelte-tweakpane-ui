import { componentMenu, fontPreloadLinks } from "./src/utils/config-helpers";
import starlight from "@astrojs/starlight";
import svelte from "@astrojs/svelte";
import { defineConfig } from "astro/config";

// declare this here for access inside
// fontPreloadLinks()
// note it must be manually applied in CSS url()s
// concatenating with a css var doesn't work
const BASE_URL = "/svelte-tweakpane-ui/";

// https://astro.build/config
export default defineConfig({
  base: BASE_URL,
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
      // prevents FOUC
      head: fontPreloadLinks([
        `${BASE_URL}fonts/Inter-VF.roman-latin.woff2`,
        `${BASE_URL}fonts/Inter-VF.italic-latin.woff2`,
        `${BASE_URL}fonts/FiraCode-VF.woff2`,
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
        {
          label: "Acknowledgments",
          link: "/docs/acknowledgments",
        },
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
