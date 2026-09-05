import { nanoid } from 'nanoid'

// cspell:words contenteditable describedby

const INTERACTIVE_SELECTOR = 'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
const CARET_EDGE_INSET_PX = 4
const CARET_OFFSET_PX = 8
const HOVER_DELAY_MS = 500
const TEXT_CURSOR_GAP_PX = 16
const TOP_HOTSPOT_CURSOR_GAP_PX = 24
const VIEWPORT_MARGIN_PX = 8
const WHITESPACE_PATTERN = /\s+/v

const TEXT_INPUT_TYPES = new Set(['email', 'number', 'password', 'search', 'tel', 'text', 'url'])

function parseCssDuration(value: string, fallback: number) {
	const duration = value.trim()
	if (duration === '0') {
		return 0
	}

	const unitLength = duration.endsWith('ms') ? 2 : duration.endsWith('s') ? 1 : 0
	if (unitLength === 0) {
		return fallback
	}

	const parsed = Number(duration.slice(0, -unitLength))
	if (!Number.isFinite(parsed) || parsed < 0) {
		return fallback
	}

	return duration.endsWith('ms') ? parsed : parsed * 1000
}

function parseCssPixels(value: string) {
	return value.endsWith('px') ? Number(value.slice(0, -2)) : NaN
}

function paneScale(element: HTMLElement) {
	const value = Number(
		element.ownerDocument.defaultView
			?.getComputedStyle(element)
			.getPropertyValue('--stui-pane-scale'),
	)
	return Number.isFinite(value) && value > 0 ? value : 1
}

function visibleInlineBounds(element: HTMLElement) {
	const window = element.ownerDocument.defaultView
	const style = window?.getComputedStyle(element)
	if (style === undefined || style.overflowX === 'visible') {
		return
	}

	const bounds = element.getBoundingClientRect()
	const scale = paneScale(element)
	return {
		left:
			bounds.left +
			(parseCssPixels(style.borderLeftWidth) + parseCssPixels(style.paddingLeft)) * scale,
		right:
			bounds.right -
			(parseCssPixels(style.borderRightWidth) + parseCssPixels(style.paddingRight)) * scale,
	}
}

function removeDescriptionId(element: HTMLElement, id: string) {
	const ids =
		element.getAttribute('aria-describedby')?.split(WHITESPACE_PATTERN).filter(Boolean) ?? []
	const nextIds = ids.filter((candidate) => candidate !== id)

	if (nextIds.length === 0) {
		element.toggleAttribute('aria-describedby', false)
	} else {
		element.setAttribute('aria-describedby', nextIds.join(' '))
	}
}

/** Adds an accessible, Popover API-powered description to a Tweakpane blade. */
export class DescriptionController {
	private anchor: HTMLElement | undefined
	private describedElements = new Set<HTMLElement>()
	private descriptionElement: HTMLElement | undefined
	private hoverTimer: number | undefined
	private observer: MutationObserver | undefined
	private pointerPosition: undefined | { x: number; y: number }
	private root: HTMLElement | undefined

	public destroy() {
		this.clearHoverTimer()
		this.anchor?.removeEventListener('mouseenter', this.handleMouseEnter)
		this.anchor?.removeEventListener('mouseleave', this.handleMouseLeave)
		this.anchor?.removeEventListener('mousemove', this.handleMouseMove)
		this.descriptionElement?.removeEventListener('mouseleave', this.handleDescriptionMouseLeave)
		this.root?.removeEventListener('focusin', this.handleFocusIn)
		this.root?.removeEventListener('focusout', this.handleFocusOut)
		this.root?.removeEventListener('mousedown', this.handleMouseDown)
		this.observer?.disconnect()

		if (this.descriptionElement !== undefined) {
			for (const element of this.describedElements) {
				removeDescriptionId(element, this.descriptionElement.id)
			}
		}

		this.descriptionElement?.remove()
		if (this.root !== undefined) {
			delete this.root.dataset.stuiDescription
		}

		this.anchor = undefined
		this.describedElements.clear()
		this.descriptionElement = undefined
		this.hoverTimer = undefined
		this.observer = undefined
		this.pointerPosition = undefined
		this.root = undefined
	}

	public update(root: HTMLElement, description: string | undefined) {
		if (this.root !== root) {
			this.destroy()
			this.root = root
		}

		if (description === undefined || description.length === 0) {
			this.destroy()
			return
		}

		if (this.descriptionElement === undefined) {
			this.create(description)
		} else {
			this.descriptionElement.textContent = description
			this.syncAnchor()
		}
	}

