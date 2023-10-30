<script lang="ts">
	import type { PageServerData } from './$types';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { kebabCase } from 'lodash-es';
	export let data: PageServerData;
</script>

<h1>Docs</h1>

<ul>
	{#each Object.values(data.components) as component}
		<li>
			<a href="docs/{kebabCase(component.name)}">{component.name}</a>
		</li>{/each}
</ul>
