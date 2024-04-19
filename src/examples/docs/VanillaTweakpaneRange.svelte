<script lang="ts">
	import { onMount } from 'svelte';
	import { Pane } from 'tweakpane';

	let params = {
		speed: 50
	};

	let container: HTMLDivElement;

	onMount(() => {
		const pane = new Pane({
			container
		});

		pane.addBinding(params, 'speed', {
			min: 0,
			max: 100
		});

		pane.on('change', () => {
			// Trigger Svelte reactivity
			params = params;
		});

		return () => {
			pane.dispose();
		};
	});
</script>

<div bind:this={container}></div>
<pre>
{params.speed}
</pre>
