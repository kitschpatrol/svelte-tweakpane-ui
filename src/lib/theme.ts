import type { RgbaColorObject, RgbColorObject } from '@tweakpane/core'
import type { Simplify } from '$lib/utils'
import { getWindowDocument, isRgbaColorObject, isRgbColorObject } from '@tweakpane/core'

// Only need undefined if we had nested themes... undefined shouldn't override global theme
export type ThemeColorValue = Simplify<RgbaColorObject | RgbColorObject | string>
export type Theme = CustomThemeKeys & ThemeKeys

type ThemeKeys = {
	// Tweakpane
	baseBackgroundColor?: ThemeColorValue
	baseBorderRadius?: string
	baseFontFamily?: string
	baseShadowColor?: ThemeColorValue
	bladeBorderRadius?: string
	bladeHorizontalPadding?: string
	bladeValueWidth?: string
	buttonBackgroundColor?: ThemeColorValue
	buttonBackgroundColorActive?: ThemeColorValue
	buttonBackgroundColorFocus?: ThemeColorValue
	buttonBackgroundColorHover?: ThemeColorValue
	buttonForegroundColor?: ThemeColorValue
	containerBackgroundColor?: ThemeColorValue
	containerBackgroundColorActive?: ThemeColorValue
	containerBackgroundColorFocus?: ThemeColorValue
	containerBackgroundColorHover?: ThemeColorValue
	containerForegroundColor?: ThemeColorValue
	containerHorizontalPadding?: string
	containerUnitSize?: string
	containerUnitSpacing?: string
	containerVerticalPadding?: string
	grooveForegroundColor?: ThemeColorValue
	inputBackgroundColor?: ThemeColorValue
	inputBackgroundColorActive?: ThemeColorValue
	inputBackgroundColorFocus?: ThemeColorValue
	inputBackgroundColorHover?: ThemeColorValue
	inputForegroundColor?: ThemeColorValue
	labelForegroundColor?: ThemeColorValue
	monitorBackgroundColor?: ThemeColorValue
	monitorForegroundColor?: ThemeColorValue
	// Plugins
	pluginImageDraggingColor?: ThemeColorValue
	// PluginThumbnailListHeight?: string; pluginThumbnailListThumbSize?: string;
	// pluginThumbnailListWidth?: string;
}

type CustomThemeKeys = Record<string, ThemeColorValue>

// Standard Tweakpane themes from https://tweakpane.github.io/docs/theming/#builder Must be kept in
// sync with TP...

const standard: Theme = {
	baseBackgroundColor: 'hsl(230, 7%, 17%)',
	baseBorderRadius: '6px',
	baseFontFamily: 'Roboto Mono, Source Code Pro, Menlo, Courier, monospace',
	baseShadowColor: 'rgba(0, 0, 0, 0.2)',
	bladeBorderRadius: '2px',
	bladeHorizontalPadding: '4px',
	bladeValueWidth: '160px',
	buttonBackgroundColor: 'hsl(230, 7%, 70%)',
	buttonBackgroundColorActive: '#d6d7db',
	buttonBackgroundColorFocus: '#c8cad0',
	buttonBackgroundColorHover: '#bbbcc4',
	buttonForegroundColor: 'hsl(230, 7%, 17%)',
	containerBackgroundColor: 'rgba(187, 188, 196, 0.1)',
	containerBackgroundColorActive: 'rgba(187, 188, 196, 0.25)',
	containerBackgroundColorFocus: 'rgba(187, 188, 196, 0.2)',
	containerBackgroundColorHover: 'rgba(187, 188, 196, 0.15)',
	containerForegroundColor: 'hsl(230, 7%, 75%)',
	containerHorizontalPadding: '4px',
	containerUnitSize: '20px',
	containerUnitSpacing: '4px',
	containerVerticalPadding: '4px',
	grooveForegroundColor: 'rgba(187, 188, 196, 0.1)',
	inputBackgroundColor: 'rgba(187, 188, 196, 0.1)',
	inputBackgroundColorActive: 'rgba(187, 188, 196, 0.25)',
	inputBackgroundColorFocus: 'rgba(187, 188, 196, 0.2)',
	inputBackgroundColorHover: 'rgba(187, 188, 196, 0.15)',
	inputForegroundColor: 'hsl(230, 7%, 75%)',
	labelForegroundColor: 'rgba(187, 188, 196, 0.7)',
	monitorBackgroundColor: 'rgba(0, 0, 0, 0.2)',
	monitorForegroundColor: 'rgba(187, 188, 196, 0.7)',
	pluginImageDraggingColor: 'hsla(230, 100%, 66%, 1)',
	// PluginThumbnailListHeight: '400px', pluginThumbnailListThumbSize: '20px',
	// pluginThumbnailListWidth: '200px'
}

