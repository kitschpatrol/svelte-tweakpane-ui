<script lang="ts">
	import '@svelteness/kit-docs/client/polyfills/index.js';
	import '@svelteness/kit-docs/client/styles/normalize.css';
	import '@svelteness/kit-docs/client/styles/fonts.css';
	import '@svelteness/kit-docs/client/styles/theme.css';
	import '@svelteness/kit-docs/client/styles/vars.css';

	import type { LayoutData } from './$types';

	import type { NavbarConfig, ResolvedSidebarConfig } from '@svelteness/kit-docs';

	import { page } from '$app/stores';
	import SvelteLogo from '$img/svelte-horizontal.svg?raw';

	import { Button, KitDocs, KitDocsLayout, createSidebarContext } from '@svelteness/kit-docs';

	function augmentSidebar(sidebar?: ResolvedSidebarConfig) {
		if (sidebar) {
			sidebar.links['Components'] = [
				{
					title: 'bla',
					slug: '/docs/components/bla'
				}
			];
		}
		return undefined;
	}

	export let data: LayoutData;

	$: ({ meta, sidebar } = data);

	const navbar: NavbarConfig = {
		links: [{ title: 'Documentation', slug: '/docs', match: /\/docs/ }]
	};

	const { activeCategory } = createSidebarContext(sidebar);

	$: category = $activeCategory ? `${$activeCategory}: ` : '';
	$: title = meta ? `${category}${meta.title} | Svelte Tweakpane UI` : null;
	$: description = meta?.description;
</script>

<svelte:head>
	{#key $page.url.pathname}
		{#if title}
			<title>{title}</title>
		{/if}
		{#if description}
			<meta name="description" content={description} />
		{/if}
	{/key}
</svelte:head>

<KitDocs {meta}>
	<KitDocsLayout {navbar} {sidebar}>
		<div class="logo" slot="navbar-left">
			<Button href="/">
				{@html SvelteLogo}
			</Button>
		</div>
		<slot />
	</KitDocsLayout>
</KitDocs>

<style>
	:global(:root) {
		--kd-color-brand-rgb: 233, 127, 6;
	}

	:global(:root.dark) {
		--kd-color-brand-rgb: 213, 149, 76;
	}

	.logo :global(a) {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.logo :global(svg) {
		height: 36px;
		overflow: hidden;
	}

	/* KitDocs overrides */

	/* Do not change the dimensions of links on hover */
	:global(.hover\:font-medium:hover) {
		font-weight: unset;
	}

	/* Do not blur backgrounds  */
	:global(.blur-bg) {
		backdrop-filter: unset !important;
		background-color: rgb(var(--kd-color-body) / 1);
	}

	/* :global(.backdrop-blur-sm) {
		backdrop-filter: unset;
	} */

	/* Fix for white scrollbar corner on chrome */
	/* https://stackoverflow.com/questions/35968553/webkit-scrollbar-css-always-a-white-box-in-corner */
	:global(::-webkit-scrollbar-corner) {
		background-color: transparent;
	}

	/* Remove excessive code backticking */
	:global(code::before),
	:global(code::after) {
		content: none !important;
	}

	/* Remove leading padding on tables */
	:global(
			.prose
				:where(tbody tr td:first-child code):not(
					:where([class~='not-prose'], [class~='not-prose'] *)
				)
		) {
		/* color: #6366f1; */
		padding-left: unset;
	}
</style>
