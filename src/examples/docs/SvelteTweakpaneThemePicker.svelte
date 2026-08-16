<script lang="ts">
	import { List, Pane, ThemeUtils } from '$lib'

	let themeKey: keyof typeof ThemeUtils.presets = 'standard'
</script>

<Pane position="inline" theme={ThemeUtils.presets[themeKey]} title="Theme Picker">
	<List label="Theme" options={Object.keys(ThemeUtils.presets)} bind:value={themeKey} />
</Pane>
