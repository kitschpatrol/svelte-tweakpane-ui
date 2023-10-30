import fs from 'fs';
import path from 'path';

import { getExportedComponents } from './ast-tools';
import { getComponentInfo } from './component-info';

// figures out prop data from src components
// and writes out a json file for each

// would rather do this in docs/+page.server.ts, but can't get the svelte-language-server modules to load there

async function generateComponentData(
	componentName: string,
	componentPath: string,
	destination: string
): Promise<boolean> {
	const unaliasedPath = componentPath.replace('$lib', './src/lib');
	const componentInfo = await getComponentInfo(unaliasedPath);

	if (componentInfo) {
		// overwrites existing, creates intermediate directories
		const resolvedPath = path.resolve(`${destination}/${componentName}.json`);
		fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
		fs.writeFileSync(resolvedPath, JSON.stringify(componentInfo, null, 2));
		return true;
	} else {
		return false;
	}
}

// main
let totalComponentsGenerated = 0;

const components = getExportedComponents('./src/lib/index.ts');
const destination = './src/lib-docs/generated/data';

console.log(`Generating documentation data for ${components.length} components...`);

if (fs.existsSync(destination)) {
	console.log(`Removing existing component documentation data at "${destination}"...`);
	fs.rmSync(destination, { recursive: true });
}

components.forEach(async ({ name, path }) => {
	if (await generateComponentData(name, path, destination)) {
		totalComponentsGenerated++;
	} else {
		console.warn(`Issue generating component data for "${name}.svelte"`);
	}
});

console.log(
	`Done. Created ${totalComponentsGenerated} component docunmentation data files in "${destination}" .`
);
