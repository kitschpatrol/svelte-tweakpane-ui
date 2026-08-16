<script lang="ts">
	import { Slider } from '$lib'
	let value: number = 0
</script>

<Slider format={(v) => `${v}px`} label="Width" step={1} bind:value />
