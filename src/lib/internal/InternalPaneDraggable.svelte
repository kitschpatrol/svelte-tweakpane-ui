<script lang="ts" context="module">
	const localStorePrefix = 'svelte-tweakpane-ui-draggable-position-';
	const localStoreDefaultId = '1';
	const localStoreIds: string[] = [];
	let zIndexGlobal = 1000;
</script>

<script lang="ts">
	import GenericPane from './GenericPane.svelte';
	import type { ComponentProps } from 'svelte';
	import { clamp, removeKeys } from '../utils.js';
	import type { Pane as TpPane } from 'tweakpane';
	import { BROWSER } from 'esm-env';
	import { onDestroy, onMount } from 'svelte';
	import { persisted } from 'svelte-local-storage-store';
	import type { Writable } from 'svelte/store';
	import { page } from '$app/stores';

	// Could extend from InternalPaneFixed, but need to revise documentation anyway
	// Many gratuitous defined checks since NonNullable didn't work and not sure how to make an optional prop
	// remain optional but with a default value in the $$Props interface
	interface $$Props extends Omit<ComponentProps<GenericPane>, 'paneRef' | 'userCreatedPane'> {
		/** Horizontal position of the pane, in pixels. Bindable. (Defaults to 0.) */
		x?: number;
		/** Vertical position of the pane, in pixels. Bindable. (Defaults to 0.) */
		y?: number;
		/** Width of the pane, in pixels. User-adjustable if `resizeable` is set to true. Setting explicitly via a passed prop will override saved user-specified width. (Defaults to 256.) */
		width?: number;
		/** Whether the pane's last position and width should be saved to local storage and re-applied across page reloads. Defaults to true. */
		storePositionLocally?: boolean;
		/** Allow the user to resize the pane by dragging the right corner of the title bar. */
		resizeable?: boolean;
		/** Minimum pane width in pixels. (Defaults to 200.) */
		minWidth?: number;
		/** Maximum pane width in pixels. (Defaults to 600.) */
		maxWidth?: number;
		/** Identifier to be used if multiple <InternalPaneDraggable> components with `storePositionLocally` set to true are used on the same page. */
		localStoreId?: string;
	}

	export let storePositionLocally: $$Props['storePositionLocally'] = true;
	export let localStoreId: $$Props['localStoreId'] = localStoreDefaultId;

	// defaults are managed here, and must be set here
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

	/** Expand and collapse the pane. Bindable. */
	export let expanded: $$Props['expanded'] = $positionStore?.expanded ?? true;
	export let x: $$Props['x'] = $positionStore?.x ?? 0;
	export let y: $$Props['y'] = $positionStore?.y ?? 0;
	export let width: $$Props['width'] = $positionStore?.width ?? 256;
	export let resizeable: $$Props['resizeable'] = true;
	export let clickToExpand: $$Props['clickToExpand'] = true;
	export let minWidth: $$Props['minWidth'] = 200;
	export let maxWidth: $$Props['maxWidth'] = 600;
	export let title: $$Props['title'] = 'Tweakpane';

	let paneRef: TpPane;
	let containerElement: HTMLDivElement;
	let dragBarElement: HTMLElement; // added dynamically to tweakpane DOM
	let widthHandleElement: HTMLDivElement | undefined;
	let containerHeight: number; // driven by tweakpane's internal layout
	let documentWidth: number;
	let documentHeight: number;
	let zIndexLocal = zIndexGlobal;

	// Local storage helpers, warn about ID collisions
	function addStorageId() {
		if (localStoreId !== undefined) {
			if (BROWSER && localStoreIds.includes(localStoreId)) {
				console.warn(
					'Multiple instances of <Pane> with `mode="draggable"` and `storePositionLocally=true` detected. You must explicitly set unique localStoreId property on each component to avoid collisions.'
				);
			}
			localStoreIds.push(localStoreId);
		}
	}

	function removeStorageId() {
		if (localStoreId) {
			localStoreIds.splice(localStoreIds.indexOf(localStoreId), 1);
			localStorage.removeItem(`${localStorePrefix}${localStoreId}`);
		}
	}

	function updateLocalStoreId(id: string | undefined) {
		if (
			id !== undefined &&
			positionStore !== undefined &&
			expanded !== undefined &&
			width !== undefined &&
			x !== undefined &&
			y !== undefined
		) {
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
		if (x !== undefined && y !== undefined && width !== undefined) {
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
	}

	const clickBlocker = (e: MouseEvent) => {
		e.stopPropagation();
	};

	let startWidth = 0;
	let startOffsetX = 0;
	let startOffsetY = 0;
	let moveDistance = 0;

	const doubleClickListener = (e: MouseEvent) => {
		e.stopPropagation();
		if (e.target instanceof HTMLElement && paneRef && width !== undefined) {
			if (e.target === dragBarElement) {
				if (moveDistance < 3 && clickToExpand) paneRef.expanded = !paneRef.expanded;
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
		if (x !== undefined && y !== undefined && e.button === 0 && e.target instanceof HTMLElement) {
			moveDistance = 0;

			e.target.setPointerCapture(e.pointerId);
			e.target.addEventListener('pointermove', moveListener);
			e.target.addEventListener('pointerup', upListener);

			startWidth = width ?? 0;

			startOffsetX = x - e.pageX;
			startOffsetY = y - e.pageY;
		}
	};

	// Things that don't help drag latency:
	// -[x] directly setting style
	// -[x] awaiting ticking
	// -[x] rounding to pixel values
	// -[x] setting transform / translate instead of left / top
	// -[x] managing separate requestAnimationFrame loop
	// -[ ] using touch or mouse events instead of pointer
	// -[ ] using the native drag / drop API (no reasonable control over drawing and bounds?)
	const moveListener = (e: PointerEvent) => {
		if (
			e.target instanceof HTMLElement &&
			width !== undefined &&
			minWidth !== undefined &&
			x !== undefined &&
			y !== undefined
		) {
			if (e.target === dragBarElement) {
				moveDistance += Math.sqrt(e.movementX * e.movementX + e.movementY * e.movementY);

				x = e.pageX + startOffsetX;
				y = e.pageY + startOffsetY;
			} else if (e.target === widthHandleElement) {
				width = clamp(e.pageX + startOffsetX + startWidth - x, minWidth, maxAvailablePanelWidth);
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

		if (paneRef) {
			containerElement.appendChild(paneRef.element);
		} else {
			// todo remove if not needed
			console.warn('no pane ref in draggable');
		}

		// make the pane draggable
		// the tweakbar pane is NOT itself a svelte component, so we have to
		// hook into it directly through the DOM
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

		// clean up store id check, e.g. when cycling through the mode of a single pane
		if (localStoreId !== undefined) {
			localStoreIds.splice(localStoreIds.indexOf(localStoreId), 1);
		}
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

	$: paneRef && resizeable && updateResizeability(resizeable);

	// ensure the tweakpane panel is within the viewport
	// additional checks in the width drag handler
	$: if (
		containerHeight !== undefined &&
		documentWidth !== undefined &&
		documentHeight !== undefined &&
		x !== undefined &&
		y !== undefined &&
		width !== undefined &&
		minWidth !== undefined &&
		maxWidth !== undefined
	) {
		x = clamp(x, 0, documentWidth - width);
		y = clamp(y, 0, documentHeight - containerHeight);
		if (documentWidth < width) {
			width = Math.max(minWidth, Math.min(maxWidth, documentWidth));
		}
	}

	$: maxAvailablePanelWidth = Math.min(maxWidth ?? 600, documentWidth - (x ?? 0));

	$: localStoreId, storePositionLocally && addStorageId();
	$: localStoreId, !storePositionLocally && removeStorageId();
	$: localStoreId !== `${localStorePrefix}${localStoreId}` && updateLocalStoreId(localStoreId);

	// proxy everything to the store
	$: storePositionLocally &&
		localStoreId !== undefined &&
		x !== undefined &&
		y !== undefined &&
		width !== undefined &&
		expanded !== undefined &&
		positionStore?.set({ x, y, width, expanded });
</script>

<!--
@component
This component is for internal use only.
-->

<svelte:window on:resize={setDocumentSize} />

{#if BROWSER}
	<div
		on:focus|capture={() => {
			zIndexLocal = ++zIndexGlobal;
		}}
		class="draggable-container"
		class:not-resizeable={!resizeable}
		class:not-collapsable={!clickToExpand}
		bind:this={containerElement}
		bind:clientHeight={containerHeight}
		style={`width: ${width}px; left: ${x}px; top: ${y}px; z-index: ${zIndexLocal}`}
	>
		<GenericPane bind:expanded bind:paneRef {title} {...removeKeys($$restProps, 'position')}>
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
