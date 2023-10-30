<script lang="ts" context="module">
	const getComponentPromise = (name: string) => {
		// $lib alias doesn't seem to work for dynamic imports
		return import(`../../../lib-docs/generated/examples/${name}Example.svelte`);
	};
</script>

<script lang="ts">
	import type { PageServerData } from './$types';
	export let data: PageServerData;
</script>

<h2>{data.name}</h2>

{#await getComponentPromise(data.name) then exampleComponent}
	<svelte:component this={exampleComponent.default} />
{/await}
