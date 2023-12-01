<script lang="ts">
	import Text from '$lib/control/Text.svelte';
	import GenericBinding from '$lib/internal/GenericBinding.svelte';
	import type { ComponentProps } from 'svelte';

	type $$Props = Omit<
		ComponentProps<GenericBinding<boolean | number | object | string>>,
		'options' | 'plugin' | 'ref'
	>;

	export let value: $$Props['value'];
</script>

<!--
@component  
Rapid-development component which automatically creates a Tweakpane control for an arbitrary value.

A (reasonably) appropriate Tweakpane control will be used for the value type.

This component is intended for quick tests where you don't want to fuss with component selection or
customization.

See `<AutoObject>` for a variation that works directly on a stand-alone value that isn't wrapped in
an object.

The value is generally mapped to controls according to the logic outlined in the [Tweakpane input
binding documentation](https://tweakpane.github.io/docs/input-bindings/).

Plugin component behavior is not available in `<AutoValue>`.

@example  
```svelte
<script lang="ts">
  import { AutoValue } from 'svelte-tweakpane-ui';

  let number = 0;
  let color = '#ff00ff';
  let point = { x: 0, y: 0 };
  let text = 'Cosmic manifold';
</script>

<AutoValue bind:value={number} label="Number" />
<AutoValue bind:value={color} label="Color" />
<AutoValue bind:value={point} label="Point" />
<AutoValue bind:value={text} label="Text" />
```

-->
{#if typeof value === 'string'}
	<Text bind:value {...$$restProps} />
{:else}
	<GenericBinding bind:value {...$$restProps} />
{/if}
