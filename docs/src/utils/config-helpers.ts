/* eslint-disable @typescript-eslint/no-explicit-any */

import { slug } from 'github-slugger';
import { globSync } from 'glob';
import matter from 'gray-matter';
import { capitalize } from './string-utils.ts';

// Create custom sidebar which nests differently from directory structure
// can't seem to fish the menu type out of Astro's public exports
export function componentMenu(
	label: string = 'Components',
	mergeTopLevel: boolean = true,
	maxDepth: number = 1
): any[] {
	// Const sidebarItems = [];

	const menu: any = {
		items: [],
		label
	};

	// Would prefer to use `astro:content` here, but there's a chicken / egg problem
	// since `astro:content` depends on the config to know where to look for content
	globSync('src/content/docs/docs/components/*.mdx').map((file) => {
		const { data } = matter.read(file);

		let currentMenu = menu;

		const pathParts = data.componentData?.pathParts?.slice(0, maxDepth);
		for (const pathPart of pathParts) {
			let existingMenu = currentMenu.items?.find(
				(item: any) => item.label === capitalize(slug(pathPart))
			);

			if (!existingMenu) {
				existingMenu = {
					items: [],
					label: capitalize(slug(pathPart))
				};

				currentMenu.items?.unshift(existingMenu);
			}

			currentMenu = existingMenu;
		}

		currentMenu.items?.unshift({
			label: data.title,
			link: `/docs/components/${slug(data.componentData?.name)}`
		});

		return file;
	});

	// Custom sort order
	const sortOrder = ['core', 'control', 'monitor', 'extra'];

	menu.items?.sort((a: any, b: any) => {
		const aLabel = a.label.toLowerCase();
		const bLabel = b.label.toLowerCase();

		const aIndex = sortOrder.indexOf(aLabel);
		const bIndex = sortOrder.indexOf(bLabel);

		if (aIndex >= 0 && bIndex >= 0) {
			return aIndex - bIndex; // Both labels are in sortOrder
		}

		if (aIndex >= 0) {
			return -1; // Only aLabel is in sortOrder
		}

		if (bIndex >= 0) {
			return 1; // Only bLabel is in sortOrder
		}

		return aLabel.localeCompare(bLabel); // Neither label is in sortOrder, sort alphabetically
	});

	// Put all the second level items at the top level,
	// suffixed with the original top level label
	return mergeTopLevel
		? menu.items!.map((item: any) => ({
				items: item.items,
				label: `${item.label} ${menu.label}`
			}))
		: [menu];
}
