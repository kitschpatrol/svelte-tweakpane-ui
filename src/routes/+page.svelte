<script lang="ts">
	import { Checkbox, CubicBezier, Folder, Pane, Point, type PointValue2d } from '$lib';
	let expanded = true;
	let value: PointValue2d = [1, 4];
</script>

{value}

<Pane>
	<Point bind:value bind:expanded label={'yes'} picker={'inline'} />
</Pane>
