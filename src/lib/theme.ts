import { getWindowDocument } from '@tweakpane/core';

export interface Theme {
	baseBackground: string;
	baseShadow: string;
	buttonBackground: string;
	buttonBackgroundActive: string;
	buttonBackgroundFocus: string;
	buttonBackgroundHover: string;
	buttonForeground: string;
	containerBackground: string;
	containerBackgroundActive: string;
	containerBackgroundFocus: string;
	containerBackgroundHover: string;
	containerForeground: string;
	grooveForeground: string;
	inputBackground: string;
	inputBackgroundActive: string;
	inputBackgroundFocus: string;
	inputBackgroundHover: string;
	inputForeground: string;
	labelForeground: string;
	monitorBackground: string;
	monitorForeground: string;
}

// Standard Tweakpane themes from https://tweakpane.github.io/docs/theming/#builder
const standard: Theme = {
	baseBackground: 'hsla(230, 7%, 17%, 1)',
	baseShadow: 'hsla(0, 0%, 0%, 0.2)',
	buttonBackground: 'hsla(230, 7%, 70%, 1)',
	buttonBackgroundActive: 'hsla(230, 7%, 85%, 1)',
	buttonBackgroundFocus: 'hsla(230, 7%, 80%, 1)',
	buttonBackgroundHover: 'hsla(230, 7%, 75%, 1)',
	buttonForeground: 'hsla(230, 7%, 17%, 1)',
	containerBackground: 'hsla(230, 7%, 75%, 0.1)',
	containerBackgroundActive: 'hsla(230, 7%, 75%, 0.25)',
	containerBackgroundFocus: 'hsla(230, 7%, 75%, 0.2)',
	containerBackgroundHover: 'hsla(230, 7%, 75%, 0.15)',
	containerForeground: 'hsla(230, 7%, 75%, 1)',
	grooveForeground: 'hsla(230, 7%, 75%, 0.1)',
	inputBackground: 'hsla(230, 7%, 75%, 0.1)',
	inputBackgroundActive: 'hsla(230, 7%, 75%, 0.25)',
	inputBackgroundFocus: 'hsla(230, 7%, 75%, 0.2)',
	inputBackgroundHover: 'hsla(230, 7%, 75%, 0.15)',
	inputForeground: 'hsla(230, 7%, 75%, 1)',
	labelForeground: 'hsla(230, 7%, 75%, 0.7)',
	monitorBackground: 'hsla(230, 7%, 0%, 0.2)',
	monitorForeground: 'hsla(230, 7%, 75%, 0.7)'
};

const light: Theme = {
	baseBackground: 'hsla(230, 5%, 90%, 1.00)',
	baseShadow: 'hsla(0, 0%, 0%, 0.10)',
	buttonBackground: 'hsla(230, 7%, 75%, 1.00)',
	buttonBackgroundActive: 'hsla(230, 7%, 60%, 1.00)',
	buttonBackgroundFocus: 'hsla(230, 7%, 65%, 1.00)',
	buttonBackgroundHover: 'hsla(230, 7%, 70%, 1.00)',
	buttonForeground: 'hsla(230, 10%, 30%, 1.00)',
	containerBackground: 'hsla(230, 15%, 30%, 0.20)',
	containerBackgroundActive: 'hsla(230, 15%, 30%, 0.32)',
	containerBackgroundFocus: 'hsla(230, 15%, 30%, 0.28)',
	containerBackgroundHover: 'hsla(230, 15%, 30%, 0.24)',
	containerForeground: 'hsla(230, 10%, 30%, 1.00)',
	grooveForeground: 'hsla(230, 15%, 30%, 0.10)',
	inputBackground: 'hsla(230, 15%, 30%, 0.10)',
	inputBackgroundActive: 'hsla(230, 15%, 30%, 0.22)',
	inputBackgroundFocus: 'hsla(230, 15%, 30%, 0.18)',
	inputBackgroundHover: 'hsla(230, 15%, 30%, 0.14)',
	inputForeground: 'hsla(230, 10%, 30%, 1.00)',
	labelForeground: 'hsla(230, 10%, 30%, 0.70)',
	monitorBackground: 'hsla(230, 15%, 30%, 0.10)',
	monitorForeground: 'hsla(230, 10%, 30%, 0.50)'
};

