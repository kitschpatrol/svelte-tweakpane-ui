<script lang="ts">
	import type { Pane, SeparatorBladeApi } from 'tweakpane';
	import type { FolderApi, TabPageApi } from '@tweakpane/core';
	import { onDestroy, getContext, setContext } from 'svelte';

	let separator: SeparatorBladeApi;
	let parent: Pane | FolderApi | TabPageApi;
	export let disabled: boolean = false; // y tho

	if (typeof document !== 'undefined') {
		parent = getContext('parent');

		separator = parent.addBlade({
			view: 'separator',
			disabled
		});
	}

	onDestroy(() => {
		separator?.dispose();
	});

	$: separator && (separator.disabled = disabled);
</script>
