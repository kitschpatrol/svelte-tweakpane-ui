<script lang="ts">
	import {
		AutoObject,
		Binding,
		type BindingObject,
		Blade,
		Button,
		ButtonGrid,
		Checkbox,
		Color,
		CubicBezier,
		type CubicBezierValue,
		type CubicBezierValueTuple,
		Element,
		Folder,
		FpsGraph,
		Image,
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
		Wheel
	} from '$lib';
	import { onMount } from 'svelte';
	let text = 'Cosmic Manifold';
	let waveData = [5, 6, 7, 8, 9, 3, 9, 8, 7, 6, 5];

	setInterval(() => {
		waveData = waveData.map((v) => Math.max(0, Math.min(10, v + (Math.random() * 2 - 1) * 0.5)));
	}, 10);

	let selection: number = 1;
	const options: ListOptions<number> = { b: 2, a: 1, c: 3 };

	let booleanToMonitor = false;
	let stringToMonitor = 'Reticulating';
	let numberToMonitor = 85;

	setInterval(() => {
		numberToMonitor = Math.random() * 100;
	}, 50);

	setInterval(() => {
		booleanToMonitor = !booleanToMonitor;
		stringToMonitor = stringToMonitor.split('').reverse().join('');
	}, 1000);

	let rev: RotationEulerValueObject = { x: 0, y: 0, z: 0 };
	let revq: RotationQuaternionValueObject = { x: 0, y: 0, z: 0, w: 0 };
	let text2 = '';
	let object = {
		someBoolean: true, // Creates a <Checkbox>
		someColor: {
			r: 255,
			g: 0,
			// Creates a <Color> picker
			b: 55
		},
		someFolder: {
			b: 2,
			// Wraps children in a <Folder>
			a: 1,
			c: 3
		},
		someNumber: 1, // Creates a <Slider>
		somePoint: {
			// creates a <Point>
			x: 1,
			y: 2
		},
		someString: 'test' // Creates a <Text>
	};
	let startColor = '#fff000';
	let startColorA = { r: 255, g: 0, b: 55, a: 50 };

	let bindingObject: BindingObject = { r: 0 };

	let expanded = false;

	let point2d: PointValue2d = { x: 0, y: 0 };

	// tuples are also fine
	let point3d: PointValue3d = [0, 0, 0];

	// dimension-specific option type needs to know the type of the point value
	let point3dXOptions: PointOptions<'3', 'x'> = { min: -100, max: 100 };

	const theme: Theme = {
		...ThemeUtils.presets.standard,
		...{
			bladeHorizontalPadding: '20px',
			containerUnitSize: '130px'
		}
	};

	let cb: CubicBezierValueTuple = [0, 0, 0, 0];

	const keyboard = [
		...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
		',',
		'.',
		'!',
		'⌫'
	];

	let rv = 1;
	const radioValues = [
		['magenta', 'orange'],
		['yellow', 'red'],
		['violet', 'gold'],
		['red', 'rebeccapurple'],
		['sadf', 'orange'],
		['asdff', 'red'],
		['asdf', 'gold'],
		['asdfasdf', 'rebeccapurple']
	];

	let src = 'placeholder';

	let point4d: PointValue4d = { x: 0, y: 0, z: 0, w: 0 };

	// this is a readonly function handle assigned by Profiler component first used in onMount since
	// it is not bound until then
	let measure: ProfilerMeasure;

	let loopExponent = 1;

	// helper to test Math functions
	function hardWork(fn: (n: number) => number, exponent: number): void {
		measure(fn.name, () => {
			for (let sum = 0; sum < Number('1e' + exponent); sum++) {
				fn(sum);
			}
		});
	}

	onMount(() => {
		(function tick() {
			// Nesting measurements creates a hierarchy in the Profile visualization
			measure('Tick', () => {
				measure('Trigonometry', () => {
					hardWork(Math.sin, loopExponent);
					hardWork(Math.cos, loopExponent);
					hardWork(Math.tan, loopExponent);
					hardWork(Math.atan, loopExponent);
					hardWork(Math.acos, loopExponent);
					hardWork(Math.acosh, loopExponent);
				});
				measure('Logarithms', () => {
					hardWork(Math.log, loopExponent);
					hardWork(Math.log10, loopExponent);
					hardWork(Math.log1p, loopExponent);
					hardWork(Math.log2, loopExponent);
				});
				measure('Rounding', () => {
					hardWork(Math.round, loopExponent);
					hardWork(Math.floor, loopExponent);
					hardWork(Math.ceil, loopExponent);
					hardWork(Math.fround, loopExponent);
				});
			});

			requestAnimationFrame(tick);
		})();
	});
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
<Textarea bind:value={text2} placeholder="The void" />
<h1>Textarea</h1>
<Textarea bind:value={text2} placeholder="The void" rows={8} />

