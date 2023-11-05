---
title: About
description: Page description.
---

# {$frontmatter.title}

{$frontmatter.description}

## Test Heading 1

I am a paragraph.

### Test Heading 2

#### Test Heading 3

#### Test Heading 4

## Test Heading 5

## Test Heading

## Test Heading

## Test Heading

## Test Heading

```svelte
<script lang="ts">
  import { Button } from 'svelte-tweakpane-ui';

  let count = 0;
</script>

<Button label="Count" title="Increment" on:click={() => count++} />
<pre>
	Count: {count}
</pre>
```

| Column 1     | Column 2 | Column 3      |
| ------------ | -------- | ------------- |
| left-aligned | centered | right-aligned |
| left-aligned | centered | right-aligned |
| left-aligned | centered | right-aligned |

### Events

In the style of threlte

### Naming conventions
