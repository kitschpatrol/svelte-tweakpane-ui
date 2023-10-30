import type { PageLoad } from './$types';
export const prerender = false;

const getComponentPromise = (name: string) => {
	// $lib alias doesn't seem to work for dynamic imports
	return import(`../../../lib-docs/generated/examples/${name}Example.svelte`);
};

export const load = (async ({ data }) => {
	// Load all required components here
	// const componentsToLoad: any[] = [];

	// componentsToLoad.push(data.name);

	// const components: any = {};

	// // TODO: Can be refactored to Promise.all()
	// for (const component of [...new Set(componentsToLoad)]) {
	// 	// Remove duplicates
	// 	console.log('Loading ', component);
	// 	components[component] = ;
	// }

	return {
		component: (await getComponentPromise(data.name)).default,
		name: data.name // Pass on the data from +page.server.ts
	};
}) satisfies PageLoad;
