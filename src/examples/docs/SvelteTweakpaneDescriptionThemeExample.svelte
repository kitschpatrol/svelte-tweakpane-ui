<script lang="ts">
	import { Pane, Slider, type Theme, ThemeUtils } from '$lib'

	const theme: Theme = {
		...ThemeUtils.presets.iceberg,
		stuiDescriptionDelay: '350ms',
		stuiDescriptionFadeInDuration: '50ms',
		stuiDescriptionFadeOutDuration: '250ms',
		stuiDescriptionHint: '"ⓘ"',
		stuiDescriptionMaxWidth: '20rem',
	}

	let exposure = 0.5
	let contrast = 1
</script>

<Pane position="inline" {theme} title="Scene">
	<Slider
		description="Controls the overall scene brightness."
		label="Exposure"
		max={1}
		min={0}
		bind:value={exposure}
	/>
	<Slider
		description="Stretches the difference between light and dark areas."
		label="Contrast"
		max={2}
		min={0}
		bind:value={contrast}
	/>
</Pane>
