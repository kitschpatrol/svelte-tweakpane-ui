<script lang="ts">
	import Button from '$lib/core/Button.svelte';
	import Pane from '$lib/core/Pane.svelte';
	import Monitor from '$lib/extras/Monitor.svelte';
	import Slider from '$lib/extras/Slider.svelte';

	import WaveformMonitor from '$lib/plugins/WaveformMonitor.svelte';

	import { CubicBezier, type CubicBezierValue } from '../lib/index';

	let value: CubicBezierValue = { x1: 0, y1: 0, x2: 1, y2: 1 };
</script>

<CubicBezier {value} />
