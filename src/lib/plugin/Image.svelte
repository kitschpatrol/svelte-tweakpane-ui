<script context="module" lang="ts">
	export type ImageValue = 'placeholder' | File | HTMLImageElement | string | undefined;
</script>

<script lang="ts">
	import * as pluginModule from '@kitschpatrol/tweakpane-image-plugin';
	import type { PluginInputParams as ImageOptions } from '@kitschpatrol/tweakpane-image-plugin/dist/types/plugin.d.ts';
	import GenericInput from '$lib/internal/GenericInput.svelte';
	import { BROWSER } from 'esm-env';
	import type { ComponentProps } from 'svelte';

	type $$Props = Omit<ComponentProps<GenericInput<ImageValue>>, 'plugin' | 'ref' | 'value'> & {
		/**
		 * Image data
		 * @default `'placeholder'`
		 * @bindable
		 */
		value?: ImageValue;
		/**
		 * Array of image extension types to accept.
		 * @default `['.jpg', '.png', '.gif']`
		 */
		extensions?: string[];
		/**
		 * How to display the image in the preview pane.
		 *
		 * Renamed from `imageFit` in `tweakpane-image-plugin` for concision.
		 * @default `'cover'`
		 */
		fit?: 'contain' | 'cover';
	};

	// unique
	export let value: $$Props['value'] = 'placeholder';
	export let fit: $$Props['fit'] = undefined;
	export let extensions: $$Props['extensions'] = undefined;

	let options: ImageOptions;

	$: BROWSER &&
		(options = {
			extensions,
			imageFit: fit,
			view: 'input-image'
		});
</script>

<!--
@component  

An image input control.

Integrates the [tweakpane-image-plugin](https://github.com/metehus/tweakpane-image-plugin),
incorporating work by [Florian Morel](http://ayamflow.fr), [Matheus
Dias](https://www.linkedin.com/in/matheusdbs/), [Palash Bansal](https://github.com/repalash), and
others.

Note that `svelte-tweakpane-ui` embeds a
[fork](https://github.com/kitschpatrol/tweakpane-image-plugin) of the plugin with support for
Tweakpane 4. The dependency will be updated to point to the source repository if / when the open
[pull request](https://github.com/metehus/tweakpane-image-plugin/pull/1) with Tweakpane 4 support is
merged.

Usage outside of a `<Pane>` component will implicitly wrap the image control in `<Pane
position='inline'>`.

@example  
```svelte
<script lang="ts">
  import { Button, Image } from 'svelte-tweakpane-ui';

  let src = 'placeholder';
  let kittenIndex = 1;
</script>

<Image bind:value={src} fit="contain" label="Image" />
<Button
  on:click={() => {
    src = `https://placekitten.com/1024/1024?image=${kittenIndex}`;
    kittenIndex = (kittenIndex % 16) + 1;
  }}
  label="Random Placeholder"
  title="Load Kitten"
/>

<div class="demo">
  {#if src === 'placeholder'}
    <p>Tap “No Image” above to load an image from disk.</p>
  {:else}
    <img alt="" {src} />
  {/if}
</div>

<style>
  div.demo {
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
    width: 100%;
    background: linear-gradient(magenta, orange);
  }

  div.demo > img {
    max-width: 80%;
    max-height: 80%;
  }

  div.demo > p {
    max-width: 50%;
    color: white;
    text-align: center;
  }
</style>
```

@sourceLink
[Image.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/plugin/Image.svelte)
-->

{#if BROWSER}
	<GenericInput bind:value {options} plugin={pluginModule} {...$$restProps} />
{/if}