<h1>Rotation</h1>

<RotationQuaternion bind:value={revq} expanded={true} label="CSS Rotation" picker={'inline'} />
<h1>Rotation</h1>

<RotationQuaternion bind:value={revq} expanded={true} picker={'inline'} />
<h1>Rotation</h1>

<RotationEuler bind:value={rev} expanded={true} label="CSS Rotation" picker={'inline'} />
<h1>Rotation</h1>

<RotationEuler bind:value={rev} expanded={true} picker={'inline'} />

<h1>Profiler</h1>

<Profiler bind:measure label="Profiler" />

<h1>RG</h1>
<RadioGrid bind:value={rv} prefix="Color Scheme " values={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />

<h1>FPS</h1>
<FpsGraph rows={1} />
<h1>FPS</h1>
<FpsGraph rows={5} />
<h1>FPS</h1>
<FpsGraph />

<h1>CB</h1>
<CubicBezier bind:value={cb} expanded={true} picker="inline" />

<h1>CB</h1>
<CubicBezier bind:value={cb} expanded={true} label="bla" picker="inline" />
<h1>CB</h1>
<CubicBezier bind:value={cb} expanded={true} label="bla" />

<h1>CB</h1>
<CubicBezier bind:value={cb} label="bla" />

<h1>Button Grid</h1>
<ButtonGrid buttons={keyboard} />

<h1>Ring</h1>
<Ring value={1} label="Scale" />
<h1>Wheel</h1>
<Wheel value={1} label="Scale" />

<h1>Color</h1>
<Color bind:value={startColor} label="Start Color" />
<h1>Color</h1>
<Color bind:value={startColor} expanded={true} label="Start Color" picker="inline" />
<h1>Color</h1>
<Color bind:value={startColor} expanded={true} picker="inline" />
<h1>Color</h1>
<Color bind:value={startColorA} expanded={true} label="Start Color" picker="inline" />
<h1>Color</h1>
<Color bind:value={startColorA} expanded={true} picker="inline" />

<h1>Text</h1>
<Text bind:value={text} label="The Message" />
<h1>Slider</h1>
<Slider value={1} label="Scale" />
<h1>Separator</h1>
<Separator />

<h1>Point 2D</h1>
<Point bind:value={point2d} expanded={false} label="2D Point Picker" picker="inline" />

<h1>Point 3D</h1>
<Point bind:value={point3d} label="3D Point Picker" optionsX={point3dXOptions} />
<h1>Point 4D</h1>
<Point bind:value={point4d} min={0} max={100} label="4D Point Picker" />
<h1>Point 2D</h1>
<Point bind:value={point2d} expanded={true} label="2D Point Picker" picker="inline" />

<h1>Point 2D No Label</h1>
<Pane position="inline" {theme} width={300}>
	<Point bind:value={point2d} expanded={true} picker="inline" />
</Pane>

<h1>waveform Monitor</h1>
<WaveformMonitor value={waveData} min={-1} max={11} lineStyle={'bezier'} />
<WaveformMonitor
	value={waveData}
	min={-1}
	max={11}
	bufferSize={500}
	lineStyle={'bezier'}
	rows={10}
/>

<h1>Monitor String Rows without Multiline</h1>
<Monitor value={stringToMonitor} label="String Monitor" multiline={true} />
<Monitor value={stringToMonitor} bufferSize={2} label="String Monitor" />
<Monitor value={stringToMonitor} label="String Monitor" />
<h1>Monitor String Multiline</h1>
<Monitor
	value={stringToMonitor}
	bufferSize={10}
	label="String Monitor"
	multiline={true}
	rows={10}
/>
<h1>Monitor String Multiline With Rows</h1>
<Monitor
	value={stringToMonitor}
	bufferSize={50}
	label="String Monitor"
	multiline={true}
	rows={10}
/>

<h1>Monitor Boolean test</h1>
<Monitor value={booleanToMonitor} bufferSize={3} label="Boolean Monitor" rows={2} />

<h1>Monitor Boolean Basic</h1>
<Monitor value={numberToMonitor} graph={true} label="Boolean Monitor" />
<h1>Monitor Boolean Basic</h1>
<Monitor value={numberToMonitor} graph={true} label="Boolean Monitor" rows={20} />
<h1>Monitor Boolean Basic</h1>
<Monitor value={numberToMonitor} label="Boolean Monitor" />
<h1>Monitor Boolean Big Buffer Big Rows</h1>
<Monitor value={numberToMonitor} bufferSize={20} label="Boolean Monitor" rows={10} />
<h1>Monitor Boolean Small Buffer Big Rows</h1>
<Monitor value={numberToMonitor} bufferSize={2} label="Boolean Monitor" rows={10} />
<h1>Monitor Boolean Big Buffer Small Rows</h1>
<Monitor value={numberToMonitor} bufferSize={10} label="Boolean Monitor" rows={1} />
<h1>Monitor Boolean Big Buffer No Rows</h1>
<Monitor value={numberToMonitor} bufferSize={2} label="Boolean Monitor" />
<h1>Monitor Boolean No Buffer Big Rows</h1>
<Monitor value={numberToMonitor} label="Boolean Monitor" rows={10} />
<h1>Monitor Number</h1>
<Monitor value={numberToMonitor} bufferSize={50} rows={10} />
<h1>Monitor Number Graph</h1>
<Monitor value={numberToMonitor} graph={true} rows={10} />

<h1>List</h1>
<List bind:value={selection} label="Alphanumerics" {options} />

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
<Binding bind:object={bindingObject} key={'r'} label="Reticulation" />
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
<TabGroup></TabGroup>

<h1>Pane</h1>
<Pane position="inline">
	<Slider value={1} label="Scale" />
	<Slider value={1} label="Scale" />
	<Slider value={1} label="Scale" />
	<Slider value={1} label="Scale" />
	<Slider value={1} label="Scale" />
	<Slider value={1} label="Scale" />
	<Slider value={1} label="Scale" />
	<Slider value={1} label="Scale" />
	<Slider value={1} label="Scale" />
	<Slider value={1} label="Scale" />
	<Slider value={1} label="Scale" />
</Pane>
<h1>Slider</h1>
<Slider value={1} label="Scale" />
<h1>Pane Title</h1>
<Pane position="inline" title="Bla">
	<Slider value={1} label="Scale" />
</Pane>
<h1>Pane Folded</h1>
<Pane bind:expanded position="inline">
	<Slider value={1} label="Scale" />
</Pane>
<h1>Pane Title Folded</h1>
<Pane bind:expanded position="inline" title="Bla">
	<Slider value={1} label="Scale" />
	<Slider value={1} label="Scale" />
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
<Folder bind:expanded title="Reticulation Manager">
	<Button />
	<Button />
</Folder>
<hr />
<!-- <Checkbox bind:value={expanded} label="Expanded" /> -->
