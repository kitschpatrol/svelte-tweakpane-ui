<script lang="ts">
	import { Binding, Button, Folder, Page, Pane, Separator, Tab } from '$lib/index.js';

	let buttonTitle = 'yes';
	let paneExpanded = true;
	let testParams = { speed: 100 };

	const clickA = () => {
		console.log('clicka');
		clickFunc = clickB;
	};

	const clickB = () => {
		console.log('clickb');
		clickFunc = clickA;
	};

	let clickFunc = clickA;

	$: {
		console.log(`paneExpanded: ${paneExpanded}`);
		console.log(`testParams: ${JSON.stringify(testParams, null, 2)}`);
	}

	$: {
		console.log(`testParams: ${JSON.stringify(testParams, null, 2)}`);
	}
</script>

<div class="wrapper">
	<Pane title="yes" bind:expanded={paneExpanded}>
		<Binding params={testParams} key="speed" bindingParams={{ label: 'bla' }} />
		<Button title={buttonTitle} onClick={clickFunc} />
		<Separator />
		<Tab>
			<Page title="1">
				<Button title="Button in page 1" />
			</Page>
			<Page title="2">
				<Button title="Button in page 2" />
			</Page>
			<Page title="3">
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
				label="yes"
				title="Hi"
				onClick={() => {
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
