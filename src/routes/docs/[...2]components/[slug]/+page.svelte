<script lang="ts" context="module">
	// $lib alias doesn't seem to work for dynamic imports
	const getExampleComponentPromise = (name: string) => {
		return import(`../../../../lib-docs/generated/examples/${name}Example.svelte`);
	};

	const getExampleMarkdownPromise = (name: string) => {
		return import(`../../../../lib-docs/generated/markdown/${name}Example.svelte`);
	};
</script>

<script lang="ts">
	import type { PageServerData } from './$types';
	export let data: PageServerData;

	// has to be responsive...
	$: ({ component } = data);
</script>

<h1>{component.name}</h1>

<h2>Overview</h2>

{@html component.doc}

{#if component.jsDocs.example}
	<h2>Example</h2>

	{#await getExampleComponentPromise(component.name) then exampleComponent}
		<svelte:component this={exampleComponent.default} />
	{/await}

	{#await getExampleMarkdownPromise(component.name) then exampleMarkdown}
		<svelte:component this={exampleMarkdown.default} />
	{/await}
{/if}

<h2>Props</h2>

TBD
