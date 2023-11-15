<script lang="ts">
	import { onMount } from 'svelte';
	import { Utils } from 'svelte-tweakpane-ui';

	/*
	 * Horizontal space between grid points, in pixels
	 */
	export let gridSpacingX: number;

	/*
	 * Vertical space between grid points, in pixels
	 */
	export let gridSpacingY: number;

	/*
	 * Scale to apply to each grid item
	 */
	export let scale: number = 1.0;

	/*
	 * Rotate individual grid items
	 */
	export let rotation: [number, number, number] = [0, 0, 0];

	/*
	 * Rotate the whole grid group
	 */
	export let rotationExtrinsic: [number, number, number] = [0, 0, 0];

	/*
	 * Extra width to draw into beyond the wrapper, in pixels
	 */
	export let overdrawX: number = 0;

	/*
	 * Extra height to draw into beyond the wrapper, in pixels
	 */
	export let overdrawY: number = 0;

	/*
	 * Extra grid points at the center of each cell
	 */
	export let includeCenters: boolean = true;

	/*
	 * Background color
	 */
	export let background = '#ffffff00';

	/*
	 * Draw a red dot at each grid point, for debugging
	 */
	export let drawOrigins = false;

	/*
	 * Number of grid points @bindable
	 */
	export let paneCount: number;

	let wrapperWidth: number;
	let wrapperHeight: number;
	let mounted = false;
	let grid: number[][];

	onMount(() => {
		mounted = true;
	});

	function getGrid(w: number, h: number, sx: number, sy: number, centers: boolean): number[][] {
		const xPoints = Math.floor(w / sx);
		const yPoints = Math.floor(h / sy);
		const gridLeft = (w - (xPoints - 1) * sx) / 2;
		const gridTop = (h - (yPoints - 1) * sy) / 2;

		const points = [];

		for (let i = 0; i < xPoints; i++) {
			for (let j = 0; j < yPoints; j++) {
				points.push([gridLeft + i * sx, gridTop + j * sy]);
				if (centers && j < yPoints - 1 && i < xPoints - 1) {
					points.push([points.at(-1)![0] + sx / 2, points.at(-1)![1] + sy / 2]);
				}
			}
		}

		if (points.length === 0) {
			points.push([w / 2, h / 2]);
		}

		return points;
	}

	$: groupWidth = wrapperWidth + overdrawX;
	$: groupHeight = wrapperHeight + overdrawY;
	$: mounted &&
		(grid = getGrid(groupWidth, groupHeight, gridSpacingX, gridSpacingY, includeCenters));
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	$: mounted && (paneCount = grid.length);
</script>

{#if mounted}
	<div bind:clientHeight={wrapperHeight} bind:clientWidth={wrapperWidth} class="wrapper">
		<div
			class="grid-group"
			style={`transform: ${Utils.eulerToCssTransform(rotationExtrinsic)}`}
			style:background
			style:height="{groupHeight}px"
			style:left="{-overdrawX / 2}px"
			style:top="{-overdrawY / 2}px"
			style:width="{groupWidth}px"
		>
			{#each grid as [x, y]}
				<div
					class="grid-item"
					style={`transform: translate(-50%, -50%)
				${Utils.eulerToCssTransform(rotation)} scale(${scale})`}
					style:left="{x}px"
					style:top="{y}px"
				>
					<slot />
				</div>
			{/each}
			{#if drawOrigins}
				{#each grid as [x, y]}
					<div class="grid-marker" style:left="{x}px" style:top="{y}px"></div>
				{/each}
			{/if}
		</div>
	</div>
{/if}

<style>
	div.wrapper {
		position: fixed;
		top: 0;
		left: 0;
		transform-origin: 50% 50%;
		overflow: hidden;
		width: 100%;
		height: 100%;
	}

	div.grid-group {
		position: absolute;
		transform-origin: 50% 50%;
		height: 100%;
	}

	div.grid-item {
		position: absolute;
	}

	div.grid-marker {
		position: absolute;
		width: 10px;
		height: 10px;
		margin: -5px 0 0 -5px;
		background-color: red;
		border-radius: 50%;
	}
</style>
