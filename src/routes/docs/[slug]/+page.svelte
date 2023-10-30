<script lang="ts" context="module">
	const getComponentPromise = (name: string) => {
		// $lib alias doesn't seem to work for dynamic imports
		return import(`../../../lib-docs/generated/examples/${name}Example.svelte`);
	};
</script>

<script lang="ts">
	import type { PageServerData } from './$types';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { SvelteComponent, onMount } from 'svelte';
	import type { PageData } from '../$types';
	export let data: PageServerData;

	// let exampleComponent: SvelteComponent | undefined;
</script>

<h2>{data.name}</h2>

{#await getComponentPromise(data.name) then exampleComponent}
	<svelte:component this={exampleComponent.default} />
{/await}
