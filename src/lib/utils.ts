import { Pane } from 'tweakpane';
import type { PaneConfig } from 'tweakpane/dist/types/pane/pane-config.js';

import * as CamerakitPlugin from '@tweakpane/plugin-camerakit';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import * as ImagePlugin from 'tweakpane-image-plugin';
import * as RotationPlugin from '@0b5vr/tweakpane-plugin-rotation';
import * as ProfilerPlugin from '@0b5vr/tweakpane-plugin-profiler';
import * as TextareaPlugin from '@pangenerator/tweakpane-textarea-plugin';
import * as ThumbnailListPlugin from 'tweakpane-plugin-thumbnail-list';
import * as WaveformPlugin from 'tweakpane-plugin-waveform';

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
	if (loadPlugins) {
		pane.registerPlugin(CamerakitPlugin);
		pane.registerPlugin(EssentialsPlugin);
		pane.registerPlugin(ImagePlugin);
		pane.registerPlugin(TextareaPlugin);
		pane.registerPlugin(WaveformPlugin);
		pane.registerPlugin(RotationPlugin);
		pane.registerPlugin(ProfilerPlugin);
		pane.registerPlugin(ThumbnailListPlugin);
	}
	return pane;
}

// tries to be smart about rows and columns
// if none are provided, it makes the most square grid possible
// if one is provided, it lets the undefined axis grow / shrink
// as needed
// if both are provided, values may will be clipped
export function getGridDimensions(
	itemCount: number,
	maxColumns?: number,
	maxRows?: number
): { rows: number; columns: number } {
	let rows: number, columns: number;

	if (maxColumns && maxRows) {
		// No flexing; items can exceed the available slots
		rows = Math.min(Math.ceil(itemCount / maxColumns), maxRows);
		columns = Math.min(maxColumns, itemCount);
	} else if (maxColumns) {
		// Only maxColumns defined, so rows will flex
		rows = Math.ceil(itemCount / maxColumns);
		columns = maxColumns;
	} else if (maxRows) {
		// Only maxRows defined, so columns will flex
		columns = Math.ceil(itemCount / maxRows);
		rows = maxRows;
	} else {
		// Neither maxColumns nor maxRows defined; create a square grid
		columns = Math.ceil(Math.sqrt(itemCount));
		rows = Math.ceil(itemCount / columns);
	}

	return { rows, columns };
}
