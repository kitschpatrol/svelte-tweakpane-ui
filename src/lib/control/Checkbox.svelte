<script context="module" lang="ts">
	import type { ValueChangeEvent } from '$lib/utils.js'

	export type CheckboxChangeEvent = ValueChangeEvent<boolean>
</script>

<script lang="ts">
	import type { ComponentProps } from 'svelte'
	import GenericInput from '$lib/internal/GenericInput.svelte'

	type $$Props = Omit<ComponentProps<GenericInput<boolean>>, 'options' | 'plugin' | 'ref'>

	// Must redeclare for bindability
	export let value: $$Props['value']

	// Inheriting here with ComponentEvents makes a documentation mess

	type $$Events = {
		/**
		 * Fires when `value` changes.
		 *
		 * _This event is provided for advanced use cases. It's usually preferred to bind to the `value` prop instead._
		 *
		 * The `event.details` payload includes a copy of the value and an `origin` field to distinguish between user-interactive changes (`internal`)
		 * and changes resulting from programmatic manipulation of the `value` (`external`).
		 * @extends ValueChangeEvent
		 * @event
		 */
		change: CheckboxChangeEvent
	}
</script>

<!--
@component  
A checkbox.

Wraps Tweakpane's [boolean input binding](https://tweakpane.github.io/docs/input-bindings/#boolean).

Usage outside of a `<Pane>` component will implicitly wrap the checkbox in `<Pane position="inline">`.

@emits {CheckboxChangeEvent} change - When `value` changes. (This event is provided for advanced use cases. Prefer binding to `value`.)
	
@example  
```svelte
<script lang="ts">
  import { Checkbox } from 'svelte-tweakpane-ui'

  let reticulationEnabled: boolean = false
</script>

<Checkbox bind:value={reticulationEnabled} label="Reticulation" />
<pre>Enabled: {reticulationEnabled}</pre>
```

@sourceLink
[Checkbox.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/control/Checkbox.svelte)
-->

<GenericInput bind:value on:change {...$$restProps} />
