<script lang="ts">
	import { Checkbox, Folder, Pane } from '$lib'
	let expanded = true
	let darkMode = true
	let numbers = true
</script>

<Pane title="" userExpandable={false}>
	<Checkbox label="Expanded" bind:value={expanded} />
	<Folder {expanded}>
		<Checkbox label="Dark Mode" bind:value={darkMode} />
		<Checkbox label="Numbers" bind:value={numbers} />
	</Folder>
</Pane>
