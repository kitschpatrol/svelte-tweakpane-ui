import { createMetaRequestHandler } from '@svelteness/kit-docs/node';
import type { RequestEvent } from '@sveltejs/kit';
import { kebabToTitleCase } from '@svelteness/kit-docs';
import { JSDOM } from 'jsdom';
import { escape } from 'lodash-es';

export async function GET(request: RequestEvent) {
	if (request.params.slug?.includes('docs_components_')) {
		// kind of a mess, no real file in the filesystem for the [slug] endpoint,
		// and the handler returned from createMetaRequestHandler() only works on the
		// filesystem to find and tokenize markdown files

		// instead, fetch the dynamic page as html, and parse the DOM to get
		// the title and header metadata KitDocs wants
		// ...would only do this on a fully prerendered site

		// ಠ_ಠ
		const pageUrl = `../${request.params.slug.replaceAll('_', '/')}`;
		const res = await request.fetch(pageUrl);
		const rawText = await res.text();

		const title = resolveTitleFromHtml(rawText);
		const headers = resolveHeadersFromHtml(rawText, {
			levels: [2, 3]
		});

		const metaData = {
			title,
			headers
		};

		return new Response(JSON.stringify(metaData));
	} else {
		const handler = createMetaRequestHandler();
		const response = await handler(request);

		// the default kitdocs request handler will return an empty body for
		// endpoints that are svelte components without frontmatter instead of
		// markdown files, intercept these and add a rational title
		if (response.body) {
			return response;
		} else {
			// no frontmatter title, get the title from the slug
			const pageName = request.params.slug?.split('_').pop() || 'Unknown';
			const title = pageName === 'index' ? 'Home' : kebabToTitleCase(pageName);
			const metaData = {
				title
			};

			return new Response(JSON.stringify(metaData));
		}
	}
}

// Define the MarkdownHeader interface
interface MarkdownHeader {
	level: number;
	title: string;
	slug: string;
	children?: MarkdownHeader[];
}

// The function to parse HTML content and extract headers
function resolveHeadersFromHtml(
	htmlContent: string,
	{
		levels,
		allowHtml = false,
		escapeText = false
	}: {
		levels: number[];
		allowHtml?: boolean;
		escapeText?: boolean;
	}
): MarkdownHeader[] {
	const headers: MarkdownHeader[] = [];
	const stack: MarkdownHeader[] = [];
	const dom = new JSDOM(htmlContent);
	const document = dom.window.document;

	// Generate a selector for the desired header levels
	const levelSelector = levels.map((level) => `h${level}`).join(',');

	document.querySelectorAll(levelSelector).forEach((headerElement) => {
		const headerLevel = parseInt(headerElement.tagName.substring(1), 10);
		const slug = headerElement.id || slugify(headerElement.textContent || '');
		let title: string;

		if (allowHtml) {
			title = headerElement.innerHTML;
		} else {
			title = headerElement.textContent?.replace(/\s*#+\s*/, '') || '';
			if (escapeText) {
				title = escape(title);
			}
		}

		const currentHeader: MarkdownHeader = {
			level: headerLevel,
			title,
			slug,
			children: []
		};

		if (stack.length === 0) {
			// If stack is empty, this means it's a top-level header
			headers.push(currentHeader);
		} else {
			while (stack.length > 0 && stack[0].level >= headerLevel) {
				stack.shift(); // Pop headers that are the same or a higher level
			}

			if (stack.length > 0) {
				// The last header in the stack is the parent
				stack[0].children.push(currentHeader);
			} else {
				// No parent, so it's another top-level header
				headers.push(currentHeader);
			}
		}

		// Push the current header onto the stack
		stack.unshift(currentHeader);
	});

	return headers;
}

function resolveTitleFromHtml(htmlContent: string) {
	const dom = new JSDOM(htmlContent);
	const document = dom.window.document;
	return document.querySelector('h1')?.textContent?.trim() || '';
}

// src/node/markdown-plugin/parser/utils/slugify.ts
const rControl = /[\u0000-\u001f]/g;
const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g;
const rCombining = /[\u0300-\u036F]/g;
const slugify = (str2: string) =>
	str2
		.normalize('NFKD')
		.replace(rCombining, '')
		.replace(rControl, '')
		.replace(rSpecial, '-')
		.replace(/-{2,}/g, '-')
		.replace(/^-+|-+$/g, '')
		.replace(/^(\d)/, '_$1')
		.toLowerCase();
