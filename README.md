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

_This project is still in early development. So far, only the menu button component is available. Also expect the API to change._

- [Menu Button (Dropdown)](#menu-button-dropdown)

## Menu Button (Dropdown)

[View live demo on StackBlitz](https://stackblitz.com/edit/tailwind-1sybvr?file=src/app/app.component.html)

### Setup

Import `MenuModule` to your angular module:

```ts
import { MenuModule } from "headlessui-angular";
imports: [MenuModule];
```

### Basic example

Menu Buttons are built using the `hlMenu`, `hlMenuButton`, `*hlMenuItems`, and `*hlMenuItem` directives.

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

To style the active `hlMenuItem` you can read the `active` state, which tells you whether or not that menu item is the item that is currently focused via the mouse or keyboard.

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
