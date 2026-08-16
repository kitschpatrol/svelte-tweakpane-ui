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

<Pane position={draggable ? 'draggable' : 'fixed'} title="Controls">
	<TabGroup bind:selectedIndex={tabIndex}>
		<TabPage title="A">
			<Button title="Toggle Draggable" on:click={toggleDraggable} />
		</TabPage>
		<TabPage title="B">
			<Button title="Toggle Draggable" on:click={toggleDraggable} />
		</TabPage>
	</TabGroup>
</Pane>
