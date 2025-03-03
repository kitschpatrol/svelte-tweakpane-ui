<script context="module" lang="ts">
	import type { GenericInputOptions, GenericInputRef } from '$lib/internal/GenericInput.svelte'
	// Can't find picker options in the type definitions
	export type GenericInputFoldingOptions = { expanded?: boolean } & GenericInputOptions // Technically not shared, but useful
	export type GenericInputFoldingRef = GenericInputRef // No changes for now?
</script>

<script
	generics="T extends any, U extends GenericInputFoldingOptions = GenericInputFoldingOptions, V extends GenericInputFoldingRef = GenericInputFoldingRef"
	lang="ts"
>
	import type { ComponentProps } from 'svelte'
	import GenericInput from '$lib/internal/GenericInput.svelte'
	import { updateCollapsibility } from '$lib/utils.js'

	// TODO share prop definitions with GenericBladeFolding?
	type $$Props = {
		/**
		 * DOM class name of the button used to expand and collapse the input's picker.
		 * @default `undefined`
		 * */
		buttonClass?: string
		/**
		 * Expand or collapse the input's picker.
		 * @default `false`
		 * @bindable
		 * */
		expanded?: boolean
		/**
		 * The style of value "picker" to use in the input.
		 * @default `'popup'`
		 */
		picker?: 'inline' | 'popup' // Technically not guaranteed, but advantages to assuming it's there for coherent userExpandable behavior
		/**
		 * Allow users to interactively expand / contract the picker.
		 * @default `true`
		 * */
		userExpandable?: boolean
	} & ComponentProps<GenericInput<T, U, V>>

	// Reexport for bindability
	export let value: $$Props['value']
	export let ref: $$Props['ref'] = undefined
	export let options: $$Props['options'] = undefined

	// Unique props
	export let userExpandable: $$Props['userExpandable'] = true
	export let expanded: $$Props['expanded'] = false
	export let buttonClass: $$Props['buttonClass'] = ''
	export let picker: $$Props['picker'] = undefined

	let optionsInternal: GenericInputFoldingOptions

	// Can't be right, but no 'fold' event or 'expanded' value seems to be available, and setting /
	// reading directly from the ref doesn't seem to work
	let gotBinding = false
	const initialExpanded = expanded
	let internalExpanded = initialExpanded

	$: if (!gotBinding && ref) {
		gotBinding = true
		;(ref.controller as any)?.valueController?.foldable_
			?.value('expanded')

			.emitter.on('change', (event: any) => {
				internalExpanded = event.rawValue
				expanded = internalExpanded
			})
	}

	$: optionsInternal = {
		...options,
		expanded: initialExpanded, // Only set once
		picker,
	}

	// Click instead of setting expanded to avoid  animation jankiness
	$: ref && buttonClass && updateCollapsibility(userExpandable ?? true, ref.element, buttonClass)
	$: ref &&
		buttonClass &&
		expanded !== internalExpanded &&
		ref.element.querySelectorAll<HTMLButtonElement>(`.${buttonClass}`).length > 0 &&
		ref.element.querySelector<HTMLButtonElement>(`.${buttonClass}`)?.click()
</script>

<!--
@component  
This component is for internal use only.

@sourceLink
[GenericInputFolding.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/internal/GenericInputFolding.svelte)
-->

<GenericInput bind:value bind:ref on:change options={optionsInternal} {...$$restProps} />
