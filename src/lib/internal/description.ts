import { nanoid } from 'nanoid'

// cspell:words describedby

const INTERACTIVE_SELECTOR = 'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
const HOVER_DELAY_MS = 500
const POINTER_GAP_PX = 16
const VIEWPORT_MARGIN_PX = 8
const WHITESPACE_PATTERN = /\s+/v

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
	private managedTitle?: { element: HTMLElement; originalTitle?: string; value: string }
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

		this.removeManagedTitle()

		this.anchor = undefined
		this.describedElements.clear()
		this.descriptionElement = undefined
		this.hoverTimer = undefined
		this.observer = undefined
		this.pointerPosition = undefined
		this.root = undefined
		this.managedTitle = undefined
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
			this.setManagedTitle(description)
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
		this.clearHoverTimer()

		const window = this.root?.ownerDocument.defaultView
		if (window === null || window === undefined) {
			return
		}

		this.hoverTimer = window.setTimeout(() => {
			this.hoverTimer = undefined
			this.showAtPointer()
		}, HOVER_DELAY_MS)
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
		if (this.descriptionElement?.matches(':popover-open') !== true) {
			this.pointerPosition = { x: event.clientX, y: event.clientY }
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

	private removeManagedTitle() {
		if (this.managedTitle === undefined) {
			return
		}

		const { element, originalTitle, value } = this.managedTitle
		// Leave a title alone if application code replaced the fallback while the
		// description was active.
		if (element.getAttribute('title') !== value) {
			return
		}

		if (originalTitle === undefined) {
			element.toggleAttribute('title', false)
		} else {
			element.setAttribute('title', originalTitle)
		}
	}

	private setManagedTitle(description: string) {
		if (this.anchor === undefined) {
			return
		}

		this.managedTitle ??= {
			element: this.anchor,
			originalTitle: this.anchor.getAttribute('title') ?? undefined,
			value: description,
		}
		this.managedTitle.value = description
		this.managedTitle.element.setAttribute('title', description)
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
		this.descriptionElement.showPopover({ source })
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
		this.descriptionElement.dataset.stuiPointer = ''
		this.descriptionElement.style.left = `${x}px`
		this.descriptionElement.style.top = `${y + POINTER_GAP_PX}px`
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
		const left = Math.min(Math.max(VIEWPORT_MARGIN_PX, x), maximumLeft)
		const preferredTop = y + POINTER_GAP_PX
		const flippedTop = y - bounds.height - POINTER_GAP_PX
		const top = Math.min(
			Math.max(VIEWPORT_MARGIN_PX, preferredTop > maximumTop ? flippedTop : preferredTop),
			maximumTop,
		)

		this.descriptionElement.style.left = `${left}px`
		this.descriptionElement.style.top = `${top}px`
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
			this.removeManagedTitle()
			this.managedTitle = undefined
			this.anchor = nextAnchor
			this.anchor.addEventListener('mouseenter', this.handleMouseEnter)
			this.anchor.addEventListener('mouseleave', this.handleMouseLeave)
			this.anchor.addEventListener('mousemove', this.handleMouseMove)

			if (this.descriptionElement !== undefined) {
				this.setManagedTitle(this.descriptionElement.textContent)
			}
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
