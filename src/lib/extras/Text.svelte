<script lang="ts">
	import GenericInput from '$lib/internal/GenericInput.svelte';
	import type { ComponentProps } from 'svelte';
	import { BROWSER } from 'esm-env';

	type $$Props = Omit<ComponentProps<GenericInput<string>>, 'options' | 'ref' | 'plugin'> & {
		/**
		 * A `string` value to control.
		 * @bindable
		 * */
		value: string;
	};

	// reexport for bindability
	export let value: $$Props['value'];
</script>

<!--
@component
A text field, in the spirit of the HTML `<input type="text">` element.

Updates to the bound value only happen on blur, not on every keystroke. (@todo live update mode?)

Wraps Tweakpane's [string binding](https://tweakpane.github.io/docs/input-bindings/#string).

Usage outside of a `<Pane>` component will implicitly wrap the text field in `<Pane position='inline'>`.

@example	
```tsx
<script lang="ts">
	import { Text } from 'svelte-tweakpane-ui';

	let text = 'Cosmic Manifold';
</script>

<Text bind:value={text} label="The Message" />
<pre>
	Message: {text}
</pre>
```

@sourceLink [Text.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/extras/Text.svelte)
-->

{#if BROWSER}
	<GenericInput bind:value {...$$restProps} />
{/if}
