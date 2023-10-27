import { join } from 'path';
import { Document, DocumentManager } from 'svelte-language-server/dist/src/lib/documents';
import { LSConfigManager } from 'svelte-language-server/dist/src/ls-config';
import { LSAndTSDocResolver } from 'svelte-language-server/dist/src/plugins/typescript/LSAndTSDocResolver';
import {
	CompletionsProviderImpl,
	type CompletionEntryWithIdentifier
} from 'svelte-language-server/dist/src/plugins/typescript/features/CompletionProvider';
import { pathToUrl } from 'svelte-language-server/dist/src/utils';
import type { AppCompletionItem } from 'svelte-language-server/dist/src/plugins/interfaces';
import ts from 'typescript';

import { getExportedComponents } from './ast-tools';

// generate a svelte component that imports and uses all components, then
// figure out its props via the language server
// this is an ugly workaround since calculating the final visibility of all props
// with the complexity of Omit<> and ComponentProps<> proved more difficult than
// just asking the language server what it already knows

const exportedComponents = getExportedComponents('./src/lib/index.ts');
const testSourceRows = [
	'<script>',
	...exportedComponents.map((component) => {
		// only works with $lib, not a relative path??
		return `import ${component.name} from '${component.path.replace('./', '$lib/')}'`;
	}),
	'</script>',
	...exportedComponents.map((component) => {
		return `<${component.name} />`;
	})
];

// set up language server
const testDir = '.';
const docManager = new DocumentManager(
	(textDocument) => new Document(textDocument.uri, textDocument.text)
);
const lsConfigManager = new LSConfigManager();
const lsAndTsDocResolver = new LSAndTSDocResolver(
	docManager,
	[pathToUrl(testDir)],
	lsConfigManager,
	{ tsconfigPath: join(testDir, 'tsconfig.json') }
);

const completionProvider = new CompletionsProviderImpl(lsAndTsDocResolver, lsConfigManager);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const document = docManager.openClientDocument(<any>{
	uri: 'file:///inmemory.svelte',
	text: testSourceRows.join('\n')
});

function getTestPosition(componentName: string): { line: number; character: number } {
	for (const [index, row] of testSourceRows.entries()) {
		if (row.startsWith(`<${componentName} `)) {
			return { line: index, character: row.indexOf('/') };
		}
	}
	console.warn(`No test position found for ${componentName}.`);
	return { line: 0, character: 0 };
}

async function getCompletionsForComponent(componentName: string): Promise<string[]> {
	const { items } = (await completionProvider.getCompletions(
		document,
		getTestPosition(componentName),
		{
			triggerKind: ts.CompletionTriggerKind.TriggerCharacter,
			triggerCharacter: '.'
		}
	)) ?? { items: [] };

	return items.map((item: AppCompletionItem<CompletionEntryWithIdentifier>) => {
		// documentation doesn't seem to be consistently available...
		// will get it from the definition files instead
		return item.label;
	});
}

// find completions for all component props
const propData: unknown[] = [];
for (const component of exportedComponents) {
	propData.push({
		...component,
		props: await getCompletionsForComponent(component.name)
	});
}

// TODO add the rest of the metadata
console.log(JSON.stringify(propData, null, 2));

/* now generate the rest of the data json
- more prop data
-rendered markdown from the component's readme
- example code
*/
