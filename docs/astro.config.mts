import { componentMenu } from './src/utils/config-helpers';
import starlight from '@astrojs/starlight';
import svelte from '@astrojs/svelte';
import { defineConfig } from 'astro/config';

process.env.BROWSER = 'chromium';

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
				EditLink: './src/components/overrides/EditLink.astro',
				Head: './src/components/overrides/Head.astro',
				MarkdownContent: './src/components/overrides/MarkdownContent.astro',
				PageTitle: './src/components/overrides/PageTitle.astro',
				TableOfContents: './src/components/overrides/TableOfContents.astro',
				ThemeSelect: './src/components/overrides/ThemeSelect.astro'
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
				github: 'https://github.com/kitschpatrol/svelte-tweakpane-ui',
				mastodon: 'https://mastodon.social/@kitschpatrol'
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