const iceberg: Theme = {
	baseBackground: 'hsla(230, 20%, 11%, 1.00)',
	baseShadow: 'hsla(0, 0%, 0%, 0.20)',
	buttonBackground: 'hsla(230, 10%, 80%, 1.00)',
	buttonBackgroundActive: 'hsla(230, 10%, 95%, 1.00)',
	buttonBackgroundFocus: 'hsla(230, 10%, 90%, 1.00)',
	buttonBackgroundHover: 'hsla(230, 10%, 85%, 1.00)',
	buttonForeground: 'hsla(230, 20%, 11%, 1.00)',
	containerBackground: 'hsla(230, 25%, 16%, 1.00)',
	containerBackgroundActive: 'hsla(230, 25%, 31%, 1.00)',
	containerBackgroundFocus: 'hsla(230, 25%, 26%, 1.00)',
	containerBackgroundHover: 'hsla(230, 25%, 21%, 1.00)',
	containerForeground: 'hsla(230, 10%, 80%, 1.00)',
	grooveForeground: 'hsla(230, 20%, 8%, 1.00)',
	inputBackground: 'hsla(230, 20%, 8%, 1.00)',
	inputBackgroundActive: 'hsla(230, 28%, 23%, 1.00)',
	inputBackgroundFocus: 'hsla(230, 28%, 18%, 1.00)',
	inputBackgroundHover: 'hsla(230, 20%, 13%, 1.00)',
	inputForeground: 'hsla(230, 10%, 80%, 1.00)',
	labelForeground: 'hsla(230, 12%, 48%, 1.00)',
	monitorBackground: 'hsla(230, 20%, 8%, 1.00)',
	monitorForeground: 'hsla(230, 12%, 48%, 1.00)'
};

const jetblack: Theme = {
	baseBackground: 'hsla(0, 0%, 0%, 1.00)',
	baseShadow: 'hsla(0, 0%, 0%, 0.2)',
	buttonBackground: 'hsla(0, 0%, 70%, 1.00)',
	buttonBackgroundActive: 'hsla(0, 0%, 85%, 1.00)',
	buttonBackgroundFocus: 'hsla(0, 0%, 80%, 1.00)',
	buttonBackgroundHover: 'hsla(0, 0%, 75%, 1.00)',
	buttonForeground: 'hsla(0, 0%, 0%, 1.00)',
	containerBackground: 'hsla(0, 0%, 10%, 1.00)',
	containerBackgroundActive: 'hsla(0, 0%, 25%, 1.00)',
	containerBackgroundFocus: 'hsla(0, 0%, 20%, 1.00)',
	containerBackgroundHover: 'hsla(0, 0%, 15%, 1.00)',
	containerForeground: 'hsla(0, 0%, 50%, 1.00)',
	grooveForeground: 'hsla(0, 0%, 10%, 1.00)',
	inputBackground: 'hsla(0, 0%, 10%, 1.00)',
	inputBackgroundActive: 'hsla(0, 0%, 25%, 1.00)',
	inputBackgroundFocus: 'hsla(0, 0%, 20%, 1.00)',
	inputBackgroundHover: 'hsla(0, 0%, 15%, 1.00)',
	inputForeground: 'hsla(0, 0%, 70%, 1.00)',
	labelForeground: 'hsla(0, 0%, 50%, 1.00)',
	monitorBackground: 'hsla(0, 0%, 8%, 1.00)',
	monitorForeground: 'hsla(0, 0%, 48%, 1.00)'
};

