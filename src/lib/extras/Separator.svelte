<script lang="ts">
	import Blade from '../core/Blade.svelte';
	import type { ComponentProps } from 'svelte';
	import type {
		SeparatorBladeParams as SeparatorOptions,
		SeparatorBladeApi as SeparatorBladeRef
	} from 'tweakpane';
	import { BROWSER } from 'esm-env';

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface $$Props
		extends Omit<
			ComponentProps<Blade<SeparatorOptions, SeparatorBladeRef>>,
			'options' | 'ref' | 'plugin'
		> {}

	const options: SeparatorOptions = {
		view: 'separator'
	};
</script>

<!--
@component
A convenience component providing a subtle visual separator between controls, in the spirit of the HTML `<hr>` element.

Wraps Tweakpane's [separator blade](https://tweakpane.github.io/docs/blades/#separator).

Usage outside of a `<Pane>` component will implicitly wrap the separator in `<Pane position='inline'>`.

@example	
```tsx
<script lang="ts">
	import { Button, Separator } from 'svelte-tweakpane-ui';
</script>

<Button title="Oil" />
<Separator />
<Button title="Water" />
```

@sourceLink
-->

{#if BROWSER}
	<Blade {options} {...$$restProps} />
{/if}
