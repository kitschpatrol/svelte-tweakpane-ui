<script lang="ts">
	import { CubicBezier } from '$lib'

	let value: [number, number, number, number] = [0.5, 0, 0.5, 1]

	$: console.log(value)
</script>

<CubicBezier bind:value expanded={true} label="cubicbezier" picker="inline" />
