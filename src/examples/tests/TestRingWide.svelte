<script lang="ts">
	import { Checkbox, Ring } from '$lib';

	let value = 0;
	let wide = false;
</script>

<Ring bind:value label="Ring 1" {wide} />
<Checkbox bind:value={wide} label="Wide" />
<pre>Value: {value}</pre>
