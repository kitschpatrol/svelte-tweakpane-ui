/* eslint-disable ts/no-unsafe-member-access */
/* eslint-disable ts/no-unsafe-argument */
import { slug } from 'github-slugger'
import type { ComponentData } from '../utils/prop-utilities'
import { allProps } from '../utils/prop-utilities'
import { defineDomMiddleware } from './dom-middleware'
import { linkifyTerms } from './utilities'

export const automaticPropLinks = defineDomMiddleware((context, document) => {
	const componentData = context.props.entry?.data?.componentData as ComponentData
	if (componentData) {
		const props = allProps(context.props.entry.data.componentData)

		// eslint-disable-next-line unicorn/no-array-reduce
		const propLinks = props.reduce<Record<string, string>>((acc, prop) => {
			acc[prop.name] = `#${slug(prop.name)}`
			return acc
		}, {})

		for (const element of document.querySelectorAll('code')) {
			linkifyTerms(element, propLinks)
		}
	}

	return document
})
