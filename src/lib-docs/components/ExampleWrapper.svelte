<script lang="ts">
</script>

<div
	class="relative my-8 mx-auto rounded-md shadow-xl border-border border flex justify-center"
	style="background-color: rgb(56 56 56);"
>
	<div class="center-column shadow-xl">
		<div class="center-row">
			<slot />
		</div>
	</div>
</div>

<style>
	div.center-column {
		display: flex;
		align-items: center;
		justify-self: center;
		background-color: rgb(83 83 83);
	}

	div.center-row {
		margin: 2rem 0;
		background-color: rgb(83 83 83);
		min-width: 256px;
	}

	div.center-row :global(pre) {
		margin: 0;
		font-size: 0.875rem;
	}
</style>
