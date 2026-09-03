<script lang="ts">
	import { onMount } from 'svelte'
	import {
		AutoObject,
		Binding,
		type BindingObject,
		Blade,
		Button,
		ButtonGrid,
		Color,
		ColorPlus,
		CubicBezier,
		type CubicBezierValueTuple,
		Element,
		Folder,
		FpsGraph,
		List,
		type ListOptions,
		Monitor,
		Pane,
		Point,
		type PointOptions,
		type PointValue2d,
		type PointValue3d,
		type PointValue4d,
		Profiler,
		type ProfilerMeasure,
		RadioGrid,
		Ring,
		RotationEuler,
		type RotationEulerValueObject,
		RotationQuaternion,
		type RotationQuaternionValueObject,
		Separator,
		Slider,
		TabGroup,
		TabPage,
		Text,
		Textarea,
		type Theme,
		ThemeUtils,
		WaveformMonitor,
		Wheel,
	} from '$lib'
	let text = 'Cosmic Manifold'
	let waveData = [5, 6, 7, 8, 9, 3, 9, 8, 7, 6, 5]

	setInterval(() => {
		waveData = waveData.map((v) => Math.max(0, Math.min(10, v + (Math.random() * 2 - 1) * 0.5)))
	}, 10)

	let selection: number = 1
	const options: ListOptions<number> = { a: 1, b: 2, c: 3 }

	let booleanToMonitor = false
	let stringToMonitor = 'Reticulating'
	let numberToMonitor = 85

	setInterval(() => {
		numberToMonitor = Math.random() * 100
	}, 50)

	setInterval(() => {
		booleanToMonitor = !booleanToMonitor
		// eslint-disable-next-line ts/no-misused-spread, unicorn/no-array-reverse
		stringToMonitor = [...stringToMonitor].reverse().join('')
	}, 1000)

	let rev: RotationEulerValueObject = { x: 0, y: 0, z: 0 }
	let rev2: RotationQuaternionValueObject = { x: 0, y: 0, z: 0, w: 0 }
	let text2 = ''
	let object = {
		someBoolean: true, // Creates a <Checkbox>
		someColor: {
			r: 255,
			g: 0,
			// Creates a <Color> picker
			b: 55,
		},
		someFolder: {
			// Wraps children in a <Folder>
			a: 1,
			b: 2,
			c: 3,
		},
		someNumber: 1, // Creates a <Slider>
		somePoint: {
			// Creates a <Point>
			x: 1,
			y: 2,
		},
		someString: 'test', // Creates a <Text>
	}
	let startColor = '#fff000'
	let startColorA = { r: 255, g: 0, b: 55, a: 50 }

	let bindingObject: BindingObject = { r: 0 }

	let expanded = false

	let point2d: PointValue2d = { x: 0, y: 0 }

	// Tuples are also fine
	let point3d: PointValue3d = [0, 0, 0]

	// Dimension-specific option type needs to know the type of the point value
	const point3dxOptions: PointOptions<'3', 'x'> = { min: -100, max: 100 }

	const theme: Theme = {
		...ThemeUtils.presets.standard,

		bladeHorizontalPadding: '20px',
		containerUnitSize: '130px',
	}

	let callback: CubicBezierValueTuple = [0, 0, 0, 0]

	const keyboard = [
		...Array.from({ length: 26 }, (_, index) => String.fromCodePoint(65 + index)),
		',',
		'.',
		'!',
		'⌫',
	]

	let rv = 1
	// Const radioValues = [ ['magenta', 'orange'], ['yellow', 'red'], ['violet', 'gold'], ['red',
	//  'rebeccapurple']
	// ];

	// let src = 'placeholder';

	let point4d: PointValue4d = { x: 0, y: 0, z: 0, w: 0 }

	// This is a readonly function handle assigned by Profiler component first used in onMount since
	// it is not bound until then
	let measure: ProfilerMeasure

	const loopExponent = 1

	// Helper to test Math functions
	function hardWork(functionToMeasure: (n: number) => number, exponent: number): void {
		measure(functionToMeasure.name, () => {
			for (let sum = 0; sum < Number('1e' + exponent); sum++) {
				functionToMeasure(sum)
			}
		})
	}

	onMount(() => {
		let animationFrameHandle: number
		;(function tick() {
			// Nesting measurements creates a hierarchy in the Profile visualization
			measure('Tick', () => {
				measure('Trigonometry', () => {
					hardWork(Math.sin, loopExponent)
					hardWork(Math.cos, loopExponent)
					hardWork(Math.tan, loopExponent)
					hardWork(Math.atan, loopExponent)
					hardWork(Math.acos, loopExponent)
					hardWork(Math.acosh, loopExponent)
				})
				measure('Logarithms', () => {
					hardWork(Math.log, loopExponent)
					hardWork(Math.log10, loopExponent)
					hardWork(Math.log1p, loopExponent)
					hardWork(Math.log2, loopExponent)
				})
				measure('Rounding', () => {
					hardWork(Math.round, loopExponent)
					hardWork(Math.floor, loopExponent)
					hardWork(Math.ceil, loopExponent)
					hardWork(Math.fround, loopExponent)
				})
			})

			animationFrameHandle = requestAnimationFrame(tick)
		})()

		return () => {
			cancelAnimationFrame(animationFrameHandle)
		}
	})
