# svelte-tweakpane-ui

## Overview

**A [Svelte](https://svelte.dev) component library wrapping UI elements from [Tweakpane](https://cocopon.github.io/tweakpane/), plus some additional functionality for convenience and flexibility.**

The components should be useful for quickly integrating controls and value monitoring in parametrically driven artworks or simulations. For some use cases, it could also present a viable alternative to traditional component libraries altogether.

Tweakpane represents many years of development effort by [Hiroki Kokubun](https://cocopon.me). The library's visual design offers a highly legible aesthetic, and its implementation provides fine specimens of many controls that are often a bit clunky in general-purpose component libraries.

_Note: This library is not to be confused with Karl Moore's [`svelte-tweakpane`](https://github.com/pierogis/svelte-tweakpane)._

## Getting started

Add the library to your Svelte or SvelteKit project:

```zsh
npm install --development svelte-tweakpane-ui
```

Import and use Tweakpane in your Svelte components:

```tsx
TK;
```

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

## Temp dev notes

- https://stackoverflow.com/questions/76553208/dynamic-props-for-svelte-component
- Spreading $$props breaks types. $$restProps seems safe.
- https://github.com/sveltejs/kit/tree/1c5681e27074a0b1380f4a8b0118ed5ab7c6ebd7/sites/kit.svelte.dev/scripts
- https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API
- https://github.com/sveltejs/language-tools/blob/98848db6d4dd06e7822553c0f6138a88ccc06c32/packages/language-server/src/plugins/typescript/DocumentSnapshot.ts#L647
- Props must be passed manually instead of spreading `{...$$props}`. Spreading props breaks typechecking since the generated type definition allows any key / value to be passed to the component.
- Using `type $$Props` instead of `interface $$Props` avoids `$$Props.Type` noise in hover tips.
- https://github.com/khromov/sveltekit-dynamic-component-load-demo
- https://github.com/HiDeoo/Typedown
- Sveltepress example: https://github.com/Myrmod/svelte-babylon
- https://github.com/leveluptuts/bookit
- https://npm.io/package/svelte-doc-kit
- https://jordimarimon.github.io/ts-ast-parser/
- [Tutorial](https://blog.logrocket.com/build-your-own-component-library-svelte/)
- https://github.com/understanding-astro/understanding-astro-book

## JSDoc Meanings

- `@default`
- `@emits` bindable prop
- `@readonly` prop should not be set
- `@sourceLink` is replaced with link to github source code
