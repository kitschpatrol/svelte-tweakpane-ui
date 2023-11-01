type NestedObject = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
};

export function walkNestedObject(
	obj: NestedObject,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	callback: (value: any, key: string, parentObj: NestedObject, path: string[]) => void,
	path: string[] = []
) {
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			const newPath = [...path, key];
			const value = obj[key];

			// Apply the callback to the current value
			callback(value, key, obj, newPath);

			if (typeof value === 'object' && value !== null) {
				// Recurse if the value is another object
				walkNestedObject(value, callback, newPath);
			}
		}
	}
}
