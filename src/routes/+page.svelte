<script lang="ts">
	import { Checkbox, CubicBezier, Pane, Point, type PointValue2d } from '$lib';
	let expanded = true;
	let value: PointValue2d = [1, 4];
</script>

{value}

<Pane>
	<Point bind:value bind:expanded label={'yes'} picker={'inline'} />
</Pane>
<CubicBezier value={{ x1: 0.25, y1: 0.1, x2: 0.25, y2: 1.0 }} bind:expanded picker={'inline'} />
<Checkbox bind:value={expanded} label={'yes'} />
