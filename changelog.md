# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Block clicks on ButtonGrid and RadioGrid cells while the component is disabled, instead of only dimming the grid.
- Draw the latest WaveformMonitor value instead of the oldest one in its buffer, which made the graph lag behind updates.
- Apply the WaveformMonitor `lineStyle` prop, which was previously ignored.
- Keep ColorPlus colors on the gamut edge, such as `#0000ff`, instead of shifting them when bound.
- Accept negative y values typed into the CubicBezier text field instead of resetting the curve.
- Show a custom File `invalidExtensionMessage` as plain text instead of rendering it as HTML.
- Load an image dropped onto Image from another document, such as an iframe, popup window, or shadow root, from its URL instead of clearing the value.

### Maintenance

- Remove explicit npm token injection from the release command.

## [1.6.3] - 2026-11-02

### Documentation

- Correct File plugin author attribution and the Stepper plugin reference.

### Maintenance

- Refresh Tweakpane plugins to fork-tagged releases, update ColorPlus, fast-copy, and fast-equals.
- Refresh contributor tooling and release workflows, build before lint and fix tasks, and update shared skill integration.
- Add a test-app favicon to work around SvelteKit favicon handling.

## [1.6.2] - 2026-10-12

### Fixed

- **Breaking:** Remove the accidentally exposed options prop from File and Image public prop types.

### Documentation

- Generate examples with published package imports and reject internal aliases in distributed example code.

### Maintenance

- Migrate internal imports to package subpaths and validate packaged output for unresolved aliases.
- Update fast-equals, packaging and contributor tools, and adjust Svelte packaging configuration for version 3.

## [1.6.1] - 2026-10-07

### Fixed

- Keep fixed and draggable panes interactive when page styles disable pointer events.

### Maintenance

- Refresh runtime dependencies, including ColorPlus 0.7.
- Update contributor tooling for pnpm 12, refine compatibility overrides, and pin workflow actions.
- Add scheduled dependency-update automation.

## [1.6.0] - 2026-09-03

### Added

- Add experimental ColorPlus with CSS Color 4 formats, named colors, numeric and tuple/object values, and a configurable OKLCH wide-gamut picker.
- Support packed numeric Color values and expose the ColorValueNumber type.
- Allow Option/Alt-clicking a folder title to expand it exclusively, leaving disabled and non-expandable siblings unchanged.

### Changed

- **Breaking:** Make Color props depend on its value type: alpha is available for numbers, and type is available only for objects and tuples.

### Documentation

- Document ColorPlus formats and picker options, numeric Color values, and exclusive folder expansion.
- Restore documentation search by preserving the production environment across build subprocesses.

### Maintenance

- Write library acknowledgments only after successful license-data generation.
- Add color-picker and exclusive-folder-expansion regression tests and refresh runtime and development dependencies.
- Update npm release authentication.

## [1.5.20] - 2026-08-16

### Documentation

- Correct component descriptions, standalone rotation-control guidance, Monitor interval text, and broken reference links.

### Maintenance

- Refresh runtime and contributor dependencies and update the development Node.js requirement.
- Add scheduled repository and website link checks and simplify release-workflow validation.
- Add VS Code development tasks.

## [1.5.19] - 2026-07-14

### Changed

- Respect reduced-motion preferences for draggable-pane width transitions.

### Maintenance

- Upgrade the Nano ID runtime dependency to version 6.
- Upgrade to shared-config 8 and TypeScript 6, adapt build and documentation scripts, and apply stricter lint rules.

## [1.5.18] - 2026-06-10

### Maintenance

- Fix the test command to execute tasks once and migrate spelling configuration to TypeScript.
- Refresh development dependencies and pnpm.

## [1.5.17] - 2026-05-17

### Maintenance

- Update Nano ID and fast-copy runtime dependencies.
- Migrate contributor tooling and CI to pnpm 11 and suppress guarded Svelte 5 export warnings in Svelte 4 example builds.
- Accept prefixed and unprefixed release tags and pass npm credentials correctly to publishing.

