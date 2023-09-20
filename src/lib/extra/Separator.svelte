<script lang="ts">
	import Blade from '$lib/core/Blade.svelte';
	import type { SeparatorBladeParams } from 'tweakpane';
	export let disabled: boolean = false;

	let bladeParams: SeparatorBladeParams = {
		view: 'separator'
	};
</script>

<Blade {disabled} {bladeParams} />
