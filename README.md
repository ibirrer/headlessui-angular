# headlessui-angular

An attempt to bring [headlessui](https://headlessui.dev) to Angular. A set of completely unstyled, fully accessible UI components.

## Installation

```sh
# npm
npm install headlessui-angular

# Yarn
yarn add headlessui-angular
```

## Components

_This project is still in early development. So far, only the menu and 
listbox component are available._

- [Menu (Dropdown)](#menu-dropdown)
- [Listbox (Select) - Draft](#listbox-select)

## Menu (Dropdown)

[Demo](https://ibirrer.github.io/headlessui-angular/#menu)

From the [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/menu/): _"A menu is a widget that offers a list of choices to the user, such as a set of actions.
Menu widgets behave like native operating system menus, such as the menus
that pull down from the menubars."_

### Setup

Import `MenuModule` to your angular module:

```ts
import { MenuModule } from "headlessui-angular";
imports: [MenuModule];
```

### Basic example

Menus are built using the `hlMenu`, `hlMenuButton`, `*hlMenuItems`, and `*hlMenuItem` directives.

The menu button `*hlMenuButton` will automatically open/close the `*hlMenuItems` when clicked, and when the menu is open, the list of items receives focus and is automatically navigable via the keyboard.

```html
<div hlMenu>
  <button hlMenuButton class="w-full">More</button>
  <div *hlMenuItems>
    <a
      *hlMenuItem="let item"
      [class.bg-blue-500]="item.active"
      href="./#account-settings"
    >
      Account settings
    </a>
    <a
      *hlMenuItem="let item"
      [class.bg-blue-500]="item.active"
      href="./#documentation"
    >
      Documentation
    </a>
    <span *hlMenuItem="let item; disabled: true">
      Invite a friend (coming soon!)
    </span>
  </div>
</div>
```

### Styling the active item

This is a headless component so there are no styles included by default. Instead, the components expose useful information via let expressions that you can use to apply the styles you'd like to apply yourself.

To style the active `hlMenuItem` you can read the `active` state, which tells you whether that menu item is the item that is currently focused via the mouse or keyboard.

You can use this state to conditionally apply whatever active/focus styles you like, for instance a blue background like is typical in most operating systems.

```html
<div hlMenu>
  <button hlMenuButton>More</button>
  <div *hlMenuItems>
    <!-- Use the `active` state to conditionally style the active item. -->
    <a *hlMenuItem="let item"
       [class]="item.active ? 'bg-blue-500 text-white' : 'bg-white text-black'"
       href="#settings">
      Settings
    </a>
  </ul>
</div>
```

### Transitions

To animate the opening/closing of the menu panel, use Angular's built-in animation capabilities. All you need to do is add the animation to your `*hlMenuItems` element.

```html
@Component({
<!-- ... -->
template: `
<div hlMenu>
  <button hlMenuButton>Trigger</button>
  <!-- add the animation to the *hlMenuItems element -->
  <div *hlMenuItems @toggleAnimation>
    <a *hlMenuItem>Item A</a>
  </div>
</div>
` animations: [ trigger('toggleAnimation', [ transition(':enter', [ style({
opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({
opacity: 1, transform: 'scale(1)' })), ]), transition(':leave', [
animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' })), ]), ]), ] })
```

## Listbox (Select)
DRAFT

From the [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/): _"A listbox widget presents a list of options and allows a user to select 
one or more of them."_



[Demo](https://ibirrer.github.io/headlessui-angular/#listbox)

### Setup

Import `ListboxModule` to your angular module:

```ts
import { ListboxModule } from "headlessui-angular";
imports: [ListboxModule];
```

## Develop

```sh
git clone https://github.com/ibirrer/headlessui-angular.git
cd headlessui-angular
npm install
npm start

# open http://localhost:4200/
# edit demo: projects/demo
# edit lib:  projects/headlessui-angular
```
