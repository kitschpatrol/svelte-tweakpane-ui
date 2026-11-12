<script lang="ts">
	import { Button } from '#lib'

	// Used by TestClsTheme. Binding a value the child initializes makes Svelte
	// render this component twice on the server and discard the first attempt.
	let title: string | undefined
</script>

<Button bind:title />
<Button title="Button" />
