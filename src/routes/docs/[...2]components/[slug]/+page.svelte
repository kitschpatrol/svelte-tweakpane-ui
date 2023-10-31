<script lang="ts" context="module">
	const getComponentPromise = (name: string) => {
		// $lib alias doesn't seem to work for dynamic imports
		return import(`../../../../lib-docs/generated/examples/${name}Example.svelte`);
	};

	// const getComponent = (name: string) => {
	// 	// $lib alias doesn't seem to work for dynamic imports
	// 	return import(`${name}`);
	// };
</script>

<script lang="ts">
	import { CodeFence, CodeInline } from '@svelteness/kit-docs';

	import type { PageServerData } from './$types';
	export let data: PageServerData;

	// has to be responsive...
	$: ({ component, docHtml } = data);

	$: code = JSON.stringify(component, null, 2);

	// title && `title="${title}"`,
	// 	`lang="${language.name}"`,
	// 	`ext="${language.ext}"`,
	// 	`linesCount={${linesCount}}`,
	// 	useLineNumbers && 'showLineNumbers',
	// 	(highlightLinesRanges?.length ?? 0) > 0 && `highlightLines={${highlight}}`,
	// 	showCopyCode && `rawCode={${JSON.stringify(rawCode)}}`,
	// 	showCopyCode && 'showCopyCode',
	// 	copyHighlightOnly && `copyHighlightOnly`,
	// 	copySteps && 'copySteps',
	// 	`code={${JSON.stringify(code)}}`,
	// 	slot && `slot="${slot}"`;

	// $: description = parser.render(component.doc[0].text);

	// $: stuff = URL.createObjectURL(new Blob([sourcecode], { type: 'text/javascript' }));
</script>

<h1>{component.name}</h1>
<!-- {#await getComponent(stuff) then comp}
	{console.log(comp.default)}
	<svelte:component this={comp.default} />
{/await} -->

{@html docHtml}

{#await getComponentPromise(component.name) then exampleComponent}
	<svelte:component this={exampleComponent.default} />
{/await}

<CodeFence
	title="{component.name}Example.svelte"
	lang="json"
	showCopyCode={true}
	copyHighlightOnly={false}
	{code}
	ext="ts"
	linesCount={code.split('\n').length}
/>
