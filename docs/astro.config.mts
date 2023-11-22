import { componentMenu } from './src/utils/config-helpers';
import starlight from '@astrojs/starlight';
import svelte from '@astrojs/svelte';
import { defineConfig } from 'astro/config';

process.env.BROWSER = 'google chrome';

// https://astro.build/config
export default defineConfig({
	base: '/svelte-tweakpane-ui/',
	// experimental: {
	//   devOverlay: true,
	// },
	// messes up pagefind index if we want to strip the .html
	// build: {
	// 	format: 'file'
	// },
	integrations: [
		// https://starlight.astro.build/reference/configuration/
		starlight({
			components: {
				EditLink: './src/components/docs/CustomEditLink.astro',
				Head: './src/components/docs/CustomHead.astro',
				MarkdownContent: './src/components/docs/CustomMarkdownContent.astro',
				PageTitle: './src/components/docs/CustomPageTitle.astro',
				Sidebar: './src/components/docs/CustomSidebar.astro',
				TableOfContents: './src/components/docs/CustomTableOfContents.astro'
			},
			customCss: ['./src/style.css'],
			description: 'A Svelte Tweakpane UI component library.',
			editLink: {
				baseUrl: 'https://github.com/kitschpatrol/svelte-tweakpane-ui/edit/main/docs/'
			},
			expressiveCode: {
				styleOverrides: {
					frames: {
						tooltipSuccessBackground: 'var(--sl-color-gray-3)'
					}
				}
				// themes: ['github-dark', 'github-light']
			},
			lastUpdated: true,
			// logo: {
			// 	dark: './src/assets/svelte-tweakpane-ui-logo-dark.svg',
			// 	light: './src/assets/svelte-tweakpane-ui-logo-light.svg'
			// },
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
	site: 'https://kitschpatrol.com/',
	trailingSlash: 'never'
});
