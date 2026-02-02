<script lang="ts">
	// https://github.com/kitschpatrol/svelte-tweakpane-ui/issues/31
	import { Button, Pane, TabGroup, TabPage } from '$lib'

	let mode = 0
	let tabIndex: number = 1

	function cycleMode() {
		mode = (mode + 1) % 3
	}
</script>

<p>Mode: {mode}</p>
<p>TabIndex: {tabIndex}</p>

{#if mode === 0}
	<Pane title="Controls" position="draggable" storePositionLocally={false}>
		<TabGroup bind:selectedIndex={tabIndex}>
			<TabPage title="A">
				<Button on:click={cycleMode} title="Cycle Mode" />
			</TabPage>
			<TabPage title="B">
				<Button on:click={cycleMode} title="Cycle Mode" />
			</TabPage>
		</TabGroup>
	</Pane>
{:else if mode === 1}
	<Pane title="Controls" position="inline">
		<TabGroup bind:selectedIndex={tabIndex}>
			<TabPage title="A">
				<Button on:click={cycleMode} title="Cycle Mode" />
			</TabPage>
			<TabPage title="B">
				<Button on:click={cycleMode} title="Cycle Mode" />
			</TabPage>
		</TabGroup>
	</Pane>
{:else}
	<p>No pane</p>
{/if}
