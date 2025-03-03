// @case-police-ignore jsDoc, tsDoc

import { nanoid } from 'nanoid'
import path from 'node:path'
import ts from 'typescript'
import {
	Document,
	DocumentManager,
} from '../node_modules/svelte-language-server/dist/src/lib/documents'
import { LSConfigManager } from '../node_modules/svelte-language-server/dist/src/ls-config.js'
import { LSAndTSDocResolver } from '../node_modules/svelte-language-server/dist/src/plugins/typescript/LSAndTSDocResolver.js'
import {
	isNotNullOrUndefined,
	pathToUrl,
} from '../node_modules/svelte-language-server/dist/src/utils.js'

/**
 * Records of jsdoc tag names (without the @) and their values
 * e.g. { default: "`256`" }
 */
export type JsDocRecord = Record<string, string>

export type ComponentPartInfo = Array<{
	doc: string
	jsDocs: JsDocRecord
	name: string
	type: string
}>

export type ComponentPropCondition = Record<string, boolean | number | string>

export type ComponentDynamicPropTest = {
	condition: ComponentPropCondition
	description: string // For documentation
}

export type ComponentInfo = {
	doc: string
	dynamicProps?: Array<{
		condition: ComponentPropCondition
		description: string
		props: ComponentPartInfo
	}>
	events: ComponentPartInfo
	jsDocs: JsDocRecord
	name: string
	path: string
	pathParts: string[]
	props: ComponentPartInfo
	slots: ComponentPartInfo
}

// Function sortPropsByName(props: ComponentPartInfo): ComponentPartInfo {
// 	return props.sort((a, b) => a.name.localeCompare(b.name));
// }

function jsDocumentTagInfoToJsDocumentRecord(jsDocumentTags: ts.JSDocTagInfo[]): JsDocRecord {
	const result: JsDocRecord = {}
	for (const tag of jsDocumentTags) {
		result[tag.name] = ts.displayPartsToString(tag.text)
	}

	return result
}

// Alt approach to get cleaner types... use the static approach for the basics,
// then do a pass with the dynamic approach to get types even for static props
// TODO figure out why my extraction approach is yielding different types than the language server
async function getStaticComponentInfo(componentPath: string): Promise<ComponentInfo | undefined> {
	// Static approach
	const info = await getStaticComponentInfoInternal(componentPath)
	if (!info) return undefined

	// Amend type data with dynamic approach
	const lsPropInfo = await getDynamicComponentProps(componentPath, {})
	for (const property of info.props) {
		const lsProp = lsPropInfo.find((p) => p.name === property.name)

		if (!lsProp) {
			console.warn(`No LS prop found for ${property.name}`)
			continue
		}

		property.type = lsProp.type
	}

	return info
}

// Basic, just get the static component's info
async function getStaticComponentInfoInternal(
	componentPath: string,
): Promise<ComponentInfo | undefined> {
	// Set up language server
	const testDirectory = '.'
	const resolvedPath = path.join(testDirectory, componentPath)

	const documentManager = new DocumentManager(
		// eslint-disable-next-line ts/no-unsafe-argument
		(textDocument) => new Document(textDocument.uri, textDocument.text),
	)

	const lsAndTsDocumentResolver = new LSAndTSDocResolver(
		documentManager,
		[pathToUrl(testDirectory)],
		new LSConfigManager(),
		{ tsconfigPath: path.join(path.resolve(testDirectory), 'tsconfig.json') },
	)

	const fileText = ts.sys.readFile(resolvedPath)
	if (fileText === undefined) {
		throw new Error(`Failed to read file ${resolvedPath}`)
	}

	const document = documentManager.openClientDocument({
		text: fileText,
		uri: `file:///${resolvedPath}`,
	})

	const { lang, tsDoc } = await lsAndTsDocumentResolver.getLSAndTSDoc(document)
	const program = lang.getProgram()
	if (!program) return undefined

	// Get the component class definition
	const componentSourceFile = program.getSourceFile(tsDoc.filePath)
	if (!componentSourceFile) return undefined

	const classDefinition = getClassDefinition(componentSourceFile)
	if (!classDefinition) {
		console.error('No class def found.')
		return undefined
	}

	const typeChecker = program.getTypeChecker()
	const classType = typeChecker.getTypeAtLocation(classDefinition)
	const classSymbol = classType.getSymbol()

	if (!classSymbol) {
		console.error('No class symbol found.')
		return undefined
	}

	// Get props, events, slots
	const results: ComponentInfo = {
		doc: ts.displayPartsToString(classSymbol.getDocumentationComment(typeChecker)),
		events: getInfoFor('$$events_def', classType, typeChecker), // Natural sorting...
		jsDocs: jsDocumentTagInfoToJsDocumentRecord(classSymbol.getJsDocTags()),
		name: componentPath.split('/').pop()!.replace('.svelte', ''),
		path: componentPath,
		pathParts: componentPath.split('/').slice(3, -1),
		props: getInfoFor('$$prop_def', classType, typeChecker), // Natural sorting...
		slots: getInfoFor('$$slot_def', classType, typeChecker), // Natural sorting...
	}

	await lsAndTsDocumentResolver.deleteSnapshot(tsDoc.filePath)
	return results
}

// ----------------------

function getClassDefinition(sourceFile: ts.SourceFile): ts.Node | undefined {
	let classDefinition: ts.Node | undefined
	sourceFile.forEachChild((node) => {
		if (ts.isClassDeclaration(node)) {
			classDefinition = node
		}
	})
	return classDefinition
}

