<script lang="ts">
	import GenericInput from '$lib/internal/GenericInput.svelte';
	import { BROWSER } from 'esm-env';
	import type { ComponentProps } from 'svelte';

	type $$Props = Omit<ComponentProps<GenericInput<boolean>>, 'options' | 'ref' | 'plugin'>;

	// must redeclare for bindability
	export let value: $$Props['value'];
</script>

<!--
@component
A checkbox.

Wraps Tweakpane's [boolean input binding](https://tweakpane.github.io/docs/input-bindings/#boolean).

Usage outside of a `<Pane>` component will implicitly wrap the checkbox in `<Pane position='inline'>`.

@example	
```tsx
<script lang="ts">
	import { Checkbox } from 'svelte-tweakpane-ui';

	let reticulationEnabled: boolean = false;
</script>

<Checkbox label="Reticulation" bind:value={reticulationEnabled} />
<pre>
	Enabled: {reticulationEnabled}
</pre>
```

@sourceLink
-->

{#if BROWSER}
	<GenericInput bind:value {...$$restProps} />
{/if}
