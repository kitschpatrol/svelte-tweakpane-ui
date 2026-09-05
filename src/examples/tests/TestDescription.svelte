<script lang="ts">
	import {
		Button,
		Checkbox,
		IntervalSlider,
		List,
		Pane,
		Ring,
		Slider,
		Stepper,
		Text,
		Wheel,
	} from '$lib'
	import { presets } from '$lib/theme.js'

	let description: string | undefined = 'Adjusts the amount of glow.\nUse sparingly.'
	let glow = 0.5
	let glowLabel = 'Glow'
	let interval: [number, number] = [0.25, 0.75]
	let notes = 'Notes'
	let quality = 'High'
	let ring = 0
	let showDescriptionIcons = false
	let stepper = 0
	let themeKey: keyof typeof presets = 'light'
	let wheel = 0

	function removeDescription() {
		description = undefined
	}

	function updateDescription() {
		description = 'Updated description'
	}

	function updateLabel() {
		glowLabel = 'Bloom'
	}
</script>

<div class:show-description-icons={showDescriptionIcons}>
	<Pane position="inline" scale={1} theme={presets[themeKey]} title="Descriptions">
		<List label="Theme" options={Object.keys(presets)} bind:value={themeKey} />
		<Checkbox label="Show description icons" bind:value={showDescriptionIcons} />
		<Slider {description} label={glowLabel} max={1} min={0} bind:value={glow} />
		<List
			description="Balances rendering speed and detail."
			label="Quality"
			options={['Low', 'High']}
			bind:value={quality}
		/>
		<Button {description} disabled label="Settings" title="Reset" />
		<Button description="Performs an unlabeled action." title="Action" />
		<Slider
			description="Adjusts a labeled wide slider."
			label="Labeled Wide Slider"
			max={1}
			min={0}
			wide
			bind:value={glow}
		/>
		<Slider description="Adjusts an unlabeled regular slider." max={1} min={0} bind:value={glow} />
		<Slider
			description="Adjusts an unlabeled wide slider."
			max={1}
			min={0}
			wide
			bind:value={glow}
		/>
		<IntervalSlider
			description="Adjusts an unlabeled wide interval slider."
			max={1}
			min={0}
			wide
			bind:value={interval}
		/>
		<Stepper description="Adjusts an unlabeled wide stepper." wide bind:value={stepper} />
		<Ring description="Adjusts an unlabeled wide ring." wide bind:value={ring} />
		<Wheel description="Adjusts an unlabeled wide wheel." wide bind:value={wheel} />
		<Text description="Edits unlabeled text." bind:value={notes} />
		<Slider label="No description" max={1} min={0} bind:value={glow} />
	</Pane>
</div>

<button type="button" on:click={updateDescription}>Update description</button>
<button type="button" on:click={removeDescription}>Remove description</button>
<button type="button" on:click={updateLabel}>Update label</button>
<output data-testid="description-state">{description}</output>

<style>
	.show-description-icons :global([data-stui-description] > .tp-lblv_l) {
		position: relative;
		padding-right: calc(var(--cnt-hp) + 1em);
		white-space: nowrap;
	}

	.show-description-icons :global([data-stui-description] > .tp-lblv_l)::after {
		content: '🛈';
		position: absolute;
		right: var(--cnt-hp);
		width: 1em;
		text-align: right;
	}
</style>
