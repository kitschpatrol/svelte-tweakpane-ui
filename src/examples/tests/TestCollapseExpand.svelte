<script lang="ts">
	import { Checkbox, Element, Pane, ThemeUtils } from '$lib';
	let expanded = false;
</script>

{expanded}

<!-- Unbound -->

<Pane
	expanded={false}
	position="draggable"
	storePositionLocally={false}
	title="Draggable Pane"
	x={8}
	y={300}
>
	<Element><br /></Element>
</Pane>

<Pane expanded={false} position="fixed" title="Fixed Pane" x={8} y={400}>
	<Element><br /></Element>
</Pane>

<hr />

<Pane expanded={false} position="inline" title="Inline Pane">
	<Element><br /></Element>
</Pane>

<!-- Bound -->

<Pane
	bind:expanded
	position="draggable"
	storePositionLocally={false}
	theme={ThemeUtils.presets.light}
	title="Draggable Pane"
	x={300}
	y={300}
>
	<Checkbox bind:value={expanded} label="Expanded" />
</Pane>

<Pane
	bind:expanded
	position="fixed"
	theme={ThemeUtils.presets.light}
	title="Fixed Pane"
	x={300}
	y={400}
>
	<Checkbox bind:value={expanded} label="Expanded" />
</Pane>

<hr />

<Pane bind:expanded position="inline" theme={ThemeUtils.presets.light} title="Inline Pane">
	<Checkbox bind:value={expanded} label="Expanded" />
</Pane>
