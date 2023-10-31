import { join } from 'path';
import { Document, DocumentManager } from 'svelte-language-server/dist/src/lib/documents';
import { LSConfigManager } from 'svelte-language-server/dist/src/ls-config';
import { LSAndTSDocResolver } from 'svelte-language-server/dist/src/plugins/typescript/LSAndTSDocResolver';
import { isNotNullOrUndefined, pathToUrl } from 'svelte-language-server/dist/src/utils';
import ts from 'typescript';

/**
 * Records of jsdoc tag names (without the @) and their values
 * e.g. { default: "`256`" }
 */
export type JSDocRecord = Record<string, string>;

export type ComponentPartInfo = {
	name: string;
	type: string;
	doc: string;
	jsDocs: JSDocRecord;
}[];

export type ComponentPropCondition = Record<string, string | number | boolean>;

export type ComponentDynamicPropTest = {
	description: string; // for documentation
	condition: ComponentPropCondition;
};

export type ComponentInfo = {
	name: string;
	path: string;
	pathParts: string[];
	doc: string;
	jsDocs: JSDocRecord;
	props: ComponentPartInfo;
	events: ComponentPartInfo;
	slots: ComponentPartInfo;
	dynamicProps?: {
		description: string;
		condition: ComponentPropCondition;
		props: ComponentPartInfo;
	}[];
};

function jsDocTagInfoToJsDocRecord(jsDocTags: ts.JSDocTagInfo[]): JSDocRecord {
	const result: JSDocRecord = {};
	for (const tag of jsDocTags) {
		result[tag.name] = ts.displayPartsToString(tag.text);
	}
	return result;
}

// Basic, just get the static component's info
async function getStaticComponentInfo(componentPath: string): Promise<ComponentInfo | undefined> {
	// set up language server
	const testDir = '.';
	const path = join(testDir, componentPath);

	const docManager = new DocumentManager(
		(textDocument) => new Document(textDocument.uri, textDocument.text)
	);

	const lsAndTsDocResolver = new LSAndTSDocResolver(
		docManager,
		[pathToUrl(testDir)],
		new LSConfigManager(),
		{ tsconfigPath: join(testDir, 'tsconfig.json') }
	);

	// TODO gen test component for testprops?
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const document = docManager.openClientDocument(<any>{
		uri: `file:///${path}`,
		text: ts.sys.readFile(path)
	});

	const { lang, tsDoc } = await lsAndTsDocResolver.getLSAndTSDoc(document);
	const program = lang.getProgram();
	if (!program) return undefined;

	// get the component class definition
	const componentSourceFile = program.getSourceFile(tsDoc.filePath);
	if (!componentSourceFile) return undefined;

	const classDef = getClassDef(componentSourceFile);
	if (!classDef) {
		console.error('No class def found.');
		return undefined;
	}

	const typeChecker = program.getTypeChecker();
	const classType = typeChecker.getTypeAtLocation(classDef);
	const classSymbol = classType.getSymbol();

	if (!classSymbol) {
		console.error('No class symbol found.');
		return undefined;
	}

	// get props, events, slots
	const results: ComponentInfo = {
		name: componentPath.split('/').pop()!.replace('.svelte', ''),
		path: componentPath,
		pathParts: componentPath.split('/').slice(3, -1),
		doc: ts.displayPartsToString(classSymbol.getDocumentationComment(typeChecker)),
		jsDocs: jsDocTagInfoToJsDocRecord(classSymbol.getJsDocTags()),
		props: getInfoFor('$$prop_def', classType, typeChecker),
		events: getInfoFor('$$events_def', classType, typeChecker),
		slots: getInfoFor('$$slot_def', classType, typeChecker)
	};

	lsAndTsDocResolver.deleteSnapshot(tsDoc.filePath);
	return results;
}

// ----------------------

function getClassDef(sourceFile: ts.SourceFile): ts.Node | undefined {
	let classDef: ts.Node | undefined = undefined;
	sourceFile.forEachChild((node) => {
		if (ts.isClassDeclaration(node)) {
			classDef = node;
		}
	});
	return classDef;
}

