<script lang="ts">
	import GenericPane from '$lib/internal/GenericPane.svelte';
	import type { ComponentProps } from 'svelte';
	import { BROWSER } from 'esm-env';
	import { onMount } from 'svelte';
	import type { Pane as TpPane } from 'tweakpane';
	import { removeKeys } from '$lib/utils.js';

	interface $$Props extends Omit<ComponentProps<GenericPane>, 'paneRef'> {}

	export let expanded: $$Props['expanded'] = undefined;
	let paneRef: TpPane;

	// TODO make this work...
	// export let theme: Theme | undefined = {
	// 	baseBorderRadius: '0px',
	// 	bladeBorderRadius: '0px'
	// };

	let containerElement: HTMLDivElement;

	onMount(() => {
		if (paneRef) {
			const fixedContainer = paneRef.element.parentElement;
			containerElement.appendChild(paneRef.element);
			fixedContainer?.remove();
		} else {
			// TODO remove if not needed
			console.warn('paneRef is undefined');
		}
	});
</script>

<!--
@component
This component is for internal use only.
-->

{#if BROWSER}
	<div bind:this={containerElement}>
		<GenericPane bind:expanded bind:paneRef {...removeKeys($$restProps, 'position')}>
			<slot />
		</GenericPane>
	</div>
{/if}
