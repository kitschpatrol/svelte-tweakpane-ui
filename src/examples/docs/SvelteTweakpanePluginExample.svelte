<script lang="ts">
	import { CubicBezier } from '$lib'

	let value: [number, number, number, number] = [0.5, 0, 0.5, 1]

	$: console.log(value)
</script>

<CubicBezier expanded={true} label="cubicbezier" picker="inline" bind:value />
