<script lang="ts">
	import {
		Checkbox,
		Color,
		CubicBezier,
		Folder,
		List,
		Monitor,
		Pane,
		Point,
		type PointValue2dTuple,
		type PointValue3dTuple,
		type PointValue4dTuple,
		RotationEuler,
		Separator,
		Slider,
		TabGroup,
		TabPage,
		Text,
		type Theme,
		ThemeUtils,
	} from '$lib'
	import { onMount } from 'svelte'
	import { derived, type Writable, writable } from 'svelte/store'
	import { fade } from 'svelte/transition'

	const themeDataKey = 'data-theme'
	let astroTheme: 'dark' | 'light'
	let paneDiv: HTMLDivElement
	// Let mounted = false;

	// set up pane div pause when interacting, but not when dragging the title bar
	function onPointerDown(event: PointerEvent) {
		if (event.target && !hasParentWithClassName(event.target as HTMLElement, 'tp-rotv_b')) {
			interacting = true
		}
	}

	function onPointerUp() {
		interacting = false
	}

	onMount(() => {
		// Set up frame loop
		let lastTime: number | undefined
		let frameId: number | undefined

		function tick(animationTime: number) {
			if (playing && !interacting && lastTime !== undefined) {
				time += (animationTime - lastTime) * period
			}

			lastTime = animationTime
			frameId = requestAnimationFrame(tick)
		}

		requestAnimationFrame(tick)

		paneDiv.addEventListener('pointerdown', onPointerDown, { capture: true })
		document.addEventListener('pointerup', onPointerUp)
		document.addEventListener('pointercancel', onPointerUp)

		// Watch for theme changes
		// duplicates some functionality from ThemeWatcher.astro, but lets us keep the theme dropdown
		astroTheme = document.documentElement.getAttribute(themeDataKey) === 'dark' ? 'dark' : 'light'
		const observer = new MutationObserver((mutations: MutationRecord[]) => {
			for (const mutation of mutations) {
				if (mutation.type === 'attributes' && mutation.attributeName === themeDataKey) {
					astroTheme =
						document.documentElement.getAttribute(themeDataKey) === 'dark' ? 'dark' : 'light'
				}
			}
		})
		observer.observe(document.documentElement, {
			attributeFilter: [themeDataKey],
			attributes: true,
		})

		// Mounted = true;

		return () => {
			if (frameId !== undefined) {
				cancelAnimationFrame(frameId)
			}

			paneDiv.removeEventListener('pointerdown', onPointerDown, { capture: true })
			document.removeEventListener('pointerup', onPointerUp)
			document.removeEventListener('pointercancel', onPointerUp)

			observer.disconnect()
		}
	})

	// Helpers
	function map(
		value: number,
		fromLow: number,
		fromHigh: number,
		toLow: number,
		toHigh: number,
		clamp: boolean = true,
	): number {
		return Math.min(
			Math.max(
				toLow + ((value - fromLow) * (toHigh - toLow)) / (fromHigh - fromLow),
				clamp ? toLow : Number.MIN_VALUE,
			),
			clamp ? toHigh : Number.MAX_VALUE,
		)
	}

	function hasParentWithClassName(element: HTMLElement, className: string): boolean {
		if (element.classList.contains(className)) {
			return true
		}

		if (element.parentElement) {
			return hasParentWithClassName(element.parentElement, className)
		}

		return false
	}

	// Props
	export let width: number = 360

	// Position in the grid... useful for transition delays
	// export let i: number = 0;

	// constants
	const themes = Object.keys(ThemeUtils.presets)
	const offsetAngle = [0, Math.PI / 3, Math.PI / 2, Math.PI]
	const cubicBezierEnabled = false
	const defaultTheme: Theme = {
		// BaseBorderRadius: '0'
	}
	const keys = ['X', 'Y', 'Z', 'W']

	// Vars
	let time = 0
	let playing = true
	let interacting = false
	let text: string = 'Svelte Tweakpane UI'
	let themeKey: keyof typeof ThemeUtils.presets = 'standard'
	let min = 0
	let max = 1
	let periodSeconds = 10
	let interval2: [number, number] = [min, max]
	let offsets: PointValue4dTuple = [0, 0, 0, 0]
	let headingUp: [boolean, boolean, boolean, boolean] = [true, true, true, true]

	function reset() {
		time = 0
		playing = true
		text = 'Svelte Tweakpane UI'
		periodSeconds = 10
		min = 0
		max = 1
		themeKey = 'standard'
		offsets = [0, 0, 0, 0]
	}

	// Stores
	const point4 = writable<PointValue4dTuple>([0, 0, 0, 0])

	const point3 = derived(
		point4,
		($point4) => [$point4[0], $point4[1], $point4[2]] as PointValue3dTuple,
	)
	;(point3 as Writable<PointValue3dTuple>).set = (newItems) =>
		($point4 = [newItems[0], newItems[1], newItems[2], $point4[3]])
	;(point3 as Writable<PointValue3dTuple>).set = (newItems) =>
		($point4 = [newItems[0], newItems[1], newItems[2], $point4[3]])

	const point2 = derived(point4, ($point4) => [$point4[0], $point4[1]] as PointValue2dTuple)
	;(point2 as Writable<PointValue2dTuple>).set = (newItems) =>
		($point4 = [newItems[0], newItems[1], $point4[2], $point4[3]])

	function getAstroTheme(astro: typeof astroTheme): typeof themeKey {
		// Only respect global if the user hasn't messed with the theme
		if (themeKey === 'standard' || themeKey === 'light') {
			return astro === 'dark' ? 'standard' : 'light'
		}

		return themeKey
	}

	// Reactivity
	$: themeKey = getAstroTheme(astroTheme)

	$: theme = {
		// Svelte-ignore reactive_declaration_non_reactive_property
		...ThemeUtils.presets[themeKey],
		...defaultTheme,
	}
	$: period = 1 / ((periodSeconds / Math.PI) * 500)
	// eslint-disable-next-line svelte/no-immutable-reactive-statements
	$: [min, max] = interval2

	$: {
		if (!interacting) {
			const newValue = offsets.map((offset, index) =>
				map(Math.sin(time + offset + offsetAngle[index]), -1, 1, min, max),
			) as PointValue4dTuple

			setHeadingUp($point4, newValue)
			$point4 = newValue
		}
	}
	function setHeadingUp(oldPoint: PointValue4dTuple, newPoint: PointValue4dTuple) {
		headingUp = headingUp.map((v, index) =>
			newPoint[index] === oldPoint[index] ? v : newPoint[index] > oldPoint[index],
		) as typeof headingUp
	}

	$: interacting && setOffsets($point4)
	function setOffsets(point: PointValue4dTuple) {
		offsets = point.map((value, index) => {
			const mappedValue = Math.asin(map(value, min, max, -1, 1))
			return (headingUp[index] ? mappedValue : Math.PI - mappedValue) - time - offsetAngle[index]
		}) as PointValue4dTuple
	}

	let scale = 1
