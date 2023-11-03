import { createKitDocsLoader } from '@svelteness/kit-docs';
import type { LayoutLoad } from './$types';
import { base } from '$app/paths';

export const prerender = true;

export const load: LayoutLoad = createKitDocsLoader({
	sidebar: {
		[`${base}/`]: null,
		[`${base}/docs`]: '/docs'
	}
});
