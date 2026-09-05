import { nanoid } from 'nanoid'

// cspell:words describedby

const HIDE_DELAY = 100
const SHOW_DELAY = 500
const INTERACTIVE_SELECTOR = 'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
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
	private anchorHovered = false
	private describedElements = new Set<HTMLElement>()
	private descriptionElement: HTMLElement | undefined
	private focusWithin = false
	private hideTimer: ReturnType<typeof setTimeout> | undefined
	private observer: MutationObserver | undefined
	private popoverHovered = false
	private root: HTMLElement | undefined
	private showTimer: ReturnType<typeof setTimeout> | undefined

	public destroy() {
		this.clearTimers()

		this.anchor?.removeEventListener('pointerenter', this.handleAnchorPointerEnter)
		this.anchor?.removeEventListener('pointerleave', this.handleAnchorPointerLeave)
		this.descriptionElement?.removeEventListener('pointerenter', this.handlePopoverPointerEnter)
		this.descriptionElement?.removeEventListener('pointerleave', this.handlePopoverPointerLeave)
		this.root?.removeEventListener('focusin', this.handleFocusIn)
		this.root?.removeEventListener('focusout', this.handleFocusOut)
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
		this.anchorHovered = false
		this.describedElements.clear()
		this.descriptionElement = undefined
		this.focusWithin = false
		this.observer = undefined
		this.popoverHovered = false
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

	private clearHideTimer() {
		if (this.hideTimer === undefined) {
			return
		}

		clearTimeout(this.hideTimer)
		this.hideTimer = undefined
	}

	private clearTimers() {
		this.clearHideTimer()
		if (this.showTimer !== undefined) {
			clearTimeout(this.showTimer)
			this.showTimer = undefined
		}
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
		descriptionElement.addEventListener('pointerenter', this.handlePopoverPointerEnter)
		descriptionElement.addEventListener('pointerleave', this.handlePopoverPointerLeave)
		this.root.addEventListener('focusin', this.handleFocusIn)
		this.root.addEventListener('focusout', this.handleFocusOut)

		this.syncDescribedElements()
		this.observer = new MutationObserver(() => {
			this.syncAnchor()
			this.syncDescribedElements()
		})
		this.observer.observe(this.root, { childList: true, subtree: true })
	}

	private readonly handleAnchorPointerEnter = () => {
		this.anchorHovered = true
		this.scheduleShow()
	}

	private readonly handleAnchorPointerLeave = () => {
		this.anchorHovered = false
		this.scheduleHide()
	}

	private readonly handleFocusIn = () => {
		this.focusWithin = true
		this.show()
	}

	private readonly handleFocusOut = (event: FocusEvent) => {
		if (event.relatedTarget instanceof Node && this.root?.contains(event.relatedTarget)) {
			return
		}

		this.focusWithin = false
		this.scheduleHide()
	}

	private readonly handlePopoverPointerEnter = () => {
		this.popoverHovered = true
		this.clearHideTimer()
	}

	private readonly handlePopoverPointerLeave = () => {
		this.popoverHovered = false
		this.scheduleHide()
	}

	private hide() {
		if (
			this.descriptionElement !== undefined &&
			typeof this.descriptionElement.hidePopover === 'function' &&
			this.descriptionElement.matches(':popover-open')
		) {
			this.descriptionElement.hidePopover()
		}
	}

	private scheduleHide() {
		this.clearHideTimer()
		this.hideTimer = setTimeout(() => {
			if (!this.anchorHovered && !this.focusWithin && !this.popoverHovered) {
				this.hide()
			}
		}, HIDE_DELAY)
	}

	private scheduleShow() {
		this.clearTimers()
		this.showTimer = setTimeout(() => {
			this.show()
		}, SHOW_DELAY)
	}

	private show() {
		this.clearTimers()

		if (
			this.anchor === undefined ||
			this.descriptionElement === undefined ||
			typeof this.descriptionElement.showPopover !== 'function' ||
			this.descriptionElement.matches(':popover-open')
		) {
			return
		}

		this.descriptionElement.showPopover({ source: this.anchor })
	}

	private syncAnchor() {
		if (this.root === undefined) {
			return
		}

		const label = this.root.querySelector<HTMLElement>('.tp-lblv_l')
		const hasLabel = label !== null && label.textContent.length > 0
		const nextAnchor = hasLabel ? label : this.root

		if (nextAnchor === this.anchor) {
			return
		}

		this.hide()
		this.anchor?.removeEventListener('pointerenter', this.handleAnchorPointerEnter)
		this.anchor?.removeEventListener('pointerleave', this.handleAnchorPointerLeave)
		this.anchorHovered = false
		this.anchor = nextAnchor
		this.anchor.addEventListener('pointerenter', this.handleAnchorPointerEnter)
		this.anchor.addEventListener('pointerleave', this.handleAnchorPointerLeave)
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
