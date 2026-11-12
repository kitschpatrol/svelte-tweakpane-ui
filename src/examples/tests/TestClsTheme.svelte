<script lang="ts">
	import {
		AutoObject,
		Binding,
		Button,
		ButtonGrid,
		Checkbox,
		Color,
		ColorPlus,
		CubicBezier,
		Element,
		File,
		Folder,
		FpsGraph,
		Image,
		IntervalSlider,
		List,
		Monitor,
		Pane,
		Point,
		Profiler,
		RadioGrid,
		Ring,
		RotationEuler,
		RotationQuaternion,
		Separator,
		Slider,
		Stepper,
		TabGroup,
		TabPage,
		Text,
		Textarea,
		type Theme,
		WaveformMonitor,
		Wheel,
	} from '#lib'
	import { onMount } from 'svelte'
	import TestClsBoundButtons from './TestClsBoundButtons.svelte'
	import TestClsBoundTabPage from './TestClsBoundTabPage.svelte'

	// Every size differs from the standard theme and from every other size, so a
	// prerendered placeholder built from the wrong value can't match by accident
	const theme: Theme = {
		bladeValueWidth: '180px',
		containerHorizontalPadding: '12px',
		containerUnitSize: '26px',
		containerUnitSpacing: '6px',
		containerVerticalPadding: '10px',
	}

	const object = { count: 1, nested: { enabled: true, text: 'two' } }
	// Sizes relative to the font size, which is Tweakpane's inside a pane and the
	// page's outside of one
	const fontRelativeTheme: Theme = {
		bladeValueWidth: '12em',
		containerHorizontalPadding: '1em',
		containerUnitSize: '2em',
		containerUnitSpacing: '0.5em',
		containerVerticalPadding: '0.75em',
	}

	// Unit spacing larger than the vertical padding, the reverse of the main theme
	const wideSpacingTheme: Theme = {
		containerUnitSpacing: '12px',
		containerVerticalPadding: '5px',
	}

	// A value column sized as a share of the blade, which the square pickers
	// take their height from
	const percentageWidthTheme: Theme = {
		bladeValueWidth: '50%',
		containerHorizontalPadding: '12px',
	}

	const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
	const noPages: string[] = []

	let isMounted = false
	onMount(() => {
		isMounted = true
	})
</script>

<!-- Each heading starts a section whose height the prerendered layout test compares before and after hydration -->

<h1>Slider</h1>
<Slider label="Slider" {theme} value={1} />
<h1>Text</h1>
<Text {theme} value="Text" />
<h1>Checkbox</h1>
<Checkbox label="Checkbox" {theme} value={true} />
<h1>List</h1>
<List label="List" options={letters} {theme} value="a" />
<h1>Button</h1>
<Button {theme} title="Button" />
<h1>Separator</h1>
<Separator {theme} />
<h1>Binding</h1>
<Binding key="a" object={{ a: 1 }} {theme} />
<h1>Stepper</h1>
<Stepper label="Stepper" {theme} value={1} />
<h1>Interval slider</h1>
<IntervalSlider label="Interval" max={10} min={0} {theme} value={[2, 4]} />
<h1>Ring</h1>
<Ring label="Ring" {theme} value={1} />
<h1>Wheel</h1>
<Wheel label="Wheel" {theme} value={1} />

<h1>Textarea</h1>
<Textarea {theme} value="" />
<h1>Textarea one row</h1>
<Textarea rows={1} {theme} value="" />
<h1>Textarea five rows with label</h1>
<Textarea label="Textarea" rows={5} {theme} value="" />

<h1>File</h1>
<File label="File" {theme} />
<h1>File five rows</h1>
<File rows={5} {theme} />
<h1>Image</h1>
<Image label="Image" {theme} />

<h1>Color inline</h1>
<Color expanded={true} label="Color" picker="inline" {theme} value="#ff0055" />
<h1>Color inline alpha no label</h1>
<Color expanded={true} picker="inline" {theme} value={{ r: 255, g: 0, b: 55, a: 0.5 }} />
<h1>Color popup</h1>
<Color label="Color" {theme} value="#ff0055" />
<h1>Color plus inline</h1>
<ColorPlus expanded={true} label="Color" picker="inline" {theme} value="#ff0055" />
<h1>Color plus inline alpha no label</h1>
<ColorPlus expanded={true} picker="inline" {theme} value={{ r: 255, g: 0, b: 55, a: 0.5 }} />
<h1>Color plus inline no text fields</h1>
<ColorPlus expanded={true} picker="inline" textFields={false} {theme} value="#ff0055" />

