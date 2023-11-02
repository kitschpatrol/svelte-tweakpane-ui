export function linkify(str: string) {
	return str.replaceAll(/<([A-Z]\w+)>/g, '<a href="/docs/components/$1">&lt;$1&gt;</a>');
}
