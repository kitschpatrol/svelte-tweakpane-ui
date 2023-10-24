import { Project, type PropertySignature, type Node } from 'ts-morph';
import ts from 'typescript';
import fs from 'fs';
import { globSync } from 'glob';
import path from 'path';
import { query as tsquery } from '@phenomnomnominal/tsquery';

// works around https://github.com/sveltejs/language-tools/issues/2186 by
// manually adding missing prop comments from ancestor components
// run after build to modify the .d.ts files in dist
// idempotent

// extra logging
const verbose = false;

// Helpers

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

// returns first match, or undefined
function queryAll<T extends Node>(node: Node, tsqueryString: string): T[] | undefined {
	const result = tsquery(node.compilerNode, tsqueryString).map(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(n) => (node as any)._getNodeFromCompilerNode(n) as Node
	) as T[];
	return result.length > 0 ? result : undefined;
}

// gets all props for a given component from its definition file
function getPropsForComponent(componentName: string): PropertySignature[] | undefined {
	const project = new Project();
	const definitionFile = project.addSourceFileAtPath(findDefinitionFile(componentName));

	return queryAll<PropertySignature>(
		definitionFile,
		':declaration [name.name="props"] PropertySignature'
	)?.filter((prop) => {
		// don't include props that are nested in other props, e.g. on <Point>
		// can't seem to limit depth in tsquery alone
		const firstPropertySignatureAncestor = prop.getFirstAncestorByKind(
			ts.SyntaxKind.PropertySignature
		);

		return (
			firstPropertySignatureAncestor === undefined ||
			firstPropertySignatureAncestor.getText().startsWith('props')
		);
	});
}

// looks at use of ComponentProps in $$Props interface to find the name of the component that is extended
function getParentComponentNames(componentName: string): string[] {
	// Getting this reliably with tsquery proved too complicated
	const regex = /ComponentProps<([a-zA-Z0-9_-]+)/g;
	return fs
		.readFileSync(findSourceFile(componentName), 'utf-8')
		.split('\n')
		.filter((line) => !/^\s*\/\/|^\s*\/\*/.test(line)) // ignore comments
		.flatMap((line) => Array.from(line.matchAll(regex)).map((match) => match[1]));
}

// pass the component with the missing prop, looks up hierarchy
function findPropComment(componentName: string, propName: string): string | undefined {
	// some components extend multiple components, e.g. Pane, Monitor
	// store at least one result from the parents...

	let comment: string | undefined;

	for (const parentName of getParentComponentNames(componentName)) {
		verbose &&
			console.log(`Looking for "${propName}" in <${componentName}> with parent <${parentName}>`);

		const parentProp = getPropsForComponent(parentName)?.find((parentProp) => {
			return parentProp.getName() === propName && parentProp.getJsDocs().length > 0;
		});

		if (parentProp !== undefined) {
			verbose && console.log(`Found ${parentProp.getName()} with comment in from <${parentName}>`);
			comment = parentProp.getJsDocs()[0].getCommentText();
		} else {
			// recurse and look up the chain
			verbose && console.log(`Going up the chain from <${parentName}>`);
			const result = findPropComment(parentName, propName);
			if (result !== undefined) comment = result;
		}
	}

	return comment;
}

// sets the prop comments for a given component in its definition file
function setPropsForComponent(componentName: string, props: PropertySignature[]) {
	const project = new Project();
	const sourceFile = project.addSourceFileAtPath(findDefinitionFile(componentName));

	// TODO tsqery
	sourceFile
		.getFirstDescendant((n) => {
			return (
				(n.isKind(ts.SyntaxKind.PropertySignature) || n.isKind(ts.SyntaxKind.MethodDeclaration)) &&
				n.getText().startsWith('props')
			);
		})
		?.getDescendantsOfKind(ts.SyntaxKind.PropertySignature)
		.filter((prop) => {
			// don't include props that are nested in other props, e.g. on <Point>
			// TODO what about method signature ancestors?
			const firstPropertySignatureAncestor = prop.getFirstAncestorByKind(
				ts.SyntaxKind.PropertySignature
			);

			return (
				firstPropertySignatureAncestor === undefined ||
				firstPropertySignatureAncestor.getText().startsWith('props')
			);
		})
		.forEach((prop) => {
			const matchingProp = props.find(
				(p) => p.getName() === prop.getName() && p.getJsDocs().length > 0
			);
			if (matchingProp !== undefined && prop.getJsDocs().length === 0) {
				prop.addJsDoc(matchingProp.getJsDocs()[0].getCommentText()!);
			} else {
				verbose && console.error(`No matching prop found for ${prop.getName()}`);
			}
		});

	sourceFile.saveSync();
}

// rewrites the component's definition file with the comments from the parent as needed
// returns number of comments added
function inheritPropCommentsAndSave(componentName: string): number {
	let quantityFixed = 0;
	const ammendedProps = getPropsForComponent(componentName);

	if (ammendedProps !== undefined) {
		ammendedProps.forEach((prop) => {
			if (prop.getJsDocs().length > 0) {
				verbose && console.log(`Already have comment for ${prop.getName()}`);
			} else {
				const parentComment = findPropComment(componentName, prop.getName());

				if (parentComment !== undefined) {
					verbose &&
						console.log(`Adding comment from parent "${componentName}" for "${prop.getName()}"`);
					quantityFixed++;
					prop.addJsDoc(parentComment);
				}
			}
		});

		setPropsForComponent(componentName, ammendedProps);
	} else {
		console.warn(`No props found for ${componentName}`);
	}

	return quantityFixed;
}

// Main

let quantityFixed = 0;

// Run on all components found in dist
// Order doesn't matter since going up the chain is consistent
const componentNames = globSync('./dist/**/*.svelte.d.ts').map((file) => {
	return path.basename(file).replace('.svelte.d.ts', '');
});

console.log(`Healing missing prop comments for ${componentNames.length} components...`);

componentNames.forEach((componentName) => {
	verbose && console.log(`Adding missing prop comments for "${componentName}"`);
	quantityFixed += inheritPropCommentsAndSave(componentName);
});

// Audit
componentNames.forEach((componentName) => {
	getPropsForComponent(componentName)?.forEach((prop) => {
		if (prop.getJsDocs().length === 0) {
			console.warn(`Component <${componentName}> is missing comment for prop "${prop.getName()}"`);
		}
	});
});

console.log(
	`Done. Found and fixed ${quantityFixed} missing .d.ts component prop JSDoc annotations.`
);
