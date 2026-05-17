import { htmlKit } from 'astro-html-kit/middleware'
import { automaticComponentLinks } from './automatic-component-links'
import { automaticPropLinks } from './automatic-prop-links'

export const onRequest = htmlKit({
	addLinkPrefix: true,
	annotateExternalLinks: true,
	customDomHandler: [automaticComponentLinks, automaticPropLinks],
	stripLinkSuffix: true,
})
