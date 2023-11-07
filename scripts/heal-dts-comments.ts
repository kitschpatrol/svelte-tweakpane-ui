import {
	type PropNode,
	getAllLibComponentNames,
	getDefinitionFilePath,
	getProp,
	getProps,
	getSourceFilePath,
	queryTree
} from './ast-tools';
import { type JSDoc, Project } from 'ts-morph';

// works around https://github.com/sveltejs/language-tools/issues/2186 by
// manually adding missing prop comments from ancestor components
// run it after build to modify the .d.ts files in dist.
// it needs access to the source files as well.
// idempotent.

// TODO a more robust approach that uses the typescript type checker (see ComponentInfo.ts)

// extra logging
const verbose = false;

// helper functions

// looks at use of ComponentProps in $$Props type to find the name of the component that is extended
function getParentComponentNames(componentName: string): string[] {
	return queryTree<PropNode>(
		new Project().addSourceFileAtPath(getSourceFilePath(componentName)!),
		':matches(ExpressionWithTypeArguments[expression.name="ComponentProps"], TypeReference[typeName.name="ComponentProps"]) > TypeReference > Identifier'
	).map((node) => node.getText());
}

function getCommentForProp(componentName: string, propName: string): JSDoc[] | undefined {
	return getProp(componentName, propName, 'commented')?.getJsDocs();
}

// recursively walks up the component inheritance chain to find a comment for a prop
function getPropCommentInParents(componentName: string, propName: string): JSDoc[] | undefined {
	// some components extend multiple components, e.g. Pane, Monitor
	const parentComponents = getParentComponentNames(componentName);

	let comment: JSDoc[] | undefined;
	while (comment === undefined && parentComponents.length > 0) {
		const parent = parentComponents.pop()!;
		// recurse as needed
		comment = getCommentForProp(parent, propName) ?? getPropCommentInParents(parent, propName);
	}

	return comment;
}

function inheritPropCommentsAndSave(componentName: string): number {
	let quantityFixed = 0;

	const definitionFile = new Project().addSourceFileAtPath(getDefinitionFilePath(componentName)!);

	getProps(definitionFile, 'uncommented')?.forEach((propNode) => {
		// check self first, then go up the component inheritance chain
		const comments =
			getCommentForProp(componentName, propNode.getName()) ??
			getPropCommentInParents(componentName, propNode.getName());

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
let totalPropsFixed = 0;

const componentNames = getAllLibComponentNames();

console.log(`Healing missing prop comments for ${componentNames.length} components...`);

// Order doesn't matter since going up the chain is consistent
componentNames.forEach((componentName) => {
	verbose && console.log(`Adding missing prop comments for "${componentName}"`);
	totalPropsFixed += inheritPropCommentsAndSave(componentName);
});

console.log(
	`Done. Found and fixed ${totalPropsFixed} missing .d.ts component prop JSDoc annotations.`
);