// eslint-disable-next-line unicorn/no-array-reduce
export const keys = Object.keys(standard).reduce<Record<string, string>>((acc, key) => {
	acc[key] = key
	return acc
}, {})

const light: Theme = {
	baseBackgroundColor: 'hsla(230, 5%, 90%, 1.00)',
	baseShadowColor: 'hsla(0, 0%, 0%, 0.10)',
	buttonBackgroundColor: 'hsla(230, 7%, 75%, 1.00)',
	buttonBackgroundColorActive: 'hsla(230, 7%, 60%, 1.00)',
	buttonBackgroundColorFocus: 'hsla(230, 7%, 65%, 1.00)',
	buttonBackgroundColorHover: 'hsla(230, 7%, 70%, 1.00)',
	buttonForegroundColor: 'hsla(230, 10%, 30%, 1.00)',
	containerBackgroundColor: 'hsla(230, 15%, 30%, 0.20)',
	containerBackgroundColorActive: 'hsla(230, 15%, 30%, 0.32)',
	containerBackgroundColorFocus: 'hsla(230, 15%, 30%, 0.28)',
	containerBackgroundColorHover: 'hsla(230, 15%, 30%, 0.24)',
	containerForegroundColor: 'hsla(230, 10%, 30%, 1.00)',
	grooveForegroundColor: 'hsla(230, 15%, 30%, 0.10)',
	inputBackgroundColor: 'hsla(230, 15%, 30%, 0.10)',
	inputBackgroundColorActive: 'hsla(230, 15%, 30%, 0.22)',
	inputBackgroundColorFocus: 'hsla(230, 15%, 30%, 0.18)',
	inputBackgroundColorHover: 'hsla(230, 15%, 30%, 0.14)',
	inputForegroundColor: 'hsla(230, 10%, 30%, 1.00)',
	labelForegroundColor: 'hsla(230, 10%, 30%, 0.70)',
	monitorBackgroundColor: 'hsla(230, 15%, 30%, 0.10)',
	monitorForegroundColor: 'hsla(230, 10%, 30%, 0.50)',
}

const iceberg: Theme = {
	baseBackgroundColor: 'hsla(230, 20%, 11%, 1.00)',
	baseShadowColor: 'hsla(0, 0%, 0%, 0.20)',
	buttonBackgroundColor: 'hsla(230, 10%, 80%, 1.00)',
	buttonBackgroundColorActive: 'hsla(230, 10%, 95%, 1.00)',
	buttonBackgroundColorFocus: 'hsla(230, 10%, 90%, 1.00)',
	buttonBackgroundColorHover: 'hsla(230, 10%, 85%, 1.00)',
	buttonForegroundColor: 'hsla(230, 20%, 11%, 1.00)',
	containerBackgroundColor: 'hsla(230, 25%, 16%, 1.00)',
	containerBackgroundColorActive: 'hsla(230, 25%, 31%, 1.00)',
	containerBackgroundColorFocus: 'hsla(230, 25%, 26%, 1.00)',
	containerBackgroundColorHover: 'hsla(230, 25%, 21%, 1.00)',
	containerForegroundColor: 'hsla(230, 10%, 80%, 1.00)',
	grooveForegroundColor: 'hsla(230, 20%, 8%, 1.00)',
	inputBackgroundColor: 'hsla(230, 20%, 8%, 1.00)',
	inputBackgroundColorActive: 'hsla(230, 28%, 23%, 1.00)',
	inputBackgroundColorFocus: 'hsla(230, 28%, 18%, 1.00)',
	inputBackgroundColorHover: 'hsla(230, 20%, 13%, 1.00)',
	inputForegroundColor: 'hsla(230, 10%, 80%, 1.00)',
	labelForegroundColor: 'hsla(230, 12%, 48%, 1.00)',
	monitorBackgroundColor: 'hsla(230, 20%, 8%, 1.00)',
	monitorForegroundColor: 'hsla(230, 12%, 48%, 1.00)',
}

