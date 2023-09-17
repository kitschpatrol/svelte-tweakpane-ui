<script lang="ts">
	import type { Pane, SeparatorBladeApi } from 'tweakpane';
	import type { FolderApi, TabPageApi } from '@tweakpane/core';
	import { onDestroy, getContext, setContext } from 'svelte';

	let separator: SeparatorBladeApi;
	let parent: Pane | FolderApi | TabPageApi;
	export let hidden: boolean = false;
	export let disabled: boolean = false; // y tho

	if (typeof document !== 'undefined') {
		parent = getContext('parent');

		separator = parent.addBlade({
			view: 'separator',
			disabled,
			hidden
		});
	}

	onDestroy(() => {
		separator?.dispose();
	});

	$: separator && (separator.hidden = hidden);
	$: separator && (separator.disabled = disabled);
</script>
