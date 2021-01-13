# headlessui-angular

A set of completely unstyled, fully accessible UI components for Angular based on [headlessui](https://headlessui.dev). Designed to integrate beautifully with Tailwind CSS.


## Installation

_Tested with Angular 11 only._

```sh
# npm
npm install ibirrer/headlessui-angular

# Yarn
yarn add ibirrer/headlessui-angular
```

## Components

_This project is still in early development. So far, only the menu button component is available. Also expect the API to change._

- [Menu Button (Dropdown)](#menu-button-dropdown)


## Menu Button (Dropdown)

[View live demo](https://ibirrer.github.io/headlessui-angular/)

### Basic example

Menu Buttons are built using the `*hlMenu`, `*hlMenuButton`, `*hlMenuItems`, and `*hlMenuItem` directives.

The menu button `*hlMenuButton` will automatically open/close the `*hlMenuItems` when clicked, and when the menu is open, the list of items receives focus and is automatically navigable via the keyboard.


```html
<div *hlMenu>
  <button *hlMenuButton class="w-full">More</button>
  <div *hlMenuItems>
    <a *hlMenuItem="let active = active" [class.bg-blue-500]="active" href="./#account-settings">
      Account settings
    </a>
    <a *hlMenuItem="let active = active" [class.bg-blue-500]="active" href="./#documentation">
      Documentation
    </a>
    <span *hlMenuItem="let active = active; disabled: true">
      Invite a friend (coming soon!)
    </span>
    </div>
</div>
```

### Styling the active item

This is a headless component so there are no styles included by default. Instead, the components expose useful information via let expressions that you can use to apply the styles you'd like to apply yourself.

To style the active `*hlMenuItem` you can read the `active` state, which tells you whether or not that menu item is the item that is currently focused via the mouse or keyboard.

You can use this state to conditionally apply whatever active/focus styles you like, for instance a blue background like is typical in most operating systems.

```html
<div *hlMenu>
  <button *hlMenuButton>More</button>
  <div *hlMenuItems>
    <!-- Use the `active` state to conditionally style the active item. -->
    <a *hlMenuItem="let active = active" 
       [class]="active ? 'bg-blue-500 text-white' : 'bg-white text-black'" 
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
  template:
    `<div *hlMenu>
        <button *hlMenuButton>Trigger</button>
        <!-- add the animation to the *hlMenuItems element -->
        <div *hlMenuItems @toggleAnimation>
            <a *hlMenuItem="let active = active">Item A</a>
        </div>
    </div>`
  animations: [
    trigger('toggleAnimation', [
      transition(':enter',
        [
          style({ opacity: 0, transform: 'scale(0.95)' }),
          animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
        ]),
      transition(':leave',
        [
          animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' })),
        ]),
    ]),
  ]
})
```
