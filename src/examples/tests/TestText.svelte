<script lang="ts">
	import { Checkbox, Text } from '$lib'

	let text = 'Cosmic Manifold'
	let live = true

	let binding1InternalEventCount = 0
	let binding1ExternalEventCount = 0
	let binding2InternalEventCount = 0
	let binding2ExternalEventCount = 0
</script>

<Checkbox bind:value={live} label="Live" />

<Text
	bind:value={text}
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			binding1InternalEventCount++
		} else {
			binding1ExternalEventCount++
		}
	}}
	label="The Message"
	{live}
/>
<Text
	bind:value={text}
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			binding2InternalEventCount++
		} else {
			binding2ExternalEventCount++
		}
	}}
	label="The Message"
	{live}
/>

<pre>Value: <span>{text}</span></pre>
<pre>Live: <span>{live}</span></pre>
<pre>Binding 1 Internal: <span>{binding1InternalEventCount}</span></pre>
<pre>Binding 1 External: <span>{binding1ExternalEventCount}</span></pre>
<pre>Binding 2 Internal: <span>{binding2InternalEventCount}</span></pre>
<pre>Binding 2 External: <span>{binding2ExternalEventCount}</span></pre>
