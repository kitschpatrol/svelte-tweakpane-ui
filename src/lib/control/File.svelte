<script context="module" lang="ts">
	import type { ValueChangeEvent } from '$lib/utilities.js'

	export type FileValue = File | undefined
	export type FileChangeEvent = ValueChangeEvent<FileValue>
</script>

<script lang="ts">
	import type { PluginInputParams } from '@kitschpatrol/tweakpane-plugin-file-import/dist/types/plugin.d.ts'
	import type { ComponentProps } from 'svelte'
	import ClsPad from '$lib/internal/ClsPad.svelte'
	import GenericInput from '$lib/internal/GenericInput.svelte'
	import { fillWith } from '$lib/utilities'
	import * as pluginModule from '@kitschpatrol/tweakpane-plugin-file-import'
	import { BROWSER } from 'esm-env'
	import { shallowEqual } from 'fast-equals'

	type FileValueInternal = File | null | string

	type $$Props = {
		/**
		 * File data, or `undefined` to clear the file input.
		 * @default `undefined`
		 * @bindable
		 */
		value?: FileValue

		/**
		 * Array of valid file extensions.
		 * @default Any file extension
		 */
		extensions?: string[] | undefined

		/**
		 * String shown when the user tries to upload an invalid filetype.
		 * @default `'Unaccepted file type.'`
		 */
		invalidExtensionMessage?: string | undefined

		/**
		 * Height of the file input drop zone, in rows.
		 * @default `3`
		 */
		rows?: number | undefined
	} & Omit<ComponentProps<GenericInput<FileValueInternal>>, 'plugin' | 'ref' | 'value'>

	// Unique
	export let value: $$Props['value'] = undefined
	export let rows: $$Props['rows'] = undefined
	export let invalidExtensionMessage: $$Props['invalidExtensionMessage'] = undefined
	export let extensions: $$Props['extensions'] = undefined

	// Inheriting here with ComponentEvents makes a documentation mess
	type $$Events = {
		/**
		 * Fires when `value` changes.
		 *
		 * _This event is provided for advanced use cases. It's usually preferred to bind to the `value` prop instead._
		 *
		 * The `event.details` payload includes a copy of the value and an `origin` field to distinguish between user-interactive changes (`internal`)
		 * and changes resulting from programmatic manipulation of the `value` (`external`).
		 *
		 * @extends ValueChangeEvent
		 * @event
		 * */
		change: FileChangeEvent
	}

	let internalValue: FileValueInternal

	function updateInternalValueFromValue() {
		// Manual difference checks required to prevent Svelte 5 infinite update loops
		const newInternalValue: FileValueInternal = value ?? ''
		if (!shallowEqual(internalValue, newInternalValue)) {
			// TODO copy?
			internalValue = newInternalValue
		}
	}

	function updateValueFromInternalValue() {
		// Manual difference checks required to prevent Svelte 5 infinite update loops
		if (internalValue instanceof File) {
			if (!shallowEqual(value, internalValue)) {
				// TODO copy?
				value = internalValue
			}
		} else if (value !== undefined) {
			value = undefined
		}
	}

	let options: PluginInputParams

	$: options = {
		extensions,
		filetypes: extensions,
		invalidFiletypeMessage: invalidExtensionMessage,
		lineCount: rows,
		view: 'file-input',
	}

	$: value, updateInternalValueFromValue()
	$: internalValue, updateValueFromInternalValue()
</script>

<!--
@component  

A file input control.

_Important: This component has some rough edges, and should be considered experimental._

Integrates the [File Input](https://github.com/LuchoTurtle/tweakpane-plugin-file-import/blob/main/src/plugin.ts) control from [LuchoTurtle's](https://github.com/LuchoTurtle) [tweakpane-plugin-file-import](https://github.com/LuchoTurtle/tweakpane-plugin-file-import) plugin. Some of the control's parameter names have been changed for consistency with the `<Image>` CompositionEvent.

Use the `<Image>` control instead if you're working with images and want to see a thumbnail preview of the image.

There is currently a known bug where change events' `origin` values are sometimes incorrect. (This issue is limited to this component.)

Usage outside of a `<Pane>` component will implicitly wrap the image control in `<Pane position="inline">`.
	
Note that _Svelte Tweakpane UI_ embeds a functionally identical [fork](https://github.com/kitschpatrol/tweakpane-plugin-file-import) of the plugin with build optimizations.


@emits {FileChangeEvent} change - When `value` changes. (This event is provided for advanced use cases. Prefer binding to `value`.)

@example  
```svelte
<script lang="ts">
  import { File, type FileValue } from '$lib';

  let file: FileValue;

  async function getFileBase64(file: FileValue): Promise<string> {
    if (file === undefined) return 'Your bytes here...';
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const { result } = reader;
        if (result && typeof result === 'string') resolve(result);
        else reject(new Error('Empty result'));
      });
      reader.addEventListener('error', reject);
      reader.readAsDataURL(file);
    });
  }

  function truncate(text: string, length: number) {
    return text.length > length ? text.slice(0, length - 1) + '...' : text;
  }
</script>

<File bind:value={file} label="File" />

<div class="demo">
  <p>
    {#await getFileBase64(file)}
      Loading...
    {:then value}
      {truncate(value, 512)}
    {/await}
  </p>
</div>

<style>
  .demo {
    width: 100%;
    background: linear-gradient(45deg, orange, magenta);
  }

  .demo > p {
    margin: 0;
    padding: 0.5rem;
    font-family: monospace;
    line-height: 1.2;
    color: white;
    word-break: break-all;
    white-space: pre-wrap;
  }
</style>
```

@sourceLink
[File.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/control/File.svelte)
-->

<GenericInput
	bind:value={internalValue}
	on:change
	{options}
	plugin={pluginModule}
	{...$$restProps}
/>
{#if !BROWSER}
	{#if rows}
		<ClsPad keysAdd={fillWith('containerUnitSize', rows)} theme={$$props.theme} />
	{:else}
		<ClsPad keysAdd={fillWith('containerUnitSize', 3)} theme={$$props.theme} />
	{/if}
{/if}
