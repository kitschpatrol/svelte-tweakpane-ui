<script lang="ts">
	import { Pane, Slider, type Theme, ThemeUtils } from '$lib'

	let value = 0.5

	const theme: Theme = {
		...ThemeUtils.presets.iceberg,
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
