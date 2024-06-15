import { allProps } from '../utils/prop-utils';
import { defineDomMiddleware } from './dom-middleware';
import { linkifyTerms } from './utilities';
import { slug } from 'github-slugger';

export const automaticPropLinks = defineDomMiddleware((context, document) => {
	const componentData = context?.props?.entry?.data?.componentData;
	if (componentData) {
		const props = allProps(context.props.entry.data.componentData);

		const propLinks = props.reduce<Record<string, string>>((acc, prop) => {
			acc[prop.name] = `#${slug(prop.name)}`;
			return acc;
		}, {});

		for (const element of document.querySelectorAll('code')) {
			linkifyTerms(element, propLinks);
		}
	}

	return document;
});