</script>

<Pane>
	<Button />
	<Button />
	<Button />
</Pane>

<Pane position="fixed">
	<Button />
	<Button />
	<Button />
</Pane>

<h1>Textarea</h1>
<Textarea placeholder="The void" bind:value={text2} />
<h1>Textarea</h1>
<Textarea placeholder="The void" rows={8} bind:value={text2} />

<h1>Rotation</h1>

<RotationQuaternion expanded={true} label="CSS Rotation" picker="inline" bind:value={rev2} />
<h1>Rotation</h1>

<RotationQuaternion expanded={true} picker="inline" bind:value={rev2} />
<h1>Rotation</h1>

<RotationEuler expanded={true} label="CSS Rotation" picker="inline" bind:value={rev} />
<h1>Rotation</h1>

<RotationEuler expanded={true} picker="inline" bind:value={rev} />

<h1>Profiler</h1>

<Profiler label="Profiler" bind:measure />

<h1>RG</h1>
<RadioGrid prefix="Color Scheme " values={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} bind:value={rv} />

<h1>FPS</h1>
<FpsGraph rows={1} />
<h1>FPS</h1>
<FpsGraph rows={5} />
<h1>FPS</h1>
<FpsGraph />

<h1>CB</h1>
<CubicBezier expanded={true} picker="inline" bind:value={callback} />

<h1>CB</h1>
<CubicBezier expanded={true} label="bla" picker="inline" bind:value={callback} />
<h1>CB</h1>
<CubicBezier expanded={true} label="bla" bind:value={callback} />

<h1>CB</h1>
<CubicBezier label="bla" bind:value={callback} />

<h1>Button Grid</h1>
<ButtonGrid buttons={keyboard} />

<h1>Ring</h1>
<Ring label="Scale" value={1} />
<h1>Wheel</h1>
<Wheel label="Scale" value={1} />

<h1>Color</h1>
<Color label="Start Color" bind:value={startColor} />
<h1>Color</h1>
<Color expanded={true} label="Start Color" picker="inline" bind:value={startColor} />
<h1>Color</h1>
<Color expanded={true} picker="inline" bind:value={startColor} />
<h1>Color</h1>
<Color expanded={true} label="Start Color" picker="inline" bind:value={startColorA} />
<h1>Color</h1>
<Color expanded={true} picker="inline" bind:value={startColorA} />

<h1>Color Plus</h1>
<ColorPlus label="Start Color" bind:value={startColor} />
<h1>Color Plus</h1>
<ColorPlus expanded={true} label="Start Color" picker="inline" bind:value={startColor} />
<h1>Color Plus</h1>
<ColorPlus expanded={true} picker="inline" bind:value={startColor} />
<h1>Color Plus</h1>
<ColorPlus expanded={true} label="Start Color" picker="inline" bind:value={startColorA} />
<h1>Color Plus</h1>
<ColorPlus expanded={true} picker="inline" bind:value={startColorA} />
<h1>Color Plus</h1>
<ColorPlus expanded={true} picker="inline" textFields={false} bind:value={startColor} />
<h1>Color Plus</h1>
<ColorPlus expanded={true} picker="inline" textFields={false} bind:value={startColorA} />

<h1>Text</h1>
<Text label="The Message" bind:value={text} />
<h1>Slider</h1>
<Slider label="Scale" value={1} />
<h1>Separator</h1>
<Separator />

<h1>Point 2D</h1>
<Point expanded={false} label="2D Point Picker" picker="inline" bind:value={point2d} />

<h1>Point 3D</h1>
<Point label="3D Point Picker" optionsX={point3dxOptions} bind:value={point3d} />
<h1>Point 4D</h1>
<Point label="4D Point Picker" max={100} min={0} bind:value={point4d} />
<h1>Point 2D</h1>
<Point expanded={true} label="2D Point Picker" picker="inline" bind:value={point2d} />

<h1>Point 2D No Label</h1>
<Pane position="inline" {theme} width={300}>
	<Point expanded={true} picker="inline" bind:value={point2d} />
</Pane>

<h1>wave Monitor</h1>
<WaveformMonitor lineStyle="bezier" max={11} min={-1} value={waveData} />
<WaveformMonitor bufferSize={500} lineStyle="bezier" max={11} min={-1} rows={10} value={waveData} />

<h1>Monitor String Rows without Multiline</h1>
<Monitor label="String Monitor" multiline={true} value={stringToMonitor} />
<Monitor bufferSize={2} label="String Monitor" value={stringToMonitor} />
<Monitor label="String Monitor" value={stringToMonitor} />
<h1>Monitor String Multiline</h1>
<Monitor
	bufferSize={10}
	label="String Monitor"
	multiline={true}
	rows={10}
	value={stringToMonitor}