## [1.5.16] - 2026-04-08

### Added

- Expose draggable pane containers as accessible groups.

### Maintenance

- Add build, lint, and Playwright CI on Linux, macOS, and Windows.
- Replace shell build stages with TypeScript orchestration, reuse type-analysis state, and fix Windows paths.
- Refresh runtime and contributor dependencies, update development Node.js requirements, and harden release workflows.

## [1.5.15] - 2026-03-05

### Changed

- Declare the package side-effect-free for tree shaking.

### Maintenance

- Refresh contributor dependencies and GitHub Actions, declare the development Node.js requirement, and update tooling security overrides.

## [1.5.14] - 2026-02-02

### Fixed

- Keep draggable panes aligned with the pointer while scrolling during a drag.
- Preserve TabGroup selectedIndex during initialization and avoid invalid selection updates during destruction.

### Documentation

- Correct pane-position terminology in storage warnings and repair AutoObject attribution links.

### Maintenance

- Expand Playwright coverage for tab selection, nesting, ordering, and reported regressions.
- Refresh development dependencies and the cookie security override.

## [1.5.13] - 2026-01-20

### Documentation

- Fix grid-demo initialization and supply default grid spacing.

### Maintenance

- Upgrade fast-copy and fast-equals and migrate to fast-copy's named export.
- Parallelize build-generation tasks and update language-server integration and virtual-document handling.
- Repair pnpm hoisting, migrate contributor scripts to ksc, refresh TypeScript tooling, and add a cookie security override.
- Remove the obsolete Cloudflare Pages documentation deployment workflow.

## [1.5.12] - 2025-11-27

### Maintenance

- Update the fast-equals runtime dependency.
- Refresh development dependencies and security overrides, and update Starlight patch handling.

## [1.5.11] - 2025-11-04

### Maintenance

- Update Nano ID and fast-equals runtime dependencies.
- Refresh development dependencies, migrate README rules to mdat imports, and update token-based npm publishing.

## [1.5.10] - 2025-10-07

### Fixed

- Update the Image plugin to fix layout shifts and improve the placeholder label.

### Documentation

- Replace the Image example's placeholder-image service and improve empty-state guidance.

### Maintenance

- Update Vite and override ESLint plugin-kit for development-tool security fixes.

## [1.5.9] - 2025-06-28

### Maintenance

- Remove Color's redundant change listener and refresh call.
- Refresh development dependencies and repository metadata automation, including tooling security updates.

## [1.5.8] - 2025-05-26

### Fixed

- Make Stepper honor format, pointerScale, and keyScale props.

### Maintenance

- Refresh the shared contributor configuration.

## [1.5.7] - 2025-05-25

### Documentation

- Correct CameraKit capitalization and add a labeled numeric-formatting example.

### Maintenance

- Update Nano ID and refresh contributor tooling, lint configuration, and security-related build overrides.

## [1.5.6] - 2025-03-18

### Maintenance

- Update Nano ID and development dependencies.
- Override the development esbuild dependency to address GHSA-67mh-4wv8-2f99.

## [1.5.5] - 2025-03-04

### Maintenance

- Refresh the Tweakpane plugin dependencies.
- Refresh development dependencies, include Svelte type checks in linting, and update README component-count generation.

## [1.5.4] - 2025-03-03

### Changed

- Remove the package's Node.js engine requirement so the consuming Svelte project determines Node support.

### Documentation

- Cancel animation-frame loops when the FpsGraph and Profiler examples are destroyed.

### Maintenance

- Migrate to ESLint 9 and shared-config 5, update lint and type-check configuration, and remove the separate Svelte 5 test project.
- Repair library and documentation builds, synchronize documentation types, and update publishing tools.

## [1.5.3] - 2025-03-02

### Changed

- Remove the Node.js upper-version constraint.

### Maintenance

