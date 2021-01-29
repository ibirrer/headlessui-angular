import { ChangeDetectorRef, Directive, ElementRef, EmbeddedViewRef, EventEmitter, Input, NgModule, OnInit, Output, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core'
import { generateId } from '../util'



/// LISTBOX - Spec: https://www.w3.org/TR/wai-aria-practices-1.2/#Listbox


@Directive({
    selector: '[hlListbox]',
    exportAs: '[hlListbox]'
})
export class ListboxDirective<T> {
    @Input()
    static = false

    @Input()
    value: T | null = null

    @Output()
    valueChange: EventEmitter<T | null> = new EventEmitter()


    expanded = false
    windowClickUnlisten!: (() => void)

    listboxButton!: ListboxButtonDirective
    listboxOptionsPanel!: ListboxOptionsPanelDirective
    listboxOptions: ListboxOptionDirective<T>[] = []
    activeOption: ListboxOptionDirective<T> | null = null
    searchQuery = ''
    searchDebounce: ReturnType<typeof setTimeout> | null = null

    constructor(
        private renderer: Renderer2,
        private changeDetection: ChangeDetectorRef) {
    }

    toggle(focusAfterExpand: FocusType<T> | null = null, focusButtonOnClose = true) {
        if (this.expanded) {
            // close options panel
            this.expanded = false
            this.listboxOptionsPanel.collapse()
            this.listboxButton.element.removeAttribute('aria-controls')
            this.listboxButton.element.removeAttribute('expanded')
            this.listboxOptions = []
            this.activeOption = null
            this.windowClickUnlisten()
            if (focusButtonOnClose) {
                this.listboxButton.focus()
            }
            this.changeDetection.markForCheck()
        } else {
            // open options panel
            this.expanded = true
            this.changeDetection.markForCheck()

            setTimeout(() => {
                this.listboxOptionsPanel.expand()
                this.listboxOptionsPanel.focus()
                if (this.listboxOptionsPanel.element != null) {
                    this.listboxButton.element.setAttribute('aria-controls', this.listboxOptionsPanel.element.id)
                }
                this.listboxButton.element.setAttribute('expanded', 'true')
                this.windowClickUnlisten = this.initListeners()
                if (focusAfterExpand) {
                    setTimeout(() => this.focusOption(focusAfterExpand))
                }
            })
        }
    }


    select(value: T | null) {
        this.valueChange.emit(value)
        this.listboxOptions.forEach(option => {
            option.select(option.hlListboxOptionValue === value)
        })
    }

    isSelected(value: T | null): boolean {
        return this.value === value
    }


    focusOption(focusType: FocusType<T>) {
        const activeOption = this.calculateFocusedOption(focusType)
        if (activeOption === this.activeOption) {
            return
        }
        this.activeOption = activeOption
        this.listboxOptions.forEach(option => {
            if (this.activeOption) {
                this.listboxOptionsPanel.element?.setAttribute('aria-activedescendant', this.activeOption.element.id)
            } else {
                this.listboxOptionsPanel.element?.removeAttribute('aria-activedescendant')
            }
            option.setActive(option === this.activeOption)
        })
    }

    clickActive() {
        this.activeOption?.element.click()
    }

    search(value: string) {
        if (this.searchDebounce) {
            clearTimeout(this.searchDebounce)
        }
        this.searchDebounce = setTimeout(() => this.searchQuery = '', 350)

        this.searchQuery += value.toLocaleLowerCase()
        const matchingOption = this.listboxOptions.find(
            option => {
                const optionText = option.element.textContent?.trim().toLocaleLowerCase()
                return optionText?.startsWith(this.searchQuery) && !option.hlListboxOptionDisabled
            }
        )

        if (matchingOption === undefined || matchingOption === this.activeOption) {
            return
        }

        this.focusOption({ kind: 'FocusSpecific', option: matchingOption })
    }


    private calculateFocusedOption(focusType: FocusType<T>): ListboxOptionDirective<T> | null {
        const enabledOptions = this.listboxOptions.filter(option => !option.hlListboxOptionDisabled)

        switch (focusType.kind) {
            case 'FocusSpecific':
                return focusType.option

            case 'FocusValue':
                const option = this.listboxOptions.find((o => o.hlListboxOptionValue === focusType.value))
                if (option) {
                    return option
                }
                return null

            case 'FocusNothing':
                return null

            case 'FocusFirst':
                return enabledOptions[0]

            case 'FocusLast':
                return enabledOptions[enabledOptions.length - 1]

            case 'FocusNext':
                if (this.activeOption === null) {
                    return enabledOptions[0]
                } else {
                    const nextIndex = Math.min(enabledOptions.indexOf(this.activeOption) + 1, enabledOptions.length - 1)
                    return enabledOptions[nextIndex]
                }

            case 'FocusPrevious':
                if (this.activeOption === null) {
                    return enabledOptions[enabledOptions.length - 1]
                } else {
                    const previousIndex = Math.max(enabledOptions.indexOf(this.activeOption) - 1, 0)
                    return enabledOptions[previousIndex]
                }
        }
    }

    private initListeners(): (() => void) {
        return this.renderer.listen(window, 'click', (event: MouseEvent) => {
            const target = event.target as HTMLElement
            const active = document.activeElement

            if (this.listboxButton.element.contains(target)
                || this.listboxOptionsPanel?.element?.contains(target)) {
                return
            }

            const clickedTargetIsFocusable =
                active !== document.body
                && active?.contains(target)

            // do not focus button if the clicked element is itself focusable
            this.toggle(null, !clickedTargetIsFocusable)
        })
    }
}



// LISTBOX OPTION BUTTON


@Directive({
    selector: '[hlListboxButton]'
})
export class ListboxButtonDirective implements OnInit {
    element!: HTMLElement

    constructor(
        elementRef: ElementRef,
        private listbox: ListboxDirective<any>,
        private renderer: Renderer2) {
        this.element = elementRef.nativeElement
        listbox.listboxButton = this
    }

    ngOnInit(): void {
        this.initAttributes(this.element)

        this.renderer.listen(this.element, 'click', () => {
            this.listbox.toggle()
        })

        this.renderer.listen(
            this.element,
            'keydown',
            (event: KeyboardEvent) => {
                switch (event.key) {
                    case ' ': // Space
                    case 'Enter':
                    case 'ArrowDown':
                        event.preventDefault()
                        if (this.listbox.value) {
                            this.listbox.toggle({ kind: 'FocusValue', value: this.listbox.value })
                        } else {
                            this.listbox.toggle({ kind: 'FocusFirst' })
                        }
                        break

                    case 'ArrowUp':
                        event.preventDefault()
                        if (this.listbox.value) {
                            this.listbox.toggle({ kind: 'FocusValue', value: this.listbox.value })
                        } else {
                            this.listbox.toggle({ kind: 'FocusPrevious' })
                        }
                        break
                }
            }
        )
    }

    focus() {
        setTimeout(() => this.element?.focus())
    }

    private initAttributes(element: HTMLElement) {
        element.id = `headlessui-listbox-button-${generateId()}`
        element.setAttribute('type', 'button')
        element.setAttribute('aria-haspopup', 'true')
    }
}



/// LISTBOX OPTIONS PANEL


@Directive({
    selector: '[hlListboxOptions]'
})
export class ListboxOptionsPanelDirective implements OnInit {
    element: HTMLElement | null = null

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainerRef: ViewContainerRef,
        private listbox: ListboxDirective<any>,
        private renderer: Renderer2) {
        this.listbox.listboxOptionsPanel = this
    }

    ngOnInit(): void {
        if (this.listbox.static) {
            this.expandInternal()
        }
    }

    expand() {
        if (!this.listbox.static) {
            this.expandInternal()
        }
    }

    collapse() {
        if (!this.listbox.static) {
            this.viewContainerRef.clear()
            this.element = null
        }
    }

    focus() {
        this.element?.focus({ preventScroll: true })
    }

    private expandInternal() {
        const view = this.viewContainerRef.createEmbeddedView(this.templateRef)
        const element = view.rootNodes[0]
        this.initAttributes(element)
        this.initListeners(element)
        this.element = element
        view.markForCheck()
    }

    private initAttributes(element: HTMLElement) {
        element.tabIndex = -1
        element.id = `headlessui-listbox-options-${generateId()}`
        element.setAttribute('role', 'listbox')
        element.setAttribute('aria-labelledby', this.listbox.listboxButton.element.id)
    }

    private initListeners(element: HTMLElement) {
        this.renderer.listen(
            element,
            'keydown',
            (event: KeyboardEvent) => {
                switch (event.key) {
                    case ' ': // Space
                        if (this.listbox.searchQuery !== '') {
                            event.preventDefault()
                            this.listbox.search(event.key)
                        } else {
                            event.preventDefault()
                            this.listbox.clickActive()
                        }
                        break
                    case 'Enter':
                        event.preventDefault()
                        this.listbox.clickActive()
                        break

                    case 'ArrowDown':
                        event.preventDefault()
                        this.listbox.focusOption({ kind: 'FocusNext' })
                        break

                    case 'ArrowUp':
                        event.preventDefault()
                        this.listbox.focusOption({ kind: 'FocusPrevious' })
                        break

                    case 'Home':
                    case 'PageUp':
                        event.preventDefault()
                        this.listbox.focusOption({ kind: 'FocusFirst' })
                        break

                    case 'End':
                    case 'PageDown':
                        event.preventDefault()
                        this.listbox.focusOption({ kind: 'FocusLast' })
                        break

                    case 'Escape':
                        event.preventDefault()
                        this.listbox.toggle()
                        break

                    case 'Tab':
                        event.preventDefault()
                        break

                    default:
                        if (event.key.length === 1) {
                            this.listbox.search(event.key)
                        }
                }
            }
        )
    }
}




