<script lang="ts">
	import {
		AutoValue,
		type BindingObject,
		ButtonGrid,
		Checkbox,
		Pane,
		Separator,
		Slider,
	} from '$lib'
	import Button from '$lib/control/Button.svelte'
	import Folder from '$lib/core/Folder.svelte'

	const testObject = {
		someColor: {
			r: 255,
			g: 0,
			b: 55,
		},
		someOtherColor: {
			r: 0,
			g: 255,
			b: 55,
		},
	} as BindingObject

	let showNumbers = true
	let folderWrap = false
	let someNumber = 1
</script>

<Pane>
	{#if folderWrap}
		<Folder>
			{#each Object.keys(testObject) as key}
				{#if typeof testObject[key] !== 'number' || showNumbers}
					<AutoValue label={key} bind:value={testObject[key]} />
				{/if}
			{/each}
		</Folder>
		<Slider label="Some Number" bind:value={someNumber} />
	{:else}
		{#each Object.keys(testObject) as key}
			{#if typeof testObject[key] !== 'number' || showNumbers}
				<AutoValue label={key} bind:value={testObject[key]} />
			{/if}
		{/each}
		<Slider label="Some Number" bind:value={someNumber} />
	{/if}
	<Separator />
	<ButtonGrid buttons={['Copy', 'Reset']} />
	<Folder expanded={false} title="Tweakpane CSS Options">
		<Checkbox label="Show Numbers" bind:value={showNumbers} />
		<Checkbox label="Folder Wrap" bind:value={folderWrap} />
	</Folder>
	<Button />
</Pane>