- Update Nano ID, development dependencies, and the example app's cookie override.

## [1.5.2] - 2025-01-26

### Maintenance

- Update esm-env and fast-equals runtime dependencies.
- Refresh development dependencies and override the example app's cookie dependency to address tooling vulnerabilities.

## [1.5.1] - 2024-12-11

### Security

- Update Nano ID to address CVE-2024-55565.

### Maintenance

- Update Tweakpane, core, persisted-store, and other runtime dependencies.
- Refresh contributor and Svelte 5 test tooling, expand string-detection tests, and scope grid-test styles.

## [1.5.0] - 2024-10-24

### Added

- Add Stepper with increment and decrement buttons, numeric constraints, change events, and wide mode.
- Add File with a bindable File value, extension filtering, configurable drop-zone height, and validation text.

### Changed

- **Breaking:** Narrow ImageValue to strings or undefined, remove File and HTMLImageElement values, and use undefined to clear the image instead of the placeholder sentinel.

### Fixed

- Preserve File and HTMLImageElement instances when copying binding values.
- Remove spurious Slider wide-prop and CubicBezier global-CSS compiler warnings.

### Documentation

- Add File and Stepper usage examples and update Image value guidance.

## [1.4.0] - 2024-10-21

### Added

- Support Svelte 5 alongside Svelte 4, with binding updates that prevent reactive update loops.

### Changed

- **Breaking:** Restrict the package's declared Node.js support to Node 18 through 22.

### Fixed

- Synchronize pane expansion after Svelte updates and handle empty pane titles consistently.

### Documentation

- Document Svelte 5 compatibility, clean up the Profiler example, and update the Image example's source.

### Maintenance

- Add a Svelte 5 test project, extend collapse and expansion tests, and refresh development tooling.
- Use pnpm for sequential tasks and correct release-script matching.

## [1.3.3] - 2024-09-19

### Fixed

- Prevent Element wrappers from being counted twice when ordering controls, including conditional content in tab groups.

## [1.3.2] - 2024-09-18

### Fixed

- Keep color-like strings in Text controls from becoming color pickers.

### Maintenance

- Refresh development dependencies.

## [1.3.1] - 2024-09-15

### Documentation

- Correct Profiler attribution and acknowledge Tweakpane in the README.

### Maintenance

- Update Tweakpane, core, plugin dependencies, and the renamed svelte-persisted-store package.
- Expand regression examples for nested objects, grid layouts, invisible folders, and store initialization.
- Refresh development and documentation tooling and make metadata and deployment workflows manually dispatchable.

## [1.3.0] - 2024-05-30

### Added

- Add a wide prop to Slider and IntervalSlider to hide their numeric input fields.

### Documentation

- Add an example demonstrating wide sliders, interval sliders, rings, and wheels.

### Maintenance

- Expand width-mode regression examples, repair the Image test, and refresh development dependencies.

## [1.2.7] - 2024-05-19

### Changed

- Use plain-text labels for primitive List options and JSON labels for object options.

### Fixed

- Rebind controls when Binding receives a replacement object, preventing stale values.

### Documentation

- Add a categorized component catalog to the README.

### Maintenance

- Generate the README component catalog with mdat and refresh development tooling.

## [1.2.6] - 2024-05-15

### Changed

- Use optimized forks of Tweakpane plugins to avoid redundant bundling.

### Fixed

- Address unreleased resources during repeated CubicBezier value updates through the patched Essentials plugin.

### Documentation

- Explain the optimized plugin forks and update CubicBezier performance guidance.

### Maintenance

- Keep builds from rewriting the README.

## [1.2.5] - 2024-05-13

### Fixed

- Restore Monitor's conditional prop types with TypeScript 5.4.
- End pane dragging and reset pointer state when the browser window loses focus.
- Prevent width-transition interference when dragging or resizing multiple panes simultaneously.

### Documentation

- Replace the unavailable kitten image source in the Image example.

### Maintenance

