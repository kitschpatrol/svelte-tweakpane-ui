<script lang="ts">
	import type { ComponentProps } from 'svelte'
	import type {
		SeparatorBladeApi as SeparatorBladeRef,
		SeparatorBladeParams as SeparatorOptions,
	} from 'tweakpane'
	import { BROWSER } from 'esm-env'
	import Blade from '$lib/core/Blade.svelte'
	import ClsPad from '$lib/internal/ClsPad.svelte'

	// Note stacking multiple separators breaks SSR?

	type $$Props = Omit<
		ComponentProps<Blade<SeparatorOptions, SeparatorBladeRef>>,
		'options' | 'plugin' | 'ref'
	>

	const options: SeparatorOptions = {
		view: 'separator',
	}
</script>

<!--
@component  
A convenience component providing a subtle visual separator between controls, in the spirit of the
HTML `<hr>` element.

Wraps Tweakpane's [separator blade](https://tweakpane.github.io/docs/blades/#separator).

Usage outside of a `<Pane>` component will implicitly wrap the separator in `<Pane
position="inline">`.

@example  
```svelte
<script lang="ts">
  import { Button, Separator } from 'svelte-tweakpane-ui'
</script>

<Button title="Oil" />
<Separator />
<Button title="Water" />
```

@sourceLink
[Separator.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/core/Separator.svelte)
-->

{#if BROWSER}
	<Blade {options} {...$$restProps} />
{:else}
	<ClsPad extra={2} keysAdd={['containerVerticalPadding']} theme={$$props.theme} />
{/if}
