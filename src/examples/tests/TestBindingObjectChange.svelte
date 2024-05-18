<script lang="ts">
	import { Binding, List } from '$lib';
	import AutoObject from '$lib/extra/AutoObject.svelte';

	let testObjectA = {
		someBoolean: true,
		someColor: {
			r: 255,
			g: 0,
			b: 55
		},
		someFolder: {
			b: 2,
			a: 1,
			c: 3
		},
		someNumber: 1,
		somePoint: {
			x: 1,
			y: 2
		},
		someString: 'test'
	};

	let testObjectB = {
		someBoolean: false,
		someFolder: {
			r: 3,
			b: 2,
			a: 1,
			c: 3,
			d: 4,
			e: 5
		},
		someNumber: 3,
		someOtherColor: {
			r: 0,
			g: 55,
			b: 55
		},
		someOtherPoint: {
			x: 1,
			y: 2,
			z: 2,
			f: 3
		},
		someString: 'test'
	};

	const testOptions = { b: testObjectA, a: testObjectB };

	let activeObject = testObjectA;

	$: {
		console.log('activeObject', activeObject);
	}
</script>

// Noticed issues with re-assigning the object when working on Tweakpane CSS with STUI version 1.2.6

<List bind:value={activeObject} options={testOptions} />
<hr />
<Binding bind:object={activeObject} key="someBoolean" />
<hr />
<Binding bind:object={activeObject} key="someNumber" />
<hr />
<AutoObject bind:object={activeObject} />
