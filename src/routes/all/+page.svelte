<script lang="ts">
	import type { PageServerData } from './$types';
	export let data: PageServerData;
</script>

<div style="width: 360px">
	{#each data.examples as example}
		<h3>{example.split('/').at(-1)}</h3>
		{#await import(`/${example}`) then exampleComponent}
			<svelte:component this={exampleComponent.default} /> {/await} {/each}
</div>
