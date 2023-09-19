<script lang="ts">
	import { Binding, Button, Folder, Page, Pane, Separator, Tab } from '$lib/index.js';

	let buttonTitle = 'yes';
	let paneExpanded = true;
	let testParams = { speed: 'hi', levitch: 100 };
	let key = 'levitch';

	let viz = true;

	const toggleKey = () => {
		key = key === 'speed' ? 'levitch' : 'speed';
	};

	const toggleVisible = () => {
		viz = !viz;
	};

	const clickA = () => {
		clickFunc = clickB;
		testParams.speed += 100;
	};

	const clickB = () => {
		clickFunc = clickA;
	};

	let clickFunc = clickA;

	let p1s = true;
	let p2s = true;
	let p3s = true;
</script>

{p1s}
{p2s}
{p3s}
{JSON.stringify(testParams)}
{key}

<hr />

<div class="wrapper">
	<h3>Stand-alone</h3>

	<Binding params={testParams} {key} />
	<hr />
	<Button title="hi" />
	<hr />
	<Separator />
	<hr />
	<h3>Inside a pane</h3>
	<Pane title="yes" bind:expanded={paneExpanded}>
		<Binding params={testParams} {key} />
		<Separator />
		{#if viz}
			<Button title="hi" />
		{/if}
		<Button title="reset" />
		{#if viz}
			<Folder>
				<Button title="enfoldered" />
				<Separator />
			</Folder>
		{/if}
		<Separator />
		{#if viz}
			<Tab>
				<Page title="A">
					<Button title="Some button A" />
					<Binding params={testParams} {key} />
				</Page>
				<Page title="B">
					<Button title="Some button B" />
					<Binding params={testParams} {key} />
				</Page>
			</Tab>
		{/if}
		<Button title="Toggle Viz" on:click={toggleVisible} />
		<Button title="Toggle Key" on:click={toggleKey} />
		<Separator />
	</Pane>
</div>

<hr />
<p>I am at the bottom</p>

<style>
	div.wrapper {
		width: 500px;
	}
</style>
