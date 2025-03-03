<script lang="ts">
	import { FpsGraph } from '$lib'
</script>

<FpsGraph
	min={0}
	max={240}
	on:change={(value) => console.log(value)}
	interval={50}
	label="FPS"
	rows={5}
/>
