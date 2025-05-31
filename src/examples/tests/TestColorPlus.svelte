<script lang="ts">
	import { ColorPlus, type ColorPlusValue, Pane } from '$lib'
	import type { ColorValueString } from '../../../dist'

	let value: ColorPlusValue = 'oklch(60% 0.26 11deg / 0.5)'

	let binding1InternalEventCount = 0
	let binding1ExternalEventCount = 0
	let binding2InternalEventCount = 0
	let binding2ExternalEventCount = 0
</script>

<ColorPlus
	label="Binding 1"
	picker="inline"
	expanded={true}
	bind:value
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			binding1InternalEventCount++
		} else {
			binding1ExternalEventCount++
		}
	}}
/>
<ColorPlus
	label="Binding 2"
	picker="inline"
	expanded={true}
	bind:value
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			binding2InternalEventCount++
		} else {
			binding2ExternalEventCount++
		}
	}}
/>

<hr />

<pre>Value: <span>{JSON.stringify(value, undefined, 2)}</span></pre>
<pre>Binding 1 Internal: <span>{binding1InternalEventCount}</span></pre>
<pre>Binding 1 External: <span>{binding1ExternalEventCount}</span></pre>
<pre>Binding 2 Internal: <span>{binding2InternalEventCount}</span></pre>
<pre>Binding 2 External: <span>{binding2ExternalEventCount}</span></pre>
