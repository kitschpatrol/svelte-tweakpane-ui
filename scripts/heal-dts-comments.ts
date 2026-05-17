// @case-police-ignore jsDoc

// Works around https://github.com/sveltejs/language-tools/issues/2186 by
// manually adding missing prop comments from ancestor components run it after
// build to modify the .d.ts files in dist. it needs access to the source files
// as well. idempotent.

import type { JSDoc, SourceFile } from 'ts-morph'
import { Project } from 'ts-morph'
import type { PropNode } from './ast-tools'
import {
	getAllLibraryComponentNames,
	getDefinitionFilePath,
	getProp,
	getProps,
	getSourceFilePath,
	queryTree,
} from './ast-tools'

// TODO a more robust approach that uses the typescript type checker (see ComponentInfo.ts)

// extra logging
const verbose = false

export function healDtsComments(): void {
	// Pre-load all source and definition files into shared Projects to avoid
	// creating a new Project() per file access (~94 instantiations → 2)
	const componentNames = getAllLibraryComponentNames()

	const sourceProject = new Project()
	const sourceFiles = new Map<string, SourceFile>()
	for (const name of componentNames) {
		const filePath = getSourceFilePath(name)
		if (filePath) {
			sourceFiles.set(name, sourceProject.addSourceFileAtPath(filePath))
		}
	}

	const definitionProject = new Project()
	const definitionFiles = new Map<string, SourceFile>()
	for (const name of componentNames) {
		const filePath = getDefinitionFilePath(name)
		if (filePath) {
			definitionFiles.set(name, definitionProject.addSourceFileAtPath(filePath))
		}
	}

	// Helper functions

	// looks at use of ComponentProps in $$Props type to find the name of the component that is extended
	function getParentComponentNames(componentName: string): string[] {
		const sourceFile = sourceFiles.get(componentName)
		if (!sourceFile) {
			return []
		}

		return queryTree<PropNode>(
			sourceFile,
			':matches(ExpressionWithTypeArguments[expression.name="ComponentProps"], TypeReference[typeName.name="ComponentProps"]) > TypeReference > Identifier',
		).map((node) => node.getText())
	}

	function getCommentForProp(componentName: string, propName: string): JSDoc[] | undefined {
		const definitionFile = definitionFiles.get(componentName)
		if (!definitionFile) {
			return undefined
		}

		return getProp(definitionFile, propName, 'commented')?.getJsDocs()
	}

	// Recursively walks up the component inheritance chain to find a comment for a prop
	function getPropCommentInParents(componentName: string, propName: string): JSDoc[] | undefined {
		// Some components extend multiple components, e.g. Pane, Monitor
		const parentComponents = getParentComponentNames(componentName)

		let comment: JSDoc[] | undefined
		while (comment === undefined && parentComponents.length > 0) {
			const parent = parentComponents.pop()!
			// Recurse as needed
			comment = getCommentForProp(parent, propName) ?? getPropCommentInParents(parent, propName)
		}

		return comment
	}

	function inheritPropCommentsAndSave(componentName: string): number {
		let quantityFixed = 0

		const definitionFile = definitionFiles.get(componentName)
		if (!definitionFile) {
			return 0
		}

		const props = getProps(definitionFile, 'uncommented')
		for (const propNode of props) {
			// Check self first, then go up the component inheritance chain
			const comments =
				getCommentForProp(componentName, propNode.getName()) ??
				getPropCommentInParents(componentName, propNode.getName())

			if (comments) {
				propNode.insertJsDocs(
					0,
					comments.map((jsDoc) => jsDoc.getStructure()),
				)
				quantityFixed++
			} else {
				console.warn(
					`Component <${componentName}> is missing comment for prop "${propNode.getName()}"`,
				)
			}
		}

		definitionFile.saveSync()
		return quantityFixed
	}

	// Main
	let totalPropsFixed = 0

	console.log(`Healing missing prop comments for ${componentNames.length} components...`)

	// Order doesn't matter since going up the chain is consistent
	for (const componentName of componentNames) {
		// eslint-disable-next-line ts/no-unnecessary-condition
		if (verbose) {
			console.log(`Adding missing prop comments for "${componentName}"`)
		}

		totalPropsFixed += inheritPropCommentsAndSave(componentName)
	}

	console.log(
		`Done. Found and fixed ${totalPropsFixed} missing .d.ts component prop JSDoc annotations.`,
	)
}
