<script context="module" lang="ts">
	import type { ValueChangeEvent } from '$lib/utils.js'

	export type AutoValueChangeEvent = ValueChangeEvent<boolean | number | object | string>
</script>

<script lang="ts">
	import type { ComponentProps } from 'svelte'
	import Text from '$lib/control/Text.svelte'
	import GenericBinding from '$lib/internal/GenericBinding.svelte'

	type $$Props = Omit<
		ComponentProps<GenericBinding<boolean | number | object | string>>,
		'options' | 'plugin' | 'ref'
	>

	// Inheriting here with ComponentEvents makes a documentation mess

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
		change: AutoValueChangeEvent
	}

	export let value: $$Props['value']
</script>

<!--
@component  
Rapid-development component which automatically creates a Tweakpane control for an arbitrary value.

A (reasonably) appropriate Tweakpane control will be used for the value type.

This component is intended for quick tests where you don't want to fuss with component selection or
customization.

See `<AutoObject>` for a variation that creates controls for multiple values in an object.

The value is generally mapped to controls according to the logic outlined in the [Tweakpane input
binding documentation](https://tweakpane.github.io/docs/input-bindings/).

Plugin component behavior is not available in `<AutoValue>`.

@emits {AutoValueChangeEvent} change - When `value` changes. (This event is provided for advanced use cases. Prefer binding to `value`.)

@example  
```svelte
<script lang="ts">
  import { AutoValue } from 'svelte-tweakpane-ui'

  let number = 0
  let color = { r: 255, g: 0, b: 255 }
  let point = { x: 0, y: 0 }
  let text = 'Cosmic manifold'
</script>

<AutoValue bind:value={number} label="Number" />
<AutoValue bind:value={color} label="Color" />
<AutoValue bind:value={point} label="Point" />
<AutoValue bind:value={text} label="Text" />
```

@sourceLink
[AutoValue.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/extra/AutoValue.svelte)
-->

{#if typeof value === 'string'}
	<Text bind:value on:change {...$$restProps} />
{:else}
	<GenericBinding bind:value on:change {...$$restProps} />
{/if}
