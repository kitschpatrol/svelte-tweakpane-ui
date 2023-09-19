<script lang="ts">
	import Blade from '$lib/core/Blade.svelte';
	export let disabled: boolean = false;
</script>

<Blade
	{disabled}
	params={{
		view: 'separator'
	}}
/>
