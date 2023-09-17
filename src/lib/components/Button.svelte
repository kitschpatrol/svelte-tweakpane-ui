<script lang="ts">
	import type { Pane } from 'tweakpane';
	import type { ButtonApi, FolderApi, TabPageApi, TpEvent } from '@tweakpane/core';
	import { onMount, onDestroy, getContext } from 'svelte';

	export let title: string = 'Button';
	export let label: string | undefined = undefined;
	export let hidden: boolean = false;
	export let disabled: boolean = false;

	// TODO dispatch proper event?
	export let onClick: (ev: TpEvent) => void = () => {};

	let button: ButtonApi;
	let parent: Pane | FolderApi | TabPageApi;

	if (typeof document !== 'undefined') {
		parent = getContext('parent');

		button = parent.addButton({
			title,
			label,
			hidden,
			disabled
		});
		button.on('click', (e) => {
			onClick(e);
		});
	}

	$: button && (button.title = title);
	$: button && (button.label = label);
	$: button && (button.hidden = hidden);
	$: button && (button.disabled = disabled);

	onDestroy(() => {
		button?.dispose();
		parent?.remove(button);
	});
</script>
