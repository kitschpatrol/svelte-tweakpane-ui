<script lang="ts">
	import { persisted } from 'svelte-local-storage-store';
	import type { Theme } from '$lib/theme.js';
	import type { Pane as TpPane } from 'tweakpane';
	import GenericPane from '$lib/internal/GenericPane.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { BROWSER } from 'esm-env';
	import { clamp } from '$lib/utils.js';
	import type { Writable } from 'svelte/store';

	export let title: string | undefined = 'Tweakpane';
	export let expanded: boolean = true; // special case
	export let theme: Theme | undefined = undefined;

	const minPanelWidth = 200;

	let containerElement: HTMLDivElement;
	let dragBarElement: HTMLElement; // added dynamically to tweakpane DOM
	let widthHandleElement: HTMLDivElement;
	let containerHeight: number; // driven by tweakpane's internal layout
	let documentWidth: number;
	let documentHeight: number;
	let pane: TpPane;
	// TODO how to handle multiple
	let panelConfigStore: Writable<{
		expanded: boolean;
		width: number;
		x: number;
		y: number;
	}> = persisted('tweakpane', {
		expanded: true,
		width: 350,
		x: 0,
		y: 0
	});

	// Helpers
	function setDocumentSize() {
		const documentWidthPrevious = documentWidth;
		const documentHeightPrevious = documentHeight;
		documentWidth = document.documentElement.clientWidth;
		documentHeight = document.documentElement.clientHeight;
		const dx = documentWidth - documentWidthPrevious;
		const dy = documentHeight - documentHeightPrevious;

		// ensure we "stick" to the correct quadrant
		const centerPercentX = ($panelConfigStore.x + $panelConfigStore.width / 2) / documentWidth;
		const centerPercentY = ($panelConfigStore.y + containerHeight / 2) / documentHeight;

		if (!isNaN(dx) && centerPercentX >= 0.5) {
			$panelConfigStore.x += dx;
		}

		if (!isNaN(dy) && centerPercentY >= 0.5) {
			$panelConfigStore.y += dy;
		}
	}

	const clickBlocker = (e: MouseEvent) => {
		e.stopPropagation();
	};

	const doubleClickListener = (e: MouseEvent) => {
		e.stopPropagation();
		pane.expanded = !pane.expanded;
	};

	const downListener = (e: PointerEvent) => {
		if (e.target instanceof HTMLElement) {
			e.target.setPointerCapture(e.pointerId);
			e.target.addEventListener('pointermove', moveListener);
			e.target.addEventListener('pointerup', upListener);
		}
	};

	const moveListener = (e: PointerEvent) => {
		if (e.target instanceof HTMLElement) {
			if (e.target === dragBarElement) {
				$panelConfigStore.x += e.movementX;
				$panelConfigStore.y += e.movementY;
			} else if (e.target === widthHandleElement) {
				$panelConfigStore.width = clamp(
					$panelConfigStore.width + e.movementX,
					minPanelWidth,
					documentWidth - $panelConfigStore.x
				);
			}
		}
	};

	const upListener = (e: PointerEvent) => {
		e.stopImmediatePropagation();
		if (e.target instanceof HTMLElement) {
			e.target.releasePointerCapture(e.pointerId);
			e.target.removeEventListener('pointermove', moveListener);
			e.target.removeEventListener('pointerup', upListener);
		}
	};

	onMount(() => {
		setDocumentSize();

		containerElement.appendChild(pane.element);

		// make the pane draggable
		// the tweakbar pane is NOT itself a svelte component, so we have to
		// hook into it directly through the DOM
		// TODO is this selector working?
		dragBarElement = containerElement.getElementsByClassName('tp-rotv_t')[0] as HTMLElement;
		dragBarElement.addEventListener('click', clickBlocker);
		dragBarElement.addEventListener('dblclick', doubleClickListener);
		dragBarElement.addEventListener('pointerdown', downListener);

		// add width adjuster
		widthHandleElement = dragBarElement.parentElement?.appendChild(document.createElement('div'))!; // TODO
		if (widthHandleElement) {
			widthHandleElement.className = 'tp-custom-width-handle';
			widthHandleElement.innerText = '↔';
			widthHandleElement.addEventListener('click', clickBlocker);
			widthHandleElement.addEventListener('pointerdown', downListener);
		}
	});

	onDestroy(() => {
		if (dragBarElement) {
			dragBarElement.removeEventListener('click', clickBlocker);
			dragBarElement.removeEventListener('dblclick', doubleClickListener);
			dragBarElement.removeEventListener('pointermove', moveListener);
			dragBarElement.removeEventListener('pointerup', upListener);
			dragBarElement.removeEventListener('pointerdown', downListener);
		}

		if (widthHandleElement) {
			widthHandleElement.removeEventListener('click', clickBlocker);
			widthHandleElement.removeEventListener('pointermove', moveListener);
			widthHandleElement.removeEventListener('pointerup', upListener);
			widthHandleElement.removeEventListener('pointerdown', downListener);
		}

		// TODO confirm pane.dispose()...
	});

	// ensure the tweakpane panel is within the viewport
	// additional checks in the width drag handler
	$: if ($panelConfigStore && containerHeight && documentWidth && documentHeight) {
		$panelConfigStore.x = clamp($panelConfigStore.x, 0, documentWidth - $panelConfigStore.width);
		$panelConfigStore.y = clamp($panelConfigStore.y, 0, documentHeight - containerHeight);
		if (documentWidth < $panelConfigStore.width) {
			$panelConfigStore.width = Math.max(minPanelWidth, documentWidth);
		}
	}
</script>

<svelte:window on:resize={setDocumentSize} />

{#if BROWSER}
	<div
		class="tweakpane-container"
		bind:this={containerElement}
		bind:clientHeight={containerHeight}
		style={`width: ${$panelConfigStore.width}px; left: ${$panelConfigStore.x}px; top: ${$panelConfigStore.y}px`}
	>
		<GenericPane {title} bind:expanded {theme} bind:paneRef={pane}>
			<slot />
		</GenericPane>
	</div>
{/if}

<style>
	div.tweakpane-container {
		position: fixed;
	}

	/* stylelint-disable-next-line selector-class-pattern */
	:global(div.tp-rotv_t) {
		cursor: grab;
	}

	/* stylelint-disable-next-line selector-class-pattern */
	:global(div.tp-lblv_l) {
		white-space: nowrap;
	}

	/* stylelint-disable-next-line selector-class-pattern */
	:global(div.tp-rotv_m) {
		right: unset;
		left: calc(var(--cnt-h-p) + (var(--bld-us) + 4px - 6px) / 2 - 2px);
	}

	/* stylelint-disable-next-line selector-class-pattern */
	:global(div.tp-rotv_t:active) {
		background: var(--tp-input-background-color-active);
		cursor: grabbing;
	}

	:global(div.tp-custom-width-handle) {
		position: absolute;
		height: 100%;
		aspect-ratio: 1;
		top: 0;
		right: 0;
		cursor: col-resize;
		font-size: 1.5em;
		color: var(--cnt-fg);
		opacity: 0.5;
	}
</style>
