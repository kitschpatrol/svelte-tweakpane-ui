# svelte-tweakpane-ui

## Overview

**A [Svelte](https://svelte.dev) component library wrapping UI elements from [Tweakpane](https://cocopon.github.io/tweakpane/), plus some additional functionality for convenience and flexibility.**

The components should be useful for quickly integrating controls and value monitoring in parametrically driven artworks or simulations. For some use cases, it could also present a viable alternative to traditional component libraries altogether.

Tweakpane represents many years of development effort by [Hiroki Kokubun](https://cocopon.me). The library's visual design offers a highly legible aesthetic, and its implementation provides fine specimens of many controls that are often badly botched by more popular general-purpose component libraries. (The range slider implementation for example, stands out — as does the consistent and intuitive integration of keyboard-driven value manipulation.)

_Note: This library is not to be confused with Karl Moore's [`svelte-tweakpane`](TK)._

## Getting started

Add the library to your Svelte or SvelteKit project:

```zsh
npm install --development svelte-tweakpane-ui
```

Import and use Tweakpane in your Svelte components:

```
TK
```

## Philosophy and approach

### Batteries included

Tweakpane is enriched by a [wide array of third-party component plugins](TK). To keep these close at hand and to ensure plugin compatibility with Tweakpane version 4, this library includes a number of popular plugins right out of the box (while still allowing tree-shaking to keep the bundle size in check.)

themes

### Layered API

This component collection exposes both the core building blocks of Tweakpane's vanilla JS API as Svelte components (e.g. `Bindings`, `Folder`, `Pane`, etc.), and builds on this foundation to provide a number of more specific components which provide both convenience, clarity of intent, and improved auto-completion through type narrowing (e.g. `Slider`, `Point`, etc.).

These more specific components trade some dynamicism and flexibility for ease of use, but if you don't care for that tradeoff the higher level components remain available for use.

### Leave the binding to Svelte

Vanilla Tweakpane conveniently provides two-way bindings for manipulating object properties, but `svelte-tweakpane-ui` leaves binding up to the user via [Svelte's conventional approach](TK). This makes bindings explicit, and allows most components to function either as monitors or inputs depending on whether their value property is bound.

### Implicit Panes

Wrapping components in `<Pane>` components

## Components

### Core Tweakpane API

- `Pane`
- `Binding`
- `Blade`
- `Button`
- `Folder`
- `Tab`
- `Page`

### Convenience Components

- `MonitorBoolean`
- `Checkbox`
- `Color`
- `List`
- `MonitorNumber`
- `Point`
- `Separator`
- `Slider`
- `Text`
- `MonitorString`
- `AutoObject`

### Plugin Components _(Included)_

#### Essentials

- `ButtonGrid`
- `CubicBezier`
- `FpsGraph`
- `Interval`
- `RadioGrid`

#### Camera Kit

- `Ring`
- `Wheel`

#### Third-Party

- `Image`
- `Profiler`
- `RotationEuler`
- `RotationQuaternion`
- `Textarea`
- `ThumbnailList`
- `Waveform`

## Theming

TK

## Variations on Tweakpane

Note that the [`container`](https://tweakpane.github.io/docs/misc/#container) [PaneConfig](https://tweakpane.github.io/docs/api/interfaces/_internal_.PaneConfig.html) option is not exposed, because correct placement in the containing DOM is managed by 'svelte-tweakpane-ui', and `<Pane position='inline' ...>` should be used where you'd like a pane to become part of the normal document flow.

Similarly, the [`hidden`](https://tweakpane.github.io/docs/api/classes/Pane.html#hidden) accessor is not exposed, because visibility a pane and its components may be managed directly in Svelte.

Interval monitor

Inline components

Draggability

Scoped theming

Collapsability

Tuple support (ThreeJs compatibility)

Certain aspects of the Tweakpane API don't make a ton of sense in the Svelte context.

- [index](https://tweakpane.github.io/docs/misc/#insert) is not exposed. The order of controls appearance matches the component hierarchy.
- [visibility](https://tweakpane.github.io/docs/misc/#visibility) (e.g. `hidden`) is not exposed. Control the visibility of controls by adding / removing them from the component hierarchy.

- Not really woth distinguishing between "readonly" / "monitor" and input? this differentiation is accomplished simply through whether or not the `value` parameter is bare or `bind:value`. The polling strategy also doesn't make a ton of sense in a reactive environment.

## Plugins

### Bundled and integrated

Tweakpane version 4 is realtively recent, and introduced a number of breaking changes for plugin developers. I've ported a number of the plugins below from Tweakpane 3 to Tweakpane 4, and and submitted PRs to the project owners. If the PRs are merged, I will update the dependencies in `svelte-tweakpane-ui` to point to the source instead of my fork.

- [Essentials](https://github.com/tweakpane/plugin-essentials) (ButtonGrid, RadioGrid, CubicBezier, FpsGraph, Interval)
- [CameraKit](https://github.com/tweakpane/plugin-camerakit) (Ring, Wheel)
- [Rotation](https://github.com/kitschpatrol/tweakpane-plugin-rotation) (forked from [0b5vr](https://github.com/0b5vr/tweakpane-plugin-rotation) and ported to v4)
- [Profiler](https://github.com/kitschpatrol/tweakpane-plugin-profiler) (forked from [0b5vr](https://github.com/0b5vr/tweakpane-plugin-profiler) and ported to v4)
- [Image](https://github.com/kitschpatrol/tweakpane-image-plugin) (forked from [ayamflow](https://github.com/ayamflow/tweakpane-image-plugin) and [metehus](https://github.com/metehus/tweakpane-image-plugin) and ported to v4)
- [Textarea](https://github.com/kitschpatrol/tweakpane-textarea-plugin) (forked from [panGenerator](https://github.com/panGenerator/tweakpane-textarea-plugin) and ported to v4)
- [ThumbnailList](https://github.com/kitschpatrol/tweakpane-plugin-thumbnail-list) (forked from [donmccurdy](https://github.com/donmccurdy/tweakpane-plugin-thumbnail-list) and ported to v4)
- [Waveform](https://github.com/kitschpatrol/tweakpane-plugin-waveform) (forked from [shoedler](https://github.com/shoedler/tweakpane-plugin-waveform) and ported to v4)

### Integration candidates

Additional Tweakplane plugins under consideration for integration with `svelte-tweakpane-ui`. If there's one you'd really like to see either integrated or added to the list, please open an issue or a PR:

- [tweakpane-plugin-infodump](https://github.com/doersino/tweakpane-plugin-infodump) 🎛️v3 ⭐️×12
- [tweakpane-plugin-chromatic](https://github.com/brunoimbrizi/tweakpane-plugin-chromatic) 🎛️v3 ⭐️×11
- [tweakpane-table](https://github.com/amir-arad/tweakpane-table) 🎛️v3 ⭐️×6
- [tweakpane-plugin-search-list](https://github.com/hirohe/tweakpane-plugin-search-list) 🎛️v3 ⭐️×6
- [midi-control](https://github.com/mollerse/midi-control) 🎛️v3 ⭐️×4 👀
- [tweakpane-plugin-media](https://github.com/leochocolat/tweakpane-plugin-media) 🎛️v3 ⭐️×3
- [tweakpane-plugin-file-import](https://github.com/LuchoTurtle/tweakpane-plugin-file-import) 🎛️v3 ⭐️×3 👀
- [tweakpane-plugin-audio-player](https://github.com/brunoimbrizi/tweakpane-plugin-audio-player) 🎛️v3 ⭐️×3
- [tweakpane-plugin-grouplist](https://github.com/pierogis/tweakpane-plugin-grouplist) 🎛️v3 ⭐️×1
- [tweakpane-media](https://github.com/vnvyvu/tweakpane-media) 🎛️v3 ⭐️×0
- [tweakpane-multiple-select-plugin](https://github.com/IvanLi-CN/tweakpane-multiple-select-plugin) 🎛️v3 ⭐️×0

## Additional resources

### Tweakpane

- [GitHub Repository](https://github.com/cocopon/tweakpane/)
- [Documentation](https://tweakpane.github.io/docs/)
- [API](https://tweakpane.github.io/docs/api/index.html)

### Related projects

#### Component libraries

- [dat.gui](https://github.com/dataarts/dat.gui) _The OG, Vanilla JS_
- [leva](https://github.com/pmndrs/leva) _React-centric_
- [svelte-knobby](https://github.com/Rich-Harris/svelte-knobby)
- [Tutorial](https://blog.logrocket.com/build-your-own-component-library-svelte/)

#### Svelte Tweakpane Wrappers

Two other projects provide integration between Tweakpane and Svelte:

- [svelte-tweakpane](https://github.com/pierogis/svelte-tweakpane) by [Karl Moore](https://pierogis.live)
- [svelte-gui](https://github.com/mattcroat/svelte-gui) by [Matija](https://matia.xyz/)

`svelte-tweakpane-ui` drew some inspiration from these projects, but was developed indepdendently. The `-ui` suffix in `svelte-tweakpane-ui` is to avoid a naming colission with Karl Moore's work.

#### Tweakpane adaptations for reactive frameworks

- [solid-tweakpane](https://github.com/MrFoxPro/solid-tweakpane)
- [react-tweakpane](https://github.com/MelonCode/react-tweakpane)
- [v-tweakpane](https://github.com/vinayakkulkarni/v-tweakpane)

## Temp dev notes

- Spreading $$props breaks types. $$restProps seems safe.
- https://github.com/sveltejs/kit/tree/1c5681e27074a0b1380f4a8b0118ed5ab7c6ebd7/sites/kit.svelte.dev/scripts
- https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API

## JSDoc Meanings

- `@default`
- `@emits` bindable prop
- `@readonly` prop should not be set
