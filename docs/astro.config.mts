import { componentMenu } from './src/utils/config-helpers';
import starlight from '@astrojs/starlight';
import svelte from '@astrojs/svelte';
import { defineConfig } from 'astro/config';

// declare this here for access inside
// fontPreloadLinks()
// note it must be manually applied in CSS url()s
// concatenating with a css var doesn't work
const BASE_URL = '/svelte-tweakpane-ui/';

process.env.BROWSER = 'google chrome';

// https://astro.build/config
export default defineConfig({
	base: BASE_URL,
	// experimental: {
	//   devOverlay: true,
	// },
	integrations: [
		// https://starlight.astro.build/reference/configuration/
		starlight({
			components: {
				EditLink: './src/components/docs/CustomEditLink.astro',
				Head: './src/components/docs/CustomHead.astro',
				MarkdownContent: './src/components/docs/CustomMarkdownContent.astro',
				PageTitle: './src/components/docs/CustomPageTitle.astro',
				TableOfContents: './src/components/docs/CustomTableOfContents.astro'
			},
			customCss: ['./src/style.css'],
			description: 'A Svelte Tweakpane UI component library.',
			editLink: {
				baseUrl: 'https://github.com/kitschpatrol/svelte-tweakpane-ui/edit/main/docs/'
			},
			lastUpdated: true,
			logo: {
				dark: './src/assets/svelte-tweakpane-ui-logo-dark.svg',
				light: './src/assets/svelte-tweakpane-ui-logo-light.svg'
			},
			sidebar: [
				{
					label: 'Overview',
					link: '/docs'
				},
				{
					label: 'Getting Started',
					link: '/docs/getting-started'
				},
				{
					label: 'Themes',
					link: '/docs/themes'
				},
				{
					label: 'Utilities',
					link: '/docs/utilities'
				},
				...componentMenu(),
				{
					label: 'Acknowledgments',
					link: '/docs/acknowledgments'
				}
			],
			social: {
				github: 'https://github.com/kitschpatrol/svelte-tweakpane-ui'
			},
			title: 'Svelte Tweakpane UI'
		}),
		svelte()
	],
	server: {
		open: true
	},

	site: 'https://kitschpatrol.com/svelte-tweakpane-ui'
	// pending https://github.com/withastro/starlight/pull/1023
	// trailingSlash: "never",
});
