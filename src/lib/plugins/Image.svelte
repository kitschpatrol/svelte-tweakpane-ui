<script lang="ts" context="module">
	export type ImageValue = 'placeholder' | HTMLImageElement | string | File | undefined;
</script>

<script lang="ts">
	import GenericInput from '$lib/internal/GenericInput.svelte';
	import * as pluginModule from 'tweakpane-image-plugin';
	import type { ComponentProps } from 'svelte';
	import type { PluginInputParams as ImageOptions } from 'tweakpane-image-plugin/dist/types/plugin.d.ts';
	import { BROWSER } from 'esm-env';

	type $$Props = Omit<ComponentProps<GenericInput<ImageValue>>, 'plugin' | 'value' | 'ref'> & {
		/**
		 * How to display the image in the preview pane.
		 *
		 * Renamed from `imageFit` in `tweakpane-image-plugin` for concision.
		 * @default `'cover'`
		 */
		fit?: 'contain' | 'cover';
		/**
		 * Array of image extension types to accept.
		 * @default `['.jpg', '.png', '.gif']`
		 */
		extensions?: string[];
		/**
		 * Image data
		 * @default `'placeholder'`
		 * @bindable
		 */
		value?: ImageValue;
	};

	// unique
	export let value: $$Props['value'] = 'placeholder';
	export let fit: $$Props['fit'] = undefined;
	export let extensions: $$Props['extensions'] = undefined;

	let options: ImageOptions;

	$: BROWSER &&
		(options = {
			view: 'input-image',
			imageFit: fit,
			extensions
		});
</script>

<!--
@component
TODO

@example
```tsx
TODO
```

@sourceLink [Image.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/plugins/Image.svelte)
-->

{#if BROWSER}
	<GenericInput bind:value {options} plugin={pluginModule} {...$$restProps} />
{/if}
