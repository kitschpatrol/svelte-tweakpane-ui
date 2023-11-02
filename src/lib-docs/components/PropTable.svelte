<script lang="ts">
	import type { ComponentPartInfo } from '$lib-docs/types';
	import { Table, Chip } from '@svelteness/kit-docs';
	import BooleanIcon from './BooleanIcon.svelte';

	export let data: ComponentPartInfo;

	function cleanType(type: string): string {
		return type
			.replace(/"/g, "'")
			.replace(/&quot;/g, '&apos;')
			.replace(' | undefined', '');
	}

	function cleanDefault(defaultValue: string | undefined): string {
		if (defaultValue === undefined) return '';
		return defaultValue.includes('undefined') ? '' : defaultValue;
	}

	function isRequired(type: string): boolean {
		return !type.includes(' | undefined');
	}

	// console.log(data);
</script>

<Table class="propTable">
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
				<!-- <td><BooleanIcon showFalse={false} value={prop.jsDocs.bindable === ''} /></td>
				<td><BooleanIcon showFalse={false} value={isRequired(prop.type)} /></td> -->
				<td><em>{prop.jsDocs.bindable === '' ? 'bindable' : ''}</em></td>
				<td><em>{isRequired(prop.type) ? 'required' : ''}</em></td>
			</tr>
		{/each}
	</svelte:fragment>
</Table>

<style>
	:global(.propTable table) {
		table-layout: auto;
		border-collapse: collapse;
		width: 100%;
	}

	:global(.propTable thead) {
		background-color: unset !important;
	}

	th {
		font-size: 0.875rem;
	}

	th,
	td {
		padding-left: 0;
		margin-left: 0;
		text-align: left;
		word-wrap: break-word; /* Break long words */
		overflow-wrap: break-word; /* Modern property for wrapping */
		width: 1px; /* This will force the column to be as small as possible without content breaking */
		white-space: nowrap; /* This ensures the content does not break */
	}

	tbody tr td:nth-child(n + 2) :global(code) {
		font-weight: unset;
	}

	td:nth-child(2) {
		width: 60%;
		white-space: normal; /* Reset white space */
	}

	td:nth-child(4),
	td:nth-child(3) {
		width: 20%;
		white-space: normal; /* Reset white space */
	}
</style>
