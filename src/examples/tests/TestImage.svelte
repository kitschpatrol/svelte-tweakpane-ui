<script lang="ts">
	import { Button, Image } from '$lib'

	let source = 'placeholder'

	async function getRandomKittenUrl() {
		const { url } = await fetch('https://loremflickr.com/800/800/kitten', {
			method: 'HEAD',
		})
		return url
	}

	let binding1InternalEventCount = 0
	let binding1ExternalEventCount = 0
	let binding2InternalEventCount = 0
	let binding2ExternalEventCount = 0
</script>

<Button
	label="Random Placeholder"
	title="Load Cat"
	on:click={async () => {
		source = await getRandomKittenUrl()
	}}
/>
<Image
	fit="contain"
	label="Image 1"
	bind:value={source}
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			binding1InternalEventCount++
		} else {
			binding1ExternalEventCount++
		}
	}}
/>
<Image
	fit="contain"
	label="Image 2"
	bind:value={source}
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			binding2InternalEventCount++
		} else {
			binding2ExternalEventCount++
		}
	}}
/>

<pre>Value: <span>{source}</span></pre>
<pre>Binding 1 Internal: <span>{binding1InternalEventCount}</span></pre>
<pre>Binding 1 External: <span>{binding1ExternalEventCount}</span></pre>
<pre>Binding 2 Internal: <span>{binding2InternalEventCount}</span></pre>
<pre>Binding 2 External: <span>{binding2ExternalEventCount}</span></pre>
