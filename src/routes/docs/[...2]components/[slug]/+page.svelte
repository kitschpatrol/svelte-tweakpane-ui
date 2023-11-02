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
	import { Admonition } from '@svelteness/kit-docs';

	export let data: PageServerData;

	$: ({ component } = data);
	$: hasDynamicProps = component.dynamicProps && component.dynamicProps.length > 0;
</script>

<h1>{component.name}</h1>

{#if component.doc}
	<h2>Overview</h2>
	{@html component.doc}
{/if}

{#if component.jsDocs.example}
	<hr />
	<h2>Example</h2>
	<h3>Source</h3>
	{#await getExampleMarkdownPromise(component.name) then exampleMarkdown}
		<svelte:component this={exampleMarkdown.default} />
	{/await}

	<h3>Result</h3>
	{#await getExampleComponentPromise(component.name) then exampleComponent}
		<svelte:component this={exampleComponent.default} />
	{/await}
{/if}

{#if component.props.length > 0}
	<hr />

	<h2>Props</h2>

	{#if hasDynamicProps}
		<Admonition type="experimental" title="Dynamic Props">
			<p>
				<strong>
					&lt;{component.name}&gt; has dynamic props, which means the props available on the
					component can change depending on the value or type of other props passed to the
					component.
				</strong>
			</p>
			<p>
				The section below lists the props that are always available under "Common Props", and then
				provides additional prop tables showing how prop availability changes under different
				circumstances.
			</p>
			<p>
				Dynamic props are neither particularly well supported by Svelte itself, nor are they a
				particularly common pattern in Svelte libraries, but they're used in <code
					>svelte-tweakpane-ui</code
				> to provide flexibility at runtime and reduce the number of discrete components required.
			</p>
			<p>
				Autocompletion should adapt dynamically to show valid props available at any given time.
			</p>
			<p>
				You may see warnings if you change a dynamic prop at runtime while continuing to pass props
				contingent on a previous value of the dynamic prop.
			</p>
		</Admonition>

		<h3>Common Props</h3>
		<PropTable data={component.props} />

		{#if component.dynamicProps}
			{#each component.dynamicProps as dynamicPropExample}
				<h3>
					Props when <span class="prop-condition">{@html dynamicPropExample.description}</span>
				</h3>

				<PropTable data={dynamicPropExample.props} />
			{/each}
		{/if}
	{:else}
		<PropTable data={component.props} />
	{/if}
{/if}

{#if component.events.length > 0}
	<hr />
	<h2>Events</h2>
	<PropTable data={component.events} showDefault={false} showFlags={false} />
{/if}

<style>
	.prop-condition {
		color: #6366f1;
	}
</style>
