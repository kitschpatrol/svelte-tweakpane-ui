<script lang="ts">
	import type { Pane } from 'tweakpane';
	import type { ButtonApi, FolderApi, TabPageApi, TpEvent } from '@tweakpane/core';
	import { createEventDispatcher, onDestroy, getContext } from 'svelte';

	export let title: string = 'Button';
	export let label: string | undefined = undefined;
	export let disabled: boolean = false;

	const dispatch = createEventDispatcher();

	let button: ButtonApi;
	let parent: Pane | FolderApi | TabPageApi;

	if (typeof document !== 'undefined') {
		parent = getContext('parent');

		button = parent.addButton({
			title,
			label,
			disabled
		});
		button.on('click', () => {
			// TODO event types?
			// Does TpEvent with its target value make
			// any sense?
			dispatch('click');
		});
	}

	$: button && (button.title = title);
	$: button && (button.label = label);
	$: button && (button.disabled = disabled);

	onDestroy(() => {
		button?.dispose();
		parent?.remove(button);
	});
</script>
