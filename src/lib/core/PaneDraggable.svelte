<script lang="ts" context="module">
	const localStorePrefix = 'svelte-tweakpane-ui-draggable-position-';
	const localStoreDefaultId = '1';
	const localStoreIds: string[] = [];
	let zIndexGlobal = 1000;
</script>

<script lang="ts">
	import GenericPane from '$lib/internal/GenericPane.svelte';
	import type { Theme } from '$lib/theme.js';
	import { clamp } from '$lib/utils.js';
	import { BROWSER } from 'esm-env';
	import { onDestroy, onMount } from 'svelte';
	import { persisted } from 'svelte-local-storage-store';
	import type { Writable } from 'svelte/store';
	import type { Pane as TpPane } from 'tweakpane';

	export let title: string | undefined = 'Tweakpane';
	export let theme: Theme | undefined = undefined;
	export let storePositionLocally: boolean = true;
	export let minWidth: number = 200;
	export let maxWidth: number = 600;
	export let collapsable: boolean = true;
	export let resizeable: boolean = true;
	export let localStoreId: string = localStoreDefaultId;

	// defaults are managed here
	let positionStore: Writable<{
		expanded: boolean;
		width: number;
		x: number;
		y: number;
	}>;

	if (BROWSER && storePositionLocally) {
		positionStore = persisted(`${localStorePrefix}${localStoreId}`, {
			expanded: true,
			width: 350,
			x: 0,
			y: 0
		});
	}

	export let expanded: boolean = $positionStore?.expanded ?? true;
	export let x: number = $positionStore?.x ?? 0;
	export let y: number = $positionStore?.y ?? 0;
	export let width: number = $positionStore?.width ?? 350;

	// let firstRun = true;

	let containerElement: HTMLDivElement;
	let dragBarElement: HTMLElement; // added dynamically to tweakpane DOM
	let widthHandleElement: HTMLDivElement | undefined;
	let containerHeight: number; // driven by tweakpane's internal layout
	let documentWidth: number;
	let documentHeight: number;
	let pane: TpPane;
	let zIndexLocal = zIndexGlobal;

	// Local storage helpers, warn about ID collisions
	function addStorageId() {
		if (BROWSER && localStoreIds.includes(localStoreId)) {
			console.warn(
				'Multiple instances of <PaneDraggable> with storePositionLocally=true detected. You must explicitly set unique localStoreId property on each component to avoid collisions.'
			);
		}
		localStoreIds.push(localStoreId);
	}

	function removeStorageId() {
		localStoreIds.splice(localStoreIds.indexOf(localStoreId), 1);
	}

	function updateLocalStoreId(id: string | undefined) {
		if (id !== undefined) {
			positionStore = persisted(`${localStorePrefix}${localStoreId}`, {
				expanded,
				width,
				x,
				y
			});
		}
	}

	// Helpers
	function setDocumentSize() {
		const documentWidthPrevious = documentWidth;
		const documentHeightPrevious = documentHeight;
		documentWidth = document.documentElement.clientWidth;
		documentHeight = document.documentElement.clientHeight;
		const dx = documentWidth - documentWidthPrevious;
		const dy = documentHeight - documentHeightPrevious;

		// ensure we "stick" to the correct quadrant
		const centerPercentX = (x + width / 2) / documentWidth;
		const centerPercentY = (y + containerHeight / 2) / documentHeight;

		if (!isNaN(dx) && centerPercentX >= 0.5) {
			x += dx;
		}

		if (!isNaN(dy) && centerPercentY >= 0.5) {
			y += dy;
		}
	}

	const clickBlocker = (e: MouseEvent) => {
		e.stopPropagation();
	};

	let moveDistance = 0;

	const doubleClickListener = (e: MouseEvent) => {
		e.stopPropagation();
		if (e.target instanceof HTMLElement) {
			if (e.target === dragBarElement) {
				if (moveDistance < 3 && collapsable) pane.expanded = !pane.expanded;
			} else if (e.target === widthHandleElement) {
				if (width < maxAvailablePanelWidth) {
					width = maxAvailablePanelWidth;
				} else {
					width = minWidth;
				}
			}
		}
	};

	const downListener = (e: PointerEvent) => {
		if (e.target instanceof HTMLElement) {
			moveDistance = 0;
			e.target.setPointerCapture(e.pointerId);
			e.target.addEventListener('pointermove', moveListener);
			e.target.addEventListener('pointerup', upListener);
		}
	};

	const moveListener = (e: PointerEvent) => {
		if (e.target instanceof HTMLElement) {
			if (e.target === dragBarElement) {
				moveDistance += Math.sqrt(e.movementX * e.movementX + e.movementY * e.movementY);
				x += e.movementX;
				y += e.movementY;
			} else if (e.target === widthHandleElement) {
				width = clamp(width + e.movementX, minWidth, maxAvailablePanelWidth);
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
		// firstRun = false;

		setDocumentSize();

		containerElement.appendChild(pane.element);

		// make the pane draggable
		// the tweakbar pane is NOT itself a svelte component, so we have to
		// hook into it directly through the DOM
		// TODO is this selector working?
		dragBarElement = containerElement.getElementsByClassName('tp-rotv_t')[0] as HTMLElement;
		// let single clicks trigger window shade as well, to match default behavior
		dragBarElement.addEventListener('click', doubleClickListener);
		dragBarElement.addEventListener('dblclick', doubleClickListener);
		dragBarElement.addEventListener('pointerdown', downListener);

		// add width adjuster
		widthHandleElement = dragBarElement.parentElement?.appendChild(document.createElement('div'));
		if (widthHandleElement) {
			widthHandleElement.className = 'tp-custom-width-handle';
			widthHandleElement.innerText = '↔';
			widthHandleElement.addEventListener('dblclick', doubleClickListener);
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
			widthHandleElement.removeEventListener('dblclick', doubleClickListener);
			widthHandleElement.removeEventListener('pointermove', moveListener);
			widthHandleElement.removeEventListener('pointerup', upListener);
			widthHandleElement.removeEventListener('pointerdown', downListener);
		}

		// TODO confirm pane.dispose()...
	});

	function updateResizeability(isresizeable: boolean) {
		if (widthHandleElement) {
			if (isresizeable) {
				widthHandleElement.style.display = 'block';
			} else {
				widthHandleElement.style.display = 'none';
			}
		}
	}

	$: pane && updateResizeability(resizeable);

	// ensure the tweakpane panel is within the viewport
	// additional checks in the width drag handler
	$: if (containerHeight && documentWidth && documentHeight) {
		x = clamp(x, 0, documentWidth - width);
		y = clamp(y, 0, documentHeight - containerHeight);
		if (documentWidth < width) {
			width = Math.max(minWidth, Math.min(maxWidth, documentWidth));
		}
	}

	$: maxAvailablePanelWidth = Math.min(maxWidth, documentWidth - x);

	$: localStoreId, storePositionLocally && addStorageId();
	$: localStoreId, !storePositionLocally && removeStorageId();
	$: localStoreId !== `${localStorePrefix}${localStoreId}` && updateLocalStoreId(localStoreId);

	// proxy everything to the store
	$: localStoreId !== undefined && positionStore?.set({ x, y, width, expanded });
</script>

<svelte:window on:resize={setDocumentSize} />

{#if BROWSER}
	<div
		on:focus|capture={() => {
			zIndexLocal = ++zIndexGlobal;
		}}
		class="draggable-container"
		class:not-resizeable={!resizeable}
		class:not-collapsable={!collapsable}
		bind:this={containerElement}
		bind:clientHeight={containerHeight}
		style={`width: ${width}px; left: ${x}px; top: ${y}px; z-index: ${zIndexLocal}`}
	>
		<GenericPane {title} bind:expanded {theme} {collapsable} bind:paneRef={pane}>
			<slot />
		</GenericPane>
	</div>
{/if}

<style>
	div.draggable-container {
		position: fixed;
		/* 0.2s matches Tweakpane's internal animation duration */
		transition: width 0.2s ease;
		z-index: auto;
	}

	div.draggable-container:active {
		/* prevent animation during direct manipulation */
		transition: width 0s ease;
		/* alternate less specific approach */
		/* transition: none; */
	}

	/* stylelint-disable-next-line selector-class-pattern */
	:global(div.draggable-container div.tp-rotv_t) {
		cursor: grab;
	}

	:global(div.draggable-container.not-collapsable div.tp-rotv_t) {
		/* TODO remove the magic numbers */
		/* Expand the drag bar to fill the missing collapse icon space */
		margin-left: -28px;
		padding-left: 28px;
	}

	:global(div.draggable-container.not-resizeable div.tp-rotv_t) {
		/* TODO remove the magic numbers */
		/* Expand the drag bar to fill the missing width drag icon space */
		margin-right: -28px;
		padding-right: 28px;
	}

	/* stylelint-disable-next-line selector-class-pattern */
	:global(div.draggable-container div.tp-lblv_l) {
		white-space: nowrap;
	}

	/* stylelint-disable-next-line selector-class-pattern */
	:global(div.draggable-container div.tp-rotv_t:active) {
		cursor: grabbing;
	}

	/* stylelint-disable-next-line selector-class-pattern */
	:global(div.draggable-container div.tp-rotv_m) {
		right: unset;
		/* crazy calc but straight from the tp source */
		left: calc(var(--cnt-hp) + (var(--cnt-usz) + 4px - 6px) / 2 - 2px);
	}

	:global(div.draggable-container div.tp-custom-width-handle) {
		position: absolute;
		height: 100%;
		aspect-ratio: 1;
		top: 0;
		right: 0;
		cursor: col-resize;
		font-size: 1.5em;
		color: var(--tp-container-fg);
		opacity: 0.5;
	}
</style>
