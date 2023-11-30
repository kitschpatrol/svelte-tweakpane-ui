<script lang="ts">
	import { isColorObject } from '@tweakpane/core';
	import { Point2d } from '@tweakpane/core/dist/input-binding/point-2d/model/point-2d.js';
	import { Point3d } from '@tweakpane/core/dist/input-binding/point-3d/model/point-3d.js';
	import { Point4d } from '@tweakpane/core/dist/input-binding/point-4d/model/point-4d.js';
	import Binding from '$lib/core/Binding.svelte';
	import Folder from '$lib/core/Folder.svelte';
	import Text from '$lib/extra/Text.svelte';
	import InternalPaneInline from '$lib/internal/InternalPaneInline.svelte';
	import type { Theme } from '$lib/theme.js';
	import type { BindingObject, Container } from '$lib/utils.js';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	/**
	 * Custom color scheme.
	 * @default `undefined`  \
	 * Inherits default Tweakpane theme equivalent to `ThemeUtils.presets.standard`, or the theme
	 * set with `setGlobalDefaultTheme()`.
	 * */
	export let theme: Theme | undefined = undefined;

	/**
	 * Transforms keys into more pleasant control labels (e.g. capitalization and spaces in lieu of
	 * camelCase, kebab-case, etc.)
	 * @default `true`
	 * */
	export let prettyLabels: boolean = true;

	/**
	 * Object to create an automatic set of Tweakpane controls for.
	 *
	 * Keys will be used as labels, and a (reasonably) appropriate Tweakpane control will be used
	 * for each value's type.
	 * @bindable
	 * */
	export let object: BindingObject;

	const parentStore: Writable<Container> = getContext('parentStore');

	// parsePointDimensionParams wasn't quite right for this
	function isPointObject(obj: object): boolean {
		return Point2d.isObject(obj) || Point3d.isObject(obj) || Point4d.isObject(obj);
	}

	function prettify(value: string, active: boolean = true) {
		if (!active) return value;

		// TODO title case would be nicer... Replace underscores, hyphens, and camel case with
		// spaces, and capitalize the first letter of each word
		return value
			.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
			.replace(/[_-]+/g, ' ')
			.toLowerCase()
			.replace(/\b[a-z]/g, (letter) => {
				return letter.toUpperCase();
			});
	}
</script>

<!--
@component  
Rapid-development component which automatically creates a set of Tweakpane controls for an arbitrary
object.

Object keys will be used as labels, and a (reasonably) appropriate Tweakpane control will be used
for each value's type.

Values are generally mapped to controls according to the logic outlined in the [Tweakpane input
binding documentation](https://tweakpane.github.io/docs/input-bindings/).

This component is intended for quick tests where you want "best guess" non-customizable controls for
an entire object, without considering the ideal component for each value.

See `<AutoValue>` for a variation that works directly on a stand-alone value that isn't wrapped in
an object.

Records within the object will wrap their contents in a `<Folder>` component. Value objects in the
shape of color or point objects will show a more specialized control.

Usage outside of a `<Pane>` component will implicitly wrap the component in `<Pane
position='inline'>`.

`<AutoObject>` was inspired by the
[`<TWPAutoMutable>`](https://github.com/MrFoxPro/solid-tweakpane/blob/master/src/automutable.tsx)
component in [Dmitriy Nikiforov's](https://github.com/MrFoxPro)
[solid-tweakpane](https://github.com/MrFoxPro/solid-tweakpane) library.

Plugin component behavior is not available in `<AutoObject>`.

@example  
```svelte
<script lang="ts">
  import { AutoObject } from 'svelte-tweakpane-ui';

  let object = {
    // Creates a <Checkbox>
    someBoolean: true,
    // Creates a <Color> picker
    someColor: {
      r: 255,
      g: 0,

      b: 55
    },
    // Wraps children in a <Folder>
    someFolder: {
      b: 2,
      a: 1,
      c: 3
    },
    // Creates a <Slider>
    someNumber: 1,
    // creates a <Point>
    somePoint: {
      x: 1,
      y: 2
    },
    // Creates a <Text>
    someString: 'test'
  };
</script>

<AutoObject bind:object />

<pre>{JSON.stringify(object, null, 2)}</pre>
```

@sourceLink
[AutoObject.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/extra/AutoObject.svelte)
-->

{#if parentStore} {#each Object.keys(object) as key (key)} {#if object[key].constructor === Object
&& !isColorObject(object[key]) && !isPointObject(object[key])}
			<Folder title={prettify(key, prettyLabels)}>
				<svelte:self bind:object={object[key]} bind:prettyLabels />
			</Folder>
		{:else if typeof object[key] === 'string'}
			<Text bind:value={object[key]} label={prettify(key, prettyLabels)} /> {:else}
			<Binding bind:object {key} label={prettify(key, prettyLabels)} /> {/if} {/each} {:else}
	<InternalPaneInline {theme} userCreatedPane={false}>
		<svelte:self bind:object bind:prettyLabels />
	</InternalPaneInline>
{/if}
