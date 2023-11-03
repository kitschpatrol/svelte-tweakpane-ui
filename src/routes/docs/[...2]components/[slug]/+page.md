<script lang="ts" context="module">
	// $lib alias doesn't seem to work for dynamic imports
	const getExampleComponentPromise = (name: string) => {
		return import(`../../../../lib-docs/generated/examples/${name}Example.svelte`);
	};

	const getExampleMarkdownPromise = (name: string) => {
		return import(`../../../../lib-docs/generated/markdown/${name}Example.svelte`);
	};
</script>

<script lang="ts">
	import type { PageServerData } from './$types';
	import PropTable from '$lib-docs/components/PropTable.svelte';

	export let data: PageServerData;

	$: ({ component } = data);
	$: hasDynamicProps = component.dynamicProps && component.dynamicProps.length > 0;
</script>

# {component.name}

{#if component.doc}

## Overview

{@html component.doc}
{/if}

{#if component.jsDocs.example}

---

## Example

### Source

{#await getExampleMarkdownPromise(component.name) then exampleMarkdown}
<svelte:component this={exampleMarkdown.default} />
{/await}

### Result

{#await getExampleComponentPromise(component.name) then exampleComponent}
<svelte:component this={exampleComponent.default} />
{/await}

{/if}

{#if component.props.length > 0}

---

## Props

{#if hasDynamicProps}

:::admonition type="experimental" title="Dynamic Props"

**<{component.name}> has dynamic props, which means the props available on the component can change depending on the value or type of other props passed to the component.**

The section below lists the props that are always available under "Common Props", and then provides additional prop tables showing how prop availability changes under different circumstances.

Dynamic props are neither particularly well supported by Svelte itself, nor are they a particularly common pattern in Svelte libraries, but they're used in `svelte-tweakpane-ui` to provide flexibility at runtime and reduce the number of discrete components required.

Autocompletion should adapt dynamically to show valid props available at any given time.

You may see warnings if you change a dynamic prop at runtime while continuing to pass props
contingent on a previous value of the dynamic prop.
:::

### Common Props

<PropTable data={component.props} />

{#if component.dynamicProps}
{#each component.dynamicProps as dynamicPropExample}

### Props when {@html dynamicPropExample.description}

<PropTable data={dynamicPropExample.props} />

{/each}

{/if}

{:else}

<PropTable data={component.props} />

{/if}
{/if}

{#if component.events.length > 0}

---

## Events

<PropTable data={component.events} showDefault={false} showFlags={false} />

{/if}
