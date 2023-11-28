---
title: Getting Started
description: Steps to get going with Svelte Tweakpane UI.
---

:::note
_**If you're coming in cold, and don't know why you might want to "get started" in the first place, you might want to take a look at [the overview](./docs) first.**_
:::

## Quick start

Add svelte-tweakpane-ui to your project:

```sh
npm install svelte-tweakpane-ui
```

Import and use Tweakpane components in your `.svelte` files:

```svelte title="your-component.svelte"
<script lang="ts">
  import { Button } from 'svelte-tweakpane-ui';
</script>

<Button on:click={() => alert('Hi from STUI')} />
```

---

## Step by step

### Step 0: Create a new Svelte project

If you're starting completely from scratch and just want to test out the `svelte-tweakpane-ui` library, you can spin up a SvelteKit project like this — otherwise, [skip to step 1](#step-1-add-svelte-tweakpane-ui-to-your-project).

Of course you can use `svelte-tweakpane-ui` anywhere Svelte works, including island frameworks like [Astro](https://astro.build) or [Eleventy](https://www.11ty.dev/docs/plugins/partial-hydration/) (albeit with a [caveat or two](TODO)).

```sh
npm create svelte@latest svelte-tweakpane-sandbox
```

The Svelte project wizard will then grill you with a bunch of questions. The following answers are fine, but not mandatory:

> Which Svelte app template?
>
> - [x] Skeleton projects
>
> Add type checking with TypeScript?
>
> - [x] Yes, using TypeScript syntax
>
> Select additional options
>
> - [x] Add ESLint for code linting
> - [x] Add Prettier for code formatting

Then install dependencies:

```sh
cd svelte-tweakpane-sandbox
npm install
```

### Step 1: Add Svelte Tweakpane UI to your project

From the root of your project, run:

```sh
npm install svelte-tweakpane-ui
```

### Step 2: Import and use Tweakpane components

If you're starting from an empty SvelteKit starter project, you can add a button to the default `+page.svelte` route like this:

```diff lang="svelte" title="/src/routes/+page.svelte"
+ <script lang="ts">
+	import { Button } from 'svelte-tweakpane-ui';
+ </script>
+
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
+ <Button on:click={() => alert('Hi from STUI')} />
```

Then run the project:

```sh
npm run dev -- --open
```

And that's it, you'll notice a few things right away if you're familiar with Tweakpane:

- _**The button is in the regular page flow, not fixed in the top-right corner?**_

  By default, `svelte-tweakpane-ui` components are added to the document flow, which makes them easy to integrate with your existing UI and to manipulate with Svelte's template syntax. You can change this by wrapping your components in a [`<Pane>`](/components/pane) component and setting the `position` prop to `'draggable'` or `'fixed'`.

- _**I didn't have to create a pane around the `Button`?**_

  `svelte-tweakpane-ui` components "bootstrap" themselves into a title-less Pane component if they're used on their own. This is a convenience feature, but you can also wrap them in a `<Pane>` component yourself if you want to customize the title or other Pane properties.

- _**That's a really wide button...**_

  Yes, inline `svelte-tweakpane-ui` components take the width of their container. You can use a `<Pane>` element to set a specific width, or nestle the component in an existing element with a defined width.

- _**Looks pretty straightforward, there's nothing weird about the `on:click` syntax...**_

  Exactly, `svelte-tweakpane-ui` components are designed to leverage as many Svelte conventions as possible. Behind the scenes, the lifecycle and event listeners of the underlying "vanilla JS" Tweakpane components are managed for you.

## Next Steps

Read the [overview](./docs), or browse the component library in the sidebar.
