<script lang="ts">
	import { Binding, Button, Folder, Page, Pane, Separator, Tab } from '$lib/index.js';

	let buttonTitle = 'yes';
	let paneExpanded = true;
	let testParams = { speed: 100 };

	const clickA = () => {
		console.log('clicka');
		clickFunc = clickB;
		testParams.speed += 100;
	};

	const clickB = () => {
		console.log('clickb');
		clickFunc = clickA;
	};

	let clickFunc = clickA;

	let p1s = true;
	let p2s = true;
	let p3s = true;

	$: {
		console.log(`paneExpanded: ${paneExpanded}`);
		console.log(`testParams: ${JSON.stringify(testParams, null, 2)}`);
	}

	$: {
		console.log(`testParams: ${JSON.stringify(testParams, null, 2)}`);
	}
</script>

{p1s}
{p2s}
{p3s}
{JSON.stringify(testParams)}

<div class="wrapper">
	<Pane title="yes" bind:expanded={paneExpanded}>
		<Binding bind:params={testParams} key="speed" bindingParams={{ label: 'bla' }} />
		<Button title={buttonTitle} on:click={clickFunc} />
		<Separator />
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
		</Folder>
	</Pane>
</div>

<style>
	div.wrapper {
		width: 500px;
	}
</style>
