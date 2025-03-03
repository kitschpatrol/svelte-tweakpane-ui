<script lang="ts">
	// Svelte Tweakpane UI's Text component should NOT give color-like string
	// special treatment, use the Color component instead.
	//
	// Related:
	// https://github.com/kitschpatrol/svelte-tweakpane-ui/issues/17

	import { AutoObject, AutoValue, Color, Text } from '$lib'

	let strings: Record<string, string> = {
		sample01: 'Hi',
		sample02: '1',
		sample03: '0x13',
		sample04: '0x1337',
		sample05: '0xEE1337',
		sample06: '0x1337AA',
		sample07: '0x1337AA13',
		sample08: '#13',
		sample09: '#1337',
		sample10: '#EE1337',
		sample11: '#1337AA',
		sample12: '#1337AA13',
		sample13: '238, 19, 55',
		sample14: '238, 19, 55, 0.5',
		sample15: 'rgb(238, 19, 55)',
		sample16: 'rgba(238, 19, 55, 0.5)',
		sample17: 'hsl(238, 19, 55)',
		sample18: 'hsla(238, 19, 55, 0.5)',
		sample19: 'hsv(238, 19, 55)',
		sample20: 'hsva(238, 19, 55, 0.5)',
		sample21: 'True',
		sample22: 'true',
		sample23: 'False',
		sample24: 'false',
		sample25: 'red',
	}
</script>

<hr />
<h1>Text Component</h1>
{#each Object.keys(strings) as key}
	<Text bind:value={strings[key]} label={key} />
{/each}
<hr />
<h1>Auto Value</h1>
{#each Object.keys(strings) as key}
	<AutoValue bind:value={strings[key]} label={key} />
{/each}

<hr />
<h1>Auto Object</h1>
<AutoObject bind:object={strings} />
<hr />
<h1>Color Component</h1>
{#each Object.keys(strings) as key}
	<Color bind:value={strings[key]} label={key} />
{/each}