const jetblack: Theme = {
	baseBackgroundColor: 'hsla(0, 0%, 0%, 1.00)',
	baseShadowColor: 'hsla(0, 0%, 0%, 0.2)',
	buttonBackgroundColor: 'hsla(0, 0%, 70%, 1.00)',
	buttonBackgroundColorActive: 'hsla(0, 0%, 85%, 1.00)',
	buttonBackgroundColorFocus: 'hsla(0, 0%, 80%, 1.00)',
	buttonBackgroundColorHover: 'hsla(0, 0%, 75%, 1.00)',
	buttonForegroundColor: 'hsla(0, 0%, 0%, 1.00)',
	containerBackgroundColor: 'hsla(0, 0%, 10%, 1.00)',
	containerBackgroundColorActive: 'hsla(0, 0%, 25%, 1.00)',
	containerBackgroundColorFocus: 'hsla(0, 0%, 20%, 1.00)',
	containerBackgroundColorHover: 'hsla(0, 0%, 15%, 1.00)',
	containerForegroundColor: 'hsla(0, 0%, 50%, 1.00)',
	grooveForegroundColor: 'hsla(0, 0%, 10%, 1.00)',
	inputBackgroundColor: 'hsla(0, 0%, 10%, 1.00)',
	inputBackgroundColorActive: 'hsla(0, 0%, 25%, 1.00)',
	inputBackgroundColorFocus: 'hsla(0, 0%, 20%, 1.00)',
	inputBackgroundColorHover: 'hsla(0, 0%, 15%, 1.00)',
	inputForegroundColor: 'hsla(0, 0%, 70%, 1.00)',
	labelForegroundColor: 'hsla(0, 0%, 50%, 1.00)',
	monitorBackgroundColor: 'hsla(0, 0%, 8%, 1.00)',
	monitorForegroundColor: 'hsla(0, 0%, 48%, 1.00)',
}

const retro: Theme = {
	baseBackgroundColor: 'hsla(40, 3%, 90%, 1.00)',
	baseShadowColor: 'hsla(0, 0%, 0%, 0.30)',
	buttonBackgroundColor: 'hsla(40, 3%, 70%, 1.00)',
	buttonBackgroundColorActive: 'hsla(40, 3%, 55%, 1.00)',
	buttonBackgroundColorFocus: 'hsla(40, 3%, 60%, 1.00)',
	buttonBackgroundColorHover: 'hsla(40, 3%, 65%, 1.00)',
	buttonForegroundColor: 'hsla(40, 3%, 20%, 1.00)',
	containerBackgroundColor: 'hsla(40, 3%, 70%, 1.00)',
	containerBackgroundColorActive: 'hsla(40, 3%, 55%, 1.00)',
	containerBackgroundColorFocus: 'hsla(40, 3%, 60%, 1.00)',
	containerBackgroundColorHover: 'hsla(40, 3%, 65%, 1.00)',
	containerForegroundColor: 'hsla(40, 3%, 20%, 1.00)',
	grooveForegroundColor: 'hsla(40, 3%, 40%, 1.00)',
	inputBackgroundColor: 'hsla(120, 3%, 20%, 1.00)',
	inputBackgroundColorActive: 'hsla(120, 3%, 35%, 1.00)',
	inputBackgroundColorFocus: 'hsla(120, 3%, 30%, 1.00)',
	inputBackgroundColorHover: 'hsla(120, 3%, 25%, 1.00)',
	inputForegroundColor: 'hsla(120, 40%, 60%, 1.00)',
	labelForegroundColor: 'hsla(40, 3%, 50%, 1.00)',
	monitorBackgroundColor: 'hsla(120, 3%, 20%, 1.00)',
	monitorForegroundColor: 'hsla(120, 40%, 60%, 0.80)',
}

const translucent: Theme = {
	baseBackgroundColor: 'hsla(0, 0%, 10%, 0.80)',
	baseShadowColor: 'hsla(0, 0%, 0%, 0.20)',
	buttonBackgroundColor: 'hsla(0, 0%, 80%, 1.00)',
	buttonBackgroundColorActive: 'hsla(0, 0%, 100%, 1.00)',
	buttonBackgroundColorFocus: 'hsla(0, 0%, 95%, 1.00)',
	buttonBackgroundColorHover: 'hsla(0, 0%, 85%, 1.00)',
	buttonForegroundColor: 'hsla(0, 0%, 0%, 0.80)',
	containerBackgroundColor: 'hsla(0, 0%, 0%, 0.30)',
	containerBackgroundColorActive: 'hsla(0, 0%, 0%, 0.60)',
	containerBackgroundColorFocus: 'hsla(0, 0%, 0%, 0.50)',
	containerBackgroundColorHover: 'hsla(0, 0%, 0%, 0.40)',
	containerForegroundColor: 'hsla(0, 0%, 100%, 0.50)',
	grooveForegroundColor: 'hsla(0, 0%, 0%, 0.20)',
	inputBackgroundColor: 'hsla(0, 0%, 0%, 0.30)',
	inputBackgroundColorActive: 'hsla(0, 0%, 0%, 0.60)',
	inputBackgroundColorFocus: 'hsla(0, 0%, 0%, 0.50)',
	inputBackgroundColorHover: 'hsla(0, 0%, 0%, 0.40)',
	inputForegroundColor: 'hsla(0, 0%, 100%, 0.50)',
	labelForegroundColor: 'hsla(0, 0%, 100%, 0.50)',
	monitorBackgroundColor: 'hsla(0, 0%, 0%, 0.30)',
	monitorForegroundColor: 'hsla(0, 0%, 100%, 0.30)',
}

