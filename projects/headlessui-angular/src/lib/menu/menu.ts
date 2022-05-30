import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  Input,
  NgModule,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { generateId } from '../util';

/// MENU - Spec: https://www.w3.org/TR/wai-aria-practices-1.2/#menubutton

@Directive({
  selector: '[hlMenu]',
  exportAs: 'hlMenu',
})
export class MenuDirective {
  @Input()
  static = false;

  expanded = false;
  windowClickUnlisten!: () => void;

  menuButton!: MenuButtonDirective;
  menuItemsPanel!: MenuItemsPanelDirective;
  menuItems: MenuItemDirective[] = [];
  activeItem: MenuItemDirective | null = null;
  searchQuery = '';
  searchDebounce: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private renderer: Renderer2,
    private changeDetection: ChangeDetectorRef
  ) {}

  toggle(focusAfterExpand: FocusType | null = null, focusButtonOnClose = true) {
    if (this.expanded) {
      // close items panel
      this.expanded = false;
      this.menuItemsPanel.collapse();
      this.menuButton.element.removeAttribute('aria-controls');
      this.menuButton.element.removeAttribute('expanded');
      this.menuItems = [];
      this.activeItem = null;
      this.windowClickUnlisten();
      if (focusButtonOnClose) {
        this.menuButton.focus();
      }
      this.changeDetection.markForCheck();
    } else {
      // open items panel
      this.expanded = true;
      this.changeDetection.markForCheck();

      setTimeout(() => {
        this.menuItemsPanel.expand();
        this.menuItemsPanel.focus();
        if (this.menuItemsPanel.element != null) {
          this.menuButton.element.setAttribute(
            'aria-controls',
            this.menuItemsPanel.element.id
          );
        }
        this.menuButton.element.setAttribute('expanded', 'true');
        this.windowClickUnlisten = this.initListeners();
        if (focusAfterExpand) {
          setTimeout(() => this.focusItem(focusAfterExpand));
        }
      });
    }
  }

  focusItem(focusType: FocusType) {
    const activeItem = this.calculateFocusedItem(focusType);
    if (activeItem === this.activeItem) {
      return;
    }
    this.activeItem = activeItem;
    this.menuItems.forEach((item) => {
      if (this.activeItem) {
        this.menuItemsPanel.element?.setAttribute(
          'aria-activedescendant',
          this.activeItem.element.id
        );
      } else {
        this.menuItemsPanel.element?.removeAttribute('aria-activedescendant');
      }
      item.setActive(item === this.activeItem);
    });
  }

  clickActive() {
    this.activeItem?.element.click();
  }

  search(value: string) {
    if (this.searchDebounce) {
      clearTimeout(this.searchDebounce);
    }
    this.searchDebounce = setTimeout(() => (this.searchQuery = ''), 350);

    this.searchQuery += value.toLocaleLowerCase();
    const matchingItem = this.menuItems.find((item) => {
      const itemText = item.element.textContent?.trim().toLocaleLowerCase();
      return itemText?.startsWith(this.searchQuery) && !item.hlMenuItemDisabled;
    });

    if (matchingItem === undefined || matchingItem === this.activeItem) {
      return;
    }

    this.focusItem({ kind: 'FocusSpecific', item: matchingItem });
  }

  private calculateFocusedItem(focusType: FocusType): MenuItemDirective | null {
    const enabledItems = this.menuItems.filter(
      (item) => !item.hlMenuItemDisabled
    );

    switch (focusType.kind) {
      case 'FocusSpecific':
        return focusType.item;

      case 'FocusNothing':
        return null;

      case 'FocusFirst':
        return enabledItems[0];

      case 'FocusLast':
        return enabledItems[enabledItems.length - 1];

      case 'FocusNext':
        if (this.activeItem === null) {
          return enabledItems[0];
        } else {
          const nextIndex = Math.min(
            enabledItems.indexOf(this.activeItem) + 1,
            enabledItems.length - 1
          );
          return enabledItems[nextIndex];
        }

      case 'FocusPrevious':
        if (this.activeItem === null) {
          return enabledItems[enabledItems.length - 1];
        } else {
          const previousIndex = Math.max(
            enabledItems.indexOf(this.activeItem) - 1,
            0
          );
          return enabledItems[previousIndex];
        }
    }
  }

  private initListeners(): () => void {
    return this.renderer.listen(window, 'click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const active = document.activeElement;

      if (
        this.menuButton.element.contains(target) ||
        this.menuItemsPanel?.element?.contains(target)
      ) {
        return;
      }

      const clickedTargetIsFocusable =
        active !== document.body && active?.contains(target);

      // do not focus button if the clicked element is itself focusable
      this.toggle(null, !clickedTargetIsFocusable);
    });
  }
}

// MENU ITEM BUTTON

@Directive({
  selector: '[hlMenuButton]',
})
export class MenuButtonDirective implements OnInit {
  element!: HTMLElement;

  constructor(
    elementRef: ElementRef,
    private menu: MenuDirective,
    private renderer: Renderer2
  ) {
    this.element = elementRef.nativeElement;
    menu.menuButton = this;
  }

  ngOnInit(): void {
    this.initAttributes(this.element);

    this.renderer.listen(this.element, 'click', () => {
      this.menu.toggle();
    });

    this.renderer.listen(this.element, 'keydown', (event: KeyboardEvent) => {
      switch (event.key) {
        case ' ': // Space
        case 'Enter':
        case 'ArrowDown':
          event.preventDefault();
          this.menu.toggle({ kind: 'FocusFirst' });
          break;

        case 'ArrowUp':
          event.preventDefault();
          this.menu.toggle({ kind: 'FocusLast' });
          break;
      }
    });
  }

