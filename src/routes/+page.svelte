<script lang="ts">
	import { Binding, Button, Folder, Page, Pane, Separator, Tab } from '$lib/index.js';

	let buttonTitle = 'yes';
	let paneExpanded = true;
	let testParams = { speed: 'hi', levitch: 100 };
	let key = 'levitch';

	let viz = false;

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
<div class="wrapper">
	<Pane title="yes" bind:expanded={paneExpanded}>
		<Button title="Toggle Viz" on:click={toggleVisible} />
		<Separator />

		<Button title={buttonTitle} on:click={clickFunc} />
		<Separator />

		<Tab>
			{#if viz}
				<Page title="Tab Page 1" bind:selected={p1s}>
					<Button title="Button in page 1" />
				</Page>
				<Page title="Tab Page 2" bind:selected={p2s}>
					<Button title="Button in page 2" />
				</Page>
			{/if}
		</Tab>
		{#if viz}
			<Binding bind:params={testParams} {key} bindingParams={{ label: 'bla' }} />
		{/if}
		<Folder>
			<Button title="Toggle Key" on:click={toggleKey} />
		</Folder>
		<Binding bind:params={testParams} {key} bindingParams={{ label: 'bla' }} />

		<!--
		{#if viz}
			<Separator />
		{/if}
		<Tab>
			<Page title="1" bind:selected={p1s}>
				<Button title="Button in page 1" />
			</Page>
			<Page title="2" bind:selected={p2s}>
				<Button title="Button in page 2" />
			</Page>
			<Page title="3" bind:selected={p3s}>
				<Tab>
					<Page title="A">
						<Button title="Button in page 1" />
					</Page>
					<Page title="B">
						<Button title="Button in page 2" />
					</Page>
				</Tab>
			</Page>
		</Tab>
		<Separator />
		<Folder>
			<Button
				label="Meta"
				title="Fold"
				on:click={() => {
					paneExpanded = !paneExpanded;
				}}
			/>
		</Folder> -->
	</Pane>
</div>

<style>
	div.wrapper {
		width: 500px;
	}
</style>
