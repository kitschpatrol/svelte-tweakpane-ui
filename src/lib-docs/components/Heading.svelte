<script lang="ts">
	import { kebabCase } from 'lodash-es';
	import striptags from 'striptags';

	export let level: 1 | 2 | 3 | 4 | 5 | 6;
	export let text: string;

	function cleanAnchor(str: string): string {
		return kebabCase(striptags(str).replace(/['"]/g, '')).toLowerCase();
	}

	$: anchor = cleanAnchor(text);
	$: tag = `h${level}`;
</script>

<!-- 
  @component 
  Reimplement KitDocs heading output for correct "on this page" behavior
  Leading space matches behavior of the built-in markdown renderer
-->

<svelte:element this={tag} id={anchor} tabindex="-1">
	<a class="header-anchor" aria-hidden="true" href="#{anchor}">#</a>
	{@html text}
</svelte:element>
