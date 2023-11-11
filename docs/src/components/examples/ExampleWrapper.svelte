<script context="module" lang="ts">
  // $lib alias doesn't seem to work for dynamic imports
  const getExampleComponentPromise = (name: string) => {
    return import(`../examples/svelte/${name}Example.svelte`);
  };
</script>

<script lang="ts">
  /**
   * Name of the component to load in the `src/components/examples/svelte` directory.
   * e.g. "Button".
   * 
   * Will be suffixed with Example.svelte"
   */
  export let name: string;
</script>

{#await getExampleComponentPromise(name) then exampleComponent}
  <svelte:component this={exampleComponent.default} />
{/await}
