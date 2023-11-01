// shared
export type { Plugin, BindingObject } from '$lib/utils.js';

// themes
export { THEMES, setGlobalDefaultTheme, type Theme } from '$lib/theme.js';

// core (tweakpane building blocks)
export { default as Binding, type BindingOptions, type BindingRef } from '$lib/core/Binding.svelte';
export { default as Blade, type BladeOptions, type BladeRef } from '$lib/core/Blade.svelte';
export { default as Button } from '$lib/core/Button.svelte';
export { default as Folder } from '$lib/core/Folder.svelte';
export { default as Page } from '$lib/core/Page.svelte';
export { default as Pane, type PanePosition } from '$lib/core/Pane.svelte';
export { default as Tab } from '$lib/core/Tab.svelte';

// extra (svelte convenience components)
export { default as AutoObject } from '$lib/extra/AutoObject.svelte';
export { default as Checkbox } from '$lib/extra/Checkbox.svelte';
export { default as Color, type ColorValue } from '$lib/extra/Color.svelte';
export { default as List, type ListOptions } from '$lib/extra/List.svelte';
export { default as Monitor } from '$lib/extra/Monitor.svelte';
export {
	default as Point,
	type PointValue2d,
	type PointValue3d,
	type PointValue4d,
	type PointOptionsX,
	type PointOptionsY,
	type PointOptionsZ,
	type PointOptionsW
} from '$lib/extra/Point.svelte';
export { default as Separator } from '$lib/extra/Separator.svelte';
export { default as Slider } from '$lib/extra/Slider.svelte';
export { default as Text } from '$lib/extra/Text.svelte';

// essentials (1st party plugins)
export {
	default as ButtonGrid,
	type ButtonGridClickEvent
} from '$lib/plugin/essentials/ButtonGrid.svelte';
export {
	default as CubicBezier,
	type CubicBezierValue
} from '$lib/plugin/essentials/CubicBezier.svelte';
export { default as FpsGraph } from '$lib/plugin/essentials/FpsGraph.svelte';
export {
	default as IntervalSlider,
	type IntervalSliderValue
} from '$lib/plugin/essentials/IntervalSlider.svelte';
export { default as RadioGrid } from '$lib/plugin/essentials/RadioGrid.svelte';

// camerakit (1st party plugins)
export { default as Ring, type RingSeries, type RingUnit } from '$lib/plugin/camerakit/Ring.svelte';
export { default as Wheel } from '$lib/plugin/camerakit/Wheel.svelte';

// additional plugins (3rd party / community)
export { default as Image, type ImageValue } from '$lib/plugin/Image.svelte';
export {
	default as Profiler,
	type ProfilerCalcMode,
	type ProfilerMeasure,
	type ProfilerMeasureHandler
} from '$lib/plugin/Profiler.svelte';
export {
	default as RotationEuler,
	type RotationEulerOrder,
	type RotationEulerUnit,
	type RotationEulerValue,
	type RotationEulerOptions
} from '$lib/plugin/RotationEuler.svelte';
export {
	default as RotationQuaternion,
	type RotationQuaternionValue,
	type RotationQuaternionOptions
} from '$lib/plugin/RotationQuaternion.svelte';
export { default as Textarea } from '$lib/plugin/Textarea.svelte';
export { default as WaveformMonitor } from '$lib/plugin/WaveformMonitor.svelte';