<h1>Point 2D inline</h1>
<Point expanded={true} label="Point" picker="inline" {theme} value={{ x: 0, y: 0 }} />
<h1>Point 2D inline no label</h1>
<Point expanded={true} picker="inline" {theme} value={{ x: 0, y: 0 }} />
<h1>Point 2D popup</h1>
<Point label="Point" {theme} value={{ x: 0, y: 0 }} />
<h1>Point 3D</h1>
<Point label="Point" {theme} value={{ x: 0, y: 0, z: 0 }} />

<h1>Rotation Euler inline</h1>
<RotationEuler
	expanded={true}
	label="Rotation"
	picker="inline"
	{theme}
	value={{ x: 0, y: 0, z: 0 }}
/>
<h1>Rotation Euler inline no label</h1>
<RotationEuler expanded={true} picker="inline" {theme} value={{ x: 0, y: 0, z: 0 }} />
<h1>Rotation quaternion inline</h1>
<RotationQuaternion
	expanded={true}
	label="Rotation"
	picker="inline"
	{theme}
	value={{ x: 0, y: 0, z: 0, w: 1 }}
/>
<h1>Rotation quaternion inline no label</h1>
<RotationQuaternion expanded={true} picker="inline" {theme} value={{ x: 0, y: 0, z: 0, w: 1 }} />
<h1>Rotation quaternion popup</h1>
<RotationQuaternion label="Rotation" {theme} value={{ x: 0, y: 0, z: 0, w: 1 }} />

<h1>Cubic bezier inline</h1>
<CubicBezier expanded={true} label="Bezier" picker="inline" {theme} value={[0, 0, 1, 1]} />
<h1>Cubic bezier inline no label</h1>
<CubicBezier expanded={true} picker="inline" {theme} value={[0, 0, 1, 1]} />
<h1>Cubic bezier popup</h1>
<CubicBezier label="Bezier" {theme} value={[0, 0, 1, 1]} />

<h1>Button grid</h1>
<ButtonGrid buttons={letters} columns={3} {theme} />
<h1>Button grid with label</h1>
<ButtonGrid buttons={letters} columns={2} label="Grid" {theme} />
<h1>Radio grid</h1>
<RadioGrid columns={3} {theme} value="a" values={letters} />
<h1>Radio grid with label</h1>
<RadioGrid columns={2} label="Grid" {theme} value="a" values={letters} />

<h1>FPS graph</h1>
<FpsGraph {theme} />
<h1>FPS graph four rows</h1>
<FpsGraph label="FPS" rows={4} {theme} />
<h1>Profiler</h1>
<Profiler label="Profiler" {theme} />
<h1>Waveform monitor</h1>
<WaveformMonitor {theme} value={[1, 2, 3, 2, 1]} />
<h1>Monitor multiline</h1>
<Monitor label="Monitor" multiline={true} {theme} value="Monitor" />
<h1>Monitor multiline rows</h1>
<Monitor bufferSize={10} multiline={true} rows={5} {theme} value="Monitor" />
<h1>Monitor graph</h1>
<Monitor graph={true} label="Monitor" {theme} value={1} />
<h1>Monitor graph rows</h1>
<Monitor graph={true} rows={6} {theme} value={1} />
<h1>Monitor buffer</h1>
<Monitor bufferSize={5} label="Monitor" {theme} value={1} />
<h1>Monitor boolean</h1>
<Monitor label="Monitor" {theme} value={true} />

<h1>Element</h1>
<Element {theme}>
	<div class="content"></div>
</Element>
<h1>Element with max height</h1>
<Element maxHeight={30} {theme}>
	<div class="content"></div>
</Element>

<h1>Element with content sized by its width</h1>
<Element {theme}>
	<div class="square"></div>
</Element>

