<script lang="ts">
	import { onMount } from 'svelte';
	import { Pane } from 'tweakpane';

	let PARAMS = {
		speed: 50
	};

	let container: HTMLDivElement;

	onMount(() => {
		const pane = new Pane({
			container: container
		});

		pane.addBinding(PARAMS, 'speed', {
			min: 0,
			max: 100
		});

		pane.on('change', () => {
			// trigger svelte reactivity
			PARAMS = PARAMS;
		});

		return () => {
			pane.dispose();
		};
	});
</script>

<div bind:this={container} />
<pre>
{PARAMS.speed}
</pre>
