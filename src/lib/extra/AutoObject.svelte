<script lang="ts">
	// Inspired by https://github.com/MrFoxPro/solid-tweakpane/blob/master/src/automutable.tsx

	import Binding from '$lib/core/Binding.svelte';
	import Folder from '$lib/core/Folder.svelte';
	import InternalPaneInline from '$lib/internal/InternalPaneInline.svelte';
	import type { Theme } from '$lib/theme.js';
	import type { TpContainer } from '$lib/utils.js';
	import type { Bindable } from '@tweakpane/core';
	import { BROWSER } from 'esm-env';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { isColorObject } from '@tweakpane/core';
	import { Point2d } from '@tweakpane/core/dist/input-binding/point-2d/model/point-2d.js';
	import { Point3d } from '@tweakpane/core/dist/input-binding/point-3d/model/point-3d.js';
	import { Point4d } from '@tweakpane/core/dist/input-binding/point-4d/model/point-4d.js';

	/** Custom color scheme. Only applies if the `<AutoObject>` is created outside a `<Pane>` component.  */
	export let theme: Theme | undefined = undefined;

	/** Transforms keys into more pleasant control labels (e.g. capitalization and spaces in lieu of camelCase, kebab-case, etc.)  */
	export let prettyLabels: boolean = true;

	/** Object to create an automatic set of Tweakpane controls for. Keys will be used as labels, and a (reasonably) appropriate Tweakpane control will be used for each value's type.  */
	export let params: Bindable;

	const parentStore: Writable<TpContainer> = getContext('parentStore');

	// parsePointDimensionParams wasn't quite right for this
	function isPointObject(obj: object): boolean {
		return Point2d.isObject(obj) || Point3d.isObject(obj) || Point4d.isObject(obj);
	}

	function prettify(value: string, active: boolean = true) {
		if (!active) return value;

		// TODO title case would be nicer...
		// Replace underscores, hyphens, and camel case with spaces, and capitalize the first letter of each word
		return value
			.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
			.replace(/[_\-]+/g, ' ')
			.toLowerCase()
			.replace(/\b[a-z]/g, function (letter) {
				return letter.toUpperCase();
			});
	}

	// all props stripped
	// const plainProps = stripProps($$props, 'theme', 'params', 'prettyLabels');
</script>

<!--
@component
Convenience component which creates a set of Tweakpane controls for an arbitrary object.

Object keys will be used as labels, and a (reasonably) appropriate Tweakpane control will be used for each value's type.

Records within the object will be wrap their contents in a `<Folder>` component.

Usage outside of a `<Pane>` component will implicitly wrap the component in a `<InternalPaneInline>`.


Example:	
  ```tsx
	<script>
    let params = {
      someNumber: 1, // creates a
      someBoolean: true, // creates a checkbox
      someString: 'test', // creates a text field
      somePoint: { // creates a point picker
        x: 1,
        y: 2
      },
      someColor: { // creates a color picker
        r: 255,
        g: 0,
        b: 55
      },
      someFolder: { // wraps children in a folder
        a: 1,
        b: 2,
        c: 3
      }
    };
	</script>

	<AutoObject bind:params />

	Value: {JSON.stringify(params)}
	```
	-->

{#if BROWSER}
	{#if parentStore}
		{#each Object.keys(params) as key (key)}
			{#if params[key].constructor === Object && !isColorObject(params[key]) && !isPointObject(params[key])}
				<Folder title={prettify(key, prettyLabels)}>
					<svelte:self bind:params={params[key]} bind:prettyLabels />
				</Folder>
			{:else}
				<Binding label={prettify(key, prettyLabels)} bind:params {key} />
			{/if}
		{/each}
	{:else}
		<InternalPaneInline userCreatedPane={false} {theme}>
			<svelte:self bind:params bind:prettyLabels />
		</InternalPaneInline>
	{/if}
{/if}
