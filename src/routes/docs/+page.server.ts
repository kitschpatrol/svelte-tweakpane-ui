// import { error } from '@sveltejs/kit';
// import type { PageServerLoad } from './$types';
export const prerender = true;

// import fs from 'fs';

// import * as cp from 'child_process';
// import { MessageReader, MessageWriter } from 'vscode-jsonrpc';
// import type {
// 	MessageConnection,
// 	InitializeParams,
// 	TextDocumentItem,
// 	DocumentSymbolParams
// } from 'vscode-languageserver-protocol';
// import { createConnection, MessageReader, MessageWriter } from 'vscode-languageserver';
// import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
// import type { InitializeParams, TextDocumentItem, DocumentSymbolParams } from 'vscode-languageserver-protocol';

// async function getDocumentSymbols(fileUri: string, fileContent: string): Promise<any> {
// 	return new Promise((resolve, reject) => {
// 		// Start the language server as a child process

// 				const lspProcess: ChildProcessWithoutNullStreams = spawn('typescript-language-server', ['--stdio=pipe']);

// 				// Create the message reader and writer
// 				const reader: MessageReader = new MessageReader(lspProcess.stdout);
// 				const writer: MessageWriter = new MessageWriter(lspProcess.stdin);

// 				// Create the JSON-RPC connection
// 				const connection = createConnection(reader, writer);

// 				// Listen to the connection
// 				connection.listen();

// 				// Initialize the language server
// 				const initParams: InitializeParams = {
// 					processId: process.pid,
// 					rootPath: '/',
// 					capabilities: {}
// 				};
// 				connection.sendNotification('initialize', initParams);

// 				// Open a TypeScript document
// 				const docItem: TextDocumentItem = {
// 					uri: fileUri,
// 					languageId: 'typescript',
// 					version: 1,
// 					text: fileContent
// 				};
// 				connection.sendNotification('textDocument/didOpen', { textDocument: docItem });

// 				// Request document symbols after a delay (letting the language server process the document)
// 				setTimeout(() => {
// 					const docSymbolParams: DocumentSymbolParams = {
// 						textDocument: {
// 							uri: fileUri
// 						}
// 					};
// 					connection
// 						.sendRequest('textDocument/documentSymbol', docSymbolParams)
// 						.then((symbols) => {
// 							// Close the TypeScript document
// 							connection.sendNotification('textDocument/didClose', {
// 								textDocument: {
// 									uri: fileUri
// 								}
// 							});

// 							// Politely shut down the language server
// 							connection.sendNotification('shutdown');
// 							lspProcess.kill();

// 							resolve(symbols);
// 						})
// 						.catch(reject);
// 				}, 1000);
// 			});
// 		}

// 		// thanks gpt
// 		type PropInfo = {
// 			doc: string;
// 			name: string;
// 			type: string;
// 			defaultValue: string;
// 		};

// 		type Result = {
// 			props: PropInfo[];
// 			doc: string;
// 			example: string;
// 		};

// 		function extractComponentInfo(source: string): Result {
// 			const lines = source.split('\n');
// 			const props: PropInfo[] = [];
// 			const doc: string[] = [];
// 			const example: string[] = [];
// 			let insideDoc = false;
// 			let insideExample = false;

// 			for (let i = 0; i < lines.length; i++) {
// 				const line = lines[i].trim();

// 				if (line.startsWith('@component')) {
// 					insideDoc = true;
// 				} else if (line.startsWith('-->')) {
// 					insideDoc = false;
// 					continue;
// 				}

// 				if (insideDoc) {
// 					if (insideExample) {
// 						example.push(line);
// 					} else {
// 						if (line.startsWith('Example:')) {
// 							insideExample = true;
// 							example.push(line);
// 						} else {
// 							doc.push(line);
// 						}
// 					}
// 				}
// 			}
// 			return { props, doc: doc.join('\n'), example: example.join('\n') };
// 		}

// 		// Open a TypeScript document
// 		const docItem: TextDocumentItem = {
// 			uri: fileUri,
// 			languageId: 'typescript',
// 			version: 1,
// 			text: fileContent
// 		};
// 		connection.sendNotification('textDocument/didOpen', { textDocument: docItem });

// 		// Request document symbols after a delay (letting the language server process the document)
// 		setTimeout(() => {
// 			const docSymbolParams: DocumentSymbolParams = {
// 				textDocument: {
// 					uri: fileUri
// 				}
// 			};
// 			connection
// 				.sendRequest('textDocument/documentSymbol', docSymbolParams)
// 				.then((symbols) => {
// 					// Close the TypeScript document
// 					connection.sendNotification('textDocument/didClose', {
// 						textDocument: {
// 							uri: fileUri
// 						}
// 					});

// 					// Politely shut down the language server
// 					connection.sendNotification('shutdown');
// 					lspProcess.kill();

// 					resolve(symbols);
// 				})
// 				.catch(reject);
// 		}, 1000);
// 	});
// }

// // thanks gpt
// type PropInfo = {
// 	doc: string;
// 	name: string;
// 	type: string;
// 	defaultValue: string;
// };

// type Result = {
// 	props: PropInfo[];
// 	doc: string;
// 	example: string;
// };

// function extractComponentInfo(source: string): Result {
// 	const lines = source.split('\n');
// 	const props: PropInfo[] = [];
// 	const doc: string[] = [];
// 	const example: string[] = [];
// 	let insideDoc = false;
// 	let insideExample = false;

// 	for (let i = 0; i < lines.length; i++) {
// 		const line = lines[i].trim();

// 		if (line.startsWith('@component')) {
// 			insideDoc = true;
// 		} else if (line.startsWith('-->')) {
// 			insideDoc = false;
// 			continue;
// 		}

// 		if (insideDoc) {
// 			if (insideExample) {
// 				example.push(line);
// 			} else {
// 				if (line.startsWith('Example:')) {
// 					insideExample = true;
// 					example.push(line);
// 				} else {
// 					doc.push(line);
// 				}
// 			}
// 		} else if (line.startsWith('/**')) {
// 			let propDoc = '';

// 			if (line.endsWith('*/')) {
// 				propDoc = line.replace('/**', '').replace('*/', '').trim();
// 				i++;
// 			} else {
// 				i++;

// 				while (!lines[i].trim().endsWith('*/')) {
// 					propDoc += lines[i].trim().replace('*', '').trim() + ' ';
// 					i++;
// 				}
// 			}

// 			const propDeclaration = lines[i].trim();
// 			const propMatch = propDeclaration.match(/export let (\w+): ([\w| ]+)( = (.*))?;/);

// 			if (propMatch) {
// 				const [, propName, propType, , defaultValue] = propMatch;

// 				props.push({
// 					doc: propDoc.trim(),
// 					name: propName,
// 					type: propType.trim(),
// 					defaultValue: defaultValue ? defaultValue : 'undefined'
// 				});
// 			}
// 		}
// 	}

// 	return {
// 		props,
// 		doc: doc.join('\n').trim(),
// 		example: example.join('\n').trim()
// 	};
// }

// export const load: PageServerLoad = async ({ params }) => {
// 	console.log(params);

// 	const components: any[] = [];
// 	const base = './src/lib/core';

// 	fs.readdirSync(base).forEach((file) => {
// 		const componentText = fs.readFileSync(`${base}/${file}`, 'utf8');

// 		components.push({
// 			name: file,
// 			meta: extractComponentInfo(componentText)
// 		});
// 	});

// 	if (components.length > 0) {
// 		return {
// 			components
// 		};
// 	}

// 	throw error(404, 'Not found');
// };
