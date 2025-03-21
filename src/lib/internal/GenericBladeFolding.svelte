<script context="module" lang="ts">
	import type { BladeOptions, BladeRef } from '$lib/core/Blade.svelte'
</script>

<script generics="T extends BladeOptions, U extends BladeRef" lang="ts">
	import type { ComponentProps } from 'svelte'
	import Blade from '$lib/core/Blade.svelte'
	import { updateCollapsibility } from '$lib/utils'

	type $$Props = {
		/**
		 * DOM class name of the button used to expand and collapse the blade's picker.
		 * @default `undefined`
		 * */
		buttonClass?: string
		/**
		 * Expand or collapse the blade's picker.
		 * @default `true`
		 * @bindable
		 * */
		expanded?: boolean
		/**
		 * The style of value "picker" to use in the blade.
		 * @default `'popup'`
		 */
		picker?: 'inline' | 'popup'
		/**
		 * Allow users to interactively expand / contract the value picker by clicking its icon.
		 *
		 * Most useful when `picker` is `inline`.
		 * @default `true`
		 * */
		userExpandable?: boolean
	} & ComponentProps<Blade<T, U>>

	// Reexport for bindability
	export let options: $$Props['options']
	export let ref: $$Props['ref'] = undefined

	// Unique props
	export let userExpandable: $$Props['userExpandable'] = true
	export let expanded: $$Props['expanded'] = undefined
	export let buttonClass: $$Props['buttonClass'] = ''
	export let picker: $$Props['picker'] = undefined // Technically not guaranteed, but advantages to assuming it's there for coherent userExpandable behavior

	//  can't be right, but no 'fold' event or 'expanded' value seems to be available
	let gotBlade = false
	const initialExpanded = expanded
	let internalExpanded = initialExpanded

	$: if (!gotBlade && ref) {
		gotBlade = true
		;(ref.controller as any)?.valueController?.foldable_
			?.value('expanded')

			.emitter.on('change', (event: any) => {
				internalExpanded = event.rawValue
				expanded = internalExpanded
			})
	}

	$: options = {
		...options,
		expanded: initialExpanded, // Only set once
		picker,
	}

	$: ref &&
		buttonClass !== undefined &&
		updateCollapsibility(userExpandable ?? true, ref.element, buttonClass)

	// Click instead of setting expanded to avoid  animation jankiness
	$: ref &&
		buttonClass !== undefined &&
		expanded !== internalExpanded &&
		ref.element.querySelectorAll(`.${buttonClass}`).length > 0 &&
		(ref.element.querySelector(`.${buttonClass}`) as HTMLButtonElement).click()
</script>

<!--
@component  
This component is for internal use only.

@sourceLink
[GenericBladeFolding.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/internal/GenericBladeFolding.svelte)
-->

<Blade bind:ref {options} {...$$restProps} />
