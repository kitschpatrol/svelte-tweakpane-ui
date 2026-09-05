<script lang="ts">
	import { Pane, Slider, type Theme, ThemeUtils } from '$lib'

	let value = 0.5

	let theme: Theme = {
		...ThemeUtils.presets.iceberg,
		containerHorizontalPadding: '8px',
		containerVerticalPadding: '6px',
		stuiDescriptionDelay: '50ms',
		stuiDescriptionFadeInDuration: '75ms',
		stuiDescriptionFadeOutDuration: '60ms',
		stuiDescriptionMaxWidth: '120px',
	}
</script>

<Pane position="inline" {theme} title="Description Theme">
	<Slider
		description="A deliberately long themed description for measuring its maximum width."
		label="Themed"
		max={1}
		min={0}
		bind:value
	/>
</Pane>

<button
	type="button"
	on:click={() => {
		theme = {
			...ThemeUtils.presets.iceberg,
			'--stui-description-delay': '200ms',
			'--stui-description-max-width': '160px',
		}
	}}>Use CSS theme keys</button
>
