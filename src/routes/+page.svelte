<script lang="ts">
	import {
		Monitor,
		Pane,
		Point,
		type PointValue2dObject,
		type PointValue2dTuple,
		Profiler,
		type ProfilerMeasure,
		type ProfilerMeasureAsync,
		Separator,
		Slider
	} from '$lib';
	import { onMount } from 'svelte';

	let time = 0;
	let valueX = 0;
	let valueY = 0;
	let valueZ = 0;
	let playing = true;

	onMount(() => {
		let yTime = 0;
		let lastTime: number | undefined;
		let frameId: number;
		let xUp = true; // Track the direction of the wave
		let yUp = true; // Track the direction of the wave

		function tick(animationTime: number) {
			if (lastTime) {
				const delta = animationTime - lastTime;

				if (playing) {
					// Time to value
					time += delta;
				}

				// 	const newX = Math.sin(time / 1000);
				// 	xUp = newX > valueX; // Track the wave's direction
				// 	valueX = newX;

				// 	// yTime += delta;
				// 	const newY = Math.cos(time / 1000);
				// 	yUp = newY > valueY; // Track the wave's direction
				// 	valueY = newY;
				// } else {
				// 	// Value to time

				// 	// Calculate the new time based on the value and wave direction
				// 	let xNewTime = 1000 * Math.asin(valueX);
				// 	if (!xUp) {
				// 		// Adjust for the downswing phase
				// 		// xNewTime = 1000 * Math.PI - xNewTime;
				// 	}
				// 	time = xNewTime;

				// 	// Calculate the new time based on the value and wave direction
				// 	let yNewTime = 1000 * Math.acos(valueY);
				// 	if (!yUp) {
				// 		// Adjust for the downswing phase
				// 		// yNewTime = 1000 * Math.PI - yNewTime;
				// 	}
				// 	// yTime = yNewTime;
				// }
			}

			lastTime = animationTime;
			frameId = requestAnimationFrame(tick);
		}

		frameId = requestAnimationFrame(tick);

		return () => {
			cancelAnimationFrame(frameId);
		};
	});

	$: point = { x: valueX, y: valueY };

	// function setPointY(point: PointValue2dTuple) {
	// 	point = [value, pointY];
	// }

	function valueFromPoint(point: PointValue2dObject) {
		valueX = point.x;
		valueY = point.y;
	}

	// update from time
	$: updateFromTime(time);

	$: !playing && updateFromValueX(valueX);
	$: !playing && updateFromValueY(valueY);

	function updateFromTime(t: number) {
		console.log('updateFromTime');
		valueX = Math.sin(t / 1000);
		valueY = Math.cos(t / 1000);
		point = { x: valueX, y: valueY };
	}

	function updateFromValueX(x: number) {
		console.log('updateFromValueX');
		time = 1000 * Math.asin(x);
		valueY = Math.cos(time / 1000);
	}

	function updateFromValueY(y: number) {
		console.log('updateFromValueY');
		time = 1000 * Math.acos(y);
		valueX = Math.sin(time / 1000);
	}

	$: valueFromPoint(point);
</script>

<div
	on:pointerdown={() => {
		playing = false;
	}}
	on:pointerup={() => {
		playing = true;
	}}
	style="display: flex;"
>
	<div style=" width: 300px;">
		<Pane position="inline">
			<Point
				bind:value={point}
				min={-1}
				max={1}
				expanded={true}
				label="Tweakpane"
				optionsY={{ min: -1, max: 1, inverted: true }}
				picker="inline"
			/>
			<Separator />
			<Monitor value={valueX} min={-1} max={1} bufferSize={300} graph={true} />
			<Separator />
			<Slider bind:value={valueX} min={-1} max={1} />
			<Slider bind:value={valueY} min={-1} max={1} />
		</Pane>
	</div>
</div>
