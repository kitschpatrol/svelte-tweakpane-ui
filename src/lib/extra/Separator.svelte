<script lang="ts">
	import Blade from '$lib/core/Blade.svelte';
	import type { Theme } from '$lib/theme.js';
	import type { SeparatorBladeParams } from 'tweakpane';

	// re-exported
	export let disabled: boolean = false;
	export let theme: Theme | undefined = undefined;

	let bladeParams: SeparatorBladeParams = {
		view: 'separator'
	};
</script>

<Blade {disabled} {bladeParams} {theme} />