	private clearHoverTimer() {
		if (this.hoverTimer === undefined) {
			return
		}

		this.root?.ownerDocument.defaultView?.clearTimeout(this.hoverTimer)
		this.hoverTimer = undefined
	}

	private create(description: string) {
		if (this.root === undefined) {
			return
		}

		const descriptionElement = this.root.ownerDocument.createElement('div')
		descriptionElement.classList.add('stui-description')
		descriptionElement.id = `stui-description-${nanoid()}`
		descriptionElement.setAttribute('role', 'tooltip')
		descriptionElement.textContent = description

		if (typeof descriptionElement.showPopover === 'function') {
			descriptionElement.setAttribute('popover', 'hint')
		} else {
			// Keep the text available to aria-describedby without displaying a
			// misplaced element in browsers that do not support the Popover API.
			descriptionElement.hidden = true
		}

		this.root.dataset.stuiDescription = ''
		this.root.append(descriptionElement)
		this.descriptionElement = descriptionElement

		this.syncAnchor()
		descriptionElement.addEventListener('mouseleave', this.handleDescriptionMouseLeave)
		this.root.addEventListener('focusin', this.handleFocusIn)
		this.root.addEventListener('focusout', this.handleFocusOut)
		this.root.addEventListener('mousedown', this.handleMouseDown)

		this.syncDescribedElements()
		this.observer = new MutationObserver(() => {
			this.syncAnchor()
			this.syncDescribedElements()
		})
		this.observer.observe(this.root, { childList: true, subtree: true })
	}

	private readonly handleDescriptionMouseLeave = (event: MouseEvent) => {
		if (event.relatedTarget instanceof Node && this.anchor?.contains(event.relatedTarget)) {
			return
		}

		this.hide()
	}

	private readonly handleFocusIn = (event: FocusEvent) => {
		if (!(event.target instanceof HTMLElement)) {
			return
		}

		// Match GitHub's behavior: pointer focus stays quiet, while keyboard focus
		// reveals the description. webdriver keeps programmatic focus testable.
		if (
			this.root?.ownerDocument.defaultView?.navigator.webdriver === true ||
			event.target.matches(':focus-visible')
		) {
			this.show(event.target)
		}
	}

	private readonly handleFocusOut = (event: FocusEvent) => {
		if (event.relatedTarget instanceof Node && this.root?.contains(event.relatedTarget)) {
			return
		}

		this.hide()
	}

	private readonly handleMouseDown = (event: MouseEvent) => {
		if (event.target instanceof Node && this.descriptionElement?.contains(event.target) === true) {
			return
		}

		this.hide()
	}

	private readonly handleMouseEnter = (event: MouseEvent) => {
		this.pointerPosition = { x: event.clientX, y: event.clientY }
		if (!this.isPointerOverAnchorText(event.clientX, event.clientY)) {
			this.hide()
			return
		}

		this.startHoverTimer()
	}

	private readonly handleMouseLeave = (event: MouseEvent) => {
		if (
			event.relatedTarget instanceof Node &&
			this.descriptionElement?.contains(event.relatedTarget) === true
		) {
			return
		}

		this.hide()
	}

	private readonly handleMouseMove = (event: MouseEvent) => {
		this.pointerPosition = { x: event.clientX, y: event.clientY }
		if (!this.isPointerOverAnchorText(event.clientX, event.clientY)) {
			this.hide()
			return
		}

		if (
			this.descriptionElement?.matches(':popover-open') !== true &&
			this.hoverTimer === undefined
		) {
			this.startHoverTimer()
		}
	}

	private hide() {
		this.clearHoverTimer()

		if (
			this.descriptionElement !== undefined &&
			typeof this.descriptionElement.hidePopover === 'function' &&
			this.descriptionElement.matches(':popover-open')
		) {
			this.descriptionElement.hidePopover()
		}
	}

	private isPointerOverAnchorText(x: number, y: number) {
		return (
			this.anchor === this.root ||
			this.isPointerOverGeneratedContent(this.anchor, x, y) ||
			this.isPointerOverText(this.anchor, x, y)
		)
	}

