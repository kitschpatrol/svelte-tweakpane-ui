import { nanoid } from 'nanoid';
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
	doc: string;
	jsDocs: JSDocRecord;
	name: string;
	type: string;
}[];

export type ComponentPropCondition = Record<string, boolean | number | string>;

export type ComponentDynamicPropTest = {
	condition: ComponentPropCondition;
	description: string; // for documentation
};

export type ComponentInfo = {
	doc: string;
	dynamicProps?: {
		condition: ComponentPropCondition;
		description: string;
		props: ComponentPartInfo;
	}[];
	events: ComponentPartInfo;
	jsDocs: JSDocRecord;
	name: string;
	path: string;
	pathParts: string[];
	props: ComponentPartInfo;
	slots: ComponentPartInfo;
};

function sortPropsByName(props: ComponentPartInfo): ComponentPartInfo {
	return props.sort((a, b) => a.name.localeCompare(b.name));
}

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

	// TODO gen test component for test props?
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const document = docManager.openClientDocument(<any>{
		text: ts.sys.readFile(path),
		uri: `file:///${path}`
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
		doc: ts.displayPartsToString(classSymbol.getDocumentationComment(typeChecker)),
		events: sortPropsByName(getInfoFor('$$events_def', classType, typeChecker)),
		jsDocs: jsDocTagInfoToJsDocRecord(classSymbol.getJsDocTags()),
		name: componentPath.split('/').pop()!.replace('.svelte', ''),
		path: componentPath,
		pathParts: componentPath.split('/').slice(3, -1),
		props: sortPropsByName(getInfoFor('$$prop_def', classType, typeChecker)),
		slots: sortPropsByName(getInfoFor('$$slot_def', classType, typeChecker))
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
				doc: ts.displayPartsToString(prop.getDocumentationComment(typeChecker)),
				jsDocs: jsDocTagInfoToJsDocRecord(prop.getJsDocTags()),
				name: prop.name,
				type: typeChecker.typeToString(typeChecker.getTypeOfSymbolAtLocation(prop, declaration))
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

// Similar to what you'd get from JsOrTsComponentInfoProvider, but includes JSDocs and condition for dynamic props
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

	// generated file name must be unique, cleanup doesn't seem to be enough
	// to avoid stale autocompletion values across repeat invocations
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const document = docManager.openClientDocument(<any>{
		text: testComponentSourceRows.join('\n'),
		uri: `file:///in-memory-${componentName}-${nanoid()}.svelte`
	});

	const { lang, tsDoc } = await lsAndTsDocResolver.getLSAndTSDoc(document);
	const program = lang.getProgram();
	if (!program) return [];

	const testPosition = {
		character: testComponentSourceRows.at(-1)!.length - 2,
		line: testComponentSourceRows.length - 1
	};

	const completions = lang.getCompletionsAtPosition(
		tsDoc.filePath,
		tsDoc.offsetAt(tsDoc.getGeneratedPosition(testPosition)),
		{
			allowIncompleteCompletions: true,
			includeCompletionsForModuleExports: true,
			includeCompletionsWithInsertText: false,
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
				doc: ts.displayPartsToString(completionSymbols!.getDocumentationComment(typeChecker)),
				jsDocs: jsDocTagInfoToJsDocRecord(completionSymbols!.getJsDocTags()),
				name: entry.name,
				type: typeChecker.typeToString(typeChecker.getTypeOfSymbol(completionSymbols!))
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
				condition: testProp.condition,
				description: testProp.description,
				props: sortPropsByName(await getDynamicComponentProps(componentPath, testProp.condition))
			});
		}
	}

	return results;
}
