<script lang="ts">
	import type { PageServerData } from './$types';
	export let data: PageServerData;
</script>

<p><a href="/">Home</a></p>

<h3>{data.match.split('/').at(-1)}</h3>

{#await import(`/${data.match}`) then exampleComponent}
	<svelte:component this={exampleComponent.default} />
{/await}
