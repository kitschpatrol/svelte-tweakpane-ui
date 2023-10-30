import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { startCase } from 'lodash-es';
import type { ComponentInfo } from '$lib-docs/types/ComponentInfo';

// function extractTsxContent(inputString: string): string | undefined {
// 	const regex = /```tsx([\s\S]+?)```/gm;
// 	const match = regex.exec(inputString);
// 	if (match && match[1]) {
// 		return match[1].trim();
// 	}
// 	return;
// }

export const load: PageServerLoad = async ({ params }) => {
	const components: Record<string, ComponentInfo> = structuredClone(
		import.meta.glob('$lib-docs/generated/data/*.json', {
			eager: true,
			as: 'json'
		})
	);

	const component = Object.values(components).find((component) => {
		return component.name === startCase(params.slug).replace(/ /g, '');
	});

	if (component) {
		// generate example component

		// const exampleComponentSource = extractTsxContent(
		// 	component.jsDocs.find((doc) => doc.name === 'example')?.text?.at(0)?.text ?? ''
		// );

		// const exampleComponent = await import(
		// 	/* @vite-ignore */
		// 	`../../../lib-docs/generated/examples/${component.name}Example.svelte`
		// );

		// console.log(exampleComponent);

		return {
			name: component.name
		};
	} else {
		throw error(404, 'Not found');
	}
};

// type PropInfo = {
// 	name?: string;
// 	type?: string;
// 	description?: string;
// 	remarks?: string;
// 	default?: string;
// };

// type ComponentInfo = {
// 	name?: string;
// 	tags?: {
// 		[key: string]: string | undefined;
// 	};
// 	exampleSource?: {
// 		script?: string;
// 		markup?: string;
// 	};
// 	compiledComponent?: CompileResult;
// 	description?: string;
// 	props?: PropInfo[];
// };

// export const load: PageServerLoad = async ({ params }) => {
// 	console.log(params);

// 	const project = new Project();
// 	project.addSourceFilesAtPaths('dist/**/*{.d.ts,.ts}');
// 	project.resolveSourceFileDependencies();
// 	const indexFile = project.getSourceFileOrThrow('index.d.ts'); // Replace with the correct path to your index.d.ts

// 	indexFile.getExportSymbols().forEach((symbol) => {
// 		symbol.getDeclarations().forEach(() => {});
// 		// declarations in index
// 	});

// 	const buttonFile = project.getSourceFileOrThrow('Button.svelte.d.ts');

// 	function extractScript(inputString: string): string | undefined {
// 		const scriptMatch = inputString.match(/<script[^>]*>([\s\S]*?)<\/script>/);
// 		if (scriptMatch && scriptMatch[1]) {
// 			return scriptMatch[1];
// 		}
// 		return;
// 	}

// 	function extractTsxContent(inputString: string): string | undefined {
// 		const regex = /```tsx([\s\S]+?)```/gm;
// 		const match = regex.exec(inputString);
// 		if (match && match[1]) {
// 			return match[1].trim();
// 		}
// 		return;
// 	}

// 	function isClass(node: Node): boolean {
// 		return node.isKind(ts.SyntaxKind.ClassDeclaration);
// 	}

// 	function isProp(node: Node): boolean {
// 		return node.isKind(ts.SyntaxKind.PropertySignature) &&
// 			node.getFirstAncestor((node) => {
// 				return node.isKind(ts.SyntaxKind.PropertySignature) && node.getName() === 'props';
// 			})
// 			? true
// 			: false;
// 	}

// 	function isEvent(node: Node): boolean {
// 		return node.isKind(ts.SyntaxKind.PropertySignature) &&
// 			node.getFirstAncestor((node) => {
// 				return node.isKind(ts.SyntaxKind.PropertySignature) && node.getName() === 'events';
// 			})
// 			? true
// 			: false;
// 	}

// 	const info: ComponentInfo = {};

// 	buttonFile.getDescendantsOfKind(ts.SyntaxKind.JSDoc).forEach((docNode) => {
// 		// parent of the comment is the thing of interest
// 		const node = docNode.getParent();

// 		// TODO function props
// 		if (isClass(node)) {
// 			const componentClass = node as ClassDeclaration;
// 			info.name = componentClass.getName();

// 			const docs = componentClass.getJsDocs()[0];
// 			info.description = docs.getCommentText();
// 			docs.getTags().forEach((tag) => {
// 				info.tags = {
// 					...(info.tags ?? {}),
// 					...{
// 						[tag.getTagName()]: tag.getCommentText()
// 					}
// 				};
// 			});

// 			const rawSource = extractTsxContent(
// 				docs
// 					.getTags()
// 					.find((tag) => tag.getTagName() === 'example')
// 					?.getCommentText() || ''
// 			);

// 			if (rawSource) {
// 				const markup = rawSource.replace(/<script[^>]*>([\s\S]*?)<\/script>/, '');

// 				info.exampleSource = {
// 					script: extractScript(rawSource),
// 					markup
// 				};

// 				const result = compile(rawSource, {
// 					discloseVersion: false,
// 					hydratable: true,
// 					dev: false,
// 					sveltePath: '/node_modules/svelte/src/runtime'
// 				});
// 				// console.log(result, {});
// 				info.compiledComponent = result;
// 			}
// 		} else if (isProp(node)) {
// 			const prop = node as PropertySignature;
// 			console.log('prop:');
// 			console.log(prop.getName());

// 			const docs = prop.getJsDocs()[0];

// 			info.props = [
// 				...(info.props ?? []),
// 				...[
// 					{
// 						name: prop.getName(),
// 						type: '`' + prop.getType().getText() + '`',
// 						description: docs.getCommentText(),
// 						default: docs
// 							.getTags()
// 							.find((tag) => tag.getTagName() === 'default')
// 							?.getCommentText()
// 					}
// 				]
// 			];
// 		} else if (isEvent(node)) {
// 			console.log();
// 			const event = node as PropertySignature;
// 			console.log('event:');
// 			console.log(event.getName());
// 		}

// 		// Get class

// 		// Get props

// 		// Get slots
// 		// Get Events
// 	});

// 	// // Function to list all imported nodes
// 	// function listAllImports(sourceFile) {

// 	// 	importDeclarations.forEach((importDeclaration) => {
// 	// 		const importModuleSpecifier = importDeclaration.getModuleSpecifierValue();
// 	// 		const namedImports = importDeclaration.getNamedImports();

// 	// 		namedImports.forEach((namedImport) => {
// 	// 			console.log(`Imported: ${namedImport.getName()} from module: ${importModuleSpecifier}`);
// 	// 		});

// 	// 		const defaultImport = importDeclaration.getDefaultImport();
// 	// 		if (defaultImport) {
// 	// 			console.log(
// 	// 				`Default Imported: ${defaultImport.getText()} from module: ${importModuleSpecifier}`
// 	// 			);
// 	// 		}

// 	// 		const namespaceImport = importDeclaration.getNamespaceImport();
// 	// 		if (namespaceImport) {
// 	// 			console.log(
// 	// 				`Namespace Imported: ${namespaceImport.getName()} from module: ${importModuleSpecifier}`
// 	// 			);
// 	// 		}
// 	// 	});
// 	// }

// 	// listAllImports(indexFile);

// 	// console.log(project.getSourceFile(entrypoint));

// 	const components: ComponentInfo[] = [];

// 	components.push(info);

// 	if (components.length > 0) {
// 		return {
// 			components
// 		};
// 	}

// 	throw error(404, 'Not found');
// };
