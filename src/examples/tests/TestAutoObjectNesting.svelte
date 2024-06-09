<script lang="ts">
	// https://github.com/kitschpatrol/svelte-tweakpane-ui/issues/10
	import { AutoObject } from '$lib';

	let object = {
		aFolder: {
			aSetting: 0,
			bFolder: {
				bSetting: 0,
				cFolder: {
					cSetting: 0
				}
			}
		}
	};
</script>

<AutoObject bind:object />

<pre>Value: <span>{JSON.stringify(object)}</span></pre>
