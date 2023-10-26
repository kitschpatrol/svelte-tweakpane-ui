import { query as tsquery } from '@phenomnomnominal/tsquery';
import { globSync } from 'glob';
import path from 'path';
import {
	Project,
	type JSDoc,
	type MethodSignature,
	type Node,
	type PropertySignature
} from 'ts-morph';

// works around https://github.com/sveltejs/language-tools/issues/2186 by
// manually adding missing prop comments from ancestor components
// run after build to modify the .d.ts files in dist
// idempotent

// see https://tsquery-playground.firebaseapp.com
// and https://astexplorer.net/

// extra logging
const verbose = false;

// tsquery strings

const propsAllQueryString =
	':declaration [name.name="props"] :matches(PropertySignature, MethodSignature):not(:declaration [name.name="props"] :matches(PropertySignature, MethodSignature) :matches(PropertySignature, MethodSignature))';
const propsWithCommentsQueryString = `${propsAllQueryString}:has([jsDoc])`;
const propsWithoutCommentsQueryString = `${propsAllQueryString}:not(:has([jsDoc]))`;
function buildQueryForPropNameWithComment(name: string): string {
	return `${propsWithCommentsQueryString}[name.name="${name}"]`;
}
const parentComponentsQueryString =
	':matches(ExpressionWithTypeArguments[expression.name="ComponentProps"], TypeReference[typeName.name="ComponentProps"]) > TypeReference > Identifier';

// helper functions

function findFile(base: string, componentName: string, suffix: string): string {
	// this will break if multiple components with the same name exist

	const files = globSync(`./${base}/**/${componentName}${suffix}`);
	if (!files || files.length === 0) {
		console.error(`Fatal: No files found for ${componentName}`);
		process.exit(1);
	} else if (files.length > 1) {
		console.error(`Fatal: Found multiple files for ${componentName}: ${files}`);
		process.exit(1);
	} else {
		return path.resolve(files[0]);
	}
}

function findDefinitionFile(componentName: string): string {
	return findFile('dist', componentName, '.svelte.d.ts');
}

function findSourceFile(componentName: string): string {
	return findFile('src/lib', componentName, '.svelte');
}

// returns matches as ts-morph nodes via tsquery, zero length if no matches
function query<T extends Node>(node: Node, tsqueryString: string): T[] {
	return tsquery(node.compilerNode, tsqueryString).map(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(n) => (node as any)._getNodeFromCompilerNode(n) as Node
	) as T[];
}

// looks at use of ComponentProps in $$Props type to find the name of the component that is extended
function getParentComponentNames(componentName: string): string[] {
	return query<PropertySignature | MethodSignature>(
		new Project().addSourceFileAtPath(findSourceFile(componentName)),
		parentComponentsQueryString
	).map((node) => node.getText());
}

function getCommentForProp(componentName: string, propName: string): JSDoc[] | undefined {
	return query<PropertySignature | MethodSignature>(
		new Project().addSourceFileAtPath(findDefinitionFile(componentName)),
		buildQueryForPropNameWithComment(propName)
	)
		.at(0)
		?.getJsDocs();
	// TODO check for zero length?
}

// recursively walks up the component inheritance chain to find a comment for a prop
function findPropCommentInParent(componentName: string, propName: string): JSDoc[] | undefined {
	// some components extend multiple components, e.g. Pane, Monitor
	const parentComponents = getParentComponentNames(componentName);

	let comment: JSDoc[] | undefined;
	while (comment === undefined && parentComponents.length > 0) {
		const parent = parentComponents.pop()!;
		// recurse as needed
		comment = getCommentForProp(parent, propName) ?? findPropCommentInParent(parent, propName);
	}

	return comment;
}

function inheritPropCommentsAndSave(componentName: string): number {
	let quantityFixed = 0;

	const definitionFile = new Project().addSourceFileAtPath(findDefinitionFile(componentName));

	query<PropertySignature | MethodSignature>(
		definitionFile,
		propsWithoutCommentsQueryString
	)?.forEach((propNode) => {
		// check self first, then go up the component inheritance chain
		const comments =
			getCommentForProp(componentName, propNode.getName()) ??
			findPropCommentInParent(componentName, propNode.getName());

		if (comments) {
			propNode.insertJsDocs(
				0,
				comments.map((jsDoc) => jsDoc.getStructure())
			);
			quantityFixed++;
		} else {
			console.warn(
				`Component <${componentName}> is missing comment for prop "${propNode.getName()}"`
			);
		}
	});

	definitionFile.saveSync();
	return quantityFixed;
}

// Main

// Run on all components found in dist
// Order doesn't matter since going up the chain is consistent
const componentNames = globSync('./dist/**/*.svelte.d.ts').map((file) => {
	return path.basename(file).replace('.svelte.d.ts', '');
});

console.log(`Healing missing prop comments for ${componentNames.length} components...`);

let totalPropsFixed = 0;

componentNames.forEach((componentName) => {
	verbose && console.log(`Adding missing prop comments for "${componentName}"`);
	totalPropsFixed += inheritPropCommentsAndSave(componentName);
});

console.log(
	`Done. Found and fixed ${totalPropsFixed} missing .d.ts component prop JSDoc annotations.`
);