// Adapted from ComponentInfoProvider
function mapPropertiesOfType(typeChecker: ts.TypeChecker, type: ts.Type) {
	return type
		.getProperties()
		.map((prop: ts.Symbol) => {
			// type would still be correct when there're multiple declarations
			const declaration = prop.valueDeclaration ?? prop.declarations?.[0];
			if (!declaration) {
				return;
			}

			return {
				name: prop.name,
				type: typeChecker.typeToString(typeChecker.getTypeOfSymbolAtLocation(prop, declaration)),
				doc: ts.displayPartsToString(prop.getDocumentationComment(typeChecker)),
				jsDocs: jsDocTagInfoToJsDocRecord(prop.getJsDocTags())
			};
		})
		.filter(isNotNullOrUndefined);
}

function getInfoFor(
	propName: string,
	classType: ts.Type,
	typeChecker: ts.TypeChecker
): ComponentPartInfo {
	const propSymbol = classType.getProperty(propName);

	if (propSymbol && propSymbol.valueDeclaration) {
		const propsType = typeChecker.getTypeOfSymbolAtLocation(
			propSymbol,
			propSymbol.valueDeclaration
		);

		return mapPropertiesOfType(typeChecker, propsType);
	}
	return [];
}

// Similar to what you'd get from JsOrTsComponentInfoProvider, but includes jsdocs and condition for dynamic props
async function getDynamicComponentProps(
	componentPath: string,
	testProps: ComponentPropCondition
): Promise<ComponentPartInfo> {
	// set up language server
	const testDir = '.';

	const docManager = new DocumentManager(
		(textDocument) => new Document(textDocument.uri, textDocument.text)
	);

	const lsAndTsDocResolver = new LSAndTSDocResolver(
		docManager,
		[pathToUrl(testDir)],
		new LSConfigManager(),
		{ tsconfigPath: join(testDir, 'tsconfig.json') }
	);

	const componentName = componentPath.split('/').pop()!.replace('.svelte', '');
	const testComponentSourceRows = [
		'<script lang="ts">',
		`import ${componentName} from '${componentPath.replace('./src/lib/', '$lib/')}';`,
		'</script>',
		`<${componentName} ${generateStringFromPropObject(testProps)} />`
	];

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const document = docManager.openClientDocument(<any>{
		uri: 'file:///inmemory.svelte',
		text: testComponentSourceRows.join('\n')
	});

	const { lang, tsDoc } = await lsAndTsDocResolver.getLSAndTSDoc(document);
	const program = lang.getProgram();
	if (!program) return [];

	const testPosition = {
		line: testComponentSourceRows.length - 1,
		character: testComponentSourceRows.at(-1)!.length - 2
	};

	const completions = lang.getCompletionsAtPosition(
		tsDoc.filePath,
		tsDoc.offsetAt(tsDoc.getGeneratedPosition(testPosition)),
		{
			includeCompletionsForModuleExports: true,
			includeCompletionsWithInsertText: false,
			allowIncompleteCompletions: true,
			triggerCharacter: '.',
			useLabelDetailsInCompletionEntries: true
		}
	);

	const typeChecker = program.getTypeChecker();

	const results =
		completions?.entries.map((entry) => {
			const completionSymbols = lang.getCompletionEntrySymbol(
				tsDoc.filePath,
				tsDoc.offsetAt(tsDoc.getGeneratedPosition(testPosition)),
				entry.name,
				undefined
			);

			return {
				name: entry.name,
				type: typeChecker.typeToString(typeChecker.getTypeOfSymbol(completionSymbols!)),
				doc: ts.displayPartsToString(completionSymbols!.getDocumentationComment(typeChecker)),
				jsDocs: jsDocTagInfoToJsDocRecord(completionSymbols!.getJsDocTags())
			};
		}) ?? [];

	lsAndTsDocResolver.deleteSnapshot(tsDoc.filePath);
	return results;
}

function generateStringFromPropObject(propsObject: ComponentPropCondition): string {
	return Object.entries(propsObject)
		.map(([key, value]) => {
			const formattedValue = typeof value === 'string' ? `"${value}"` : `{${value}}`;
			return `${key}=${formattedValue}`;
		})
		.join(' ');
}

export async function getComponentInfo(
	componentPath: string,
	testProps?: ComponentDynamicPropTest[]
): Promise<ComponentInfo | undefined> {
	if (!ts.sys.fileExists(componentPath)) {
		console.error(`File ${componentPath}" does not exist.`);
		return undefined;
	}

	const results = await getStaticComponentInfo(componentPath);

	if (testProps) {
		results!.dynamicProps = [];
		for (const testProp of testProps) {
			results!.dynamicProps.push({
				description: testProp.description,
				condition: testProp.condition,
				props: await getDynamicComponentProps(componentPath, testProp.condition)
			});
		}
	}

	return results;
}
