<script lang="ts">
	import type { PageData } from './$types'
	export let data: PageData
</script>

<div style="width: 360px">
	{#each data.components as componentData}
		<h3>{componentData.filename}</h3>
		<svelte:component this={componentData.component} />
	{/each}
</div>
