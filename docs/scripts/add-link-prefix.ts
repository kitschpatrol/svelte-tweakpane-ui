import { default as astroConfig } from '../astro.config.mts';
import * as fs from 'fs';
import { globSync } from 'glob';
import { JSDOM } from 'jsdom';

// Expressive Code doesn't add the base prefix to CSS links, so we need to do it ourselves.
// Hopefully fixed soon.

console.log(`Checking for missing base URL prefixes...`);

if (astroConfig.base === undefined) {
	console.error('For missing base restoration, astro.config.mts must define "base" properties.');
	process.exit(0);
}

function stripTrailingSlash(string: string): string {
	if (string.endsWith('/')) {
		return string.slice(0, -1);
	}
	return string;
}

let basesAdded = 0;

// Use glob to get the list of HTML files
globSync(`./dist/**/*.html`).map((filePath) => {
	const fileContents = fs.readFileSync(filePath, 'utf-8');
	const dom = new JSDOM(fileContents);
	const document = dom.window.document;

	// Find and modify anchor elements
	['href', 'src'].forEach((attribute) => {
		document.querySelectorAll(`[${attribute}]`).forEach((element) => {
			const attr = element.getAttribute(attribute);
			if (attr?.startsWith('/_astro/')) {
				// add the base prefix
				element.setAttribute(attribute, `${stripTrailingSlash(astroConfig.base ?? '')}${attr}`);
				basesAdded++;
			}
		});
	});

	// Save the modified HTML back to the file
	const modifiedHtml = dom.serialize();
	fs.writeFileSync(filePath, modifiedHtml, 'utf-8');
});
console.log(`...Added ${basesAdded} base prefixes.`);
