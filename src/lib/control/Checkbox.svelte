<script lang="ts">
	import GenericInput from '$lib/internal/GenericInput.svelte';
	import type { ComponentProps } from 'svelte';

	type $$Props = Omit<ComponentProps<GenericInput<boolean>>, 'options' | 'plugin' | 'ref'>;

	// must redeclare for bindability
	export let value: $$Props['value'];
</script>

<!--
@component  
A checkbox.

Wraps Tweakpane's [boolean input binding](https://tweakpane.github.io/docs/input-bindings/#boolean).

Usage outside of a `<Pane>` component will implicitly wrap the checkbox in `<Pane
position='inline'>`.

@example  
```svelte
<script lang="ts">
  import { Checkbox } from 'svelte-tweakpane-ui';

  let reticulationEnabled: boolean = false;
</script>

<Checkbox bind:value={reticulationEnabled} label="Reticulation" />
<pre>Enabled: {reticulationEnabled}</pre>
```

@sourceLink
[Checkbox.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/control/Checkbox.svelte)
-->

<GenericInput bind:value {...$$restProps} />
