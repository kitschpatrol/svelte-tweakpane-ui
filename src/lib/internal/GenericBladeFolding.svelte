<script lang="ts" generics="T extends BaseBladeParams, U extends BladeApi">
	import Blade from '../core/Blade.svelte';
	import type { Theme } from '../theme.js';
	import { updateCollapsability } from '../utils.js';
	import type { PickerLayout } from '@tweakpane/core';
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { BaseBladeParams, BladeApi } from 'tweakpane';

	// re-exported
	export let bladeParams: T;
	export let disabled: boolean = false;
	export let theme: Theme | undefined = undefined;
	export let bladeRef: U | undefined = undefined;

	// unique
	export let clickToExpand: boolean = true;
	export let expanded: boolean | undefined = undefined;
	export let buttonClass: string = '';
	export let picker: PickerLayout | undefined = undefined; // technically not guaranteed, but advantages to assuming it's there for coherent clickToExpand behavior

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

	$: bladeRef && updateCollapsability(clickToExpand, bladeRef.element, buttonClass);

	// click isntead of setting expanded
	// to avoid  animation jankiness
	$: bladeRef &&
		expanded !== internalExpanded &&
		bladeRef.element.getElementsByClassName(buttonClass).length > 0 &&
		(bladeRef.element.getElementsByClassName(buttonClass)[0] as HTMLButtonElement).click();
</script>

<!--
@component
This component is for internal use only.
-->

<Blade {disabled} bind:bladeRef {bladeParams} {theme} />