const vivid: Theme = {
	baseBackgroundColor: 'hsla(0, 80%, 40%, 1)',
	baseShadowColor: 'hsla(0, 0%, 0%, 0.2)',
	buttonBackgroundColor: 'hsla(0, 0%, 100%, 1)',
	buttonBackgroundColorActive: 'hsla(0, 0%, 85%, 1)',
	buttonBackgroundColorFocus: 'hsla(0, 0%, 90%, 1)',
	buttonBackgroundColorHover: 'hsla(0, 0%, 95%, 1)',
	buttonForegroundColor: 'hsla(230, 20%, 11%, 1)',
	containerBackgroundColor: 'hsla(0, 0%, 0%, 0.2)',
	containerBackgroundColorActive: 'hsla(0, 0%, 0%, 0.35)',
	containerBackgroundColorFocus: 'hsla(0, 0%, 0%, 0.3)',
	containerBackgroundColorHover: 'hsla(0, 0%, 0%, 0.25)',
	containerForegroundColor: 'hsla(0, 0%, 100%, 0.9)',
	grooveForegroundColor: 'hsla(0, 0%, 0%, 0.5)',
	inputBackgroundColor: 'hsla(0, 0%, 0%, 0.5)',
	inputBackgroundColorActive: 'hsla(0, 0%, 0%, 0.65)',
	inputBackgroundColorFocus: 'hsla(0, 0%, 0%, 0.60)',
	inputBackgroundColorHover: 'hsla(0, 0%, 0%, 0.55)',
	inputForegroundColor: 'hsla(0, 0%, 100%, 0.9)',
	labelForegroundColor: 'hsla(0, 0%, 100%, 0.9)',
	monitorBackgroundColor: 'hsla(0, 0%, 0%, 0.5)',
	monitorForegroundColor: 'hsla(0, 0%, 100%, 0.5)',
}

export const presets = {
	/** Dark blue theme. */
	iceberg,
	/** Extra dark theme. */
	jetblack,
	/** Standard Tweakpane light theme. */
	light,
	/** Light theme with CRT vibes. */
	retro,
	/** Standard Tweakpane dark theme. This is the default theme. */
	standard,
	/** Dark translucent theme. */
	translucent,
	/** Red theme. */
	vivid,
}

// More humane theme names... Note that the shorthand variables don't work
const keyToCssVariableMap = new Map([
	// Tweakpane
	['baseBackgroundColor', '--tp-base-background-color'],
	['baseBorderRadius', '--tp-base-border-radius'],
	['baseFontFamily', '--tp-base-font-family'],
	['baseShadowColor', '--tp-base-shadow-color'],
	['bladeBorderRadius', '--tp-blade-border-radius'],
	['bladeHorizontalPadding', '--tp-blade-horizontal-padding'],
	['bladeValueWidth', '--tp-blade-value-width'],
	['buttonBackgroundColor', '--tp-button-background-color'],
	['buttonBackgroundColorActive', '--tp-button-background-color-active'],
	['buttonBackgroundColorFocus', '--tp-button-background-color-focus'],
	['buttonBackgroundColorHover', '--tp-button-background-color-hover'],
	['buttonForegroundColor', '--tp-button-foreground-color'],
	['containerBackgroundColor', '--tp-container-background-color'],
	['containerBackgroundColorActive', '--tp-container-background-color-active'],
	['containerBackgroundColorFocus', '--tp-container-background-color-focus'],
	['containerBackgroundColorHover', '--tp-container-background-color-hover'],
	['containerForegroundColor', '--tp-container-foreground-color'],
	['containerHorizontalPadding', '--tp-container-horizontal-padding'],
	['containerUnitSize', '--tp-container-unit-size'],
	['containerUnitSpacing', '--tp-container-unit-spacing'],
	['containerVerticalPadding', '--tp-container-vertical-padding'],
	['grooveForegroundColor', '--tp-groove-foreground-color'],
	['inputBackgroundColor', '--tp-input-background-color'],
	['inputBackgroundColorActive', '--tp-input-background-color-active'],
	['inputBackgroundColorFocus', '--tp-input-background-color-focus'],
	['inputBackgroundColorHover', '--tp-input-background-color-hover'],
	['inputForegroundColor', '--tp-input-foreground-color'],
	['labelForegroundColor', '--tp-label-foreground-color'],
	['monitorBackgroundColor', '--tp-monitor-background-color'],
	['monitorForegroundColor', '--tp-monitor-foreground-color'],
	// Plugins
	['pluginImageDraggingColor', '--tp-plugin-image-dragging-color'],
	// ['pluginThumbnailListHeight', '--tp-plugin-thumbnail-list-height'],
	// ['pluginThumbnailListThumbSize', '--tp-plugin-thumbnail-list-thumb-size'],
	// ['pluginThumbnailListWidth', '--tp-plugin-thumbnail-list-width']
])

