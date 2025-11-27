import { addLinkPrefix } from './add-link-prefix'
import { automaticComponentLinks } from './automatic-component-links'
import { automaticPropLinks } from './automatic-prop-links'
import { domSequence } from './dom-middleware'
import { externalLinkAnnotator } from './external-link-annotator'
import { stripLinkSuffix } from './strip-link-suffix'

export const onRequest = domSequence(
	externalLinkAnnotator,
	automaticComponentLinks,
	automaticPropLinks,
	addLinkPrefix,
	stripLinkSuffix,
)
