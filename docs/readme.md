<!-- title -->

# svelte-tweakpane-ui-docs

<!-- /title -->

<!-- description -->

**Documentation website for Svelte Tweakpane UI.**

<!-- /description -->

## Deployment

The site deploys to [kitschpatrol.com/svelte-tweakpane-ui](https://kitschpatrol.com/svelte-tweakpane-ui) via Cloudflare Workers at the end of `pnpm release`. To deploy between releases, run `pnpm build` and then `pnpm docs-deploy` from the repository root.

## Generated content

Some of the site's content is generated at build time and gitignored. Run `pnpm build` from the repository root before `pnpm docs-dev` or `pnpm docs-deploy`.

The root build (`scripts/build.ts`) writes:

- `src/content/docs/docs/components/`: One page per component, with prop, event, and slot data extracted from the library source and its JSDoc.
- `src/examples/`: A copy of the root `src/examples`, including the component examples extracted from JSDoc `@example` blocks, with `#lib` imports rewritten to public package imports and a Markdown code listing beside each example.
- `src/content/acknowledgments/acknowledgments-lib.json`: License data for the library's dependencies, from `pnpm licenses list`.

This package's `build` script writes the following, so they are refreshed whenever the site alone is rebuilt, as `pnpm release` does after updating the changelog:

- `src/content/acknowledgments/acknowledgments-docs.json`: License data for the site's own dependencies, from `pnpm licenses list`.
- `src/content/changelog.md`: A copy of the root `changelog.md`. The Changelog page renders it without the Unreleased section.
