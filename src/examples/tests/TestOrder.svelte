<script lang="ts">
	import {
		AutoValue,
		type BindingObject,
		ButtonGrid,
		Checkbox,
		Pane,
		Separator,
		Slider
	} from '$lib';
	import Button from '$lib/control/Button.svelte';
	import Folder from '$lib/core/Folder.svelte';

	let testObject = {
		someColor: {
			r: 255,
			g: 0,
			b: 55
		},
		someOtherColor: {
			r: 0,
			g: 255,
			b: 55
		}
	} as BindingObject;

	let showNumbers = true;
	let folderWrap = false;
	let someNumber = 1;
</script>

<Pane>
	{#if folderWrap}
		<Folder>
			{#each Object.keys(testObject) as key}
				{#if typeof testObject[key] !== 'number' || showNumbers}
					<AutoValue bind:value={testObject[key]} label={key} />
				{/if}
			{/each}
		</Folder>
		<Slider bind:value={someNumber} label="Some Number" />
	{:else}
		{#each Object.keys(testObject) as key}
			{#if typeof testObject[key] !== 'number' || showNumbers}
				<AutoValue bind:value={testObject[key]} label={key} />
			{/if}
		{/each}
		<Slider bind:value={someNumber} label="Some Number" />
	{/if}
	<Separator />
	<ButtonGrid buttons={['Copy', 'Reset']} />
	<Folder expanded={false} title="Tweakpane CSS Options">
		<Checkbox bind:value={showNumbers} label="Show Numbers" />
		<Checkbox bind:value={folderWrap} label="Folder Wrap" />
	</Folder>
	<Button />
</Pane>