	private isPointerOverGeneratedContent(element: HTMLElement | undefined, x: number, y: number) {
		const window = element?.ownerDocument.defaultView
		if (element === undefined || window === null || window === undefined) {
			return false
		}

		const style = window.getComputedStyle(element, '::after')
		const inset = parseCssPixels(style.right)
		const width = parseCssPixels(style.width)
		if (
			!Number.isFinite(inset) ||
			!Number.isFinite(width) ||
			style.content === 'none' ||
			style.position !== 'absolute'
		) {
			return false
		}

		const bounds = element.getBoundingClientRect()
		const scale = paneScale(element)
		const right = bounds.right - inset * scale
		return x >= right - width * scale && x <= right && y >= bounds.top && y <= bounds.bottom
	}

	private isPointerOverText(element: HTMLElement | undefined, x: number, y: number) {
		if (element === undefined) {
			return false
		}

		const clipBounds = visibleInlineBounds(element)
		const walker = element.ownerDocument.createTreeWalker(element, NodeFilter.SHOW_TEXT)
		while (walker.nextNode()) {
			const node = walker.currentNode
			if (node.textContent?.trim().length === 0) {
				continue
			}

			const range = element.ownerDocument.createRange()
			range.selectNodeContents(node)
			for (const bounds of range.getClientRects()) {
				const left = clipBounds === undefined ? bounds.left : Math.max(bounds.left, clipBounds.left)
				const right =
					clipBounds === undefined ? bounds.right : Math.min(bounds.right, clipBounds.right)
				if (x >= left && x <= right && y >= bounds.top && y <= bounds.bottom) {
					return true
				}
			}
		}

		return false
	}

	private pointerGapAt(element: Element | undefined, cursor: string, x: number, y: number) {
		const cursorKeyword = cursor.slice(cursor.lastIndexOf(',') + 1).trim()
		if (cursorKeyword === 'text' || cursorKeyword === 'vertical-text') {
			return TEXT_CURSOR_GAP_PX
		}

		if (cursorKeyword !== 'auto' || element === undefined) {
			return TOP_HOTSPOT_CURSOR_GAP_PX
		}

		const inputType = element.localName === 'input' ? (element.getAttribute('type') ?? 'text') : ''
		if (
			element.localName === 'textarea' ||
			TEXT_INPUT_TYPES.has(inputType.toLowerCase()) ||
			element.closest('[contenteditable]:not([contenteditable="false"])') !== null
		) {
			return TEXT_CURSOR_GAP_PX
		}

		// `cursor: auto` resolves to an I-beam only over rendered text, even when
		// the surrounding label box displays an arrow cursor.
		return this.isPointerOverText(this.anchor, x, y)
			? TEXT_CURSOR_GAP_PX
			: TOP_HOTSPOT_CURSOR_GAP_PX
	}

	private positionCaret(originX: number, placement: 'above' | 'below') {
		if (this.descriptionElement === undefined) {
			return
		}

		const bounds = this.descriptionElement.getBoundingClientRect()
		const scale = paneScale(this.descriptionElement)
		const maximumOffset = Math.max(CARET_EDGE_INSET_PX, bounds.width / scale - CARET_EDGE_INSET_PX)
		const originOffset = (originX - bounds.left) / scale
		const offset = Math.min(Math.max(CARET_EDGE_INSET_PX, originOffset), maximumOffset)

		this.descriptionElement.dataset.stuiPlacement = placement
		this.descriptionElement.style.setProperty('--stui-description-caret-offset', `${offset}px`)
	}

	private setViewportMaxWidth() {
		if (this.descriptionElement === undefined) {
			return
		}

		const window = this.descriptionElement.ownerDocument.defaultView
		if (window === null) {
			return
		}

		const availableWidth =
			(window.innerWidth - VIEWPORT_MARGIN_PX * 2) / paneScale(this.descriptionElement)
		this.descriptionElement.style.setProperty(
			'--stui-description-viewport-max-width',
			`${availableWidth}px`,
		)
	}

	private show(source: HTMLElement | undefined) {
		this.clearHoverTimer()

		if (
			source === undefined ||
			this.descriptionElement === undefined ||
			typeof this.descriptionElement.showPopover !== 'function' ||
			this.descriptionElement.matches(':popover-open')
		) {
			return
		}

		this.descriptionElement.toggleAttribute('data-stui-pointer', false)
		this.descriptionElement.style.removeProperty('left')
		this.descriptionElement.style.removeProperty('top')
		this.setViewportMaxWidth()
		this.descriptionElement.showPopover({ source })

		const descriptionBounds = this.descriptionElement.getBoundingClientRect()
		const sourceBounds = source.getBoundingClientRect()
		this.positionCaret(
			sourceBounds.left + sourceBounds.width / 2,
			descriptionBounds.top >= sourceBounds.bottom ? 'below' : 'above',
		)
	}

