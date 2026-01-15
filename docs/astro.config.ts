/* eslint-disable ts/naming-convention */
// @case-police-ignore blueSky

import starlight from '@astrojs/starlight'
import svelte from '@astrojs/svelte'
import { defineConfig } from 'astro/config'
import { componentMenu } from './src/utils/config-helpers'
process.env.BROWSER = 'chromium'

// https://astro.build/config
export default defineConfig({
	base: '/svelte-tweakpane-ui',
	compressHTML: true,
	// Messes up pagefind index if we want to strip the .html
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
				ThemeSelect: './src/components/overrides/ThemeSelect.astro',
			},
			customCss: ['./src/style.css'],
			description: 'A Svelte Tweakpane UI component library.',
			editLink: {
				baseUrl: 'https://github.com/kitschpatrol/svelte-tweakpane-ui/edit/main/docs/',
			},
			expressiveCode: {
				styleOverrides: {
					codeLineHeight: '1.65',
					frames: {
						tooltipSuccessBackground: 'var(--sl-color-gray-3)',
					},
				},
				// Themes: ['github-dark', 'github-light']
			},
			lastUpdated: true,
			// Logo: {
			// 	dark: './src/assets/svelte-tweakpane-ui-logo-dark.svg',
			// 	light: './src/assets/svelte-tweakpane-ui-logo-light.svg'
			// },
			sidebar: [
				{
					label: 'Overview',
					link: '/docs',
				},
				{
					label: 'Getting Started',
					link: '/docs/getting-started',
				},
				{
					label: 'Features',
					link: '/docs/features',
				},
				{
					label: 'Plugins',
					link: '/docs/plugins',
				},
				{
					label: 'Themes',
					link: '/docs/themes',
				},
				{
					label: 'Utilities',
					link: '/docs/utilities',
				},
				// eslint-disable-next-line ts/no-unsafe-assignment
				...componentMenu(),
				{
					label: 'Acknowledgments',
					link: '/docs/acknowledgments',
				},
			],
			social: [
				{
					href: 'https://github.com/kitschpatrol/svelte-tweakpane-ui',
					icon: 'github',
					label: 'GitHub',
				},
				{ href: 'https://x.com/kitschpatrol', icon: 'x.com', label: 'X' },
				// Maybe later
				// { href: 'https://mastodon.social/@kitschpatrol', icon: 'mastodon', label: 'Mastodon' },
				// {
				// 	href: 'https://bsky.app/profile/kitschpatrol.bsky.social',
				// 	icon: 'blueSky',
				// 	label: 'Bluesky',
				// },
			],
			title: 'Svelte Tweakpane UI',
		}),
		svelte({}),
	],
	outDir: './dist/svelte-tweakpane-ui',
	server: {
		open: true,
	},
	site: 'https://kitschpatrol.com/',
	trailingSlash: 'never',
	vite: {
		ssr: {
			// https://github.com/withastro/astro/issues/8660
			noExternal: ['nanoid'],
		},
	},
})
