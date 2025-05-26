<script lang="ts">
	// See https://github.com/kitschpatrol/svelte-tweakpane-ui/issues/24

	import { Stepper } from '$lib'

	let linearValue = 1

	function format(v: number): string {
		return `${v} $`
	}
</script>

<Stepper label="Bla" bind:value={linearValue} min={0} max={10} step={0.5} {format} />
