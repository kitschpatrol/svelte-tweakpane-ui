<script lang="ts" generics="T extends BaseBladeParams, U extends BladeApi">
	import Blade from '../core/Blade.svelte';
	import { updateCollapsability } from '../utils.js';
	import type { PickerLayout } from '@tweakpane/core';
	import type { BaseBladeParams, BladeApi } from 'tweakpane';
	import type { ComponentProps } from 'svelte';

	interface $$Props extends ComponentProps<Blade<BaseBladeParams, BladeApi>> {
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
	export let bladeParams: $$Props['bladeParams'];
	export let bladeRef: $$Props['bladeRef'] = undefined;

	// unique
	export let clickToExpand: $$Props['clickToExpand'] = true;
	export let expanded: $$Props['expanded'] = undefined;
	export let buttonClass: $$Props['buttonClass'] = '';
	export let picker: $$Props['picker'] = undefined; // technically not guaranteed, but advantages to assuming it's there for coherent clickToExpand behavior

	//  can't be right, but no 'fold' event or 'expanded' value seems to be available
	let gotBlade = false;
	const initialExpanded = expanded;
	let internalExpanded = initialExpanded;

	$: if (!gotBlade && bladeRef) {
		gotBlade = true;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(bladeRef.controller as any)?.valueController?.foldable_
			?.value('expanded')
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.emitter.on('change', (e: any) => {
				internalExpanded = e.rawValue;
				expanded = internalExpanded;
			});
	}

	$: bladeParams = {
		...bladeParams,
		picker,
		expanded: initialExpanded // only set once
	};

	$: bladeRef &&
		buttonClass !== undefined &&
		updateCollapsability(clickToExpand ?? true, bladeRef.element, buttonClass);

	// click isntead of setting expanded
	// to avoid  animation jankiness
	$: bladeRef &&
		buttonClass !== undefined &&
		expanded !== internalExpanded &&
		bladeRef.element.getElementsByClassName(buttonClass).length > 0 &&
		(bladeRef.element.getElementsByClassName(buttonClass)[0] as HTMLButtonElement).click();
</script>

<!--
@component
This component is for internal use only.
-->

<Blade bind:bladeRef {bladeParams} {...$$restProps} />
