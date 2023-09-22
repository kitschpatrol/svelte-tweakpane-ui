# svelte-tweakpane-ui

## Scratch

Renderless child ordering...

- https://github.com/sveltejs/svelte/issues/5381#issuecomment-690842511

Index files...

- https://github.com/sveltejs/kit/issues/2884

Advanced example...

- https://github.com/shinokada/svelte-lib-helpers
- https://flowbite-svelte.com

## Overview

A [Svelte](https://svelte.dev) component library for [Tweakpane](https://cocopon.github.io/tweakpane/).

## Variations on Tweakpane

Certain aspects of the Tweakpane API don't make a ton of sense in the Svelte context.

- [index](https://tweakpane.github.io/docs/misc/#insert) is not exposed. The order of controls appearance matches the component hierarchy.
- [visibility](https://tweakpane.github.io/docs/misc/#visibility) (e.g. `hidden`) is not exposed. Control the visibility of controls by adding / removing them from the component hierarchy.

- Not really woth distinguishing between "readonly" / "monitor" and input? this differentiation is accomplished simply through whether or not the `value` parameter is bare or `bind:value`. The polling strategy also doesn't make a ton of sense in a reactive environment.

### Tweakpane resources

- [Documentation](https://tweakpane.github.io/docs/)
- [API](https://tweakpane.github.io/docs/api/index.html)

### Other projects adapting Tweakpane to Svelte

- [svelte-tweakpane](https://github.com/pierogis/svelte-tweakpane) by [Karl Moore](https://pierogis.live)
- [svelte-gui](https://github.com/mattcroat/svelte-gui) by [Matija](https://matia.xyz/)

### Other projects adapting Tweakpane to reactive frameworks

- Solid: [solid-tweakpane](https://github.com/MrFoxPro/solid-tweakpane)
- React: [react-tweakpane](https://github.com/MelonCode/react-tweakpane)
- Vue: [v-tweakpane](https://github.com/vinayakkulkarni/v-tweakpane)

### Bundled & Integrated Plugins

- [Essentials](https://github.com/tweakpane/plugin-essentials) (ButtonGrid, RadioGrid, CubicBezier, FpsGraph, Interval)
- [CameraKit](https://github.com/tweakpane/plugin-camerakit) (Ring, Wheel)
- [Rotation](https://github.com/kitschpatrol/tweakpane-plugin-rotation) (forked from [0b5vr](https://github.com/0b5vr/tweakpane-plugin-rotation) and ported to v4)
- [Profiler](https://github.com/kitschpatrol/tweakpane-plugin-profiler) (forked from [0b5vr](https://github.com/0b5vr/tweakpane-plugin-profiler) and ported to v4)
- [Image](https://github.com/kitschpatrol/tweakpane-image-plugin) (forked from [ayamflow](https://github.com/ayamflow/tweakpane-image-plugin) and [metehus](https://github.com/metehus/tweakpane-image-plugin) and ported to v4)
- [Textarea](https://github.com/kitschpatrol/tweakpane-textarea-plugin) (forked from [panGenerator](https://github.com/panGenerator/tweakpane-textarea-plugin) and ported to v4)
- [ThumbnailList](https://github.com/kitschpatrol/tweakpane-plugin-thumbnail-list) (forked from [donmccurdy](https://github.com/donmccurdy/tweakpane-plugin-thumbnail-list) and ported to v4)
- [Waveform](https://github.com/kitschpatrol/tweakpane-plugin-waveform) (forked from [shoedler](https://github.com/shoedler/tweakpane-plugin-waveform) and ported to v4)

### Plugin Integration Candidates

- https://github.com/doersino/tweakpane-plugin-infodump (🎛️v3 ⭐️×12)
- https://github.com/brunoimbrizi/tweakpane-plugin-chromatic (🎛️v3 ⭐️×11)
- https://github.com/amir-arad/tweakpane-table (🎛️v3 ⭐️×6)
- https://github.com/hirohe/tweakpane-plugin-search-list (🎛️v3 ⭐️×6)
- https://github.com/mollerse/midi-control (🎛️v3 ⭐️×4 👀)
- https://github.com/leochocolat/tweakpane-plugin-media (🎛️v3 ⭐️×3)
- https://github.com/LuchoTurtle/tweakpane-plugin-file-import (🎛️v3 ⭐️×3 👀)
- https://github.com/brunoimbrizi/tweakpane-plugin-audio-player (🎛️v3 ⭐️×3)
- https://github.com/pierogis/tweakpane-plugin-grouplist (🎛️v3 ⭐️×1)
- https://github.com/vnvyvu/tweakpane-media (🎛️v3 ⭐️×0)
- https://github.com/IvanLi-CN/tweakpane-multiple-select-plugin (🎛️v3 ⭐️×0)

### Svelte Library integration

- https://kit.svelte.dev/docs/packaging
- Everything inside `src/lib` is part of your library, everything inside `src/routes` can be used as a showcase or preview app.
- To build your library: `npm run package`
- To create a production version of your showcase app: `npm run build`
- To publish your library to [npm](https://www.npmjs.com): `npm publish`
