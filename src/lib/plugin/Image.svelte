<script lang="ts" context="module">
	export type ImageValue = 'placeholder' | HTMLImageElement | string | File | undefined;
</script>

<script lang="ts">
	import GenericInput from '$lib/internal/GenericInput.svelte';
	import * as pluginModule from '@kitschpatrol/tweakpane-image-plugin';
	import type { PluginInputParams as ImageOptions } from '@kitschpatrol/tweakpane-image-plugin/dist/types/plugin.d.ts';
	import { BROWSER } from 'esm-env';
	import type { ComponentProps } from 'svelte';

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

Note some layout issues with the component itself...

@example
```svelte
<script lang="ts">
  import { Image, Button } from 'svelte-tweakpane-ui';

  let src = 'placeholder';
  let kittenIndex = 1;
</script>

<Image fit="contain" label="Image" bind:value={src} />
<Button
  label="Random Placeholder"
  title="Load Kitten"
  on:click={() => {
    src = `https://placekitten.com/1024/1024?image=${kittenIndex}`;
    kittenIndex = (kittenIndex % 16) + 1;
  }}
/>

<div class="demo">
  {#if src === 'placeholder'}
    <p>Tap “No Image” above to load an image from disk.</p>
  {:else}
    <img {src} alt="" />
  {/if}
</div>

<style>
  div.demo {
    background: linear-gradient(magenta, orange);
    width: 100%;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  div.demo > img {
    max-width: 80%;
    max-height: 80%;
  }

  div.demo > p {
    text-align: center;
    color: white;
    max-width: 50%;
  }
</style>
```

@sourceLink [Image.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/plugin/Image.svelte)
-->

{#if BROWSER}
	<GenericInput bind:value {options} plugin={pluginModule} {...$$restProps} />
{/if}
