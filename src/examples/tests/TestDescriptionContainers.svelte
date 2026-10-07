<script lang="ts">
	import { Button, Folder, Pane, Slider, TabGroup, TabPage } from '$lib'

	let description: string | undefined = 'Groups the lighting controls.'
	let disabled = false
	let expanded = true
	let mounted = true
	let title = 'Lighting'
	let value = 0.5
</script>

{#if mounted}
	<Pane position="inline" title="Container descriptions">
		<Folder {description} {disabled} {title} bind:expanded>
			<Slider description="Adjusts the key light." label="Key" max={1} min={0} bind:value />
			<Slider label="Fill" max={1} min={0} bind:value />
		</Folder>
		<Folder description="Cannot be collapsed." title="Locked" userExpandable={false}>
			<Button title="Action" />
		</Folder>
		<Folder description="Has no title." title="">
			<Button title="Untitled action" />
		</Folder>
		<TabGroup>
			<TabPage description="Shows scene settings." title="Scene">
				<Slider label="Exposure" max={1} min={0} bind:value />
			</TabPage>
			<TabPage description="Shows render settings." title="Render">
				<Slider label="Samples" max={1} min={0} bind:value />
			</TabPage>
			<TabPage title="Plain">
				<Slider label="Nothing" max={1} min={0} bind:value />
			</TabPage>
		</TabGroup>
	</Pane>
{/if}

<button
	type="button"
	on:click={() => {
		disabled = !disabled
	}}>Toggle disabled</button
>
<button
	type="button"
	on:click={() => {
		description = 'Updated description'
	}}>Update description</button
>
<button
	type="button"
	on:click={() => {
		description = undefined
	}}>Remove description</button
>
<button
	type="button"
	on:click={() => {
		title = 'Lights'
	}}>Update title</button
>
<button
	type="button"
	on:click={() => {
		mounted = !mounted
	}}>Toggle mounted</button
>
<output data-testid="expanded-state">{expanded}</output>