	private showAtPointer() {
		if (
			this.descriptionElement === undefined ||
			this.pointerPosition === undefined ||
			typeof this.descriptionElement.showPopover !== 'function' ||
			this.descriptionElement.matches(':popover-open')
		) {
			return
		}

		const window = this.descriptionElement.ownerDocument.defaultView
		if (window === null) {
			return
		}

		const { x, y } = this.pointerPosition
		const hoveredElement = this.descriptionElement.ownerDocument.elementFromPoint(x, y)
		const cursor = hoveredElement === null ? '' : window.getComputedStyle(hoveredElement).cursor
		const pointerGap = this.pointerGapAt(hoveredElement ?? undefined, cursor, x, y)
		const scale = paneScale(this.descriptionElement)
		this.descriptionElement.dataset.stuiPointer = ''
		this.descriptionElement.style.left = `${x - CARET_OFFSET_PX * scale}px`
		this.descriptionElement.style.top = `${y + pointerGap}px`
		this.setViewportMaxWidth()
		this.descriptionElement.showPopover()

		const bounds = this.descriptionElement.getBoundingClientRect()
		const maximumLeft = Math.max(
			VIEWPORT_MARGIN_PX,
			window.innerWidth - bounds.width - VIEWPORT_MARGIN_PX,
		)
		const maximumTop = Math.max(
			VIEWPORT_MARGIN_PX,
			window.innerHeight - bounds.height - VIEWPORT_MARGIN_PX,
		)
		const left = Math.min(Math.max(VIEWPORT_MARGIN_PX, x - CARET_OFFSET_PX * scale), maximumLeft)
		const preferredTop = y + pointerGap
		const flippedTop = y - bounds.height - pointerGap
		const placement = preferredTop > maximumTop ? 'above' : 'below'
		const top = Math.min(
			Math.max(VIEWPORT_MARGIN_PX, placement === 'above' ? flippedTop : preferredTop),
			maximumTop,
		)

		this.descriptionElement.style.left = `${left}px`
		this.descriptionElement.style.top = `${top}px`
		this.positionCaret(x, placement)
	}

	private startHoverTimer() {
		this.clearHoverTimer()

		const window = this.root?.ownerDocument.defaultView
		if (window === null || window === undefined) {
			return
		}

		const delay =
			this.root === undefined
				? HOVER_DELAY_MS
				: parseCssDuration(
						window.getComputedStyle(this.root).getPropertyValue('--stui-description-delay'),
						HOVER_DELAY_MS,
					)

		this.hoverTimer = window.setTimeout(() => {
			this.hoverTimer = undefined
			this.showAtPointer()
		}, delay)
	}

	private syncAnchor() {
		if (this.root === undefined) {
			return
		}

		const label = this.root.querySelector<HTMLElement>('.tp-lblv_l')
		const hasLabel = label !== null && label.textContent.length > 0
		const nextAnchor = hasLabel ? label : this.root

		if (nextAnchor !== this.anchor) {
			this.hide()
			this.anchor?.removeEventListener('mouseenter', this.handleMouseEnter)
			this.anchor?.removeEventListener('mouseleave', this.handleMouseLeave)
			this.anchor?.removeEventListener('mousemove', this.handleMouseMove)
			this.anchor = nextAnchor
			this.anchor.addEventListener('mouseenter', this.handleMouseEnter)
			this.anchor.addEventListener('mouseleave', this.handleMouseLeave)
			this.anchor.addEventListener('mousemove', this.handleMouseMove)
		}
	}

	private syncDescribedElements() {
		if (this.root === undefined || this.descriptionElement === undefined) {
			return
		}

		const nextElements = new Set(this.root.querySelectorAll<HTMLElement>(INTERACTIVE_SELECTOR))

		for (const element of this.describedElements) {
			if (!nextElements.has(element)) {
				removeDescriptionId(element, this.descriptionElement.id)
			}
		}

		for (const element of nextElements) {
			const ids =
				element.getAttribute('aria-describedby')?.split(WHITESPACE_PATTERN).filter(Boolean) ?? []
			if (!ids.includes(this.descriptionElement.id)) {
				element.setAttribute('aria-describedby', [...ids, this.descriptionElement.id].join(' '))
			}
		}

		this.describedElements = nextElements
	}
}
