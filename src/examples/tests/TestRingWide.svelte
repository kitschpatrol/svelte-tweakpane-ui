<script lang="ts">
	import { Checkbox, Ring } from '$lib'

	let value = 0
	let wide = false
</script>

<Ring label="Ring 1" {wide} bind:value />
<Checkbox label="Wide" bind:value={wide} />
<pre>Value: {value}</pre>
