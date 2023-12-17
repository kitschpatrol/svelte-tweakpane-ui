<script lang="ts">
	import type { PageServerData } from './$types';
	export let data: PageServerData;
</script>

<div style="width: 360px">
	{#each data.examples as example}
		{@const filename = example.split('/').at(-1)}
		{@const folder = example.split('/').slice(2, -1).join('/')}
		{@const component = filename?.split('.').slice(0, -1).join('.')}
		<h3>{filename}</h3>
		{#await import(`../../examples/${folder}/${component}.svelte`) then exampleComponent}
			<svelte:component this={exampleComponent.default} />
		{/await}
	{/each}
</div>
