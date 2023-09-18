<script lang="ts">
	import { onMount, onDestroy, setContext, tick } from 'svelte';
	import { Pane, type TpPluginBundle } from 'tweakpane';
	import { writable } from 'svelte/store';

	export let title: string | undefined = undefined;
	export let expanded: boolean = true;
	export let plugins: TpPluginBundle[] = [];

	const paneStore = writable<Pane | undefined>(undefined);
	setContext('parentStore', paneStore);

	let container: HTMLElement;

	onMount(() => {
		$paneStore = new Pane({ title, expanded });

		if ($paneStore !== undefined) {
			plugins.forEach((plugin) => $paneStore?.registerPlugin(plugin));
			$paneStore.on('fold', () => {
				$paneStore && (expanded = $paneStore.expanded);
			});
		}

		container.appendChild($paneStore.element);
	});

	onDestroy(() => {
		$paneStore?.dispose();
	});

	$: $paneStore && ($paneStore.title = title);
	$: $paneStore && ($paneStore.expanded = expanded);

	// TODO reactive plugins
	// TODO theme presets
</script>

<div class="container" bind:this={container}>
	<slot />
</div>

<style>
	.container {
		/* --tp-base-background-color: hsla(230, 5%, 90%, 1);
		--tp-base-shadow-color: hsla(0, 0%, 0%, 0.1);
		--tp-button-background-color: hsla(230, 7%, 75%, 1);
		--tp-button-background-color-active: hsla(230, 7%, 60%, 1);
		--tp-button-background-color-focus: hsla(230, 7%, 65%, 1);
		--tp-button-background-color-hover: hsla(230, 7%, 70%, 1);
		--tp-button-foreground-color: hsla(230, 10%, 30%, 1);
		--tp-container-background-color: hsla(230, 15%, 30%, 0.2);
		--tp-container-background-color-active: hsla(230, 15%, 30%, 0.32);
		--tp-container-background-color-focus: hsla(230, 15%, 30%, 0.28);
		--tp-container-background-color-hover: hsla(230, 15%, 30%, 0.24);
		--tp-container-foreground-color: hsla(230, 10%, 30%, 1);
		--tp-groove-foreground-color: hsla(230, 15%, 30%, 0.1);
		--tp-input-background-color: hsla(230, 15%, 30%, 0.1);
		--tp-input-background-color-active: hsla(230, 15%, 30%, 0.22);
		--tp-input-background-color-focus: hsla(230, 15%, 30%, 0.18);
		--tp-input-background-color-hover: hsla(230, 15%, 30%, 0.14);
		--tp-input-foreground-color: hsla(230, 10%, 30%, 1);
		--tp-label-foreground-color: hsla(230, 10%, 30%, 0.7);
		--tp-monitor-background-color: hsla(230, 15%, 30%, 0.1);
		--tp-monitor-foreground-color: hsla(230, 10%, 30%, 0.5); */
	}
</style>
