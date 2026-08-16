<script lang="ts">
	import { Binding, List } from '$lib'
	import AutoObject from '$lib/extra/AutoObject.svelte'

	const testObjectA = {
		someBoolean: true,
		someColor: {
			r: 255,
			g: 0,
			b: 55,
		},
		someFolder: {
			a: 1,
			b: 2,
			c: 3,
		},
		someNumber: 1,
		somePoint: {
			x: 1,
			y: 2,
		},
		someString: 'test',
	}

	const testObjectB = {
		someBoolean: false,
		someFolder: {
			a: 1,
			b: 2,
			c: 3,
			d: 4,
			e: 5,
			r: 3,
		},
		someNumber: 3,
		someOtherColor: {
			r: 0,
			g: 55,
			b: 55,
		},
		someOtherPoint: {
			f: 3,
			x: 1,
			y: 2,
			z: 2,
		},
		someString: 'test',
	}

	const testOptions = { b: testObjectA, a: testObjectB }

	let activeObject = testObjectA

	$: console.log('activeObject', activeObject)
</script>

// Noticed issues with re-assigning the object when working on Tweakpane CSS with STUI version 1.2.6

<List options={testOptions} bind:value={activeObject} />
<hr />
<Binding key="someBoolean" bind:object={activeObject} />
<hr />
<Binding key="someNumber" bind:object={activeObject} />
<hr />
<AutoObject bind:object={activeObject} />
