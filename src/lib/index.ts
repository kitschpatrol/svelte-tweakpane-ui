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
export { default as AutoObject } from '$lib/extras/AutoObject.svelte';
export { default as Checkbox } from '$lib/extras/Checkbox.svelte';
export { default as Color, type ColorValue } from '$lib/extras/Color.svelte';
export { default as List, type ListOptions } from '$lib/extras/List.svelte';
export { default as Monitor } from '$lib/extras/Monitor.svelte';
export {
	default as Point,
	type PointValue2d,
	type PointValue3d,
	type PointValue4d,
	type PointOptionsX,
	type PointOptionsY,
	type PointOptionsZ,
	type PointOptionsW
} from '$lib/extras/Point.svelte';
export { default as Separator } from '$lib/extras/Separator.svelte';
export { default as Slider } from '$lib/extras/Slider.svelte';
export { default as Text } from '$lib/extras/Text.svelte';

// essentials (1st party plugins)
export {
	default as ButtonGrid,
	type ButtonGridClickEvent
} from '$lib/plugins/essentials/ButtonGrid.svelte';
export {
	default as CubicBezier,
	type CubicBezierValue
} from '$lib/plugins/essentials/CubicBezier.svelte';
export { default as FpsGraph } from '$lib/plugins/essentials/FpsGraph.svelte';
export {
	default as IntervalSlider,
	type IntervalSliderValue
} from '$lib/plugins/essentials/IntervalSlider.svelte';
export { default as RadioGrid } from '$lib/plugins/essentials/RadioGrid.svelte';

// camerakit (1st party plugins)
export {
	default as Ring,
	type RingSeries,
	type RingUnit
} from '$lib/plugins/camerakit/Ring.svelte';
export { default as Wheel } from '$lib/plugins/camerakit/Wheel.svelte';

// additional plugins (3rd party / community)
export { default as Image, type ImageValue } from '$lib/plugins/Image.svelte';
export {
	default as Profiler,
	type ProfilerCalcMode,
	type ProfilerMeasure,
	type ProfilerMeasureHandler
} from '$lib/plugins/Profiler.svelte';
export {
	default as RotationEuler,
	type RotationEulerOrder,
	type RotationEulerUnit,
	type RotationEulerValue,
	type RotationEulerOptions
} from '$lib/plugins/RotationEuler.svelte';
export {
	default as RotationQuaternion,
	type RotationQuaternionValue,
	type RotationQuaternionOptions
} from '$lib/plugins/RotationQuaternion.svelte';
export { default as Textarea } from '$lib/plugins/Textarea.svelte';
export { default as WaveformMonitor } from '$lib/plugins/WaveformMonitor.svelte';
