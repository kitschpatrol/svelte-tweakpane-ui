<script lang="ts">
	import type { ComponentPartInfo } from '$lib-docs/types';
	import { Table, Chip } from '@svelteness/kit-docs';

	export let data: ComponentPartInfo;
	export let showDefault: boolean = true;
	export let showFlags: boolean = true;

	function cleanType(type: string): string {
		return type
			.replace(/"/g, "'")
			.replace(/&quot;/g, '&apos;')
			.replace(' | undefined', '');
	}

	function cleanDefault(defaultValue: string | undefined): string {
		if (defaultValue === undefined) return '';
		return defaultValue;
	}

	function isRequired(type: string): boolean {
		return !type.includes(' | undefined');
	}

	function getFlags(prop: ComponentPartInfo[0]): string[] {
		const flags = Object.keys(prop.jsDocs)
			// default gets its own row
			.filter((key) => key !== 'default')
			.map((key) => key);

		// have to pull "required" from type
		if (isRequired(prop.type)) {
			flags.push('required');
		} else {
			flags.push('optional');
		}

		return flags;
	}

	// console.log(data);
</script>

<Table class="prop-table">
	<svelte:fragment slot="head">
		<tr>
			<th>Name</th>
			<th>Description</th>
			<th>Type</th>
			{#if showDefault}
				<th>Default</th>
			{/if}
			{#if showFlags}
				<th>Flags</th>
			{/if}
		</tr>
	</svelte:fragment>
	<svelte:fragment slot="body">
		{#each data as prop}
			<tr>
				<td>
					<code>{prop.name}</code>
				</td>
				<td class="widest">{@html prop.doc}</td>
				<td class="wide"><code>{@html cleanType(prop.type)}</code></td>
				{#if showDefault}
					<td class="wide">{@html cleanDefault(prop.jsDocs.default)}</td>
				{/if}
				{#if showFlags}
					<td>
						<div class="chip-stack">
							{#each getFlags(prop) as flag}
								<Chip>{flag}</Chip>
							{/each}
						</div>
					</td>
				{/if}
			</tr>
		{/each}
	</svelte:fragment>
</Table>

<style>
	:global(.prop-table table) {
		table-layout: auto;
		border-collapse: collapse;
		width: 100%;
	}

	:global(.prop-table thead) {
		background-color: unset !important;
	}

	th {
		font-size: 0.875rem;
	}

	.chip-stack {
		display: flex;
		flex-direction: column;
		gap: 4px;
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

	td.widest {
		width: 100%;
		min-width: 180px;
		white-space: normal; /* Reset white space */
	}

	td.wide {
		width: 20%;
		word-wrap: normal; /* Break long words */
		white-space: normal; /* Reset white space */
	}
</style>
