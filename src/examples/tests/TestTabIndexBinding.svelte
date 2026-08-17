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
	<Pane position="draggable" storePositionLocally={false} title="Controls">
		<TabGroup bind:selectedIndex={tabIndex}>
			<TabPage title="A">
				<Button title="Cycle Mode" on:click={cycleMode} />
			</TabPage>
			<TabPage title="B">
				<Button title="Cycle Mode" on:click={cycleMode} />
			</TabPage>
		</TabGroup>
	</Pane>
{:else if mode === 1}
	<Pane position="inline" title="Controls">
		<TabGroup bind:selectedIndex={tabIndex}>
			<TabPage title="A">
				<Button title="Cycle Mode" on:click={cycleMode} />
			</TabPage>
			<TabPage title="B">
				<Button title="Cycle Mode" on:click={cycleMode} />
			</TabPage>
		</TabGroup>
	</Pane>
{:else}
	<p>No pane</p>
{/if}
