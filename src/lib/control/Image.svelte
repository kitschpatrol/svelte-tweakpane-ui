<script context="module" lang="ts">
	import type { ValueChangeEvent } from '$lib/utils.js';

	export type ImageValue = 'placeholder' | File | HTMLImageElement | string | undefined;
	export type ImageChangeEvent = ValueChangeEvent<ImageValue>;
</script>

<script lang="ts">
	// TODO CLS prerendering slightly broken because component has fractional heights
	// TODO minor issues with internal vs. external event count

	import * as pluginModule from '@kitschpatrol/tweakpane-plugin-image';
	import type { PluginInputParams as ImageOptions } from '@kitschpatrol/tweakpane-plugin-image/dist/types/plugin.d.ts';
	import ClsPad from '$lib/internal/ClsPad.svelte';
	import GenericInput from '$lib/internal/GenericInput.svelte';
	import { fillWith } from '$lib/utils';
	import { BROWSER } from 'esm-env';
	import type { ComponentProps } from 'svelte';

	type $$Props = {
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
	} & Omit<ComponentProps<GenericInput<ImageValue>>, 'plugin' | 'ref' | 'value'>;

	// Unique
	export let value: $$Props['value'] = 'placeholder';
	export let fit: $$Props['fit'] = undefined;
	export let extensions: $$Props['extensions'] = undefined;

	// Inheriting here with ComponentEvents makes a documentation mess
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Events = {
		/**
		 * Fires when `value` changes.
		 *
		 * _This event is provided for advanced use cases. It's usually preferred to bind to the `value` prop instead._
		 *
		 * The `event.details` payload includes a copy of the value and an `origin` field to distinguish between user-interactive changes (`internal`)
		 * and changes resulting from programmatic manipulation of the `value` (`external`).
		 *
		 * @extends ValueChangeEvent
		 * @event
		 * */
		change: ImageChangeEvent;
	};

	let options: ImageOptions;

	$: options = {
		extensions,
		imageFit: fit,
		view: 'input-image'
	};
</script>

<!--
@component  

An image input control.

_Important: This component has some rough edges, and should be considered experimental._

Integrates the [tweakpane-image-plugin](https://github.com/metehus/tweakpane-image-plugin),
incorporating work by [Florian Morel](http://ayamflow.fr), [Matheus
Dias](https://www.linkedin.com/in/matheusdbs/), [Palash Bansal](https://github.com/repalash), and
others.

There is currently a known bug where change events' `origin` values are sometimes incorrect. (This issue is limited to this component.)

Usage outside of a `<Pane>` component will implicitly wrap the image control in `<Pane
position="inline">`.

Note that _Svelte Tweakpane UI_ embeds a functionally identical [fork](https://github.com/kitschpatrol/tweakpane-plugin-image) of the plugin with build optimizations. The fork also changes the package name to `@kitschpatrol/tweakpane-plugin-image` for consistency with other plugins.

@emits {ImageChangeEvent} change - When `value` changes. (This event is provided for advanced use cases. Prefer binding to `value`.)

@example  
```svelte
<script lang="ts">
  import { Button, Image } from 'svelte-tweakpane-ui';

  let source = 'placeholder';

  async function getRandomKittenUrl() {
    const { url } = await fetch(
      'https://source.unsplash.com/800x800/?kitten',
      { method: 'HEAD', redirect: 'follow' }
    );
    return url;
  }
</script>

<Image bind:value={source} fit="contain" label="Image" />
<Button
  on:click={async () => {
    source = await getRandomKittenUrl();
  }}
  label="Random Placeholder"
  title="Load Kitten"
/>

<div class="demo">
  {#if source === 'placeholder'}
    <p>Tap “No Image” above to load an image from disk.</p>
  {:else}
    <img alt="" src={source} />
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
[Image.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/control/Image.svelte)
-->

<GenericInput bind:value on:change {options} plugin={pluginModule} {...$$restProps} />
{#if !BROWSER}
	<ClsPad keysAdd={fillWith('containerVerticalPadding', 2)} theme={$$props.theme} />
{/if}
