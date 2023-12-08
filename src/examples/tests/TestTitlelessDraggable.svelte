<script lang="ts">
	import { Pane, Text } from '$lib';
	let title = '';
	let title2 = 'Title';
</script>

<a href="https://github.com/kitschpatrol/svelte-tweakpane-ui/issues/1">Issue #1</a>

<Pane position="draggable" {title} x={10} y={150}>
	<Text bind:value={title} label="Pane Title" />
</Pane>

<Pane localStoreId={'B'} position="draggable" title={title2} x={10} y={220}>
	<Text bind:value={title2} label="Pane Title" />
</Pane>
