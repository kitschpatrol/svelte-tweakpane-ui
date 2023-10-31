<script lang="ts">
	import Binding from '$lib/core/Binding.svelte';
	import Blade from '$lib/core/Blade.svelte';
	import Button from '$lib/core/Button.svelte';
	import Folder from '$lib/core/Folder.svelte';
	import Page from '$lib/core/Page.svelte';
	import Pane from '$lib/core/Pane.svelte';
	import Tab from '$lib/core/Tab.svelte';
	import AutoObject from '$lib/extras/AutoObject.svelte';
	import Checkbox from '$lib/extras/Checkbox.svelte';
	import Color from '$lib/extras/Color.svelte';
	import type { ListOptions } from '$lib/extras/List.svelte';
	import Monitor from '$lib/extras/Monitor.svelte';
	import Point from '$lib/extras/Point.svelte';
	import Separator from '$lib/extras/Separator.svelte';
	import Slider from '$lib/extras/Slider.svelte';
	import Text from '$lib/extras/Text.svelte';
	import ButtonGrid from '$lib/plugins/essentials/ButtonGrid.svelte';
	import CubicBezier from '$lib/plugins/essentials/CubicBezier.svelte';
	import FpsGraph from '$lib/plugins/essentials/FpsGraph.svelte';
	import IntervalSlider from '$lib/plugins/essentials/IntervalSlider.svelte';
	import RadioGrid from '$lib/plugins/essentials/RadioGrid.svelte';
	import Ring from '$lib/plugins/camerakit/Ring.svelte';
	import Wheel from '$lib/plugins/camerakit/Wheel.svelte';
	import Image from '$lib/plugins/Image.svelte';
	import Profiler from '$lib/plugins/Profiler.svelte';
	import RotationEuler from '$lib/plugins/RotationEuler.svelte';
	import RotationQuaternion from '$lib/plugins/RotationQuaternion.svelte';
	import Textarea from '$lib/plugins/Textarea.svelte';
	import WaveformMonitor from '$lib/plugins/WaveformMonitor.svelte';

	const options: ListOptions<number> = { a: 1, b: 2, c: 3 };
	let selection: number = 1;
	let multiline: boolean = false;
	let stringToMonitor: string = 'Reticulating';
</script>

<h1>Hi</h1>

<Pane position="draggable" maxWidth={5}>
	<Monitor value={1} />
</Pane>

<!-- <Binding />
<Blade />
<Button />
<Folder />
<Page />
<Pane />
<Tab />
<AutoObject />
<Checkbox />
<Color />
<List />
<Monitor />
<Point />
<Separator />
<Slider />
<Text />
<ButtonGrid />
<CubicBezier />
<FpsGraph />
<IntervalSlider />
<RadioGrid />
<Ring />
<Wheel />
<Image />
<Profiler />
<RotationEuler />
<RotationQuaternion />
<Textarea />
<WaveformMonitor /> -->
