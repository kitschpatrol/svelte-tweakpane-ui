<script lang="ts">
	// See https://github.com/kitschpatrol/svelte-tweakpane-ui/issues/24

	import { Stepper } from '$lib'

	let linearValue = 1

	function format(v: number): string {
		return `${v} $`
	}
</script>

<Stepper {format} label="Bla" max={10} min={0} step={0.5} bind:value={linearValue} />