// LISTBOX OPTION


@Directive({
    selector: '[hlListboxOption]'
})
export class ListboxOptionDirective<T> implements OnInit {

    @Input()
    hlListboxOptionDisabled = false

    @Input()
    hlListboxOptionValue: T | null = null

    element!: HTMLElement
    context = { active: false, selected: false }

    private view!: EmbeddedViewRef<any>

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainerRef: ViewContainerRef,
        private listbox: ListboxDirective<T>,
        private renderer: Renderer2) {
        this.listbox.listboxOptions.push(this)
    }

    ngOnInit(): void {
        this.context.selected = this.listbox.isSelected(this.hlListboxOptionValue)
        this.view = this.viewContainerRef.createEmbeddedView(this.templateRef, { $implicit: this.context })
        this.element = this.view.rootNodes[0]
        this.initAttributes(this.element)
        this.initListeners(this.element)
    }

    setActive(active: boolean) {
        this.context.active = active
        this.view.markForCheck()
    }

    select(selected: boolean) {
        this.context.selected = selected
        this.view.markForCheck()
    }

    private initAttributes(element: HTMLElement) {
        element.id = `headlessui-listbox-option-${generateId()}`
        element.tabIndex = -1
        element.setAttribute('role', 'listboxoption')
        if (this.hlListboxOptionDisabled) {
            this.element.setAttribute('aria-disabled', 'true')
        } else {
            this.element.removeAttribute('aria-disabled')
        }
    }

    private initListeners(element: HTMLElement) {
        this.renderer.listen(
            element,
            'pointermove',
            () => this.listbox.focusOption({ kind: 'FocusSpecific', option: this })
        )

        this.renderer.listen(
            element,
            'pointerleave',
            () => this.listbox.focusOption({ kind: 'FocusNothing' })
        )

        this.renderer.listen(
            element,
            'click',
            (event) => {
                if (this.hlListboxOptionDisabled) {
                    event.preventDefault()
                    return
                }
                this.listbox.select(this.hlListboxOptionValue)
                this.listbox.toggle()
            }
        )
    }
}


type FocusFirst = { kind: 'FocusFirst' }
type FocusLast = { kind: 'FocusLast' }
type FocusPrevious = { kind: 'FocusPrevious' }
type FocusNext = { kind: 'FocusNext' }
type FocusNothing = { kind: 'FocusNothing' }
type FocusSpecific<T> = { kind: 'FocusSpecific'; option: ListboxOptionDirective<T> }
type FocusValue<T> = { kind: 'FocusValue'; value: T }

type FocusType<T> =
    | FocusFirst
    | FocusLast
    | FocusPrevious
    | FocusNext
    | FocusNothing
    | FocusSpecific<T>
    | FocusValue<T>




@NgModule({
    imports: [],
    exports: [ListboxDirective, ListboxButtonDirective, ListboxOptionsPanelDirective, ListboxOptionDirective],
    declarations: [ListboxDirective, ListboxButtonDirective, ListboxOptionsPanelDirective, ListboxOptionDirective],
    providers: []
})
export class ListboxModule { }
