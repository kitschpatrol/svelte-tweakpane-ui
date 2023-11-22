<script context="module" lang="ts">
	const localStorePrefix = 'svelte-tweakpane-ui-draggable-position-';
	const localStoreDefaultId = '1';
	const localStoreIds: string[] = [];
	let zIndexGlobal = 1000;
</script>

<script lang="ts">
	import GenericPane from '$lib/internal/GenericPane.svelte';
	import { clamp, getSwatchButton, pickerIsOpen, removeKeys } from '$lib/utils.js';
	import type { ComponentProps } from 'svelte';
	import { onDestroy, onMount } from 'svelte';
	import { persisted } from 'svelte-local-storage-store';
	import type { Writable } from 'svelte/store';
	import type { BladeApi, FolderApi, Pane as TpPane } from 'tweakpane';

	// Maybe expose as props
	const TITLEBAR_WINDOW_SHADE_SINGLE_CLICK = true;
	const TITLEBAR_WINDOW_SHADE_DOUBLE_CLICK = false;

	// Could extend from InternalPaneFixed, but need to revise documentation anyway Many gratuitous
	// defined checks since NonNullable didn't work and not sure how to make an optional prop remain
	// optional but with a default value in the $$Props type
	type $$Props = Omit<ComponentProps<GenericPane>, 'paneRef' | 'userCreatedPane'> & {
		/**
		 * Horizontal position of the pane relative to the left edge of the window, in pixels.
		 *
		 * Not to be confused with the `position` prop which defines _how_, not _where_, the pane is
		 * positioned on the page. (So-named because of its similarity to CSS `position` property.)
		 *
		 * By default, this position is saved to local storage for persistence across page loads.
		 * @default `0`
		 * @bindable
		 * */
		x?: number;
		/**
		 * Vertical position of the pane relative to the top of the window, in pixels.
		 *
		 * Not to be confused with the `position` prop which defines _how_, not _where_, the pane is
		 * positioned on the page. (So-named because of its similarity to CSS `position` property.)
		 *
		 * By default, this position is saved to local storage for persistence across page loads.
		 * @default `0`
		 * @bindable
		 * */
		y?: number;
		/**
		 * Minimum pane width in pixels.
		 * @default `200`
		 * */
		minWidth?: number;
		/**
		 * Maximum pane width in pixels.
		 * @default `600`
		 * */
		maxWidth?: number;
		/**
		 * Automatically collapse open panels whey the available window size is less than the height
		 * of the pane.
		 *
		 * @default `false`
		 * */
		collapseChildrenToFit?: boolean;
		/**
		 * Identifier to be used if multiple `<Pane position='draggable'>` components with
		 * `storePositionLocally` set to true are used on the same page.
		 * @default `'1'`
		 */
		localStoreId?: string;
		/**
		 * CSS [padding property string](https://developer.mozilla.org/en-US/docs/Web/CSS/padding)
		 * to apply to the draggable pane container to prevent it from being dragged all the way to
		 * the edge of the window.
		 *
		 * Useful for keeping the pane away from of menu bars, etc.
		 * @default `'0'`
		 */
		padding?: string;
		/**
		 * Allow the user to resize the width of the pane by dragging the right corner of the title
		 * bar.
		 * @default `true`
		 * */
		resizable?: boolean;
		/**
		 * Store the pane's position and width when the user changes it interactively.
		 *
		 * Set the `localStoreId` prop if you have multiple draggable panes on the same page with
		 * `storePositionLocally` set to `true`.
		 * @default `true`
		 * */
		storePositionLocally?: boolean;
		/**
		 * Width of the pane, in pixels.
		 *
		 * Setting explicitly via a passed prop will override saved user-specified width.
		 *
		 * Use this prop to set a starting width, or to monitor changes in the the pane's width when
		 * a user resizes it.
		 *
		 * Note that height is not exposed because it is determined dynamically by the pane's
		 * contents and state of its foldable elements.
		 *
		 * By default, the width value is saved to local storage for persistence across page loads.
		 * @default `256`
		 * @bindable
		 * */
		width?: number;
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Slots = {
		/**
		 * Any Tweakpane component, except another `<Pane>`.
		 */
		default: {};
	};

	// reexport for bindability
	export let storePositionLocally: $$Props['storePositionLocally'] = true;
	export let localStoreId: $$Props['localStoreId'] = localStoreDefaultId;

	// defaults are managed here, and must be set here
	let positionStore: Writable<{
		x: number;
		y: number;
		expanded: boolean;
		width: number;
	}>;

	if (storePositionLocally) {
		positionStore = persisted(`${localStorePrefix}${localStoreId}`, {
			x: 0,
			y: 0,
			expanded: true,
			width: 350
		});
	}

	export let expanded: $$Props['expanded'] = $positionStore?.expanded ?? true;
	export let collapseChildrenToFit: $$Props['collapseChildrenToFit'] = false;
	export let x: $$Props['x'] = $positionStore?.x ?? 0;
	export let y: $$Props['y'] = $positionStore?.y ?? 0;
	export let width: $$Props['width'] = $positionStore?.width ?? 256;
	export let resizable: $$Props['resizable'] = true;
	export let userExpandable: $$Props['userExpandable'] = true;
	export let minWidth: $$Props['minWidth'] = 200;
	export let maxWidth: $$Props['maxWidth'] = 600;
	export let title: $$Props['title'] = 'Tweakpane';
	export let scale: $$Props['scale'] = 1;
	export let padding: $$Props['padding'] = '0';

	let paneRef: TpPane;
	let containerElement: HTMLDivElement;
	let dragBarElement: HTMLElement; // added dynamically to tweakpane DOM
	let widthHandleElement: HTMLDivElement | undefined;
	let containerHeight: number; // driven by tweakpane's internal layout
	let containerHeightScaled: number; // derived
	let containerWidth: number; // for padding
	let documentWidth: number;
	let documentHeight: number;
	let zIndexLocal = zIndexGlobal;

	// Local storage helpers, warn about ID collisions
	function addStorageId() {
		if (localStoreId !== undefined) {
			if (localStoreIds.includes(localStoreId)) {
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
				x,
				y,
				expanded,
				width
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
			const centerPercentY = (y + containerHeightScaled / 2) / documentHeight;

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
		// e.preventDefault(); e.stopImmediatePropagation();
	};

	let startWidth = 0;
	let startOffsetX = 0;
	let startOffsetY = 0;
	let moveDistance = 0;

	const doubleClickListener = (e: MouseEvent) => {
		e.stopPropagation();
		if (e.target) {
			if (width !== undefined && e.target === widthHandleElement) {
				if (width < maxAvailablePanelWidth) {
					width = maxAvailablePanelWidth;
				} else {
					width = minWidth;
				}
			} else if (TITLEBAR_WINDOW_SHADE_DOUBLE_CLICK && e.target === dragBarElement) {
				//if (moveDistance < 3 && userExpandable)
				paneRef.expanded = !paneRef.expanded;
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

	// Things that don't help drag latency: -[x] directly setting style -[x] awaiting ticking -[x]
	// rounding to pixel values -[x] setting transform / translate instead of left / top -[x]
	// managing separate requestAnimationFrame loop -[ ] using touch or mouse events instead of
	// pointer -[ ] using the native drag / drop API (no reasonable control over drawing and
	// bounds?)
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

	// TODO need to catch cancellations as well?
	const upListener = (e: PointerEvent) => {
		e.stopImmediatePropagation();
		if (e.target instanceof HTMLElement) {
			e.target.releasePointerCapture(e.pointerId);
			e.target.removeEventListener('pointermove', moveListener);
			e.target.removeEventListener('pointerup', upListener);

			if (TITLEBAR_WINDOW_SHADE_SINGLE_CLICK && e.target === dragBarElement) {
				if (moveDistance < 3 && userExpandable) paneRef.expanded = !paneRef.expanded;
			}
		}
	};

	const touchScrollBlocker = (e: TouchEvent) => {
		e.preventDefault();
	};

	onMount(() => {
		setDocumentSize();

		if (paneRef) {
			containerElement.appendChild(paneRef.element);
		} else {
			console.warn('no pane ref in draggable');
		}

		// prevent scrolling the background on mobile when dragging the pane or otherwise
		containerElement.addEventListener('touchmove', touchScrollBlocker, { passive: false });

		// make the pane draggable the Tweakpane pane is NOT itself a svelte component, so we have
		// to manage events directly through the DOM click blocking and handling collapse in
		// pointerup was most reliable cross-browser approach
		dragBarElement = containerElement.getElementsByClassName('tp-rotv_t')[0] as HTMLElement;
		dragBarElement.addEventListener('click', clickBlocker);
		dragBarElement.addEventListener('dblclick', doubleClickListener);
		dragBarElement.addEventListener('pointerdown', downListener);

		// add width adjuster handle
		widthHandleElement = dragBarElement.parentElement?.appendChild(document.createElement('div'));
		if (widthHandleElement) {
			widthHandleElement.className = 'tp-custom-width-handle';
			widthHandleElement.innerText = '↔';

			widthHandleElement.addEventListener('click', clickBlocker);
			widthHandleElement.addEventListener('dblclick', doubleClickListener);
			widthHandleElement.addEventListener('pointerdown', downListener);
		}
	});

	onDestroy(() => {
		if (dragBarElement) {
			dragBarElement.removeEventListener('click', clickBlocker);
			dragBarElement.removeEventListener('dblclick', doubleClickListener);
			dragBarElement.removeEventListener('pointerdown', downListener);
			dragBarElement.removeEventListener('pointermove', moveListener); // might exist, set in down
			dragBarElement.removeEventListener('pointerup', upListener); // might exist, set in down
		}

		if (widthHandleElement) {
			widthHandleElement.removeEventListener('click', clickBlocker);
			widthHandleElement.removeEventListener('dblclick', doubleClickListener);
			widthHandleElement.removeEventListener('pointerdown', downListener);
			widthHandleElement.removeEventListener('pointermove', moveListener); // might exist, set in down
			widthHandleElement.removeEventListener('pointerup', upListener); // might exist, set in down
		}

		if (containerElement) {
			containerElement.removeEventListener('touchmove', touchScrollBlocker);
		}

		// clean up store id check, e.g. when cycling through the mode of a single pane
		if (localStoreId !== undefined) {
			localStoreIds.splice(localStoreIds.indexOf(localStoreId), 1);
		}
	});

	function updateResizability(isResizable: boolean) {
		if (widthHandleElement) {
			if (isResizable) {
				widthHandleElement.style.display = 'block';
			} else {
				widthHandleElement.style.display = 'none';
			}
		}
	}

	$: paneRef && resizable && updateResizability(resizable);

	function recursiveCollapse(
		children: BladeApi[],
		maxToCollapse: number = Number.MAX_SAFE_INTEGER
	) {
		console.log(maxToCollapse);
		if (maxToCollapse > 0) {
			children.forEach((child: BladeApi) => {
				if ('expanded' in child) {
					if ((child as FolderApi).expanded) {
						maxToCollapse--;
						(child as FolderApi).expanded = false;
					}

					if ('children' in child) {
						recursiveCollapse((child as FolderApi).children, maxToCollapse);
					}
				} else {
					const swatchButton = getSwatchButton(child);
					if (swatchButton && pickerIsOpen(child)) {
						maxToCollapse--;
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						swatchButton.click();
					}
				}
			});
		}
	}

	// ensure the tweakpane panel is within the viewport additional checks in the width drag handler
	$: if (
		containerHeightScaled !== undefined &&
		documentWidth !== undefined &&
		documentHeight !== undefined &&
		x !== undefined &&
		y !== undefined &&
		width !== undefined &&
		minWidth !== undefined &&
		maxWidth !== undefined
	) {
		// collapse children if needed TODO progressive collapsing not working because of container
		// height update delays...
		if (collapseChildrenToFit && containerHeightScaled > documentHeight) {
			recursiveCollapse(paneRef.children);
		}

		// prioritize visibility of the top / left corner
		x = clamp(x, 0, Math.max(0, documentWidth - containerWidth));
		y = clamp(y, 0, Math.max(0, documentHeight - containerHeightScaled));

		if (documentWidth < containerWidth) {
			width = Math.max(minWidth, Math.min(maxWidth, documentWidth));
		}
	}

	// no browser check...
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
		positionStore?.set({ x, y, expanded, width });

	$: {
		if (containerElement) {
			if (scale === undefined || scale === 1.0) {
				containerHeightScaled = containerHeight;
			} else {
				// padding doesn't scale
				const style = window.getComputedStyle(containerElement);
				const vPadding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
				containerHeightScaled = (containerHeight - vPadding) * scale + vPadding;
			}
		}
	}
</script>

<!--
@component  
This component is for internal use only.

@sourceLink
[InternalPaneDraggable.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/internal/InternalPaneDraggable.svelte)
-->

<svelte:window on:resize={setDocumentSize} />

<div
	bind:this={containerElement}
	bind:clientHeight={containerHeight}
	bind:clientWidth={containerWidth}
	on:focus|capture={() => {
		zIndexLocal = ++zIndexGlobal;
	}}
	on:pointerdown|capture={() => {
		zIndexLocal = ++zIndexGlobal;
	}}
	class="svelte-tweakpane-ui
draggable-container"
	class:not-collapsable={!userExpandable}
	class:not-resizable={!resizable}
	style:left="{x}px"
	style:padding
	style:top="{y}px"
	style:width="{width}px"
	style:z-index={zIndexLocal}
>
	<GenericPane bind:expanded bind:paneRef {scale} {title} {...removeKeys($$restProps, 'position')}>
		<slot />
	</GenericPane>
</div>

<style>
	div.draggable-container {
		position: fixed;
		z-index: auto;
		padding: 20px;
		/* 0.2s matches Tweakpane's internal animation duration */
		transition: width 0.2s ease;
	}

	div.draggable-container:active {
		/* prevent animation during direct manipulation */
		transition: width 0s ease;
		/* alternate less specific approach */
		/* transition: none; */
	}

	/* stylelint-disable-next-line selector-class-pattern */
	div.draggable-container :global(div.tp-rotv_t) {
		cursor: grab;
	}

	div.draggable-container.not-collapsable :global(div.tp-rotv_t) {
		/* TODO remove the magic numbers */
		/* Expand the drag bar to fill the missing window shade icon space */
		margin-left: -28px;
		padding-left: 28px;
	}

	div.draggable-container.not-resizable :global(div.tp-rotv_t) {
		/* TODO remove the magic numbers */
		/* Expand the drag bar to fill the missing width drag icon space */
		margin-right: -28px;
		padding-right: 28px;
	}

	div.draggable-container :global(div.tp-lblv_l) {
		white-space: nowrap;
	}

	div.draggable-container :global(div.tp-rotv_t:active) {
		cursor: grabbing;
	}

	div.draggable-container :global(div.tp-rotv_m) {
		right: unset;
		left: 0;
		/* inflate the icon into a better hit zone */
		margin: auto calc((var(--cnt-usz) + (var(--cnt-hp)) - 6px) / 2);
	}

	div.draggable-container :global(div.tp-custom-width-handle) {
		cursor: col-resize;
		position: absolute;
		top: 0;
		right: 0;
		aspect-ratio: 1;
		height: 100%;
		font-size: 1.5em;
		color: var(--tp-container-fg);
		opacity: 0.5;
	}
</style>
