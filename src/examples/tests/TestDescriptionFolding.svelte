<script lang="ts">
	import {
		Color,
		ColorPlus,
		CubicBezier,
		type CubicBezierValue,
		Pane,
		Point,
		type PointValue2d,
		RotationEuler,
		type RotationEulerValue,
	} from '$lib'

	let color = '#ff8800'
	let colorPlus = 'oklch(70% 0.2 50deg)'
	let curve: CubicBezierValue = [0.25, 0.1, 0.25, 1]
	let expanded = false
	let point: PointValue2d = { x: 0.25, y: 0.75 }
	let rotation: RotationEulerValue = { x: 0, y: 0, z: 0 }
</script>

<Pane position="inline" title="Folding descriptions">
	<Color description="Tints the scene." label="Tint" bind:value={color} bind:expanded />
	<Color
		description="Tints the scene with an inline picker."
		expanded
		label="Inline tint"
		picker="inline"
		bind:value={color}
	/>
	<Color description="Tints without a label." bind:value={color} />
	<Color description="Cannot change the tint." disabled label="Locked tint" bind:value={color} />
	<Point description="Positions the light." label="Light" bind:value={point} />
	<Point
		description="Positions the light with an inline picker."
		expanded
		label="Inline light"
		picker="inline"
		bind:value={point}
	/>
	<CubicBezier description="Eases the animation." label="Easing" bind:value={curve} />
	<RotationEuler description="Rotates the model." label="Rotation" bind:value={rotation} />
	<ColorPlus description="Tints in a wide gamut." label="Wide tint" bind:value={colorPlus} />
</Pane>

<button
	type="button"
	on:click={() => {
		expanded = !expanded
	}}>Toggle picker</button
>
<output data-testid="expanded-state">{expanded}</output>
