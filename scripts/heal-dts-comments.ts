import { Project, type PropertySignature } from 'ts-morph';
import ts from 'typescript';
import { globSync } from 'glob';
import path from 'path';

// works around https://github.com/sveltejs/language-tools/issues/2186 by
// manually adding missing prop comments from ancestor components
// should run after build, before publish
// will modify the .d.ts files in dist

// should be idempotent

// TODO handle dynamic components like Pane and Monitor

// extra logging
const verbose = false;

// Helpers

// will break if multiple components with the same name exist
function findFile(base: string, componentName: string, suffix: string): string {
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

// Utilities

// gets all props for a given component from its definition file
function getPropsForComponent(componentName: string): PropertySignature[] | undefined {
	const project = new Project();
	const sourceFile = project.addSourceFileAtPath(findDefinitionFile(componentName));

	// paranoid version
	// return sourceFile
	// .getVariableDeclaration('__propDef')
	// ?.getFirstDescendant((n) => {
	//   return n.isKind(ts.SyntaxKind.PropertySignature) && n.getText().startsWith('props');
	// })
	// ?.getDescendantsOfKind(ts.SyntaxKind.PropertySignature);

	return sourceFile
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

			// const firstMethodDeclarationAncestor = prop.getFirstAncestorByKind(
			// 	ts.SyntaxKind.MethodDeclaration
			// );
			// firstMethodDeclarationAncestor === undefined ||
			// firstMethodDeclarationAncestor.getText().startsWith('props')

			return (
				firstPropertySignatureAncestor === undefined ||
				firstPropertySignatureAncestor.getText().startsWith('props')
			);
		});
}

// looks at use of ComponentProps in $$Props interface to find the name of the component that is extended
function getParentComponent(componentName: string): string | undefined {
	// TODO support type in addition to interface
	const project = new Project();
	const sourceFile = project.addSourceFileAtPath(findSourceFile(componentName));

	return sourceFile
		.getInterface('$$Props')
		?.getFirstDescendant((n) => {
			return (
				(n.isKind(ts.SyntaxKind.TypeReference) ||
					n.isKind(ts.SyntaxKind.ExpressionWithTypeArguments)) &&
				n.getText().startsWith('ComponentProps')
			);
		})
		?.getFirstDescendantByKind(ts.SyntaxKind.TypeReference)
		?.getFirstDescendantByKind(ts.SyntaxKind.Identifier)
		?.getText();
}

// pass the component with the missing prop, looks up hierarchy
// could be more efficient
function findPropComment(componentName: string, propName: string): string | undefined {
	const parentName = getParentComponent(componentName);

	verbose && console.log(`Looking for ${propName} in ${componentName} with parent ${parentName}`);

	if (parentName !== undefined) {
		const parentProp = getPropsForComponent(parentName)?.find((parentProp) => {
			return parentProp.getName() === propName;
		});

		if (parentProp !== undefined && parentProp.getJsDocs().length > 0) {
			return parentProp.getJsDocs()[0].getCommentText();
		} else {
			// recurse and look up the chain
			verbose && console.log(`Going up the chain from ${parentName}`);
			return findPropComment(parentName, propName);
		}
	} else {
		console.warn(
			`No doc comment found in final parent, add comment to prop "${propName}" in ${findSourceFile(
				componentName
			)}>`
		);
		return;
	}
}

// sets the prop comments for a given component in its definition file
function setPropsForComponent(componentName: string, props: PropertySignature[]) {
	const project = new Project();
	const sourceFile = project.addSourceFileAtPath(findDefinitionFile(componentName));

	// paranoid version
	// return sourceFile
	// .getVariableDeclaration('__propDef')
	// ?.getFirstDescendant((n) => {
	//   return n.isKind(ts.SyntaxKind.PropertySignature) && n.getText().startsWith('props');
	// })
	// ?.getDescendantsOfKind(ts.SyntaxKind.PropertySignature);

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
			const matchingProp = props.find((p) => p.getName() === prop.getName());
			if (matchingProp !== undefined && matchingProp.getJsDocs().length > 0) {
				if (prop.getJsDocs().length === 0) {
					prop.addJsDoc(matchingProp.getJsDocs()[0].getCommentText()!);
				}
			} else {
				console.error(`No matching prop found for ${prop.getName()}`);
			}
		});

	sourceFile.saveSync();
}

// rewrites the component's definition file with the comments from the parent as needed
function inheritPropCommentsAndSave(componentName: string) {
	const ammendedProps = getPropsForComponent(componentName);

	if (ammendedProps !== undefined) {
		ammendedProps.forEach((prop) => {
			if (prop.getJsDocs().length > 0) {
				verbose && console.log(`Have comment for ${prop.getName()}`);
			} else {
				const parentComment = findPropComment(componentName, prop.getName());

				if (parentComment !== undefined) {
					verbose &&
						console.log(`Adding comment from parent "${componentName}" for "${prop.getName()}"`);
					prop.addJsDoc(parentComment);
					// TODO add @default annotation?
				} else {
					// warning logging handled in findPropComment
				}
			}
		});

		setPropsForComponent(componentName, ammendedProps);
	} else {
		console.warn(`No props found for ${componentName}`);
	}
}

// Main

// Run on all components found in dist
globSync('./dist/**/*.svelte.d.ts').forEach((file) => {
	const componentName = path.basename(file).replace('.svelte.d.ts', '');
	verbose && console.log(`Adding missing prop comments for "${componentName}"`);
	inheritPropCommentsAndSave(componentName);
});

// inheritPropCommentsAndSave('Point');
// inheritPropCommentsAndSave('Checkbox');

// getPropsForComponent('Point')?.forEach((prop) => {
// 	console.log(prop.getName());
// 	// if (prop.getJsDocs().length > 0) {
// 	// 	console.log(prop.getJsDocs()[0].getCommentText());
// 	// }
// });
