<script lang="ts">
	import { Button, List, Pane, Slider } from '$lib'
	import { presets } from '$lib/theme.js'

	let description: string | undefined = 'Adjusts the amount of glow.\nUse sparingly.'
	let glow = 0.5
	let glowLabel = 'Glow'
	let quality = 'High'

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

<Pane position="inline" theme={presets.iceberg} title="Descriptions">
	<Slider {description} label={glowLabel} max={1} min={0} bind:value={glow} />
	<List
		description="Balances rendering speed and detail."
		label="Quality"
		options={['Low', 'High']}
		bind:value={quality}
	/>
	<Button {description} disabled label="Settings" title="Reset" />
	<Button description="Performs an unlabeled action." title="Action" />
	<Slider label="No description" max={1} min={0} bind:value={glow} />
</Pane>

<button type="button" on:click={updateDescription}>Update description</button>
<button type="button" on:click={removeDescription}>Remove description</button>
<button type="button" on:click={updateLabel}>Update label</button>
<output data-testid="description-state">{description}</output>
