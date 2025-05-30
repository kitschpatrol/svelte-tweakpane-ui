<script lang="ts">
	import { ColorPlus, type ColorPlusValue } from '$lib'

	let value: ColorPlusValue = 'oklch(60% 0.26 11deg / 0.5)'
</script>

<ColorPlus picker="inline" expanded={true} bind:value />
