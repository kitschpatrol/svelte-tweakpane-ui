<script lang="ts">
	import { Checkbox, Folder, Pane } from '$lib'
	let expanded = true
	let darkMode = true
	let numbers = true
</script>

<Pane title="" userExpandable={false}>
	<Checkbox bind:value={expanded} label="Expanded" />
	<Folder {expanded}>
		<Checkbox bind:value={darkMode} label="Dark Mode" />
		<Checkbox bind:value={numbers} label="Numbers" />
	</Folder>
</Pane>
