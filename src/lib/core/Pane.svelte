<script context="module"></script>

<script>
  import InternalPaneDraggable from '../internal/InternalPaneDraggable.svelte'
  import InternalPaneFixed from '../internal/InternalPaneFixed.svelte'
  import InternalPaneInline from '../internal/InternalPaneInline.svelte'
  import { removeKeys } from '../utils'
  import { BROWSER } from 'esm-env'
  import { beforeUpdate } from 'svelte'
  export let expanded = void 0
  export let position = void 0
  export let width = void 0
  export let tpPane = void 0
  export let x = void 0
  export let y = void 0
  export let positioning = 'fixed'
  beforeUpdate(() => {
    if ($$props.position === 'inline' || $$props.position === 'fixed') {
      x = $$props.x
      y = $$props.y
      width = $$props.width
      expanded = $$props.expanded
    }
  })
</script>

<!-- Only prerender inline panes, because fixed / absolute positioned objects don't affect layout
-->
{#if position === undefined || position === 'draggable'}
  {#if BROWSER}
    <InternalPaneDraggable {positioning} bind:expanded bind:tpPane bind:width bind:x bind:y {...$$restProps}>
      <slot />
    </InternalPaneDraggable>
  {:else}
    <div style="display: none;">
      <slot />
    </div>
  {/if}
{:else if position === 'inline'}
  <InternalPaneInline bind:expanded bind:tpPane {width} {...removeKeys($$restProps, 'storePositionLocally')}>
    <slot />
  </InternalPaneInline>
{:else if position === 'fixed'}
  {#if BROWSER}
    <InternalPaneFixed bind:expanded bind:tpPane bind:x bind:y {width} {...$$restProps}>
      <slot />
    </InternalPaneFixed>
  {:else}
    <div style="display: none;">
      <slot />
    </div>
  {/if}
{/if}