</script>

<div bind:this={paneDiv}>
	<!-- {#if mounted} -->
	<div transition:fade={{ duration: 1500 }}>
		<Pane position="inline" {scale} {theme} title={`<Pane> ${text}`} {width}>
			<!-- <Slider bind:value={scale} min={0} max={2} /> -->
			<List bind:value={themeKey} label="<List> Theme" options={themes} />
			<Text bind:value={text} label="<Text> Title" />
			<Checkbox bind:value={playing} label="<Checkbox> Play" />
			<!-- <FpsGraph label="<FpsGraph>" /> -->
			<Monitor
				value={$point4[0]}
				min={-0.2}
				max={1.2}
				bufferSize={1800}
				graph={true}
				label="<Monitor>"
			/>
			<Separator />
			<!-- <Button on:click={reset} label="<Button> Reset" title="Reset" /> -->
			<Slider
				bind:value={periodSeconds}
				min={1}
				max={60}
				format={(v) => `${v.toFixed(1)}s`}
				label="<Slider> Period"
				step={1}
			/>
			<Separator />
			<Folder title="<Folder> Axes">
				{#each keys as k, index}
					<Slider
						bind:value={$point4[index]}
						{min}
						{max}
						format={(v) => `${v.toFixed(2)}`}
						label={`<Slider> ${k}`}
						pointerScale={0.002}
					/>
				{/each}
			</Folder>
			{#if cubicBezierEnabled}
				<Separator />Z
				<RotationEuler
					bind:value={$point3}
					expanded={true}
					label="<RotationEuler> X Y Z"
					picker="inline"
				/>
				<!-- <IntervalSlider bind:value={interval2} min={0} max={1} label="<IntervalSlider> Min /
Max"
	/> -->

				<Separator />
				<TabGroup>
					{#each keys as k, index}
						<TabPage title={`<TabPage> ${k}`}>
							<Monitor
								value={$point4[index]}
								min={-0.2}
								max={1.2}
								bufferSize={300}
								graph={true}
								label={`<Monitor> ${k}`}
							/>
						</TabPage>
					{/each}
				</TabGroup>
				<Separator />
				<Color
					bind:value={$point4}
					expanded={false}
					label="<Color> R G B A"
					picker="inline"
					type="float"
				/>
				<Separator />
				<Point
					bind:value={$point2}
					{min}
					{max}
					expanded={true}
					label="<Point> X Y"
					optionsY={{
						min,
						max,
						inverted: true,
					}}
					picker="inline"
				/>
				<CubicBezier
					bind:value={$point4}
					expanded={true}
					label="<CubicBezier> X Y Z W"
					picker="inline"
				/>
			{/if}
		</Pane>
	</div>
	<!-- {/if} -->
</div>