<h1>Element with max height and content that only renders in the browser</h1>
<Element maxHeight={100} {theme}>
	{#if isMounted}
		<div class="tall-content"></div>
	{/if}
</Element>

<h1>Folder</h1>
<Folder {theme} title="Folder">
	<Button title="Button" />
	<Button title="Button" />
</Folder>
<h1>Folder collapsed</h1>
<Folder expanded={false} {theme} title="Folder">
	<Button title="Button" />
</Folder>
<h1>Tab group</h1>
<TabGroup {theme}>
	<TabPage title="A">
		<Button title="Button" />
	</TabPage>
	<TabPage title="B">
		<Button title="Button" />
		<Button title="Button" />
	</TabPage>
</TabGroup>
<h1>Tab group with a selected index that is not a number</h1>
<TabGroup selectedIndex={NaN} {theme}>
	<TabPage title="A">
		<Button title="Button" />
		<Button title="Button" />
	</TabPage>
	<TabPage title="B">
		<Button title="Button" />
	</TabPage>
</TabGroup>
<h1>Tab group whose slot renders no pages</h1>
<TabGroup {theme}>
	{#each noPages as page}
		<TabPage title={page}>
			<Button title={page} />
		</TabPage>
	{/each}
</TabGroup>
<h1>Tab group with a selected index past the last page</h1>
<TabGroup selectedIndex={5} {theme}>
	<TabPage title="A">
		<Button title="Button" />
		<Button title="Button" />
	</TabPage>
	<TabPage title="B">
		<Button title="Button" />
	</TabPage>
</TabGroup>
<h1>Empty tab group before a button</h1>
<Pane position="inline" {theme}>
	<TabGroup />
	<Button title="Button" />
</Pane>
<h1>Empty tab group between blades and last</h1>
<Pane position="inline" {theme}>
	<Separator />
	<TabGroup />
	<Slider label="Slider" value={1} />
	<Folder title="Folder">
		<Slider label="Slider" value={1} />
	</Folder>
	<TabGroup />
</Pane>
<h1>Tab groups whose slots render no pages, among other blades</h1>
<Pane position="inline" {theme}>
	<TabGroup>
		{#each noPages as page}
			<TabPage title={page} />
		{/each}
	</TabGroup>
	<Button title="Button" />
	<Separator />
	<TabGroup>
		{#each noPages as page}
			<TabPage title={page} />
		{/each}
	</TabGroup>
	<Slider label="Slider" value={1} />
	<Folder title="Folder">
		<Slider label="Slider" value={1} />
	</Folder>
	<TabGroup>
		{#each noPages as page}
			<TabPage title={page} />
		{/each}
	</TabGroup>
	<Folder title="Folder">
		<Slider label="Slider" value={1} />
	</Folder>
	<TabGroup>
		{#each noPages as page}
			<TabPage title={page} />
		{/each}
	</TabGroup>
</Pane>
<h1>Tab group whose slot renders no pages, before a folder</h1>
<Pane position="inline" {theme}>
	<TabGroup>
		{#each noPages as page}
			<TabPage title={page} />
		{/each}
	</TabGroup>
	<Folder title="Folder">
		<Slider label="Slider" value={1} />
	</Folder>
</Pane>
<h1>Tab group without pages</h1>
<TabGroup {theme} />
<h1>Auto object</h1>
<AutoObject {object} {theme} />

<h1>Pane with title</h1>
<Pane position="inline" {theme} title="Pane">
	<Slider label="Slider" value={1} />
</Pane>
<h1>Pane with title collapsed</h1>
<Pane expanded={false} position="inline" {theme} title="Pane">
	<Slider label="Slider" value={1} />
</Pane>
<h1>Pane collapsed</h1>
<Pane expanded={false} position="inline" {theme}>
	<Slider label="Slider" value={1} />
</Pane>
<h1>Pane with width</h1>
<Pane position="inline" {theme} width={300}>
	<Point expanded={true} picker="inline" value={{ x: 0, y: 0 }} />
	<RotationEuler expanded={true} picker="inline" value={{ x: 0, y: 0, z: 0 }} />
</Pane>

<h1>Width-dependent controls inside a folder</h1>
<Pane position="inline" {theme} width={300}>
	<Folder title="Folder">
		<Point expanded={true} picker="inline" value={{ x: 0, y: 0 }} />
		<Element>
			<div class="square"></div>
		</Element>
	</Folder>
</Pane>
<h1>Width-dependent control inside nested folders</h1>
<Pane position="inline" {theme} width={300}>
	<Folder title="Outer">
		<Folder title="Inner">
			<RotationEuler expanded={true} picker="inline" value={{ x: 0, y: 0, z: 0 }} />
		</Folder>
	</Folder>
</Pane>
<h1>Width-dependent control inside a tab page</h1>
<Pane position="inline" {theme} width={300}>
	<TabGroup>
		<TabPage title="A">
			<Point expanded={true} picker="inline" value={{ x: 0, y: 0 }} />
		</TabPage>
	</TabGroup>
</Pane>

<h1>Mixed blades inside a wrapper element</h1>
<Pane position="inline" {theme}>
	<div>
		<Slider label="Slider" value={1} />
		<Separator />
		<Slider label="Slider" value={1} />
		<Folder title="Folder">
			<div>
				<Slider label="Slider" value={1} />
				<Slider label="Slider" value={1} />
			</div>
		</Folder>
	</div>
</Pane>
<!-- Only blades of one kind, because the browser orders blades by their position within their own
	wrapper, so mixed kinds split across wrappers end up in a different order than written -->
<h1>Sliders split across wrapper elements</h1>
<Pane position="inline" {theme}>
	<div>
		<Slider label="Slider" value={1} />
		<Slider label="Slider" value={1} />
	</div>
	<div>
		<Slider label="Slider" value={1} />
	</div>
</Pane>

<h1>Tab page that renders twice on the server</h1>
<TabGroup {theme}>
	<TestClsBoundTabPage />
</TabGroup>
<h1>Buttons that render twice on the server</h1>
<Pane position="inline" {theme}>
	<TestClsBoundButtons />
</Pane>

<h1>Theme with sizes relative to the font size</h1>
<Pane position="inline" theme={fontRelativeTheme} title="Pane">
	<Button title="Button" />
	<Slider label="Slider" value={1} />
	<Folder title="Folder">
		<Point expanded={true} label="Point" picker="inline" value={{ x: 0, y: 0 }} />
	</Folder>
</Pane>
<h1>Standalone control with sizes relative to the font size</h1>
<Color expanded={true} picker="inline" theme={fontRelativeTheme} value="#ff0055" />
<h1>Standalone element with sizes relative to the font size</h1>
<Element theme={fontRelativeTheme}>
	<div class="square"></div>
</Element>

<h1>Empty element before a button</h1>
<Pane position="inline" {theme}>
	<div></div>
	<Button title="Button" />
</Pane>
<h1>Empty elements between blades</h1>
<Pane position="inline" {theme}>
	<Separator />
	<div></div>
	<Slider label="Slider" value={1} />
	<span></span>
	<Slider label="Slider" value={1} />
	<Folder title="Folder">
		<Slider label="Slider" value={1} />
	</Folder>
	<div></div>
	<Folder title="Folder">
		<div></div>
		<Slider label="Slider" value={1} />
	</Folder>
</Pane>

<h1>Folders beside empty elements at both ends of a pane</h1>
<Pane position="inline" {theme}>
	<div></div>
	<Folder title="Folder">
		<Slider label="Slider" value={1} />
	</Folder>
	<Slider label="Slider" value={1} />
	<Folder title="Folder">
		<Slider label="Slider" value={1} />
	</Folder>
	<span></span>
	<div></div>
</Pane>
<h1>Folder beside an empty element at the end of a folder</h1>
<Pane position="inline" {theme}>
	<Folder title="Outer">
		<Slider label="Slider" value={1} />
		<Folder title="Inner">
			<Slider label="Slider" value={1} />
		</Folder>
		<div></div>
	</Folder>
	<Slider label="Slider" value={1} />
</Pane>

<!-- Blades in separate wrappers are all sliders, because the browser orders blades by their position
	within their own wrapper, so mixed kinds split across wrappers end up in a different order -->
<h1>Sliders inside nested wrapper elements</h1>
<Pane position="inline" {theme}>
	<div>
		<div>
			<Slider label="Slider" value={1} />
		</div>
	</div>
	<div>
		<div>
			<Slider label="Slider" value={1} />
		</div>
	</div>
	<section>
		<div>
			<div>
				<Slider label="Slider" value={1} />
				<Slider label="Slider" value={1} />
			</div>
		</div>
	</section>
</Pane>
<h1>Mixed blades inside one chain of nested wrapper elements</h1>
<Pane position="inline" {theme}>
	<div>
		<div>
			<Folder title="Folder">
				<div>
					<div>
						<Slider label="Slider" value={1} />
					</div>
				</div>
			</Folder>
			<Slider label="Slider" value={1} />
			<Separator />
			<Separator />
			<Slider label="Slider" value={1} />
			<Folder title="Folder">
				<Slider label="Slider" value={1} />
			</Folder>
			<Folder title="Folder">
				<Slider label="Slider" value={1} />
			</Folder>
		</div>
	</div>
</Pane>

<!-- A folder in a wrapper element is only first or last in its content if the wrapper is too -->
<h1>Folder in a wrapper element after a button</h1>
<Pane position="inline" {theme}>
	<Button title="Button" />
	<div>
		<Folder title="Folder">
			<Button title="Button" />
		</Folder>
	</div>
</Pane>
<h1>Folder in a wrapper element before a button</h1>
<Pane position="inline" {theme}>
	<div>
		<Folder title="Folder">
			<Button title="Button" />
		</Folder>
	</div>
	<Button title="Button" />
</Pane>
<h1>Folder in nested wrapper elements, the outer one before a button</h1>
<Pane position="inline" {theme}>
	<div>
		<div>
			<Folder title="Folder">
				<Button title="Button" />
			</Folder>
		</div>
	</div>
	<Button title="Button" />
</Pane>
<h1>Folder last in a folder whose wrapper element is followed by a button</h1>
<Pane position="inline" {theme}>
	<div>
		<Folder title="Outer">
			<Button title="Button" />
			<Folder title="Inner">
				<Button title="Button" />
			</Folder>
		</Folder>
	</div>
	<Button title="Button" />
</Pane>

<h1>Theme with unit spacing larger than the vertical padding</h1>
<Pane position="inline" theme={wideSpacingTheme} title="Pane">
	<Slider label="Slider" value={1} />
	<Slider label="Slider" value={1} />
	<Textarea value="" />
	<Slider label="Slider" value={1} />
	<Separator />
	<Slider label="Slider" value={1} />
	<Folder title="Folder">
		<Slider label="Slider" value={1} />
		<Color expanded={true} picker="inline" value="#ff0055" />
		<Slider label="Slider" value={1} />
	</Folder>
	<Folder title="Folder">
		<Slider label="Slider" value={1} />
	</Folder>
</Pane>

<h1>Theme with a percentage value width</h1>
<Pane position="inline" theme={percentageWidthTheme} width={300}>
	<Point expanded={true} label="Point" picker="inline" value={{ x: 0, y: 0 }} />
	<RotationEuler expanded={true} label="Rotation" picker="inline" value={{ x: 0, y: 0, z: 0 }} />
	<Slider label="Slider" value={1} />
	<Folder title="Folder">
		<Point expanded={true} label="Point" picker="inline" value={{ x: 0, y: 0 }} />
		<Point expanded={true} picker="inline" value={{ x: 0, y: 0 }} />
	</Folder>
</Pane>
<h1>Standalone control with a percentage value width</h1>
<div class="narrow">
	<Point
		expanded={true}
		label="Point"
		picker="inline"
		theme={percentageWidthTheme}
		value={{ x: 0, y: 0 }}
	/>
</div>

<h1>Separators first, stacked, and last</h1>
<Pane position="inline" {theme}>
	<Separator />
	<Slider label="Slider" value={1} />
	<Separator />
	<Separator />
	<Slider label="Slider" value={1} />
	<Separator />
</Pane>

<h1>Folders first, adjacent, and last</h1>
<Pane position="inline" {theme}>
	<Folder title="Folder">
		<Slider label="Slider" value={1} />
	</Folder>
	<Slider label="Slider" value={1} />
	<Folder title="Folder">
		<Slider label="Slider" value={1} />
	</Folder>
	<Folder expanded={false} title="Folder">
		<Slider label="Slider" value={1} />
	</Folder>
	<Slider label="Slider" value={1} />
	<Folder title="Folder">
		<Slider label="Slider" value={1} />
	</Folder>
</Pane>

<h1>Titled pane starting with a folder</h1>
<Pane position="inline" {theme} title="Pane">
	<Folder title="Folder">
		<Slider label="Slider" value={1} />
	</Folder>
	<Slider label="Slider" value={1} />
</Pane>

<h1>Nested folders and tabs</h1>
<Pane position="inline" {theme}>
	<Slider label="Slider" value={1} />
	<Folder title="Outer">
		<Folder title="Inner first">
			<Slider label="Slider" value={1} />
		</Folder>
		<Slider label="Slider" value={1} />
		<Separator />
		<TabGroup>
			<TabPage title="A">
				<Slider label="Slider" value={1} />
				<Folder title="In tab and last">
					<Slider label="Slider" value={1} />
				</Folder>
			</TabPage>
			<TabPage title="B">
				<Slider label="Slider" value={1} />
			</TabPage>
		</TabGroup>
	</Folder>
	<TabGroup>
		<TabPage title="A">
			<Color expanded={true} picker="inline" value="#ff0055" />
			<Slider label="Slider" value={1} />
		</TabPage>
	</TabGroup>
</Pane>

<h1>Taller controls between blades</h1>
<Pane position="inline" {theme}>
	<Slider label="Slider" value={1} />
	<Textarea value="" />
	<Slider label="Slider" value={1} />
	<Element>
		<div class="content"></div>
	</Element>
	<Slider label="Slider" value={1} />
	<File />
	<Image />
	<ButtonGrid buttons={letters} columns={3} />
	<Element>
		<div class="content"></div>
	</Element>
</Pane>

<h1>End</h1>

<style>
	.content {
		height: 50px;
	}

	.tall-content {
		height: 150px;
	}

	.narrow {
		width: 320px;
	}

	.square {
		aspect-ratio: 1;
		width: 100%;
	}
</style>
