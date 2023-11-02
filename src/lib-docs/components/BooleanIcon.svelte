<script lang="ts">
	export let showFalse: boolean = true;
	export let value: boolean;
</script>

<div class="">
	{#if value}
		<svg
			color="rgb(74 222 128 / var(--tw-bg-opacity))"
			width="6"
			height="4.5"
			class="scale-x-[1.3] scale-y-[1.3] transform overflow-visible"
			aria-hidden="true"
		>
			<path
				d="M6 0L2 4.5L0 2.5"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if showFalse}
		<svg
			color="rgb(251 113 133 / var(--tw-bg-opacity))"
			width="6"
			height="6"
			class="-ml-px scale-x-[1.1] scale-y-[1.1] transform overflow-visible"
			aria-hidden="true"
		>
			<path
				d="M0 0L6 6M6 0L0 6"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{/if}
</div>
