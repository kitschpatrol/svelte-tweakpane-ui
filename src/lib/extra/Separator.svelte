<script lang="ts">
	import Blade from '$lib/core/Blade.svelte';
	import type { ComponentProps } from 'svelte';
	import type { SeparatorBladeParams, BladeApi } from 'tweakpane';

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface $$Props
		extends Omit<
			ComponentProps<Blade<SeparatorBladeParams, BladeApi>>,
			'bladeParams' | 'bladeRef'
		> {}

	const bladeParams: SeparatorBladeParams = {
		view: 'separator'
	};
</script>

<!--
@component
A convenience component providing a subtle visual separator between controls, in the spirit of the HTML `<hr>` element.

Wraps Tweakpane's [separator blade](https://tweakpane.github.io/docs/blades/#separator).

Usage outside of a `<Pane>` component will implicitly wrap the separator in a `<InternalPaneInline>`.

Example:	
```tsx
<Button title="Oil" />
<Separator />
<Button title="Water" />
```
-->

<Blade {bladeParams} {...$$restProps} />
