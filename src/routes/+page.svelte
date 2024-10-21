<script lang="ts">
	import type { PageServerData } from './$types';
	export let data: PageServerData;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	$: version = typeof window !== 'undefined' && [...(window as unknown as any).__svelte.v][0];
</script>

<h1>svelte-tweakpane-ui</h1>
<h2>Svelte {version}</h2>
<strong>
	This is a scratch pad for development and integration testing, you probably want the <a
		href="https://kitschpatrol.com/svelte-tweakpane-ui">documentation</a
	> instead.
</strong>

<p><a href="/all">View all examples on one page.</a></p>
<h2>Examples</h2>
<ul>
	{#each data.examples as example}
		{@const componentName = example.split('/').at(-1)}
		<li><a href={componentName}>{componentName}</a></li>
	{/each}
</ul>