  focus() {
    setTimeout(() => this.element?.focus());
  }

  private initAttributes(element: HTMLElement) {
    element.id = `headlessui-menu-button-${generateId()}`;
    element.setAttribute('type', 'button');
    element.setAttribute('aria-haspopup', 'true');
  }
}

/// MENU ITEMS PANEL

@Directive({
  selector: '[hlMenuItems]',
})
export class MenuItemsPanelDirective implements OnInit {
  element: HTMLElement | null = null;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private menu: MenuDirective,
    private renderer: Renderer2
  ) {
    this.menu.menuItemsPanel = this;
  }

  ngOnInit(): void {
    if (this.menu.static) {
      this.expandInternal();
    }
  }

  expand() {
    if (!this.menu.static) {
      this.expandInternal();
    }
  }

  collapse() {
    if (!this.menu.static) {
      this.viewContainerRef.clear();
      this.element = null;
    }
  }

  focus() {
    this.element?.focus({ preventScroll: true });
  }

  private expandInternal() {
    const view = this.viewContainerRef.createEmbeddedView(this.templateRef);
    const element = view.rootNodes[0];
    this.initAttributes(element);
    this.initListeners(element);
    this.element = element;
    view.markForCheck();
  }

  private initAttributes(element: HTMLElement) {
    element.tabIndex = -1;
    element.id = `headlessui-menu-items-${generateId()}`;
    element.setAttribute('role', 'menu');
    element.setAttribute('aria-labelledby', this.menu.menuButton.element.id);
  }

  private initListeners(element: HTMLElement) {
    this.renderer.listen(element, 'keydown', (event: KeyboardEvent) => {
      switch (event.key) {
        case ' ': // Space
          if (this.menu.searchQuery !== '') {
            event.preventDefault();
            this.menu.search(event.key);
          } else {
            event.preventDefault();
            this.menu.clickActive();
          }
          break;
        case 'Enter':
          event.preventDefault();
          this.menu.clickActive();
          break;

        case 'ArrowDown':
          event.preventDefault();
          this.menu.focusItem({ kind: 'FocusNext' });
          break;

        case 'ArrowUp':
          event.preventDefault();
          this.menu.focusItem({ kind: 'FocusPrevious' });
          break;

        case 'Home':
        case 'PageUp':
          event.preventDefault();
          this.menu.focusItem({ kind: 'FocusFirst' });
          break;

        case 'End':
        case 'PageDown':
          event.preventDefault();
          this.menu.focusItem({ kind: 'FocusLast' });
          break;

        case 'Escape':
          event.preventDefault();
          this.menu.toggle();
          break;

        case 'Tab':
          event.preventDefault();
          break;

        default:
          if (event.key.length === 1) {
            this.menu.search(event.key);
          }
      }
    });
  }
}

// MENU ITEM

@Directive({
  selector: '[hlMenuItem]',
})
export class MenuItemDirective implements OnInit {
  @Input()
  hlMenuItemDisabled = false;

  element!: HTMLElement;

  private view!: EmbeddedViewRef<any>;
  private context = { active: false };

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private menu: MenuDirective,
    private renderer: Renderer2
  ) {
    this.menu.menuItems.push(this);
  }

  ngOnInit(): void {
    this.view = this.viewContainerRef.createEmbeddedView(this.templateRef, {
      $implicit: this.context,
    });
    this.element = this.view.rootNodes[0];
    this.initAttributes(this.element);
    this.initListeners(this.element);
  }

  setActive(active: boolean) {
    this.context.active = active;
    this.view.markForCheck();
  }

  private initAttributes(element: HTMLElement) {
    element.id = `headlessui-menu-item-${generateId()}`;
    element.tabIndex = -1;
    element.setAttribute('role', 'menuitem');
    if (this.hlMenuItemDisabled) {
      this.element.setAttribute('aria-disabled', 'true');
    } else {
      this.element.removeAttribute('aria-disabled');
    }
  }

  private initListeners(element: HTMLElement) {
    this.renderer.listen(element, 'pointermove', () =>
      this.menu.focusItem({ kind: 'FocusSpecific', item: this })
    );

    this.renderer.listen(element, 'pointerleave', () =>
      this.menu.focusItem({ kind: 'FocusNothing' })
    );

    this.renderer.listen(element, 'click', (event) => {
      if (this.hlMenuItemDisabled) {
        event.preventDefault();
        return;
      }
      this.menu.toggle();
    });
  }
}

type FocusFirst = { kind: 'FocusFirst' };
type FocusLast = { kind: 'FocusLast' };
type FocusPrevious = { kind: 'FocusPrevious' };
type FocusNext = { kind: 'FocusNext' };
type FocusNothing = { kind: 'FocusNothing' };
type FocusSpecific = { kind: 'FocusSpecific'; item: MenuItemDirective };

type FocusType =
  | FocusFirst
  | FocusLast
  | FocusPrevious
  | FocusNext
  | FocusNothing
  | FocusSpecific;

@NgModule({
  imports: [],
  exports: [
    MenuDirective,
    MenuButtonDirective,
    MenuItemsPanelDirective,
    MenuItemDirective,
  ],
  declarations: [
    MenuDirective,
    MenuButtonDirective,
    MenuItemsPanelDirective,
    MenuItemDirective,
  ],
  providers: [],
})
export class MenuModule {}
