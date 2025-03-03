<script lang="ts">
	// https://github.com/kitschpatrol/svelte-tweakpane-ui/issues/18
	// https://svelte.dev/repl/3cc711caf304411dbf2d6fc8d2493219?version=4.2.19
	import { Checkbox, Element, TabGroup, TabPage, Text } from '$lib'
	let text = '#1234'
	let text2 = '#1235'
	let check = false
</script>

<TabGroup>
	<TabPage title="A">
		<Checkbox bind:value={check} label="Visibility" />
		{#if check}
			<Element>🅱️</Element>
			<Text bind:value={text} label="C" />
		{/if}
		<Text bind:value={text2} label="D" />
	</TabPage>
</TabGroup>
