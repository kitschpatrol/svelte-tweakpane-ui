<script lang="ts">
	import { Checkbox, Wheel } from '$lib'

	let value = 0
	let wide = false
</script>

<Wheel bind:value label="Wheel 1" {wide} />
<Checkbox bind:value={wide} label="Wide" />
<pre>Value: {value}</pre>
