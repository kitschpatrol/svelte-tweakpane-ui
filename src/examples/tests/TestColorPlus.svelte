<script lang="ts">
	import { ColorPlus, type ColorPlusValue } from '$lib'

	let value: ColorPlusValue = 'oklch(60% 0.26 11deg / 0.5)'

	let binding1InternalEventCount = 0
	let binding1ExternalEventCount = 0
	let binding2InternalEventCount = 0
	let binding2ExternalEventCount = 0
	let binding3InternalEventCount = 0
	let binding3ExternalEventCount = 0
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

<ColorPlus
	label="Binding 3"
	picker="inline"
	constrain={false}
	expanded={true}
	formatLocked={false}
	gamutLabel={true}
	gamutLines="all"
	gamuts={['srgb', 'p3', 'rec2020']}
	paletteChannels="LC_H"
	paletteProjection="perceptual"
	swatchFallback="css"
	textFields={false}
	bind:value
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			binding3InternalEventCount++
		} else {
			binding3ExternalEventCount++
		}
	}}
/>

<hr />

<pre>Value: <span>{JSON.stringify(value, undefined, 2)}</span></pre>
<pre>Binding 1 Internal: <span>{binding1InternalEventCount}</span></pre>
<pre>Binding 1 External: <span>{binding1ExternalEventCount}</span></pre>
<pre>Binding 2 Internal: <span>{binding2InternalEventCount}</span></pre>
<pre>Binding 2 External: <span>{binding2ExternalEventCount}</span></pre>
<pre>Binding 2 Internal: <span>{binding2InternalEventCount}</span></pre>
<pre>Binding 2 External: <span>{binding2ExternalEventCount}</span></pre>
<pre>Binding 3 Internal: <span>{binding3InternalEventCount}</span></pre>
<pre>Binding 3 External: <span>{binding3ExternalEventCount}</span></pre>
