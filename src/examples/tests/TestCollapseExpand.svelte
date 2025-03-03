<script lang="ts">
	import { Checkbox, Element, Pane, ThemeUtils } from '$lib'
	let expanded = false

	// Related to https://github.com/kitschpatrol/svelte-tweakpane-ui/issues/4
</script>

{expanded}

<!-- Unbound Literal -->

<Pane
	expanded={false}
	position="draggable"
	storePositionLocally={false}
	title="Draggable Pane Unbound Literal"
	x={8}
	y={300}
>
	<Element><br /></Element>
</Pane>

<Pane expanded={false} position="fixed" title="Fixed Pane Unbound Literal" x={8} y={400}>
	<Element><br /></Element>
</Pane>

<hr />

<Pane expanded={false} position="inline" title="Inline Pane Unbound Literal">
	<Element><br /></Element>
</Pane>

<!-- Unbound variable -->

<Pane
	{expanded}
	position="draggable"
	storePositionLocally={false}
	title="Draggable Pane Unbound Variable"
	x={300}
	y={300}
>
	<Element><br /></Element>
</Pane>

<Pane {expanded} position="fixed" title="Fixed Pane Unbound Variable" x={300} y={400}>
	<Element><br /></Element>
</Pane>

<hr />

<Pane
	{expanded}
	position="inline"
	theme={ThemeUtils.presets.light}
	title="Inline Pane Unbound Variable"
>
	<Checkbox bind:value={expanded} label="Expanded" />
</Pane>

<!-- Bound Literal Not Allowed -->

<!-- Bound Variable -->

<Pane
	bind:expanded
	position="draggable"
	storePositionLocally={false}
	theme={ThemeUtils.presets.light}
	title="Draggable Pane Bound Variable"
	x={600}
	y={300}
>
	<Checkbox bind:value={expanded} label="Expanded" />
</Pane>

<Pane
	bind:expanded
	position="fixed"
	theme={ThemeUtils.presets.light}
	title="Fixed Pane Bound Variable"
	x={600}
	y={400}
>
	<Checkbox bind:value={expanded} label="Expanded" />
</Pane>

<hr />

<Pane
	bind:expanded
	position="inline"
	theme={ThemeUtils.presets.light}
	title="Inline Pane Bound Variable"
>
	<Checkbox bind:value={expanded} label="Expanded" />
</Pane>