// Adapted from ComponentInfoProvider
function mapPropertiesOfType(typeChecker: ts.TypeChecker, type: ts.Type) {
	return type
		.getProperties()
		.map((property: ts.Symbol) => {
			// Type would still be correct when there're multiple declarations
			const declaration = property.valueDeclaration ?? property.declarations?.[0]
			if (!declaration) {
				return
			}

			// TODO despite its resemblance to the language-server's ComponentInfoProvider implementation,
			// this doesn't seem to give the same type strings
			// for now, the type field is later discarded and replaced with the language-server's output
			return {
				doc: ts.displayPartsToString(property.getDocumentationComment(typeChecker)),
				jsDocs: jsDocumentTagInfoToJsDocumentRecord(property.getJsDocTags()),
				name: property.name,
				type: typeChecker.typeToString(
					typeChecker.getTypeOfSymbolAtLocation(property, declaration),
				),
			}
		})
		.filter((element) => isNotNullOrUndefined(element)) as ComponentPartInfo
}

function getInfoFor(
	propertyName: string,
	classType: ts.Type,
	typeChecker: ts.TypeChecker,
): ComponentPartInfo {
	const propertySymbol = classType.getProperty(propertyName)

	if (propertySymbol?.valueDeclaration) {
		const propertiesType = typeChecker.getTypeOfSymbolAtLocation(
			propertySymbol,
			propertySymbol.valueDeclaration,
		)

		return mapPropertiesOfType(typeChecker, propertiesType)
	}

	return []
}

// Similar to what you'd get from JsOrTsComponentInfoProvider, but includes JSDocs and condition for dynamic props
async function getDynamicComponentProps(
	componentPath: string,
	testProps: ComponentPropCondition,
): Promise<ComponentPartInfo> {
	// Set up language server
	const testDirectory = '.'

	const documentManager = new DocumentManager(
		// eslint-disable-next-line ts/no-unsafe-argument
		(textDocument) => new Document(textDocument.uri, textDocument.text),
	)

	const lsAndTsDocumentResolver = new LSAndTSDocResolver(
		documentManager,
		[pathToUrl(testDirectory)],
		new LSConfigManager(),
		{ tsconfigPath: path.join(path.resolve(testDirectory), 'tsconfig.json') },
	)

	const componentName = componentPath.split('/').pop()!.replace('.svelte', '')
	const testComponentSourceRows = [
		'<script lang="ts">',
		`import ${componentName} from '${componentPath.replace('./src/lib/', '$lib/')}';`,
		'</script>',
		`<${componentName} ${generateStringFromPropObject(testProps)} />`,
	]

	// Generated file name must be unique, cleanup doesn't seem to be enough
	// to avoid stale autocompletion values across repeat invocations
	const document = documentManager.openClientDocument({
		text: testComponentSourceRows.join('\n'),
		uri: `file:///in-memory-${componentName}-${nanoid()}.svelte`,
	})

	const { lang, tsDoc } = await lsAndTsDocumentResolver.getLSAndTSDoc(document)
	const program = lang.getProgram()
	if (!program) return []

	const testPosition = {
		character: testComponentSourceRows.at(-1)!.length - 2,
		line: testComponentSourceRows.length - 1,
	}

	const completions = lang.getCompletionsAtPosition(
		tsDoc.filePath,
		tsDoc.offsetAt(tsDoc.getGeneratedPosition(testPosition)),
		{
			allowIncompleteCompletions: true, // No change to output
			includeCompletionsForModuleExports: true,
			includeCompletionsWithInsertText: false,
			triggerCharacter: '.',
			useLabelDetailsInCompletionEntries: true,
			// IncludeSymbol // TODO try this...
		},
	)

	const typeChecker = program.getTypeChecker()

	const results =
		completions?.entries.map((entry) => {
			const completionSymbols = lang.getCompletionEntrySymbol(
				tsDoc.filePath,
				tsDoc.offsetAt(tsDoc.getGeneratedPosition(testPosition)),
				entry.name,
				// eslint-disable-next-line unicorn/no-useless-undefined
				undefined,
			)

			return {
				doc: ts.displayPartsToString(completionSymbols!.getDocumentationComment(typeChecker)),
				jsDocs: jsDocumentTagInfoToJsDocumentRecord(completionSymbols!.getJsDocTags()),
				name: entry.name,
				type: typeChecker.typeToString(typeChecker.getTypeOfSymbol(completionSymbols!)),
			}
		}) ?? []

	await lsAndTsDocumentResolver.deleteSnapshot(tsDoc.filePath)
	return results
}

function generateStringFromPropObject(propertiesObject: ComponentPropCondition): string {
	return Object.entries(propertiesObject)
		.map(([key, value]) => {
			const formattedValue = typeof value === 'string' ? `"${value}"` : `{${value}}`
			return `${key}=${formattedValue}`
		})
		.join(' ')
}

export async function getComponentInfo(
	componentPath: string,
	testProps?: ComponentDynamicPropTest[],
): Promise<ComponentInfo | undefined> {
	if (!ts.sys.fileExists(componentPath)) {
		console.error(`File ${componentPath}" does not exist.`)
		return undefined
	}

	const results = await getStaticComponentInfo(componentPath)

	if (testProps) {
		results!.dynamicProps = []
		for (const testProp of testProps) {
			results!.dynamicProps.push({
				condition: testProp.condition,
				description: testProp.description,
				props: await getDynamicComponentProps(componentPath, testProp.condition), // Natural sorting...
			})
		}
	}

	return results
}
