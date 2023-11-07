<script lang="ts">
	export let showFalse: boolean = true;
	export let value: boolean;
</script>

<div class="">
	{#if value}
		<svg
			class="scale-x-[1.3] scale-y-[1.3] transform overflow-visible"
			aria-hidden="true"
			color="rgb(74 222 128 / var(--tw-bg-opacity))"
			height="4.5"
			width="6"
		>
			<path
				d="M6 0L2 4.5L0 2.5"
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
			/>
		</svg>
	{:else if showFalse}
		<svg
			class="-ml-px scale-x-[1.1] scale-y-[1.1] transform overflow-visible"
			aria-hidden="true"
			color="rgb(251 113 133 / var(--tw-bg-opacity))"
			height="6"
			width="6"
		>
			<path
				d="M0 0L6 6M6 0L0 6"
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
			/>
		</svg>
	{/if}
</div>
