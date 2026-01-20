<script lang="ts">
	import { AutoValue } from '$lib'

	let number = 0
	let color = '#ff00ff'
	let colorArray = { r: 0, g: 0, b: 255 }
	let point = { x: 0, y: 0 }
	let text = 'Cosmic manifold'

	let number1InternalEventCount = 0
	let number1ExternalEventCount = 0
	let number2InternalEventCount = 0
	let number2ExternalEventCount = 0
	let color1InternalEventCount = 0
	let color1ExternalEventCount = 0
	let color2InternalEventCount = 0
	let color2ExternalEventCount = 0
	let point1InternalEventCount = 0
	let point1ExternalEventCount = 0
	let point2InternalEventCount = 0
	let point2ExternalEventCount = 0
	let text1InternalEventCount = 0
	let text1ExternalEventCount = 0
	let text2InternalEventCount = 0
	let text2ExternalEventCount = 0
</script>

<AutoValue
	bind:value={number}
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			number1InternalEventCount++
		} else {
			number1ExternalEventCount++
		}
	}}
	label="Number 1"
/>
<AutoValue
	bind:value={number}
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			number2InternalEventCount++
		} else {
			number2ExternalEventCount++
		}
	}}
	label="Number 2"
/>

<AutoValue
	bind:value={color}
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			color1InternalEventCount++
		} else {
			color1ExternalEventCount++
		}
	}}
	label="Color 1"
/>
<AutoValue
	bind:value={color}
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			color2InternalEventCount++
		} else {
			color2ExternalEventCount++
		}
	}}
	label="Color 2"
/>

<AutoValue
	bind:value={point}
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			point1InternalEventCount++
		} else {
			point1ExternalEventCount++
		}
	}}
	label="Point 1"
/>
<AutoValue
	bind:value={point}
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			point2InternalEventCount++
		} else {
			point2ExternalEventCount++
		}
	}}
	label="Point 2"
/>

<AutoValue
	bind:value={text}
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			text1InternalEventCount++
		} else {
			text1ExternalEventCount++
		}
	}}
	label="Text 1"
/>
<AutoValue
	bind:value={text}
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			text2InternalEventCount++
		} else {
			text2ExternalEventCount++
		}
	}}
	label="Text 2"
/>

<hr />

<AutoValue bind:value={colorArray} label="Color Array" />

<pre>Number Value: <span>{number}</span></pre>
<pre>Number 1 Internal: <span>{number1InternalEventCount}</span></pre>
<pre>Number 1 External: <span>{number1ExternalEventCount}</span></pre>
<pre>Number 2 Internal: <span>{number2InternalEventCount}</span></pre>
<pre>Number 2 External: <span>{number2ExternalEventCount}</span></pre>
<pre>Color Value: <span>{color}</span></pre>
<pre>Color 1 Internal: <span>{color1InternalEventCount}</span></pre>
<pre>Color 1 External: <span>{color1ExternalEventCount}</span></pre>
<pre>Color 2 Internal: <span>{color2InternalEventCount}</span></pre>
<pre>Color 2 External: <span>{color2ExternalEventCount}</span></pre>
<pre>Point Value: <span>{point}</span></pre>
<pre>Point 1 Internal: <span>{point1InternalEventCount}</span></pre>
<pre>Point 1 External: <span>{point1ExternalEventCount}</span></pre>
<pre>Point 2 Internal: <span>{point2InternalEventCount}</span></pre>
<pre>Point 2 External: <span>{point2ExternalEventCount}</span></pre>
<pre>Text Value: <span>{text}</span></pre>
<pre>Text 1 Internal: <span>{text1InternalEventCount}</span></pre>
<pre>Text 1 External: <span>{text1ExternalEventCount}</span></pre>
<pre>Text 2 Internal: <span>{text2InternalEventCount}</span></pre>
<pre>Text 2 External: <span>{text2ExternalEventCount}</span></pre>
