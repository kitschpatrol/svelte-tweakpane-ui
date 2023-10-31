---
title: About
description: Page description.
---

# {$frontmatter.title}

{$frontmatter.description}

```tsx
<script lang="ts">
	import { Button } from 'svelte-tweakpane-ui';

	let count = 0;
</script>

<Button
	label="Count"
	title="Increment"
	on:click={() => count++}
/>
<pre>
	Count: {count}
</pre>
```
