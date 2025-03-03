<script lang="ts">
	import { Button, type Theme, ThemeUtils } from '$lib'

	const customizedTheme: Theme = {
		...ThemeUtils.presets.iceberg,
		baseBackgroundColor: 'hsla(230, 20%, 11%, 0.5)',
		labelForegroundColor: 'hsla(230, 12%, 88%, 1.00)',
	}
</script>

<Button label="I'm customized" theme={customizedTheme} />
