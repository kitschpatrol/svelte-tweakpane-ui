<script lang="ts">
	import { File, type FileValue } from '$lib';

	let file: FileValue;

	let binding1InternalEventCount = 0;
	let binding1ExternalEventCount = 0;
	let binding2InternalEventCount = 0;
	let binding2ExternalEventCount = 0;
</script>

<File
	bind:value={file}
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			binding1InternalEventCount++;
		} else {
			binding1ExternalEventCount++;
		}
	}}
	label="File 1"
/>
<File
	bind:value={file}
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			binding2InternalEventCount++;
		} else {
			binding2ExternalEventCount++;
		}
	}}
	label="File 2"
/>

<pre>Value: <span>{file}</span></pre>
<pre>Binding 1 Internal: <span>{binding1InternalEventCount}</span></pre>
<pre>Binding 1 External: <span>{binding1ExternalEventCount}</span></pre>
<pre>Binding 2 Internal: <span>{binding2InternalEventCount}</span></pre>
<pre>Binding 2 External: <span>{binding2ExternalEventCount}</span></pre>
