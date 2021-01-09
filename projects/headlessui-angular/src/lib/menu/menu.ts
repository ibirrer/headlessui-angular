import { Directive, EmbeddedViewRef, Host, Input, NgModule, OnInit, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { generateId } from './util';



/// MENU


@Directive({
    selector: '[hlMenu]'
})
export class MenuDirective implements OnInit {
    expanded = false;

    view!: EmbeddedViewRef<any>;

    windowClickUnlisten!: (() => void)

    menuButton!: MenuButtonDirective;
    menuItemsPanel!: MenuItemsPanelDirective;
    menuItems: MenuItemDirective[] = []
    activeItem: MenuItemDirective | null = null;

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainerRef: ViewContainerRef,
        private renderer: Renderer2) {
    }

    ngOnInit(): void {
        this.view = this.viewContainerRef.createEmbeddedView(this.templateRef);
    }

    toggle() {
        if (this.expanded) {
            this.expanded = false
            this.menuItemsPanel.collapse()
            this.menuButton.element.removeAttribute('aria-controls')
            this.menuButton.element.removeAttribute('expanded')
            this.menuItems = []
            this.activeItem = null
            this.windowClickUnlisten();
            this.focusButton()
        } else {
            this.expanded = true
            this.menuItemsPanel.expand()
            this.menuItemsPanel.focus()
            if (this.menuItemsPanel.element != null) {
                this.menuButton.element.setAttribute('aria-controls', this.menuItemsPanel.element.id)
            }
            this.menuButton.element.setAttribute('expanded', 'true')
            this.windowClickUnlisten = this.initListeners()
        }
    }

    focusButton() {
        this.menuButton.focus()
    }

    focusItem(focusType: FocusType) {
        const activeItem = this.calculateFocusedItem(focusType)
        if (activeItem === this.activeItem) {
            return
        }
        this.activeItem = activeItem
        this.menuItems.forEach(item => {
            if (this.activeItem) {
                this.menuItemsPanel.element?.setAttribute('aria-activedescendant', this.activeItem.element.id)
            } else {
                this.menuItemsPanel.element?.removeAttribute('aria-activedescendant')
            }
            item.focus(item === this.activeItem)
        });
    }

    clickActive() {
        this.activeItem?.element.click();
    }

    private calculateFocusedItem(focusType: FocusType): MenuItemDirective | null {
        let items;
        switch (focusType.kind) {
            case 'FocusSpecific':
                return focusType.item

            case 'FocusNothing':
                return null

            case 'FocusNext':
                items = this.menuItems.filter(item => !item.hlMenuItemDisabled)
                if (this.activeItem === null) {
                    return items[0];
                } else {
                    let nextIndex = Math.min(items.indexOf(this.activeItem) + 1, items.length - 1);
                    return items[nextIndex];
                }

            case 'FocusPrevious':
                items = this.menuItems.filter(item => !item.hlMenuItemDisabled)
                if (this.activeItem === null) {
                    return items[items.length - 1];
                } else {
                    let previousIndex = Math.max(items.indexOf(this.activeItem) - 1, 0);
                    return items[previousIndex];
                }
        }
    }

    private initListeners(): (() => void) {
        return this.renderer.listen(window, 'click', (event: MouseEvent) => {
            const target = event.target as HTMLElement

            if (this.menuButton.element.contains(target)
                || this.menuItemsPanel?.element?.contains(target)) {
                return;
            }

            this.toggle();
        });
    }
}



// MENU ITEM BUTTON


@Directive({
    selector: '[hlMenuButton]'
})
export class MenuButtonDirective implements OnInit {
    element!: HTMLElement;

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainerRef: ViewContainerRef,
        @Host() private menu: MenuDirective,
        private renderer: Renderer2) {
        menu.menuButton = this;
    }

    ngOnInit(): void {
        const view = this.viewContainerRef.createEmbeddedView(this.templateRef);
        this.element = view.rootNodes[0];
        this.initAttributes(this.element)

        this.renderer.listen(this.element, 'click', () => {
            this.menu.toggle();
        });

        this.renderer.listen(
            this.element,
            'keydown',
            (event: KeyboardEvent) => {
                switch (event.key) {
                    case 'Space':
                    case 'Enter':
                    case 'ArrowDown':
                        event.preventDefault();
                        this.menu.toggle();
                        // delay focus until menu item is initialized
                        setTimeout(() => this.menu.focusItem({ kind: 'FocusNext' }))
                        break;

                    case 'ArrowUp':
                        event.preventDefault();
                        this.menu.toggle();
                        // delay focus until menu item is initialized
                        setTimeout(() => this.menu.focusItem({ kind: 'FocusPrevious' }))
                        break;
                }
            }
        );
    }

    focus() {
        setTimeout(() => this.element?.focus())
    }

    private initAttributes(element: HTMLElement) {
        element.id = `headlessui-menu-button-${generateId()}`
        element.setAttribute('type', 'button');
        element.setAttribute('aria-haspopup', 'true');
    }
}



