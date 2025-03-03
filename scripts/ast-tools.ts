// TypeScript AST traversal and extraction tools used by various scripts.
// @case-police-ignore jsDoc

import { query as tsquery } from '@phenomnomnominal/tsquery'
import { ESLint } from 'eslint'
import { globSync } from 'glob'
import { exec, spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { readPackageUp } from 'read-package-up'
import { svelte2tsx } from 'svelte2tsx'
import {
	type ClassDeclaration,
	type MethodSignature,
	type Node,
	Project,
	type PropertySignature,
	type StringLiteral,
} from 'ts-morph'

// This will break if multiple components with the same name exist in different folders
function findFile(
	base: string,
	componentName: string,
	suffix: string,
	warn: boolean = true,
): string | undefined {
	const files = globSync(`./${base}/**/${componentName}${suffix}`)
	if (files.length === 0) {
		if (warn) console.warn(`No files found for ${componentName}`)
		return undefined
	}

	if (files.length > 1) {
		if (warn) console.error(`Fatal: Found multiple files for ${componentName}: ${files.join(' ')}`)
		return undefined
	}

	return path.resolve(files[0])
}

async function getRepositoryUrl(): Promise<string | undefined> {
	const closestPackageJson = await readPackageUp({ normalize: false })
	const { repository } = closestPackageJson?.packageJson ?? {}
	if (!repository) return undefined

	// Handle string case or object with url property
	if (typeof repository === 'string') {
		return repository
	}

	if (typeof repository === 'object' && repository.url) {
		return repository.url
	}

	return undefined
}

export async function getGithubUrlForSourceFile(filePath: string): Promise<string> {
	// Gonna be slow
	const url = await getRepositoryUrl()
	if (!url) {
		throw new Error('No repository url found in package.json')
	}

	const sourceBaseUrl = `${url
		.toString()
		.replace(/^git\+/, '')
		.replace(/\.git$/, '')}/blob/main/`
	return sourceBaseUrl + filePath
}

export async function getEditUrlForSourceFile(filePath: string): Promise<string> {
	// Gonna be slow
	const url = await getRepositoryUrl()
	if (!url) {
		throw new Error('No repository url found in package.json')
	}

	const sourceBaseUrl = `${String(url)
		.replace(/^git\+/, '')
		.replace(/\.git$/, '')}/edit/main/`
	return sourceBaseUrl + filePath
}

export function getDefinitionFilePath(
	componentName: string,
	warn: boolean = true,
): string | undefined {
	return findFile('dist', componentName, '.svelte.d.ts', warn)
}

export function getSourceFilePath(componentName: string, warn: boolean = true): string | undefined {
	return findFile('src/lib', componentName, '.svelte', warn)
}

export function getAllLibraryFiles(): string[] {
	return globSync('./src/lib/**/*').filter((file) => fs.statSync(file).isFile())
}

export function getAllLibraryComponentNames(): string[] {
	// What happens with js components?
	return globSync('./src/lib/**/*.svelte').map((file) => path.basename(file).replace('.svelte', ''))
}

export function getExportedComponents(indexPath: string): Array<{ name: string; path: string }> {
	return queryTree<StringLiteral>(
		new Project().addSourceFileAtPath(indexPath),
		'ExportDeclaration StringLiteral[value=/.+.svelte/]',
	).map((node) => {
		const cleanPath = node.getText().replaceAll(/["']/g, '')

		return {
			name: path.basename(cleanPath).replace('.svelte', ''),
			path: cleanPath,
		}
	})
}

// Brittle
export function getExportedJs(indexPath: string): Array<{ name: string; path: string }> {
	return queryTree<StringLiteral>(
		new Project().addSourceFileAtPath(indexPath),
		'ExportDeclaration[isTypeOnly=false]:has(StringLiteral[value=/.+.js/])',
	).map((node) => {
		const name = queryTree<StringLiteral>(node, 'Identifier.name').at(0)!.getText()
		const path = queryTree<StringLiteral>(node, 'StringLiteral')
			.at(0)!
			.getText()
			.replaceAll(/["']/g, '')

		return {
			name,
			path,
		}
	})
}

/**
 * Wraps tsquery to return ts-morph Nodes
 * @see https://tsquery-playground.firebaseapp.com
 * @see https://astexplorer.net/
 */
export function queryTree<T extends Node>(node: Node, tsqueryString: string): T[] {
	// TODO type issues...
	return tsquery(node.compilerNode as unknown as string, tsqueryString).map(
		// eslint-disable-next-line ts/no-explicit-any, ts/no-unsafe-call, ts/no-unsafe-member-access
		(n) => (node as any)._getNodeFromCompilerNode(n) as Node,
	) as T[]
}

export type PropNode = MethodSignature | PropertySignature

/**
 * Get a prop node by name from a component definition file
 * @param source - either a string of source code, the name of a component with an existing definition file, or a Node
 * @param propertyName - optional name of a specific prop to return, happens at query level so might be more efficient than filtering the returned array
 * @param include - 'all' | 'commented' | 'uncommented' to filter the props returned by the presence of comments on the props
 * @returns an array of ts-morph Nodes representing the props meeting the argument criteria, or an empty array if none are found
 */
export function getProp(
	source: Node | string,
	propertyName: string,
	include: 'all' | 'commented' | 'uncommented' = 'all',
): PropNode | undefined {
	return getPropsInternal(source, include, propertyName)[0]
}

/**
 * Get all prop nodes from a component definition file
 * @param source - either a string of source code, the name of a component with an existing definition file, or a Node
 * @param include - 'all' | 'commented' | 'uncommented' to filter the props returned by the presence of comments on the props
 * @returns an array of ts-morph Nodes representing the props meeting the argument criteria, or an empty array if none are found
 */
export function getProps(
	source: Node | string,
	include: 'all' | 'commented' | 'uncommented' = 'all',
): PropNode[] {
	return getPropsInternal(source, include)
}

function getPropsInternal(
	source: Node | string,
	include: 'all' | 'commented' | 'uncommented' = 'all',
	propertyName?: string,
): PropNode[] {
	return queryTree<PropNode>(
		typeof source === 'string'
			? new Project().addSourceFileAtPath(getDefinitionFilePath(source) ?? source)
			: source,
		':declaration [name.name="props"] :matches(PropertySignature, MethodSignature):not(:declaration [name.name="props"] :matches(PropertySignature, MethodSignature) :matches(PropertySignature, MethodSignature))' +
			(include === 'commented' ? ':has([jsDoc])' : '') +
			(include === 'uncommented' ? ':not(:has([jsDoc]))' : '') +
			(propertyName === undefined ? '' : `[name.name="${propertyName}"]`),
	)
}

// Doc-specific

function extractCodeBlock(inputString: string): string | undefined {
	const regex = /```\w*\n([\s\S]+?)```/
	const match = regex.exec(inputString)
	if (match?.[1]) {
		return match[1].trim()
	}
}

export async function getComponentExampleCodeFromSource(
	componentName: string,
	includeMarkdown: boolean = false,
): Promise<string | undefined> {
	const componentPath = getSourceFilePath(componentName)
	if (!componentPath) return undefined

	const componentCode = svelte2tsx(fs.readFileSync(componentPath, 'utf8')).code

	const classDeclaration = queryTree<ClassDeclaration>(
		new Project().createSourceFile('TempComponent.ts', componentCode),
		'ClassDeclaration:has([jsDoc]):has(ExportKeyword)',
	).at(0)

	// Strip jsdoc comments
	if (classDeclaration === undefined) {
		console.error(`Class declaration not found in ${componentName}`)
		return undefined
	}

	// Support two extraction strategies... sticking with AST for now
	const useAst = true

	let exampleCommentWithFence: string | undefined
	// eslint-disable-next-line ts/no-unnecessary-condition
	if (useAst) {
		// Note that this breaks if there are @ css blocks in the JSDoc comments,
		// but so do a lot of other things so just don't do that!

		// try for an actual @example tag in case there are multiple code block
		exampleCommentWithFence =
			classDeclaration
				.getJsDocs()
				.at(0)
				?.getTags()
				.find((tag) => tag.getTagName() === 'example')
				?.getCommentText() ?? classDeclaration.getJsDocs().at(0)?.getCommentText()
	} else {
		// Get the full text of the JSDoc block and strip the JSDoc syntax
		const fullCommentText = classDeclaration
			.getJsDocs()
			.at(0)
			?.getFullText()
			.replaceAll(/^ ?\/*\*+[ /]?/gm, '')

		if (fullCommentText === undefined) {
			console.error(`Class declaration comment not found in ${componentName}`)
			return undefined
		}

		// Pull out just the @example code fence
		// TODO multiple example support (via .exec, /g doesn't work with .match)
		exampleCommentWithFence = /@example[\s\S]+(```[\s\S]+```)/.exec(fullCommentText)?.at(1)
	}

	if (exampleCommentWithFence === undefined) {
		console.error(`Example comment not found in ${componentName}`)
		return undefined
	}

	// Format, because it's lost in the AST

	const exampleCommentWithoutFence = extractCodeBlock(exampleCommentWithFence)

	if (exampleCommentWithoutFence === undefined) {
		console.error(`Could not extract example code block in ${componentName}`)
		return undefined
	}

	const formattedComment = await lintAndFormat(exampleCommentWithoutFence)

	// Put the formatted code block back inside the fence
	const wrappedComment = `${exampleCommentWithFence
		.split('\n')
		.at(0)}\n${formattedComment}${exampleCommentWithFence.split('\n').at(-1)}`

	return includeMarkdown ? wrappedComment : formattedComment
}

// TODO better to format and lint?
export async function lintAndFormat(
	code: string,
	fileExtension: string = 'svelte',
	formatParser: string = 'svelte',
): Promise<string> {
	const lintedCode = await lint(code, fileExtension)
	const lintedAndFormattedCode = await format(lintedCode, formatParser)
	return lintedAndFormattedCode
}

async function lint(code: string, fileExtension: string): Promise<string> {
	// Create an instance of the linter
	const eslint = new ESLint({
		fix: true,
		// TODO does this find the config?
		// eslint-disable-next-line unicorn/no-null
		overrideConfigFile: null,
	})

	let result: ESLint.LintResult | undefined
	try {
		;[result] = await eslint.lintText(code, {
			filePath: `example.${fileExtension}`,
		})
	} catch (error) {
		console.log(error)
	}

	// Output is undefined when there are no errors

	return result?.output ?? code
}

export async function format(code: string, formatParser: string): Promise<string> {
	// Much slower than the node api, but more consistently gets the right config
	return new Promise((resolve, reject) => {
		// Spawn Prettier process
		const prettierProcess = spawn('prettier', [
			'--plugin',
			'prettier-plugin-svelte',
			'--parser',
			formatParser,
			'--print-width',
			'75',
			'--use-tabs',
			'false',
		])

		let formattedCode = ''
		let errorOutput = ''

		// Collect formatted code
		prettierProcess.stdout.on('data', (data: Uint8Array) => {
			formattedCode += data.toString()
		})

		// Collect error messages
		prettierProcess.stderr.on('data', (data: Uint8Array) => {
			errorOutput += data.toString()
		})

		// Handle process completion
		prettierProcess.on('close', (code) => {
			if (code === 0) {
				resolve(formattedCode)
			} else {
				reject(new Error(`Prettier exited with code ${code}: ${errorOutput}`))
			}
		})

		// Handle process errors (e.g., Prettier not found)
		prettierProcess.on('error', (error) => {
			reject(error)
		})

		// Write code to Prettier process and end input
		prettierProcess.stdin.write(code)
		prettierProcess.stdin.end()
	})
}

export async function getLastUpdatedDate(filePath: string): Promise<Date | undefined> {
	return new Promise((resolve, reject) => {
		exec(`git log -1 --format=%cd "${filePath}"`, (error, stdout) => {
			if (error) {
				reject(error)
				return
			}

			const date = new Date(stdout.trim())
			if (Number.isNaN(date.getTime())) {
				// eslint-disable-next-line unicorn/no-useless-undefined
				resolve(undefined)
			} else {
				resolve(date)
			}
		})
	})
}
