<script lang="ts">
	// https://github.com/kitschpatrol/svelte-tweakpane-ui/issues/31
	import { Button, Pane, TabGroup, TabPage } from '$lib'

	let draggable = true
	let tabIndex: number

	function toggleDraggable() {
		draggable = !draggable
	}
</script>

<p>Draggable: {draggable}</p>
<p>TabIndex: {tabIndex}</p>

<Pane title="Controls" position={draggable ? 'draggable' : 'fixed'}>
	<TabGroup bind:selectedIndex={tabIndex}>
		<TabPage title="A">
			<Button on:click={toggleDraggable} title="Toggle Draggable" />
		</TabPage>
		<TabPage title="B">
			<Button on:click={toggleDraggable} title="Toggle Draggable" />
		</TabPage>
	</TabGroup>
</Pane>