/// MENU ITEMS PANEL


@Directive({
    selector: '[hlMenuItems]'
})
export class MenuItemsPanelDirective {
    element: HTMLElement | null = null;

    expand() {
        const view = this.viewContainerRef.createEmbeddedView(this.templateRef);
        const element = view.rootNodes[0];
        this.initAttributes(element)
        this.initListeners(element)
        this.element = element;
        view.markForCheck();
    }

    collapse() {
        this.viewContainerRef.clear();
        this.element = null;
    }

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainerRef: ViewContainerRef,
        @Host() private menu: MenuDirective,
        private renderer: Renderer2) {
        this.menu.menuItemsPanel = this;
    }

    focus() {
        setTimeout(() => this.element?.focus({ preventScroll: true }))
    }

    private initAttributes(element: HTMLElement) {
        element.tabIndex = -1;
        element.id = `headlessui-menu-items-${generateId()}`
        element.setAttribute('role', 'menu');
        element.setAttribute('aria-labelledby', this.menu.menuButton.element.id)
    }

    private initListeners(element: HTMLElement) {
        this.renderer.listen(
            element,
            'keydown',
            (event: KeyboardEvent) => {
                switch (event.key) {
                    case 'Space':
                    case 'Enter':
                        event.preventDefault()
                        this.menu.clickActive()
                        break;

                    case 'ArrowDown':
                        event.preventDefault();
                        this.menu.focusItem({ kind: 'FocusNext' })
                        break;

                    case 'ArrowUp':
                        event.preventDefault();
                        this.menu.focusItem({ kind: 'FocusPrevious' })
                        break;

                    case 'Tab':
                        event.preventDefault();
                        break;

                    case 'Escape':
                        event.preventDefault()
                        this.menu.toggle()
                        break
                }
            }
        );
    }
}




// MENU ITEM


@Directive({
    selector: '[hlMenuItem]'
})
export class MenuItemDirective implements OnInit {
    view!: EmbeddedViewRef<any>
    element!: HTMLElement
    context = { active: false };

    @Input()
    hlMenuItemDisabled: boolean = false;


    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainerRef: ViewContainerRef,
        @Host() private menu: MenuDirective,
        private renderer: Renderer2) {
        this.menu.menuItems.push(this);
    }

    ngOnInit(): void {
        this.view = this.viewContainerRef.createEmbeddedView(this.templateRef, this.context);
        this.element = this.view.rootNodes[0]
        this.initAttributes(this.element)
        this.initListeners(this.element)
    }

    focus(active: boolean) {
        this.context.active = active;
        this.view.markForCheck();
    }

    private initAttributes(element: HTMLElement) {
        element.id = `headlessui-menu-item-${generateId()}`
        element.tabIndex = -1;
        element.setAttribute('role', 'menuitem');
        if (this.hlMenuItemDisabled) {
            this.element.setAttribute('aria-disabled', 'true')
        } else {
            this.element.removeAttribute('aria-disabled')
        }

    }

    private initListeners(element: HTMLElement) {
        this.renderer.listen(
            element,
            'pointermove',
            () => this.menu.focusItem({ kind: 'FocusSpecific', item: this })
        );

        this.renderer.listen(
            element,
            'pointerleave',
            () => this.menu.focusItem({ kind: 'FocusNothing' })
        );

        this.renderer.listen(
            element,
            'click',
            (event) => {
                if (this.hlMenuItemDisabled) {
                    event.preventDefault()
                    return
                }
                this.menu.toggle()
            }
        );
    }
}


type FocusPrevious = { kind: 'FocusPrevious' }
type FocusNext = { kind: 'FocusNext' }
type FocusNothing = { kind: 'FocusNothing' }
type FocusSpecific = { kind: 'FocusSpecific', item: MenuItemDirective }

type FocusType =
    | FocusPrevious
    | FocusNext
    | FocusNothing
    | FocusSpecific



@NgModule({
    imports: [],
    exports: [MenuDirective, MenuButtonDirective, MenuItemsPanelDirective, MenuItemDirective],
    declarations: [MenuDirective, MenuButtonDirective, MenuItemsPanelDirective, MenuItemDirective],
    providers: []
})
export class MenuModule { }