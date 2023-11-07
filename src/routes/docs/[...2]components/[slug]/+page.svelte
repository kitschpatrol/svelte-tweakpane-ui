<script context="module" lang="ts">
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
	import { Admonition } from '@svelteness/kit-docs';
	import ExampleWrapper from '$lib-docs/components/ExampleWrapper.svelte';
	import Heading from '$lib-docs/components/Heading.svelte';
	import PropTable from '$lib-docs/components/PropTable.svelte';

	export let data: PageServerData;

	$: ({ component } = data);
</script>

<!-- 
	@component  
	This could technically be a .md file instead of .svelte, but loss of autocompletion and comingling of markdown and svelte syntax outweighed the inconvenience of wrapping headings etc.
-->

<h1>{component.name}</h1>

<!-- Component-level Documentation -->

{#if component.doc}
	<Heading level={2} text="Overview" />
	{@html component.doc}
{/if}

<!-- Example -->

{#if component.jsDocs.example}
	<hr />
	<Heading level={2} text="Example" />
	<Heading level={3} text="Source" />

	{#await getExampleMarkdownPromise(component.name) then exampleMarkdown}
		<svelte:component this={exampleMarkdown.default} />
	{/await}

	<Heading level={3} text="Result" />
	<ExampleWrapper>
		{#await getExampleComponentPromise(component.name) then exampleComponent}
			<svelte:component this={exampleComponent.default} />
		{/await}
	</ExampleWrapper>
{/if}

<!-- Props -->

{#if component.props.length > 0}
	<hr />
	<Heading level={2} text="Props" />

	{#if !(component.dynamicProps && component.dynamicProps.length > 0)}
		<PropTable data={component.props} />
	{:else}
		<Admonition title="Dynamic Props" type="experimental">
			<strong
				>&lt;{component.name}&gt; has dynamic props, which means the props available on the
				component can change depending on the value or type of other props passed to the component.</strong
			>
			<p>
				The section below lists the props that are always available under "Common Props", and then
				provides additional prop tables showing how prop availability changes under different
				circumstances.
			</p>
			<p>
				Dynamic props are neither particularly well supported by Svelte itself, nor are they a
				particularly common pattern in Svelte libraries, but they're used in `svelte-tweakpane-ui`
				to provide flexibility at runtime and reduce the number of discrete components required.
			</p>
			<p>
				Autocompletion should adapt dynamically to show valid props available at any given time.
			</p>
			<p>
				You may see warnings if you change a dynamic prop at runtime while continuing to pass props
				valid only for a different permutation of dynamic props.
			</p>
		</Admonition>

		<Heading level={3} text="Common Props" />
		<PropTable data={component.props} />

		{#each component.dynamicProps as dynamicPropExample}
			<Heading level={3} text={`Props when ${dynamicPropExample.description}`} />
			<PropTable data={dynamicPropExample.props} />
		{/each}
	{/if}
{/if}

<!-- Events -->

{#if component.events.length > 0}
	<hr />
	<Heading level={2} text="Events" />
	<PropTable data={component.events} showDefault={false} showFlags={false} />
{/if}

<!-- No svelte-tweakpane-ui components implement named slots -->
