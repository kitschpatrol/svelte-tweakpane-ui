import {
	format,
	getExportedComponents,
	getGithubUrlForSourceFile,
	getLastUpdatedDate
} from './ast-tools';
import { ComponentDynamicPropTest, getComponentInfo } from './component-info';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

// figures out prop data from src components
// and writes out a json and / or markdown file with the prop info in the frontmatter for each

async function generateComponentData(
	componentName: string,
	componentPath: string,
	destination: string,
	outputFormat: 'json' | 'mdx', // must match file extension
	testProps?: ComponentDynamicPropTest[] | undefined
): Promise<boolean> {
	const expandedPath = componentPath.replace('$lib', './src/lib');

	const componentInfo = await getComponentInfo(expandedPath, testProps);

	if (componentInfo) {
		// overwrites existing, creates intermediate directories
		const resolvedPath = path.resolve(`${destination}/${componentName}.${outputFormat}`);
		fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });

		let content: string;
		switch (outputFormat) {
			case 'mdx':
				{
					// Add some extra metadata for Astro
					// The shape of this object needs to be coordinated with the Astro
					// frontmatter schema definitions in docs/src/content/config.ts
					const frontmatter = {
						componentData: componentInfo,
						editUrl: false,
						lastUpdated: (await getLastUpdatedDate(expandedPath)) ?? false,
						note: `Generated by generate-doc-data.ts from JSDoc information in "${expandedPath}" at ${new Date().toISOString()}. Do not edit directly.`,
						sourceUrl: getGithubUrlForSourceFile(expandedPath),
						title: componentName
					};

					content = `---\n${YAML.stringify(frontmatter, {
						toStringDefaults: {
							// defaultStringType: 'QUOTE_DOUBLE',
							lineWidth: 0
						}
					})}---\n`;

					// Embed example component so we don't have to load it dynamically so that it can prerender to avoid cls
					content += `\nimport Example from '../../../../examples/components/${componentName}Example.svelte';\n`;
					content += `\n<Example client:load />\n`;

					// this would be nicer to lay out in astro, but looking for ways around
					// around https://github.com/withastro/astro/issues/5084
					// if (componentInfo.doc.length > 0) {
					// 	content += `## Overview\n\n`;
					// 	content += `<slot slot="overview" name="overview">overview fallback</slot>\n\n`;
					// }
					// if (componentInfo.jsDocs['example']) {
					// 	content += `## Example\n\n`;
					// 	content += `<slot slot="example" name="example">example fallback</slot>\n\n`;
					// }
					// if (componentInfo.props.length > 0) {
					// 	content += `## Props\n\n`;
					// 	content += `<slot slot="props" name="props">props fallback</slot>\n\n`;
					// }
					// if (componentInfo.events.length > 0) {
					// 	content += `## Events\n\n`;
					// 	content += `<slot slot="events" name="events">events fallback</slot>\n\n`;
					// }
					// if (componentInfo.slots.length > 0) {
					// 	content += `## Slots\n\n`;
					// 	content += `<slot slot="slots" name="slots">slots fallback</slot>\n\n`;
					// }
				}
				break;
			case 'json':
				content = await format(JSON.stringify(componentInfo, null, 2), 'json');
				break;
		}

		fs.writeFileSync(resolvedPath, content);

		return true;
	} else {
		return false;
	}
}

// main
let totalComponentsGenerated = 0;

const components = getExportedComponents('./src/lib/index.ts');
const destination = './docs/src/content/docs/docs/components';

console.log(`Generating documentation data for ${components.length} components...`);

if (fs.existsSync(destination)) {
	console.log(`Removing existing component documentation data at "${destination}"...`);
	fs.rmSync(destination, { recursive: true });
}

for (const { name, path } of components) {
	// TODO this is not pretty
	// Pass custom dynamic prop test cases to certain components
	let testProps: ComponentDynamicPropTest[] | undefined = undefined;

	if (name === 'Pane') {
		testProps = [
			{
				condition: {
					position: 'draggable'
				},
				description: 'position is draggable'
			},
			{
				condition: {
					position: 'inline'
				},
				description: 'position is inline'
			},
			{
				condition: {
					position: 'fixed'
				},
				description: 'position is fixed'
			}
		];
	}

	if (name === 'Monitor') {
		testProps = [
			{
				condition: {
					value: 1
				},
				description: 'value is number'
			},
			{
				condition: {
					value: false
				},
				description: 'value is boolean'
			},
			{
				condition: {
					value: 'i am a string'
				},
				description: 'value is string'
			}
		];
	}

	if (name === 'Point') {
		testProps = [
			{
				condition: {
					value: '{[0, 0]}'
				},
				description: 'value is 2D'
			},
			{
				condition: {
					value: '{[0, 0, 0]}'
				},
				description: 'value is 3D'
			},
			{
				condition: {
					value: '{[0, 0, 0, 0]}'
				},
				description: 'value is 4D'
			}
		];
	}

	const success = await generateComponentData(name, path, destination, 'mdx', testProps);

	if (success) {
		totalComponentsGenerated++;
	} else {
		console.warn(`Issue generating component data for "${name}.svelte"`);
	}
}

console.log(
	`Done. Created ${totalComponentsGenerated} component documentation ${format} files in "${destination}" .`
);
