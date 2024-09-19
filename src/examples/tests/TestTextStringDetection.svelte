<script lang="ts">
	// Svelte Tweakpane UI's Text component should NOT give color-like string
	// special treatment, use the Color component instead.
	//
	// Related:
	// https://github.com/kitschpatrol/svelte-tweakpane-ui/issues/17

	import { Text } from '$lib';
	let sample01 = 'Hi';
	let sample02 = '1';
	let sample03 = '0x13';
	let sample04 = '0x1337';
	let sample05 = '0xEE1337';
	let sample06 = '0x1337AA';
	let sample07 = '0x1337AA13';
	let sample08 = '#13';
	let sample09 = '#1337';
	let sample10 = '#EE1337';
	let sample11 = '#1337AA';
	let sample12 = '#1337AA13';
	let sample13 = '238, 19, 55';
	let sample14 = '238, 19, 55, 0.5';
	let sample15 = 'rgb(238, 19, 55)';
	let sample16 = 'rgba(238, 19, 55, 0.5)';
	let sample17 = 'True';
	let sample18 = 'true';
	let sample19 = 'False';
	let sample20 = 'false';
</script>

<Text bind:value={sample01} />
<Text bind:value={sample02} />
<Text bind:value={sample03} />
<Text bind:value={sample04} />
<Text bind:value={sample05} />
<Text bind:value={sample06} />
<Text bind:value={sample07} />
<Text bind:value={sample08} />
<Text bind:value={sample09} />
<Text bind:value={sample10} />
<Text bind:value={sample11} />
<Text bind:value={sample12} />
<Text bind:value={sample13} />
<Text bind:value={sample14} />
<Text bind:value={sample15} />
<Text bind:value={sample16} />
<Text bind:value={sample17} />
<Text bind:value={sample18} />
<Text bind:value={sample19} />
<Text bind:value={sample20} />
