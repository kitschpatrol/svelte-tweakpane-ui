# svelte-tweakpane-ui

[![NPM Package](https://img.shields.io/npm/v/svelte-tweakpane-ui.svg)](https://npmjs.com/package/svelte-tweakpane-ui)
[![Documentation](https://img.shields.io/badge/-documentation-ffdd00?logo=readthedocs&logoColor=222222)](https://kitschpatrol.com/svelte-tweakpane-ui)

## Overview

🎛️ **_Svelte Tweakpane UI_** wraps user-interface elements from the excellent [Tweakpane](https://cocopon.github.io/tweakpane/) library in a collection of 31 idiomatic, reactive, type-safe, carefully-crafted, and obsessively-documented [Svelte](https://svelte.dev) components.

The library makes it easy to quickly and declaratively add knobs and dials to your projects using components that feel like they were made for Svelte. It also augments Tweakpane with a few [extra features](https://kitschpatrol.com/svelte-tweakpane-ui/docs/features) for your convenience and enjoyment.

[The components](https://kitschpatrol.com/svelte-tweakpane-ui/docs#components) should be useful for integrating controls and value monitoring in parametrically driven artworks, data visualizations, creative tools, simulations, etc.

## Demo

![Svelte Tweakpane UI quick demo](./docs/public/quick-demo.gif)

## Documentation

**_Please see the documentation site for much more information:_**  
**[https://kitschpatrol.com/svelte-tweakpane-ui](https://kitschpatrol.com/svelte-tweakpane-ui)**

## Quick start

1. Add _Svelte Tweakpane UI_ to your Svelte project:

```sh
npm install svelte-tweakpane-ui
```

2. Import and use Tweakpane components in your `.svelte` files:

```svelte
<script lang="ts">
  import { Button } from 'svelte-tweakpane-ui';
</script>

<Button on:click={() => alert('🎛️')} />
```

---

_Note: This library is not to be confused with Karl Moore's [`svelte-tweakpane`](https://github.com/pierogis/svelte-tweakpane)._
