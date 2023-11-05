<script lang="ts">
	import { Profiler, Slider, type ProfilerMeasure } from '$lib';
	import { onMount } from 'svelte';

	// this is a readonly function handle assigned by Profiler component
	// first used in onMount since it is not bound until then
	let measure: ProfilerMeasure;

	let loopExponent = 1;

	// helper to test Math functions
	function hardWork(fn: (n: number) => number, exponent: number): void {
		measure(fn.name, () => {
			for (let sum = 0; sum < Number('1e' + exponent); sum++) {
				fn(sum);
			}
		});
	}

	onMount(() => {
		(function tick() {
			// Nesting measurements creates a hierarchy
			// in the Profile visualization
			measure('Tick', () => {
				measure('Trigonometry', () => {
					hardWork(Math.sin, loopExponent);
					hardWork(Math.cos, loopExponent);
					hardWork(Math.tan, loopExponent);
					hardWork(Math.atan, loopExponent);
					hardWork(Math.acos, loopExponent);
					hardWork(Math.acosh, loopExponent);
				});
				measure('Logarithms', () => {
					hardWork(Math.log, loopExponent);
					hardWork(Math.log10, loopExponent);
					hardWork(Math.log1p, loopExponent);
					hardWork(Math.log2, loopExponent);
				});
				measure('Rounding', () => {
					hardWork(Math.round, loopExponent);
					hardWork(Math.floor, loopExponent);
					hardWork(Math.ceil, loopExponent);
					hardWork(Math.fround, loopExponent);
				});
			});

			requestAnimationFrame(tick);
		})();
	});
</script>

<Profiler bind:measure label="Profiler" />
<Slider label="Loop Exponent (Careful)" bind:value={loopExponent} min={1} max={5} step={1} />
