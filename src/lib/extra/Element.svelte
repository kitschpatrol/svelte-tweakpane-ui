<script lang="ts">
	import type { BladeOptions, BladeRef } from '$lib/core/Blade.svelte';
	import Blade from '$lib/core/Blade.svelte';
	import { BROWSER } from 'esm-env';
	import type { ComponentProps } from 'svelte';

	// TODO more specific escape that just removes tweakpane css?
	// TODO maybe expose scrollable prop?

	type $$Props = Omit<
		ComponentProps<Blade<BladeOptions, BladeRef>>,
		'disabled' | 'options' | 'plugin' | 'ref'
	> & {
		/**
		 * Maximum height of the element block, in pixels.
		 * By default, the element block will expand vertically to fit its contents, but clip any horizontal excess.
		 * @default `undefined` (no max height)
		 */
		maxHeight?: boolean;
		/**
		 * Whether to reset the CSS of the element block to its default values.
		 * Avoids inheritance of Tweakpane's CSS styles.
		 * Note that this uses a simple `all: initial;` rule.
		 * @default `true`
		 */
		resetStyle?: boolean;
	};

	export let maxHeight: $$Props['maxHeight'] = undefined;
	export let resetStyle: $$Props['resetStyle'] = true;

	// pretend we're a separator blade seems to require a view
	// the <hr> is replaced immediately with the slot contents
	const options: BladeOptions = {
		view: 'separator'
	};

	let ref: BladeRef;
	let sourceDiv: HTMLDivElement;

	// hoist the slot into the blade
	$: if (BROWSER && ref && ref.element) {
		console.log('swapping separator');

		ref.element.replaceChildren(sourceDiv);
	}
</script>

<!--
@component

A convenience component for embedding arbitrary HTML elements into a pane.

Any children wrapped in this component will be rendered into the pane. Any content larger than the pane in the horizontal axis will be clipped.

Useful for quickly prototyping UIs, or adding content to a pane that's not easily represented by the built-in components.

Think of this component as an escape hatch for getting something into the pane that you couldn't otherwise, but it's recommended to abstract new functionality for reuse by extending one of the internal component types in 'svelte-tweakplane-ui', or better yet by creating a new [Tweakpane Plugin](https://github.com/tweakpane/plugin-template).

In many cases, this component should not be necesary because `svelte-tweakpane-ui` already makes it easy to combine tweakpane components with other inline elements simply by not using a wrapping `<Pane>` component. It should generally be the most useful when you're using `<Pane position='draggable'>`	or `<Pane position='fixed'>` and you want a custom element embedded in the pane.

Usage outside of a `<Pane>` component doesn't make a ton of sense, but in such a case the `<Element>` will be implicitly wrapped in `<Pane position='inline'>`.

@example
```svelte
<script lang="ts">
  import { Button, Element, Pane, Wheel } from 'svelte-tweakpane-ui';

  let gradientAngle = 45;
  let textAngle = 0;
</script>

<Pane position="inline" title="Element Demo">
  <Wheel
    bind:value={gradientAngle}
    format={(v) => `${(Math.abs(v) % 360).toFixed(0)}°`}
    label="Gradient Angle"
    pointerScale={-5}
  />
  <Wheel
    bind:value={textAngle}
    format={(v) => `${(Math.abs(v) % 360).toFixed(0)}°`}
    label="Text Angle"
    pointerScale={-2}
  />
  <Element>
    <div class="demo" style:--a="{gradientAngle}deg">
      <p style:rotate="{textAngle}deg">
        <code>&lt;Pane&gt;</code><br />
        <code>&lt;Element&gt;</code><br />
        Whatever you want.
        <code>&lt;/Element&gt;</code><br />
        <code>&lt;/Pane&gt;</code>
      </p>
    </div>
  </Element>
  <Button
    disabled={gradientAngle == 45 && textAngle == 0}
    on:click={() => {
      gradientAngle = 45;
      textAngle = 0;
    }}
    title="Reset"
  />
</Pane>

<style>
  .demo {
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
    width: 100%;
    background: linear-gradient(var(--a), orange, magenta);
  }

  .demo > p {
    font-family: sans-serif;
    font-size: 10cqw;
    color: white;
    text-align: center;
  }

  .demo > p > code {
    color: white;
  }
</style>
```

@sourceLink [Element.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/extra/Element.svelte)
-->

{#if BROWSER}
	<Blade bind:ref {options} {...$$restProps} />
	<div bind:this={sourceDiv} class="element">
		<div class="element-container" style:max-height="{maxHeight}px">
			<div class:reset={resetStyle}>
				<slot />
			</div>
		</div>
	</div>
{/if}

<style>
	div.element {
		padding-right: var(--cnt-hp);
		padding-left: var(--cnt-hp);
	}

	div.element-container {
		overflow: hidden;
		border-radius: var(--bld-br);
	}

	div.reset {
		all: initial;
	}
</style>
