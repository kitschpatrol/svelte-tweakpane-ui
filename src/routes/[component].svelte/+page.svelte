<script lang="ts">
	import type { PageServerData } from './$types';
	export let data: PageServerData;

	const filename = data.match.split('/').at(-1);
	const folder = data.match.split('/').slice(2, -1).join('/');
	const component = filename?.split('.').slice(0, -1).join('.');
</script>

<p><a href="/">Home</a></p>

<h3>{filename}</h3>

{#await import(`../../examples/${folder}/${component}.svelte`) then exampleComponent}
	<svelte:component this={exampleComponent.default} />
{/await}
