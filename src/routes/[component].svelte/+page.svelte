<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	// Uses dual-load approach for SSR:
	// https://learn.svelte.dev/tutorial/using-both-load-functions
</script>

<p><a href="/">Home</a></p>
<h3>{data.filename}</h3>
<svelte:component this={data.component} />
