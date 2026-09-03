<script lang="ts">
	import { Checkbox, Folder, Pane } from '$lib'
	let expandedA = true
	let expandedB = true
	let expandedC = true
	let expandedNested = true
	let expandedLocked = true
	let expandedDisabled = true
</script>

<Pane position="inline" title="Alt Click Test">
	<Folder title="Folder A" bind:expanded={expandedA}>
		<Checkbox label="A" value={true} />
	</Folder>
	<Folder title="Folder B" bind:expanded={expandedB}>
		<Checkbox label="B" value={true} />
		<Folder title="Nested B1" bind:expanded={expandedNested}>
			<Checkbox label="B1" value={true} />
		</Folder>
	</Folder>
	<Folder title="Folder C" bind:expanded={expandedC}>
		<Checkbox label="C" value={true} />
	</Folder>
	<Folder title="Locked" userExpandable={false} bind:expanded={expandedLocked}>
		<Checkbox label="L" value={true} />
	</Folder>
	<Folder disabled title="Disabled" bind:expanded={expandedDisabled}>
		<Checkbox label="D" value={true} />
	</Folder>
</Pane>

<p id="state">
	{expandedA}
	{expandedB}
	{expandedC}
	{expandedNested}
	{expandedLocked}
	{expandedDisabled}
</p>