- Upgrade development tooling to TypeScript 5.4 and refresh build dependencies.

## [1.2.4] - 2024-04-19

### Maintenance

- Update contributor tooling for pnpm 9 and refresh development dependencies.
- Correct self-closing HTML elements in components and examples, and update lint configuration.

## [1.2.3] - 2024-03-22

### Fixed

- Avoid redundant pane expansion updates that disrupt some collapse and expand interactions.

### Maintenance

- Refresh development dependencies and the Starlight patch.

## [1.2.2] - 2024-03-07

### Documentation

- Clarify conditional prop availability, restore elided component documentation, and add README banners.

### Maintenance

- Pin runtime dependency versions and keep TypeScript on 5.3 while refreshing development dependencies.
- Add repository metadata synchronization and update release automation.

## [1.2.1] - 2024-02-23

### Documentation

- Expand README contributor and license information and correct the change-event example.

### Maintenance

- Switch Textarea to the upstream plugin with Tweakpane 4 support.
- Update Nano ID and refresh development and documentation tooling.
- Generate README boilerplate with mdat.

## [1.2.0] - 2024-01-25

### Added

- Emit typed change events from interactive value controls, including a value snapshot and internal or external origin.
- Expose Pane's underlying Tweakpane instance through the bindable tpPane prop.

### Documentation

- Add change-event examples, refine component API guidance, repair links, and fix excessively wide example code.

### Maintenance

- Add Playwright integration tests for controls and change-event behavior.
- Refresh development dependencies and documentation tooling.
- Add fast-copy and fast-equals runtime dependencies for change-event handling.

## [1.1.4] - 2023-12-23

### Maintenance

- Update Tweakpane and core runtime dependencies.
- Add automated GitHub releases with version-tag and branch validation.
- Refresh development dependencies, contributor configuration, and documentation generation.

## [1.1.3] - 2023-12-18

### Maintenance

- Move Button into the control component group and update its export targets.

## [1.1.2] - 2023-12-18

### Fixed

- Prevent a red placeholder flash before Textarea hydrates.

### Maintenance

- Server-render dynamically imported components in the SvelteKit example app.

## [1.1.1] - 2023-12-18

### Changed

- Emit FpsGraph change events from Tweakpane's tick API using its numeric FPS value.

### Maintenance

- Build before obtaining the npm one-time password to avoid expiration during publishing.

## [1.1.0] - 2023-12-18

### Changed

- Truncate long control labels and pane titles with ellipses.

### Fixed

- Update the Essentials plugin to resolve remaining scaled-control interaction bugs.
- Stop installing the release-only bumpp tool as a runtime dependency.
- Scope the CubicBezier overflow workaround to library panes.
- Remove debug logging from Textarea interactions and utility code.

### Documentation

- Refine the README overview and add a package description.

### Maintenance

- Migrate the example app to SvelteKit 2 and Vite 5, fix dynamic example imports, and refresh development dependencies.
- Avoid package metadata normalization noise in source-link and export generation.

## [1.0.2] - 2023-12-18

### Fixed

- Update Tweakpane and its core dependency to partially fix scaled-control interaction.
- Remove stray draggable-pane console logging.

### Documentation

- Correct Safari scrollbar colors after documentation theme changes.
- Document the remaining CubicBezier scaling limitation.

### Maintenance

- Refresh shared contributor tooling and add automated versioning and publishing scripts.

## [1.0.1] - 2023-12-18

### Fixed

- Keep draggable pane title bars usable when their titles are empty.

### Documentation

- Add a recorded quick demo, refine Element usage guidance, and correct example-code formatting.

### Maintenance

- Update the Nano ID runtime dependency.
- Adopt shared lint and formatting configuration, refresh contributor tooling, and fix the build.

## [1.0.0] - 2023-12-18

### Added

