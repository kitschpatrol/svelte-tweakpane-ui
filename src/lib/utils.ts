import { Pane } from 'tweakpane';
import type { PaneConfig } from 'tweakpane/dist/types/pane/pane-config.js';

import * as EssentialsPlugin from '@tweakpane/plugin-essentials';

export function getElementIndex(element: HTMLElement): number {
	let index = 0;
	let sibling: Element | null | undefined = element;
	while ((sibling = sibling.previousElementSibling) !== null) {
		index++;
	}

	return index;
}

export function makeSafeKey(input: string | undefined, defaultKey: string = 'key'): string {
	if (input === undefined) return defaultKey;

	// Replace problematic keys and characters with a preceding underscore
	return input.replace(/(__proto__|constructor|prototype|\s|\.)/g, (match) => {
		if (match === ' ' || match === '.') {
			return '_';
		}
		return '_' + match;
	});
}

// TODO dynamically detect plugin components in hierarchy,
// then recreate pane to only register as needed?
export function createPane(config: PaneConfig | undefined = {}, loadPlugins: boolean = true): Pane {
	const pane = new Pane(config);
	loadPlugins && pane.registerPlugin(EssentialsPlugin);
	return pane;
}
