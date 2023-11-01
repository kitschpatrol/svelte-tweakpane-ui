<script lang="ts">
	import type { ComponentPartInfo } from '$lib-docs/types';
	import { Table } from '@svelteness/kit-docs';

	export let data: ComponentPartInfo;

	function cleanType(type: string): string {
		return type.replace(' | undefined', '');
	}

	function cleanDefault(defaultValue: string | undefined): string {
		if (defaultValue === undefined) return '';
		return defaultValue.includes('undefined') ? '' : defaultValue;
	}

	function isRequired(type: string): string {
		return !type.includes(' | undefined') ? 'Yes' : '';
	}

	// console.log(data);
</script>

<Table>
	<svelte:fragment slot="head">
		<tr>
			<th>Prop</th>
			<th>Description</th>
			<th>Type</th>
			<th>Default</th>
			<th>Bindable</th>
			<th>Required</th>
		</tr>
	</svelte:fragment>
	<svelte:fragment slot="body">
		{#each data as prop}
			<tr>
				<td><code>{prop.name}</code></td>
				<td>{@html prop.doc}</td>
				<td><code>{@html cleanType(prop.type)}</code></td>
				<td>{@html cleanDefault(prop.jsDocs.default)}</td>
				<td>{prop.jsDocs.bindable === '' ? 'Yes' : ''}</td>
				<td>{isRequired(prop.type)}</td>
			</tr>
		{/each}
	</svelte:fragment>
</Table>
