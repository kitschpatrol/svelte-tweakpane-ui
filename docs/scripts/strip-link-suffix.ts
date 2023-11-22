import { default as astroConfig } from '../astro.config.mts';
import * as fs from 'fs';
import { globSync } from 'glob';
import { JSDOM } from 'jsdom';

// Cloudflare Pages is obsessed with trailing slashes, the only way around this is to use the
// build.format.file Astro config option, which renders each page to a separate HTML file.
// but this adds .html suffixes to all links, which is ugly. So we remove them.
// Note that the docs deploy script also pops the root index.html file up a directory.

console.log(`Checking for unwanted '.html' link suffixes...`);

if (astroConfig.base === undefined || astroConfig.site === undefined) {
	console.error(
		'For link suffix removal, astro.config.mts must define "base" and "site" properties.'
	);
	process.exit(0);
}

function stripTrailingSlash(string: string): string {
	if (string.endsWith('/')) {
		return string.slice(0, -1);
	}
	return string;
}

const baseValues = [
	`${stripTrailingSlash(astroConfig.site)}${stripTrailingSlash(astroConfig.base)}`,
	`${stripTrailingSlash(astroConfig.base)}`
];

let suffixesStripped = 0;

function processHtmlFile(filePath: string) {
	const fileContents = fs.readFileSync(filePath, 'utf-8');
	const dom = new JSDOM(fileContents);
	const document = dom.window.document;

	// Find and modify anchor elements
	const anchorElements = document.querySelectorAll('a');
	anchorElements.forEach((anchor) => {
		let href = anchor.getAttribute('href');
		if (href) {
			for (const baseValue of baseValues) {
				if (href.startsWith(baseValue) && href.includes('.html')) {
					// Strip "html" from the end of the href
					href = href.replace(/\.html$/, '');
					anchor.setAttribute('href', href);
					suffixesStripped++;
					break; // Exit the loop once we've matched a base value
				}
			}
		}
	});

	// Save the modified HTML back to the file
	const modifiedHtml = dom.serialize();
	fs.writeFileSync(filePath, modifiedHtml, 'utf-8');
}

// Use glob to get the list of HTML files
globSync(`./dist/**/*.html`).map((file) => {
	// Process HTML files
	processHtmlFile(file);
});
console.log(`...Stripped ${suffixesStripped} ".html" link suffixes.`);
