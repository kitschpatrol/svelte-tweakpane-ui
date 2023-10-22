<script lang="ts">
	import GenericPane from './GenericPane.svelte';
	import type { ComponentProps } from 'svelte';
	import { BROWSER } from 'esm-env';
	import { onMount } from 'svelte';
	import type { Pane as TpPane } from 'tweakpane';
	import { removeKeys } from '../utils.js';

	interface $$Props extends Omit<ComponentProps<GenericPane>, 'paneRef'> {
		/** Width of the pane, in pixels. If undefined, pane fills the width of its container, while maintaining a minimum width of about 221 pixels. (Defaults to `undefined`)  */
		width?: number;
	}

	export let expanded: $$Props['expanded'] = undefined;
	export let width: $$Props['width'] = undefined;
	let paneRef: TpPane;

	export let theme: $$Props['theme'] = {
		baseBorderRadius: '0px',
		bladeBorderRadius: '0px'
	};

	let containerElement: HTMLDivElement;

	function setWidth() {
		if (width !== undefined) {
			paneRef.element.style.setProperty('width', `${width}px`);
		} else {
			paneRef.element.style.removeProperty('width');
		}
	}

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

	$: width, paneRef !== undefined && setWidth();
	$: paneRef !== undefined && console.log(paneRef.element);
</script>

<!--
@component
This component is for internal use only.
-->

{#if BROWSER}
	<div bind:this={containerElement}>
		<GenericPane bind:expanded bind:paneRef {theme} {...removeKeys($$restProps, 'position')}>
			<slot />
		</GenericPane>
	</div>
{/if}
