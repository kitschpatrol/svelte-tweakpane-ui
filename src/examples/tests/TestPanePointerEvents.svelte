<script lang="ts">
	import { Pane, Slider } from '$lib'

	let draggableValue = 0
	let fixedValue = 0
</script>

<p>Draggable value: {draggableValue}</p>
<p>Fixed value: {fixedValue}</p>

<Pane position="draggable" storePositionLocally={false} title="Draggable Pane" x={8} y={100}>
	<Slider label="Draggable Slider" max={100} min={0} bind:value={draggableValue} />
</Pane>

<Pane position="fixed" title="Fixed Pane" x={300} y={100}>
	<Slider label="Fixed Slider" max={100} min={0} bind:value={fixedValue} />
</Pane>
