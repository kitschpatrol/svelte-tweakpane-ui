// TypeScript AST traversal and extraction tools used by various scripts.

import { query as tsquery } from '@phenomnomnominal/tsquery';
import { globSync } from 'glob';
import path from 'path';
import {
	Project,
	type MethodSignature,
	type Node,
	type PropertySignature,
	type ClassDeclaration,
	StringLiteral
} from 'ts-morph';

// this will break if multiple components with the same name exist in different folders
function findFile(
	base: string,
	componentName: string,
	suffix: string,
	warn: boolean = true
): string | undefined {
	const files = globSync(`./${base}/**/${componentName}${suffix}`);
	if (files.length === 0) {
		warn && console.warn(`No files found for ${componentName}`);
		return undefined;
	} else if (files.length > 1) {
		warn && console.error(`Fatal: Found multiple files for ${componentName}: ${files}`);
		return undefined;
	} else {
		return path.resolve(files[0]);
	}
}

export function getDefinitionFilePath(
	componentName: string,
	warn: boolean = true
): string | undefined {
	return findFile('dist', componentName, '.svelte.d.ts', warn);
}

export function getSourceFilePath(componentName: string, warn: boolean = true): string | undefined {
	return findFile('src/lib', componentName, '.svelte', warn);
}

export function getAllLibComponentNames(): string[] {
	// what happens with js components?
	return globSync('./src/lib/**/*.svelte').map((file) => {
		return path.basename(file).replace('.svelte', '');
	});
}

export function getExportedComponents(indexPath: string): { name: string; path: string }[] {
	return queryTree<StringLiteral>(
		new Project().addSourceFileAtPath(indexPath),
		'ExportDeclaration StringLiteral[value=/.+.svelte/]'
	).map((node) => {
		const cleanPath = node.getText().replace(/['"]/g, '');

		return {
			name: path.basename(cleanPath).replace('.svelte', ''),
			path: cleanPath
		};
	});
}

/**
 * wraps tsquery to return ts-morph Nodes
 * @see https://tsquery-playground.firebaseapp.com
 * @see https://astexplorer.net/
 */
export function queryTree<T extends Node>(node: Node, tsqueryString: string): T[] {
	return tsquery(node.compilerNode, tsqueryString).map(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(n) => (node as any)._getNodeFromCompilerNode(n) as Node
	) as T[];
}

export type PropNode = PropertySignature | MethodSignature;

/**
 * @param source - either a string of source code, the name of a component with an existing definition file, or a Node
 * @param propName - optional name of a specific prop to return, happens at query level so might be more efficient than filtering the returned array
 * @param include - 'all' | 'commented' | 'uncommented' to filter the props returned by the presence of comments on the props
 * @returns an array of ts-morph Nodes representing the props meeting the argument criteria, or an empty array if none are found
 */
export function getProp(
	source: string | Node,
	propName: string,
	include: 'all' | 'commented' | 'uncommented' = 'all'
): PropNode | undefined {
	return getPropsInternal(source, include, propName)[0];
}

/**
 * @param source - either a string of source code, the name of a component with an existing definition file, or a Node
 * @param include - 'all' | 'commented' | 'uncommented' to filter the props returned by the presence of comments on the props
 * @returns an array of ts-morph Nodes representing the props meeting the argument criteria, or an empty array if none are found
 */
export function getProps(
	source: string | Node,
	include: 'all' | 'commented' | 'uncommented' = 'all'
): PropNode[] {
	return getPropsInternal(source, include);
}

function getPropsInternal(
	source: string | Node,
	include: 'all' | 'commented' | 'uncommented' = 'all',
	propName?: string
): PropNode[] {
	return queryTree<PropNode>(
		typeof source === 'string'
			? new Project().addSourceFileAtPath(getDefinitionFilePath(source) ?? source)
			: source,
		':declaration [name.name="props"] :matches(PropertySignature, MethodSignature):not(:declaration [name.name="props"] :matches(PropertySignature, MethodSignature) :matches(PropertySignature, MethodSignature))' +
			(include === 'commented' ? ':has([jsDoc])' : '') +
			(include === 'uncommented' ? ':not(:has([jsDoc]))' : '') +
			(propName !== undefined ? `[name.name="${propName}"]` : '')
	);
}

// doc-specific

function extractCodeBlock(inputString: string): string | undefined {
	const regex = /```(?:tsx)([\s\S]+?)```/gm;
	const match = regex.exec(inputString);
	if (match && match[1]) {
		return match[1].trim();
	}
	return;
}

export function getComponentExampleCode(source: string | Node): string | undefined {
	const classDeclaration = queryTree<ClassDeclaration>(
		typeof source === 'string'
			? new Project().addSourceFileAtPath(getDefinitionFilePath(source) ?? source)
			: source,
		'ClassDeclaration:has([jsDoc]):has(ExportKeyword)'
	).at(0);

	if (classDeclaration) {
		// try for an actual @example tag in case there are multiple code block
		const comment =
			classDeclaration
				.getJsDocs()
				?.at(0)
				?.getTags()
				.find((tag) => tag.getTagName() === 'example')
				?.getCommentText() ?? classDeclaration.getJsDocs()?.at(0)?.getCommentText();

		if (comment) {
			return extractCodeBlock(comment);
		}
	}

	return undefined;
}
