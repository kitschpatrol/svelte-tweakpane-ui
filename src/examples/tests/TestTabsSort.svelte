<script lang="ts">
	// https://github.com/kitschpatrol/svelte-tweakpane-ui/issues/31
	import { Button, Pane, TabGroup, TabPage } from '$lib'

	let tabIndex: number = 0
	let tabPages = ['A', 'B', 'C', 'D']

	function sortTabs() {
		tabPages = tabPages.toReversed()
	}
</script>

<p>TabIndex: {tabIndex}</p>

<Pane position="inline">
	<TabGroup bind:selectedIndex={tabIndex}>
		{#each tabPages as pageTitle}
			<TabPage title={pageTitle}>
				<Button on:click={sortTabs} title="Sort Tabs" />
			</TabPage>
		{/each}
	</TabGroup>
</Pane>
