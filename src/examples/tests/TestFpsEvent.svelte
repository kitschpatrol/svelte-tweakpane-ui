<script lang="ts">
	import { FpsGraph } from '$lib'
</script>

<FpsGraph
	interval={50}
	label="FPS"
	max={240}
	min={0}
	rows={5}
	on:change={(value) => console.log(value)}
/>
