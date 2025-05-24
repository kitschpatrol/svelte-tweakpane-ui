<script lang="ts">
	import { Slider } from '$lib'
	let value: number = 0
</script>

<Slider bind:value label="Width" step={1} format={(v) => `${v}px`} />
