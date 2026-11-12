<script lang="ts">
	import { Button, TabPage } from '#lib'

	// Used by TestClsTheme. Binding a value the child initializes makes Svelte
	// render this component twice on the server and discard the first attempt.
	let selected: boolean | undefined
</script>

<TabPage title="A" bind:selected>
	<Button title="Button" />
	<Button title="Button" />
</TabPage>