- Introduce 31 reactive, typed Svelte 4 components for Tweakpane 4, requiring Node.js 18+ and supporting package-level and component-subpath imports.
- Provide buttons, checkboxes, numeric sliders, interval sliders with a bindable midpoint, arbitrary-value option lists, and text inputs with live-update control.
- Provide RGB(A) color, 2D–4D point, Euler rotation, and quaternion controls with object and tuple value support.
- Integrate image, cubic Bézier, radio-grid, button-grid, camera ring, and wheel controls.
- Organize controls with folders, tabs, separators, and draggable, fixed, or inline panes; standalone controls create inline panes automatically.
- Support pane dragging, resizing, scaling, expansion bindings, optional child collapsing, and local persistence of position, width, and expansion state.
- Monitor boolean, number, and string values, graph FPS and waveforms, and profile synchronous or asynchronous operations.
- Generate controls automatically for individual values or nested objects with AutoValue and AutoObject.
- Embed custom HTML in panes through Element, with optional height limits and style resetting.
- Provide seven theme presets, custom per-pane themes, global theme defaults, and exported theme types and ThemeUtils.
- Expose Binding and Blade for custom Tweakpane integrations, plus Utils helpers for easing functions and CSS rotation transforms.
- Provide experimental server-rendered layout placeholders to reduce layout shifts during component hydration.

### Documentation

- Add npm installation and quick-start instructions, component API references, and interactive control, theme, and plugin examples.

### Maintenance

- Set up library packaging, declaration documentation, example generation, linting, type checks, and documentation deployment.

[Unreleased]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.6.3...HEAD
[1.0.0]: https://github.com/kitschpatrol/svelte-tweakpane-ui/releases/tag/v1.0.0
[1.0.1]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.0.0...v1.0.1
[1.0.2]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.0.1...v1.0.2
[1.1.0]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.0.2...v1.1.0
[1.1.1]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.1.0...v1.1.1
[1.1.2]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.1.1...v1.1.2
[1.1.3]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.1.2...v1.1.3
[1.1.4]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.1.3...v1.1.4
[1.2.0]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.1.4...v1.2.0
[1.2.1]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.2.0...v1.2.1
[1.2.2]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.2.1...v1.2.2
[1.2.3]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.2.2...v1.2.3
[1.2.4]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.2.3...v1.2.4
[1.2.5]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.2.4...v1.2.5
[1.2.6]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.2.5...v1.2.6
[1.2.7]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.2.6...v1.2.7
[1.3.0]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.2.7...v1.3.0
[1.3.1]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.3.0...v1.3.1
[1.3.2]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.3.1...v1.3.2
[1.3.3]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.3.2...v1.3.3
[1.4.0]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.3.3...v1.4.0
[1.5.0]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.4.0...v1.5.0
[1.5.1]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.5.0...v1.5.1
[1.5.2]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.5.1...v1.5.2
[1.5.3]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.5.2...v1.5.3
[1.5.4]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.5.3...v1.5.4
[1.5.5]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.5.4...v1.5.5
[1.5.6]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.5.5...v1.5.6
[1.5.7]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.5.6...v1.5.7
[1.5.8]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.5.7...v1.5.8
[1.5.9]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.5.8...v1.5.9
[1.5.10]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.5.9...v1.5.10
[1.5.11]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.5.10...v1.5.11
[1.5.12]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.5.11...v1.5.12
[1.5.13]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.5.12...v1.5.13
[1.5.14]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.5.13...v1.5.14
[1.5.15]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.5.14...v1.5.15
[1.5.16]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.5.15...v1.5.16
[1.5.17]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.5.16...v1.5.17
[1.5.18]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.5.17...v1.5.18
[1.5.19]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.5.18...v1.5.19
[1.5.20]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.5.19...v1.5.20
[1.6.0]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.5.20...v1.6.0
[1.6.1]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.6.0...v1.6.1
[1.6.2]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.6.1...v1.6.2
[1.6.3]: https://github.com/kitschpatrol/svelte-tweakpane-ui/compare/v1.6.2...v1.6.3