const retro: Theme = {
	baseBackground: 'hsla(40, 3%, 90%, 1.00)',
	baseShadow: 'hsla(0, 0%, 0%, 0.30)',
	buttonBackground: 'hsla(40, 3%, 70%, 1.00)',
	buttonBackgroundActive: 'hsla(40, 3%, 55%, 1.00)',
	buttonBackgroundFocus: 'hsla(40, 3%, 60%, 1.00)',
	buttonBackgroundHover: 'hsla(40, 3%, 65%, 1.00)',
	buttonForeground: 'hsla(40, 3%, 20%, 1.00)',
	containerBackground: 'hsla(40, 3%, 70%, 1.00)',
	containerBackgroundActive: 'hsla(40, 3%, 55%, 1.00)',
	containerBackgroundFocus: 'hsla(40, 3%, 60%, 1.00)',
	containerBackgroundHover: 'hsla(40, 3%, 65%, 1.00)',
	containerForeground: 'hsla(40, 3%, 20%, 1.00)',
	grooveForeground: 'hsla(40, 3%, 40%, 1.00)',
	inputBackground: 'hsla(120, 3%, 20%, 1.00)',
	inputBackgroundActive: 'hsla(120, 3%, 35%, 1.00)',
	inputBackgroundFocus: 'hsla(120, 3%, 30%, 1.00)',
	inputBackgroundHover: 'hsla(120, 3%, 25%, 1.00)',
	inputForeground: 'hsla(120, 40%, 60%, 1.00)',
	labelForeground: 'hsla(40, 3%, 50%, 1.00)',
	monitorBackground: 'hsla(120, 3%, 20%, 1.00)',
	monitorForeground: 'hsla(120, 40%, 60%, 0.80)'
};

const translucent: Theme = {
	baseBackground: 'hsla(0, 0%, 10%, 0.80)',
	baseShadow: 'hsla(0, 0%, 0%, 0.20)',
	buttonBackground: 'hsla(0, 0%, 80%, 1.00)',
	buttonBackgroundActive: 'hsla(0, 0%, 100%, 1.00)',
	buttonBackgroundFocus: 'hsla(0, 0%, 95%, 1.00)',
	buttonBackgroundHover: 'hsla(0, 0%, 85%, 1.00)',
	buttonForeground: 'hsla(0, 0%, 0%, 0.80)',
	containerBackground: 'hsla(0, 0%, 0%, 0.30)',
	containerBackgroundActive: 'hsla(0, 0%, 0%, 0.60)',
	containerBackgroundFocus: 'hsla(0, 0%, 0%, 0.50)',
	containerBackgroundHover: 'hsla(0, 0%, 0%, 0.40)',
	containerForeground: 'hsla(0, 0%, 100%, 0.50)',
	grooveForeground: 'hsla(0, 0%, 0%, 0.20)',
	inputBackground: 'hsla(0, 0%, 0%, 0.30)',
	inputBackgroundActive: 'hsla(0, 0%, 0%, 0.60)',
	inputBackgroundFocus: 'hsla(0, 0%, 0%, 0.50)',
	inputBackgroundHover: 'hsla(0, 0%, 0%, 0.40)',
	inputForeground: 'hsla(0, 0%, 100%, 0.50)',
	labelForeground: 'hsla(0, 0%, 100%, 0.50)',
	monitorBackground: 'hsla(0, 0%, 0%, 0.30)',
	monitorForeground: 'hsla(0, 0%, 100%, 0.30)'
};

