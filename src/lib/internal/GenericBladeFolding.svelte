<script lang="ts" context="module">
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { BladeOptions, BladeRef } from '../core/Blade.svelte';
</script>

<script lang="ts" generics="T extends BladeOptions, U extends BladeRef">
	import Blade from '../core/Blade.svelte';
	import { updateCollapsability } from '../utils.js';
	import type { PickerLayout } from '@tweakpane/core';
	import type { ComponentProps } from 'svelte';

	interface $$Props extends ComponentProps<Blade<T, U>> {
		/** TODO docs */
		clickToExpand?: boolean;
		/** TODO docs */
		expanded?: boolean;
		/** TODO docs */
		buttonClass?: string;
		/** TODO docs */
		picker?: PickerLayout;
	}

	// re-exported
	export let options: $$Props['options'];
	export let ref: $$Props['ref'] = undefined;

	// unique
	export let clickToExpand: $$Props['clickToExpand'] = true;
	export let expanded: $$Props['expanded'] = undefined;
	export let buttonClass: $$Props['buttonClass'] = '';
	export let picker: $$Props['picker'] = undefined; // technically not guaranteed, but advantages to assuming it's there for coherent clickToExpand behavior

	//  can't be right, but no 'fold' event or 'expanded' value seems to be available
	let gotBlade = false;
	const initialExpanded = expanded;
	let internalExpanded = initialExpanded;

	$: if (!gotBlade && ref) {
		gotBlade = true;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(ref.controller as any)?.valueController?.foldable_
			?.value('expanded')
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.emitter.on('change', (e: any) => {
				internalExpanded = e.rawValue;
				expanded = internalExpanded;
			});
	}

	$: options = {
		...options,
		picker,
		expanded: initialExpanded // only set once
	};

	$: ref &&
		buttonClass !== undefined &&
		updateCollapsability(clickToExpand ?? true, ref.element, buttonClass);

	// click isntead of setting expanded
	// to avoid  animation jankiness
	$: ref &&
		buttonClass !== undefined &&
		expanded !== internalExpanded &&
		ref.element.getElementsByClassName(buttonClass).length > 0 &&
		(ref.element.getElementsByClassName(buttonClass)[0] as HTMLButtonElement).click();
</script>

<!--
@component
This component is for internal use only.
-->

<Blade bind:ref {options} {...$$restProps} />
