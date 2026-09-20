import { nanoid } from 'nanoid'

const INTERACTIVE_SELECTOR = 'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
// Pane and folder title bars and tab buttons serve as both the label and the only control.
const TITLE_BAR_SELECTOR = ':scope > :is(.tp-rotv_b, .tp-fldv_b, .tp-tbiv_b)'
const WHITESPACE_PATTERN = /\s+/v
const TIME_UNIT_PATTERN = /m?s$/v

function removeDescriptionId(element: HTMLElement, id: string) {
	const ids = element.getAttribute('aria-describedby')?.split(WHITESPACE_PATTERN) ?? []
	const remaining = ids.filter((candidate) => candidate.length > 0 && candidate !== id)
	if (remaining.length > 0) {
		element.setAttribute('aria-describedby', remaining.join(' '))
	} else {
		element.toggleAttribute('aria-describedby', false)
	}
}

function findLabel(root: HTMLElement) {
	// Tweakpane retains the old text when it hides a label by changing this class.
	const label = root.classList.contains('tp-lblv-nol')
		? undefined
		: root.querySelector<HTMLElement>(':scope > .tp-lblv_l')
	const content = label?.textContent
	return content === undefined || content.length === 0 ? undefined : (label ?? undefined)
}

function createDescription(root: HTMLElement, text: string) {
	const document = root.ownerDocument
	const tooltip = document.createElement('div')
	tooltip.className = 'stui-description'
	tooltip.id = `stui-description-${nanoid()}`
	tooltip.setAttribute('role', 'tooltip')
	tooltip.textContent = text
	tooltip.popover = 'hint'
	if (tooltip.popover !== 'hint') {
		// An auto popover could close unrelated popovers just by hovering a label.
		tooltip.popover = 'manual'
	}

	root.append(tooltip)
	root.dataset.stuiDescription = ''

	let label: HTMLElement | undefined
	let describedElements = new Set<HTMLElement>()
	let hovered = false
	let dismissed = false
	let cursorX = 0
	let showTimer: ReturnType<typeof setTimeout> | undefined
	let hideTimer: ReturnType<typeof setTimeout> | undefined
	let layoutFrame: number | undefined
	const listeners = new AbortController()
	const options = { signal: listeners.signal }

	function cancelShow() {
		clearTimeout(showTimer)
		showTimer = undefined
	}

	function hide() {
		cancelShow()
		clearTimeout(hideTimer)
		if (layoutFrame !== undefined) {
			cancelAnimationFrame(layoutFrame)
			layoutFrame = undefined
		}

		if (tooltip.matches(':popover-open')) {
			tooltip.hidePopover()
		}
	}

	function positionCaret() {
		if (!tooltip.matches(':popover-open')) {
			return
		}

		const bounds = tooltip.getBoundingClientRect()
		const sourceBounds = (label ?? root).getBoundingClientRect()
		const paneScale = Number(getComputedStyle(tooltip).getPropertyValue('--stui-pane-scale'))
		const scale = paneScale > 0 ? paneScale : 1
		tooltip.dataset.stuiPlacement = bounds.top >= sourceBounds.bottom ? 'below' : 'above'
		tooltip.style.setProperty(
			'--stui-description-caret-offset',
			`${(cursorX - bounds.left) / scale}px`,
		)
	}

	function fitTooltip() {
		if (!tooltip.matches(':popover-open')) {
			return
		}

		// Let CSS balance the text at its natural/max width before fitting the box to its lines.
		tooltip.style.removeProperty('--stui-description-width')
		const style = getComputedStyle(tooltip)
		const naturalWidth = Number(style.width.replace('px', ''))
		const scale = tooltip.getBoundingClientRect().width / naturalWidth
		const range = document.createRange()
		range.selectNodeContents(tooltip)
		const textWidth = range.getBoundingClientRect().width / scale
		const padding =
			Number(style.paddingLeft.replace('px', '')) + Number(style.paddingRight.replace('px', ''))
		// Round up so fractional glyph widths cannot cause an extra line, but keep CSS's width cap.
		const width = Math.min(naturalWidth, Math.ceil(textWidth + padding))
		tooltip.style.setProperty('--stui-description-width', `${width}px`)
		positionCaret()
	}

	function scheduleLayout() {
		if (layoutFrame === undefined && tooltip.matches(':popover-open')) {
			// ResizeObserver callbacks must not resize their own observed element in the same frame.
			layoutFrame = requestAnimationFrame(() => {
				layoutFrame = undefined
				fitTooltip()
			})
		}
	}

	function isHoverTarget(target: EventTarget | undefined) {
		return target instanceof Node && (tooltip.contains(target) || (label ?? root).contains(target))
	}

	function leave() {
		if (!hovered) {
			return
		}

		hovered = false
		dismissed = false
		cancelShow()
		// Give the pointer time to cross between the label and the tooltip,
		// independently of fade animations and reduced-motion preferences.
		hideTimer = setTimeout(hide, 150)
	}

	function handleMouse(event: MouseEvent) {
		if (!isHoverTarget(event.target ?? undefined)) {
			leave()
			return
		}

		hovered = true
		clearTimeout(hideTimer)
		if (event.buttons !== 0 || document.pointerLockElement !== null) {
			hide()
			return
		}

		if (dismissed || tooltip.matches(':popover-open')) {
			return
		}

		cursorX = event.clientX
		if (showTimer !== undefined) {
			return
		}

		// The registered CSS time property resolves calc() and var() before parsing.
		const delay = getComputedStyle(tooltip).getPropertyValue('--stui-description-delay').trim()
		const milliseconds =
			Number(delay.replace(TIME_UNIT_PATTERN, '')) * (delay.endsWith('ms') ? 1 : 1000)
		showTimer = setTimeout(() => {
			showTimer = undefined
			if (!root.isConnected || document.pointerLockElement !== null) {
				return
			}

			// Native hint popovers do this themselves. Also keep the manual fallback exclusive.
			for (const other of document.querySelectorAll<HTMLElement>(
				'.stui-description:popover-open',
			)) {
				other.hidePopover()
			}

			// Pin the horizontal offset to the pointer's position when the tooltip opens.
			tooltip.style.setProperty('--stui-description-cursor-x', `${cursorX}px`)
			tooltip.showPopover({ source: label ?? root })
			fitTooltip()
		}, milliseconds)
	}

	root.addEventListener('mouseover', handleMouse, options)
	root.addEventListener('mousemove', handleMouse, options)
	root.addEventListener(
		'mouseout',
		(event) => {
			if (!isHoverTarget(event.relatedTarget ?? undefined)) {
				leave()
			}
		},
		options,
	)
	document.addEventListener(
		'mousedown',
		(event) => {
			if (event.target instanceof Node && tooltip.contains(event.target)) {
				return
			}

			dismissed = hovered
			hide()
		},
		options,
	)
	document.addEventListener(
		'keydown',
		(event) => {
			if (event.key !== 'Escape') {
				return
			}

			dismissed = hovered
			cancelShow()
			if (tooltip.popover === 'manual' && tooltip.matches(':popover-open')) {
				event.preventDefault()
				hide()
			}
		},
		options,
	)
	document.addEventListener(
		'pointerlockchange',
		() => {
			if (document.pointerLockElement !== null) {
				hide()
			}
		},
		options,
	)
	// eslint-disable-next-line unicorn/prefer-observer-apis -- Intersection changes do not detect every anchor-position flip.
	document.addEventListener('scroll', positionCaret, { ...options, capture: true })
	document.defaultView?.addEventListener('resize', scheduleLayout, options)
	document.fonts.addEventListener('loadingdone', scheduleLayout, options)

	function sync() {
		const titleBar = root.querySelector<HTMLElement>(TITLE_BAR_SELECTOR) ?? undefined
		const anchor = titleBar ?? findLabel(root)
		if (label !== anchor) {
			hide()
			label = anchor
		}

		// A title bar describes itself, not the blades nested inside its container.
		const nextElements = new Set<HTMLElement>(
			titleBar === undefined
				? root.querySelectorAll<HTMLElement>(INTERACTIVE_SELECTOR)
				: [titleBar],
		)
		for (const control of describedElements) {
			if (!nextElements.has(control)) {
				removeDescriptionId(control, tooltip.id)
			}
		}

		for (const control of nextElements) {
			const ids =
				control.getAttribute('aria-describedby')?.split(WHITESPACE_PATTERN).filter(Boolean) ?? []
			if (!ids.includes(tooltip.id)) {
				control.setAttribute('aria-describedby', [...ids, tooltip.id].join(' '))
			}
		}

		describedElements = nextElements
	}

	sync()
	// Tweakpane can replace label text and plugin controls without recreating the blade.
	const observer = new MutationObserver((records) => {
		// Ignore our own sizing and caret styles, while still handling description text changes.
		if (records.every((record) => record.type === 'attributes' && record.target === tooltip)) {
			return
		}

		sync()
		scheduleLayout()
	})
	observer.observe(root, {
		attributeFilter: ['class', 'style'],
		characterData: true,
		childList: true,
		subtree: true,
	})
	// A larger inherited width limit or a new font may not resize an already fitted tooltip.
	for (let ancestor = root.parentElement; ancestor !== null; ancestor = ancestor.parentElement) {
		observer.observe(ancestor, { attributeFilter: ['class', 'style'] })
	}

	const resizeObserver = new ResizeObserver(scheduleLayout)
	resizeObserver.observe(tooltip, { box: 'border-box' })
	resizeObserver.observe(root.closest('.svelte-tweakpane-ui') ?? root)

	return {
		destroy() {
			observer.disconnect()
			resizeObserver.disconnect()
			listeners.abort()
			hide()
			for (const control of describedElements) {
				removeDescriptionId(control, tooltip.id)
			}

			tooltip.remove()
			delete root.dataset.stuiDescription
		},
		tooltip,
	}
}

/** Owns a description across reactive updates and Tweakpane blade replacements. */
export class DescriptionController {
	private description: ReturnType<typeof createDescription> | undefined
	private root: HTMLElement | undefined

	public destroy() {
		this.description?.destroy()
		this.description = undefined
		this.root = undefined
	}

	public update(root: HTMLElement, description: string | undefined) {
		if (description === undefined || description.length === 0) {
			this.destroy()
			return
		}

		if (this.root !== root) {
			this.destroy()
		}

		this.root = root
		if (this.description === undefined) {
			this.description = createDescription(root, description)
		} else {
			this.description.tooltip.textContent = description
		}
	}
}
