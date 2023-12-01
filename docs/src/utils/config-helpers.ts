/* eslint-disable @typescript-eslint/no-explicit-any */
import { capitalize } from './string-utils.ts';
import { slug } from 'github-slugger';
import { globSync } from 'glob';
import matter from 'gray-matter';

// create custom sidebar which nests differently from directory structure
// can't seem to fish the menu type out of astro's public exports
export function componentMenu(
	label: string = 'Components',
	mergeTopLevel: boolean = true,
	maxDepth: number = 1
): any[] {
	// const sidebarItems = [];

	const menu: any = {
		items: [],
		label
	};

	// would prefer to use 'astro:content' here, but there's a chicken / egg problem
	// since astro:content depends on the config to know where to look for content
	globSync('src/content/docs/docs/components/*.mdx').map((file) => {
		const { data } = matter.read(file);

		let currentMenu = menu;
		data.componentData?.pathParts?.slice(0, maxDepth).forEach((pathPart: string) => {
			let existingMenu = currentMenu.items?.find((item: any) => {
				return item.label === capitalize(slug(pathPart));
			});

			if (!existingMenu) {
				existingMenu = {
					items: [],
					label: capitalize(slug(pathPart))
				};

				currentMenu.items?.unshift(existingMenu);
			}

			currentMenu = existingMenu;
		});

		currentMenu.items?.unshift({
			label: data.title,
			link: `/docs/components/${slug(data.componentData?.name)}`
		});
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
		} else if (aIndex >= 0) {
			return -1; // Only aLabel is in sortOrder
		} else if (bIndex >= 0) {
			return 1; // Only bLabel is in sortOrder
		} else {
			return aLabel.localeCompare(bLabel); // Neither label is in sortOrder, sort alphabetically
		}
	});

	if (mergeTopLevel) {
		// put all the second level items at the top level,
		// suffixed with the original top level label
		return menu.items!.map((item: any) => {
			return {
				items: item.items,
				label: `${item.label} ${menu.label}`
			};
		});
	} else {
		return [menu];
	}
}
