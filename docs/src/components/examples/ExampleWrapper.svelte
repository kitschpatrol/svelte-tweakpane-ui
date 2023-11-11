<script context="module" lang="ts">
  // $lib alias doesn't seem to work for dynamic imports
  const getExampleComponentPromise = (name: string) => {
    return import(`../examples/svelte/${name}Example.svelte`);
  };
</script>

<script lang="ts">
  export let name: string;
</script>


  {#await getExampleComponentPromise(name) then exampleComponent}
    <svelte:component this={exampleComponent.default} />
  {/await}

