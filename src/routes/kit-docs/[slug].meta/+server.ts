import type { RequestEvent } from '@sveltejs/kit';
import { kebabToTitleCase } from '@svelteness/kit-docs';
import { createMetaRequestHandler } from '@svelteness/kit-docs/node';
import { base } from '$app/paths';
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
		const pageUrl = `${base}/${request.params.slug.substring(base.length).replaceAll('_', '/')}`;
		const res = await request.fetch(pageUrl);
		const rawText = await res.text();

		const title = resolveTitleFromHtml(rawText);
		const headers = resolveHeadersFromHtml(rawText, {
			levels: [2, 3]
		});

		const metaData = {
			headers,
			title
		};

		return new Response(JSON.stringify(metaData));
	} else {
		const handler = createMetaRequestHandler({
			resolve: (slug, { resolve }) => resolve(slug.substring(base.length))
		});
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
	children?: MarkdownHeader[];
	level: number;
	slug: string;
	title: string;
}

// The function to parse HTML content and extract headers
function resolveHeadersFromHtml(
	htmlContent: string,
	{
		allowHtml = false,
		escapeText = false,
		levels
	}: {
		allowHtml?: boolean;
		escapeText?: boolean;
		levels: number[];
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
			children: [],
			level: headerLevel,
			slug,
			title
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
				stack.at(0)?.children?.push(currentHeader);
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
	return (
		document
			.querySelector('h1')
			?.textContent?.replace(/\s*#+\s*/, '')
			.trim() || ''
	);
}

// Somewhere else to pull this from?
// src/node/markdown-plugin/parser/utils/slugify.ts
// eslint-disable-next-line no-control-regex
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
