/* eslint-disable @typescript-eslint/no-explicit-any */
import type { StarlightConfig } from "@astrojs/starlight/types";
import { slug } from "github-slugger";
import { globSync } from "glob";
import matter from "gray-matter";
import { capitalize } from "lodash-es";

export function fontPreloadLinks(fonts: string[]): StarlightConfig["head"] {
  return fonts.map((font) => {
    return {
      attrs: {
        as: "font",
        crossorigin: true,
        href: font,
        rel: "preload",
        type: "font/woff2",
      },
      content: "",
      tag: "link",
    };
  });
}

// create custom sidebar which nests differently from directory structure
// can't seem to fish the menu type out of astro's public exports
export function componentMenu(
  label: string = "Components",
  mergeTopLevel: boolean = true,
  maxDepth: number = 1,
): any[] {
  // const sidebarItems = [];

  const menu: any = {
    items: [],
    label,
  };

  globSync("src/content/docs/docs/components/*.md").map((file) => {
    const { data } = matter.read(file);

    let currentMenu = menu;
    data.componentData?.pathParts
      ?.slice(0, maxDepth)
      .forEach((pathPart: string) => {
        let existingMenu = currentMenu.items?.find((item: any) => {
          return item.label === capitalize(slug(pathPart));
        });

        if (!existingMenu) {
          existingMenu = {
            items: [],
            label: capitalize(slug(pathPart)),
          };

          currentMenu.items?.unshift(existingMenu);
        }

        currentMenu = existingMenu;
      });

    currentMenu.items?.unshift({
      label: data.componentData?.name,
      link: `/docs/components/${slug(data.componentData?.name)}`,
    });
  });

  if (mergeTopLevel) {
    // put all the second level items at the top level,
    // suffixed with the original top level label
    return menu.items!.map((item: any) => {
      return {
        items: item.items,
        label: `${item.label} ${menu.label}`,
      };
    });
  } else {
    return [menu];
  }
}
