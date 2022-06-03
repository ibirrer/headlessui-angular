import {
  ChangeDetectionStrategy,
  Component,
  DebugElement,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { resetIdCounter } from '../util';
import {
  MenuButtonDirective,
  MenuDirective,
  MenuItemDirective,
  MenuItemsPanelDirective,
} from './menu';

describe('MenuTestComponent', () => {
  let component: MenuTestComponent;
  let fixture: ComponentFixture<MenuTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MenuTestComponent,
        MenuDirective,
        MenuButtonDirective,
        MenuItemsPanelDirective,
        MenuItemDirective,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    resetIdCounter();
    fixture = TestBed.createComponent(MenuTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be possible to render a Menu without crashing', () => {
    expect(menuButton().attributes['id']).toBe('headlessui-menu-button-1');
    expect(menuItems().length).toBe(0);
    expect(menuItemsPanel().length).toBe(0);
  });

  it('should be possible to toggle the menu', fakeAsync(() => {
    click(menuButton());
    tick();
    fixture.detectChanges();
    expect(menuItemsPanel().length).toBe(1);
    expect(menuItems().length).toBe(3);
    expect(menuButton().attributes['aria-controls']).toBe(
      'headlessui-menu-items-2'
    );
    expect(menuButton().attributes['expanded']).toBe('true');
    click(menuButton());
    tick();
    expect(menuItems().length).toBe(0);
    expect(menuItemsPanel().length).toBe(0);
    expect(menuButton().attributes['aria-controls']).toBeUndefined();
    expect(menuButton().attributes['expanded']).toBeUndefined();
  }));

  it('should be possible to navigate the menu with arrow down', fakeAsync(() => {
    arrowDown(menuButton());
    fixture.detectChanges();
    tick(0, { processNewMacroTasksSynchronously: false });
    fixture.detectChanges();
    tick(0, { processNewMacroTasksSynchronously: false });
    expect(menuItemsPanel().length).toBe(1);
    tick();
    fixture.detectChanges();
    expect(menuItemsPanel().length).toBe(1);
    expect(menuItems().length).toBe(3);
    expect(menuButton().attributes['aria-controls']).toBe(
      'headlessui-menu-items-2'
    );
    expect(menuButton().attributes['expanded']).toBe('true');

    // run delayed focus of first element
    tick();
    fixture.detectChanges();

    expect(menuItemsState()).toEqual([true, false, false]);
    expect(menuItemsPanel()[0].attributes['aria-activedescendant']).toBe(
      'headlessui-menu-item-3'
    );

    arrowDown(menuItemsPanel()[0]);
    tick();
    fixture.detectChanges();
    expect(menuItemsState()).toEqual([false, true, false]);
    expect(menuItemsPanel()[0].attributes['aria-activedescendant']).toBe(
      'headlessui-menu-item-4'
    );

    arrowDown(menuItemsPanel()[0]);
    tick();
    fixture.detectChanges();
    expect(menuItemsState()).toEqual([false, false, true]);
    expect(menuItemsPanel()[0].attributes['aria-activedescendant']).toBe(
      'headlessui-menu-item-5'
    );

    arrowDown(menuItemsPanel()[0]);
    tick();
    fixture.detectChanges();
    expect(menuItemsState()).toEqual([false, false, true]);
    expect(menuItemsPanel()[0].attributes['aria-activedescendant']).toBe(
      'headlessui-menu-item-5'
    );
  }));

  it('should be possible to navigate the menu with arrow up', fakeAsync(() => {
    arrowUp(menuButton());
    fixture.detectChanges();
    tick(0, { processNewMacroTasksSynchronously: false });
    fixture.detectChanges();
    tick(0, { processNewMacroTasksSynchronously: false });
    expect(menuItemsPanel().length).toBe(1);
    expect(menuItems().length).toBe(3);
    expect(menuButton().attributes['aria-controls']).toBe(
      'headlessui-menu-items-2'
    );
    expect(menuButton().attributes['expanded']).toBe('true');

    // run delayed focus of first element
    tick();
    fixture.detectChanges();

    expect(menuItemsState()).toEqual([false, false, true]);
    expect(menuItemsPanel()[0].attributes['aria-activedescendant']).toBe(
      'headlessui-menu-item-5'
    );

    arrowUp(menuItemsPanel()[0]);
    fixture.detectChanges();
    expect(menuItemsState()).toEqual([false, true, false]);
    expect(menuItemsPanel()[0].attributes['aria-activedescendant']).toBe(
      'headlessui-menu-item-4'
    );

    arrowUp(menuItemsPanel()[0]);
    fixture.detectChanges();
    expect(menuItemsState()).toEqual([true, false, false]);
    expect(menuItemsPanel()[0].attributes['aria-activedescendant']).toBe(
      'headlessui-menu-item-3'
    );

    arrowUp(menuItemsPanel()[0]);
    fixture.detectChanges();
    expect(menuItemsState()).toEqual([true, false, false]);
    expect(menuItemsPanel()[0].attributes['aria-activedescendant']).toBe(
      'headlessui-menu-item-3'
    );
  }));

  it('should be possible to close the menu with the escape key', fakeAsync(() => {
    click(menuButton());
    tick();
    escape(menuItemsPanel()[0]);
    tick();
    fixture.detectChanges();
    expect(menuItemsPanel().length).toBe(0);
    expect(menuItems().length).toBe(0);
  }));

  // HELPERS

  function menuButton(): DebugElement {
    const menuButtons = fixture.debugElement.queryAll(By.css('button'));
    expect(menuButtons.length).toBe(1);
    return menuButtons[0];
  }

  function menuItemsPanel(): DebugElement[] {
    return fixture.debugElement.queryAll(By.css('ul'));
  }

  function menuItems(): DebugElement[] {
    return fixture.debugElement.queryAll(By.css('li'));
  }

  function click(debugElement: DebugElement) {
    debugElement.triggerEventHandler('click', null);
  }

  function arrowDown(debugElement: DebugElement) {
    debugElement.nativeElement.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown' })
    );
  }

  function arrowUp(debugElement: DebugElement) {
    debugElement.nativeElement.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowUp' })
    );
  }

  function escape(debugElement: DebugElement) {
    debugElement.nativeElement.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape' })
    );
  }

  function menuItemsState(): boolean[] {
    return menuItems().map((item) => {
      if (item.nativeElement.innerText === 'true') {
        return true;
      }

      if (item.nativeElement.innerText === 'false') {
        return false;
      }

      throw new Error('illegal acitve state: ' + item.nativeElement.innerText);
    });
  }
});

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-menu-test',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div hlMenu>
    <button hlMenuButton>Trigger</button>
    <ul *hlMenuItems>
      <li *hlMenuItem="let item">{{ item.active }}</li>
      <li *hlMenuItem="let item">{{ item.active }}</li>
      <li *hlMenuItem="let item">{{ item.active }}</li>
    </ul>
  </div>`,
})
class MenuTestComponent {}
