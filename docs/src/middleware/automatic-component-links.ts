import { defineDomMiddleware } from './dom-middleware'
import { linkifyTerms } from './utilities'
const { BASE_URL: baseUrl } = import.meta.env
import { getCollection } from 'astro:content'

const documentationCollection = await getCollection('docs')
// eslint-disable-next-line unicorn/no-array-reduce
const componentLinks = documentationCollection.reduce<Record<string, string>>((acc, component) => {
	if (component.data.componentData !== undefined) {
		acc[component.data.componentData.name] = component.id
	}

	return acc
}, {})

export const automaticComponentLinks = defineDomMiddleware((context, document) => {
	// Filter out own page
	// eslint-disable-next-line unicorn/no-array-reduce
	const componentLinksNotSelf = Object.entries(componentLinks).reduce<Record<string, string>>(
		(acc, [componentName, componentId]) => {
			if (context.props.id !== componentId) {
				acc[`<${componentName}>`] = componentId
			}

			return acc
		},
		{},
	)

	for (const element of document.querySelectorAll('code')) {
		linkifyTerms(element, componentLinksNotSelf, baseUrl)
	}

	return document
})
