<script context="module" lang="ts">
	import type { BindingObject, ValueChangeEvent } from '$lib/utils.js';

	export type AutoObjectChangeEvent = ValueChangeEvent<BindingObject>;
</script>

<script lang="ts">
	import { isColorObject } from '@tweakpane/core';
	import { Point2d } from '@tweakpane/core/dist/input-binding/point-2d/model/point-2d.js';
	import { Point3d } from '@tweakpane/core/dist/input-binding/point-3d/model/point-3d.js';
	import { Point4d } from '@tweakpane/core/dist/input-binding/point-4d/model/point-4d.js';
	import Text from '$lib/control/Text.svelte';
	import Binding from '$lib/core/Binding.svelte';
	import Folder from '$lib/core/Folder.svelte';
	import InternalPaneInline from '$lib/internal/InternalPaneInline.svelte';
	import type { Theme } from '$lib/theme.js';
	import type { Container, UnwrapCustomEvents } from '$lib/utils.js';
	import copy from 'fast-copy';
	import { createEventDispatcher, getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	// TODO what about the onchange event?

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

	// Inheriting here with ComponentEvents makes a documentation mess

	type $$Events = {
		/**
		 * Fires when a value in the `object` changes.
		 *
		 * _This event is provided for advanced use cases. It's usually preferred to bind to the `object` prop instead._
		 *
		 * The `event.details` payload includes a copy of the value and an `origin` field to distinguish between user-interactive changes (`internal`)
		 * and changes resulting from programmatic manipulation of the `object` (`external`).
		 *
		 * @extends ValueChangeEvent
		 * @event
		 * */
		change: AutoObjectChangeEvent;
	};

	const dispatch = createEventDispatcher<UnwrapCustomEvents<$$Events>>();

	const parentStore: Writable<Container> = getContext('parentStore');

	// ParsePointDimensionParams wasn't quite right for this
	function isPointObject(testObject: Record<string, unknown>): boolean {
		return (
			Point2d.isObject(testObject) || Point3d.isObject(testObject) || Point4d.isObject(testObject)
		);
	}

	function prettify(value: string, active: boolean = true) {
		if (!active) return value;

		// TODO title case would be nicer... Replace underscores, hyphens, and camel case with
		// spaces, and capitalize the first letter of each word
		return value
			.replaceAll(/([\da-z])([A-Z])/g, '$1 $2')
			.replaceAll(/[_-]+/g, ' ')
			.toLowerCase()
			.replaceAll(/\b[a-z]/g, (letter) => letter.toUpperCase());
	}

	function changeEventAggregator(event: ValueChangeEvent<unknown>) {
		// Repackage events to always provide the entire
		// object instead of just the changed key's value
		// to avoid the "where did this come from" question
		dispatch('change', {
			value: copy(object),
			origin: event.detail.origin
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
position="inline">`.

`<AutoObject>` was inspired by the
[`<TWPAutoMutable>`](https://github.com/MrFoxPro/solid-tweakpane/blob/master/src/automutable.tsx)
component in [Dmitriy Nikiforov's](https://github.com/MrFoxPro)
[solid-tweakpane](https://github.com/MrFoxPro/solid-tweakpane) library.

Plugin component behavior is not available in `<AutoObject>`.

@emits {AutoObjectChangeEvent} change - When `object` changes. (This event is provided for advanced use cases. Prefer binding to `object`.)

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

{#if parentStore}
	{#each Object.keys(object) as key (key)}
		{#if object[key].constructor === Object && !isColorObject(object[key]) && !isPointObject(object[key])}
			<Folder title={prettify(key, prettyLabels)}>
				<svelte:self
					bind:object={object[key]}
					bind:prettyLabels
					on:change={changeEventAggregator}
				/>
			</Folder>
		{:else if typeof object[key] === 'string'}
			<Text
				bind:value={object[key]}
				on:change={changeEventAggregator}
				label={prettify(key, prettyLabels)}
			/>
		{:else}
			<Binding
				bind:object
				on:change={changeEventAggregator}
				{key}
				label={prettify(key, prettyLabels)}
			/>
		{/if}
	{/each}
{:else}
	<InternalPaneInline {theme} userCreatedPane={false}>
		<svelte:self bind:object bind:prettyLabels on:change={changeEventAggregator} />
	</InternalPaneInline>
{/if}