// Just do it dynamically instead of the map? function transformToCustomProperty(str: string):
// string { return '--tp-' + str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
// }

// eslint-disable-next-line ts/no-redundant-type-constituents
function stringToCssValue(v: string | ThemeColorValue | undefined): string | undefined {
	if (v === undefined) {
		return undefined
	}

	if (typeof v === 'string') {
		return v
	}

	if (isRgbaColorObject(v)) {
		return `rgba(${v.r}, ${v.g}, ${v.b}, ${v.a})`
	}

	if (isRgbColorObject(v)) {
		return `rgb(${v.r}, ${v.g}, ${v.b})`
	}
}

function expandVariableKey(name: string): string {
	// Pass explicit variables through
	if (name.startsWith('--tp-')) {
		return name
	}

	const variableName = keyToCssVariableMap.get(name)
	if (variableName) {
		return variableName
	}

	throw new Error(`Unknown Tweakpane CSS theme map variable key: "${name}"`)
}

/**
 * Used during SSR to calculate metrics Returns CSS string.
 */
export function getValueOrFallback(theme: Theme | undefined, key: keyof ThemeKeys): string {
	return theme?.[key] === undefined
		? stringToCssValue(standard[key])!
		: stringToCssValue(theme[key])!
}

export function applyTheme(element: HTMLElement, theme: Theme | undefined) {
	const rootDocument = getWindowDocument().documentElement

	if (theme === undefined) {
		for (const k of Object.keys(standard)) {
			const key = expandVariableKey(k)

			if (element.style.getPropertyValue(key).length > 0) {
				element.style.removeProperty(key)
			}
		}
	} else {
		for (const [k, v] of Object.entries(theme)) {
			const key = expandVariableKey(k)
			const value = stringToCssValue(v)
			// Only set the variable if it deviates from the standard theme or  the root theme (set
			// by setGlobalDefaultTheme).... but if theme is explicitly standard and not undefined,
			// then apply it anyway so that any global theme is overridden TODO normalize color
			// representation for comparison? TODO tests for this logic

			const standardValue = standard[k] || undefined
			const rootValue = rootDocument.style.getPropertyValue(key) || undefined

			const isDeviationFromRoot = (rootValue && value !== rootValue) ?? false
			const isDeviationFromStandard = (standardValue && value !== standardValue) ?? false

			if (value !== undefined && (isDeviationFromRoot || (!rootValue && isDeviationFromStandard))) {
				element.style.setProperty(key, value)
			} else if (element.style.getPropertyValue(key).length > 0) {
				element.style.removeProperty(key)
			}
		}
	}
}

/**
 * Sets a default theme for all Tweakpane components on the page. Useful if you have a light / dark
 * mode toggle.
 */
export function setGlobalDefaultTheme(theme: Theme | undefined) {
	// Wait for dom ready... better outside?
	// eslint-disable-next-line unicorn/prefer-global-this, ts/no-unnecessary-condition
	if (window?.document) {
		applyTheme(getWindowDocument().documentElement, theme)
	}
}

// Library exports
export default {
	/**
	 * A collection of default theme color schemes, matching those provided in the Tweakpane
	 * [Panebuilder presets](https://tweakpane.github.io/docs/theming/#builder).
	 */
	presets,
	setGlobalDefaultTheme,
}
