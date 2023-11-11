<script lang="ts">
  /**
   * Name of the component to load in the `src/components/examples/svelte` directory.
   * e.g. "Button".
   * 
   * Will be suffixed with Example.svelte"
   */
  export let name: string;
</script>

{#await import(`../examples/svelte/${name}Example.svelte`) then exampleComponent}
  <svelte:component this={exampleComponent.default} />
{/await}