/>
<h1>Monitor String Multiline With Rows</h1>
<Monitor
	bufferSize={50}
	label="String Monitor"
	multiline={true}
	rows={10}
	value={stringToMonitor}
/>

<h1>Monitor Boolean test</h1>
<Monitor bufferSize={3} label="Boolean Monitor" rows={2} value={booleanToMonitor} />

<h1>Monitor Boolean Basic</h1>
<Monitor graph={true} label="Boolean Monitor" value={numberToMonitor} />
<h1>Monitor Boolean Basic</h1>
<Monitor graph={true} label="Boolean Monitor" rows={20} value={numberToMonitor} />
<h1>Monitor Boolean Basic</h1>
<Monitor label="Boolean Monitor" value={numberToMonitor} />
<h1>Monitor Boolean Big Buffer Big Rows</h1>
<Monitor bufferSize={20} label="Boolean Monitor" rows={10} value={numberToMonitor} />
<h1>Monitor Boolean Small Buffer Big Rows</h1>
<Monitor bufferSize={2} label="Boolean Monitor" rows={10} value={numberToMonitor} />
<h1>Monitor Boolean Big Buffer Small Rows</h1>
<Monitor bufferSize={10} label="Boolean Monitor" rows={1} value={numberToMonitor} />
<h1>Monitor Boolean Big Buffer No Rows</h1>
<Monitor bufferSize={2} label="Boolean Monitor" value={numberToMonitor} />
<h1>Monitor Boolean No Buffer Big Rows</h1>
<Monitor label="Boolean Monitor" rows={10} value={numberToMonitor} />
<h1>Monitor Number</h1>
<Monitor bufferSize={50} rows={10} value={numberToMonitor} />
<h1>Monitor Number Graph</h1>
<Monitor graph={true} rows={10} value={numberToMonitor} />

<h1>List</h1>
<List label="Alphanumerics" {options} bind:value={selection} />

<h1>Element Standalone</h1>
<Element>
	<p>
		<code>&lt;Pane&gt;</code><br />
		<code>&lt;Element&gt;</code><br /> Whatever you want.
		<code>&lt;/Element&gt;</code><br />
		<code>&lt;/Pane&gt;</code>
	</p>
</Element>

<h1>Binding</h1>
<Binding key="r" label="Reticulation" bind:object={bindingObject} />
<h1>Auto object</h1>
<AutoObject bind:object />

<h1>single tab</h1>
<TabGroup>
	<TabPage title="B!!!!">
		<Button />
	</TabPage>
</TabGroup>

<h1>Tabs Short first</h1>
<TabGroup>
	<TabPage title="A">
		<Button />
	</TabPage>
	<TabPage title="B">
		<Button />
		<Button />
		<Button />
	</TabPage>
</TabGroup>

<h1>Tabs tall first</h1>
<TabGroup>
	<TabPage title="A">
		<Button />
		<Button />
		<Button />
	</TabPage>
	<TabPage title="B">
		<Button />
	</TabPage>
</TabGroup>

<h1>Tab page no group</h1>
<TabPage title="A">
	<Button />
	<Button />
	<Button />
</TabPage>

<h1>Tab group no pages</h1>
<TabGroup />

<h1>Pane</h1>
<Pane position="inline">
	<Slider label="Scale" value={1} />
	<Slider label="Scale" value={1} />
	<Slider label="Scale" value={1} />
	<Slider label="Scale" value={1} />
	<Slider label="Scale" value={1} />
	<Slider label="Scale" value={1} />
	<Slider label="Scale" value={1} />
	<Slider label="Scale" value={1} />
	<Slider label="Scale" value={1} />
	<Slider label="Scale" value={1} />
	<Slider label="Scale" value={1} />
</Pane>
<h1>Slider</h1>
<Slider label="Scale" value={1} />
<h1>Pane Title</h1>
<Pane position="inline" title="Bla">
	<Slider label="Scale" value={1} />
</Pane>
<h1>Pane Folded</h1>
<Pane position="inline" bind:expanded>
	<Slider label="Scale" value={1} />
</Pane>
<h1>Pane Title Folded</h1>
<Pane position="inline" title="Bla" bind:expanded>
	<Slider label="Scale" value={1} />
	<Slider label="Scale" value={1} />
</Pane>

<h1>Blade</h1>
<Blade options={{ view: 'separator' }} />
<h1>Button</h1>
<Button />
<h1>Folder expanded</h1>
<Folder title="Reticulation Manager">
	<Button />
	<Button />
</Folder>
<h1>Folder collapsed</h1>
<Folder title="Reticulation Manager" bind:expanded>
	<Button />
	<Button />
</Folder>
<hr />
<!-- <Checkbox bind:value={expanded} label="Expanded" /> -->
