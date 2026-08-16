<script lang="ts">
	import { Checkbox, Wheel } from '$lib'

	let value = 0
	let wide = false
</script>

<Wheel label="Wheel 1" {wide} bind:value />
<Checkbox label="Wide" bind:value={wide} />
<pre>Value: {value}</pre>