const vivid: Theme = {
	baseBackground: 'hsla(0, 80%, 40%, 1)',
	baseShadow: 'hsla(0, 0%, 0%, 0.2)',
	buttonBackground: 'hsla(0, 0%, 100%, 1)',
	buttonBackgroundActive: 'hsla(0, 0%, 85%, 1)',
	buttonBackgroundFocus: 'hsla(0, 0%, 90%, 1)',
	buttonBackgroundHover: 'hsla(0, 0%, 95%, 1)',
	buttonForeground: 'hsla(230, 20%, 11%, 1)',
	containerBackground: 'hsla(0, 0%, 0%, 0.2)',
	containerBackgroundActive: 'hsla(0, 0%, 0%, 0.35)',
	containerBackgroundFocus: 'hsla(0, 0%, 0%, 0.3)',
	containerBackgroundHover: 'hsla(0, 0%, 0%, 0.25)',
	containerForeground: 'hsla(0, 0%, 100%, 0.9)',
	grooveForeground: 'hsla(0, 0%, 0%, 0.5)',
	inputBackground: 'hsla(0, 0%, 0%, 0.5)',
	inputBackgroundActive: 'hsla(0, 0%, 0%, 0.65)',
	inputBackgroundFocus: 'hsla(0, 0%, 0%, 0.60)',
	inputBackgroundHover: 'hsla(0, 0%, 0%, 0.55)',
	inputForeground: 'hsla(0, 0%, 100%, 0.9)',
	labelForeground: 'hsla(0, 0%, 100%, 0.9)',
	monitorBackground: 'hsla(0, 0%, 0%, 0.5)',
	monitorForeground: 'hsla(0, 0%, 100%, 0.5)'
};

export const Themes = {
	standard,
	light,
	translucent,
	vivid,
	retro,
	iceberg,
	jetblack
};

// More humane theme names...
const keyToCssVariableMap = new Map([
	['baseBackground', '--tp-base-background-color'],
	['baseShadow', '--tp-base-shadow-color'],
	['buttonBackground', '--tp-button-background-color'],
	['buttonBackgroundActive', '--tp-button-background-color-active'],
	['buttonBackgroundFocus', '--tp-button-background-color-focus'],
	['buttonBackgroundHover', '--tp-button-background-color-hover'],
	['buttonForeground', '--tp-button-foreground-color'],
	['containerBackground', '--tp-container-background-color'],
	['containerBackgroundActive', '--tp-container-background-color-active'],
	['containerBackgroundFocus', '--tp-container-background-color-focus'],
	['containerBackgroundHover', '--tp-container-background-color-hover'],
	['containerForeground', '--tp-container-foreground-color'],
	['grooveForeground', '--tp-groove-foreground-color'],
	['inputBackground', '--tp-input-background-color'],
	['inputBackgroundActive', '--tp-input-background-color-active'],
	['inputBackgroundFocus', '--tp-input-background-color-focus'],
	['inputBackgroundHover', '--tp-input-background-color-hover'],
	['inputForeground', '--tp-input-foreground-color'],
	['labelForeground', '--tp-label-foreground-color'],
	['monitorBackground', '--tp-monitor-background-color'],
	['monitorForeground', '--tp-monitor-foreground-color']
]);

export function applyTheme(element: HTMLElement, theme: Theme | undefined) {
	// merge with standard theme
	const mergedTheme = {
		...standard,
		...theme
	};

	Object.entries(mergedTheme).forEach(([k, v]) => {
		const varName = keyToCssVariableMap.get(k);
		if (varName) {
			// only set the variable if it deviates from the standard theme....
			// but if theme is explicitly standard and not undefined, then apply
			// it anyway so that any variables higher up the cascade are overridden
			if (theme === standard || v !== standard[k as keyof Theme]) {
				// console.log(`Setting ${varName} to ${v} !important`);
				element.style.setProperty(varName, v);
			} else {
				if (element.style.getPropertyValue(varName).length > 0) {
					// console.log(`Unsetting ${varName}`);
					element.style.removeProperty(varName);
				}
			}
		} else {
			throw new Error(`Unknown Tweakpane CSS theme map variable key: "${k}"`);
		}
	});
}

export function setGlobalDefaultTheme(theme: Theme | undefined) {
	if (typeof window !== 'undefined' && window.document) {
		applyTheme(getWindowDocument().documentElement, theme);
	}
}
