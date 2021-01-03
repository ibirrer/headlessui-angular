# headlessui-angular

Tries to bring headless components (https://headlessui.dev) to angular.

_This project is in a very early stage and not much more than a proof of concept._

A set of completely unstyled, fully accessible UI components for angular, designed to integrate beautifully with Tailwind CSS.


## Menu Button (Dropdown)

[View live demo](https://ibirrer.github.io/headlessui-angular/)

### Basic example

Menu Buttons are built using the `*appMenu`, `*appMenuButton`, `*appMenuItems`, and `*appMenuItem` directives.

The menu button `*appMenuButton` will automatically open/close the `*appMenuItems` when clicked, and when the menu is open, the list of items receives focus and is automatically navigable via the keyboard.


```html
<div *appMenu>
  <button *appMenuButton>More</button>
  <ul *appMenuItems>
    <li *appMenuItem="let active = active">
      <a [class.bg-blue-500]="active" href="#account-settings">Account settings</a>
    </li>
    <li *appMenuItem="let active = active">
      <a [class.bg-blue-500]="active" href="#documentation">Documentation</a>
    </li>
    <li *appMenuItem="let active = active; disabled: true">
      <span>Invite a friend (coming soon!)</span>
    </li>
  </ul>
</div>
```

### Styling the active item

This is a headless component so there are no styles included by default. Instead, the components expose useful information via let expressions that you can use to apply the styles you'd like to apply yourself.

To style the active `*appMenuItem` you can read the `active` state, which tells you whether or not that menu item is the item that is currently focused via the mouse or keyboard.

You can use this state to conditionally apply whatever active/focus styles you like, for instance a blue background like is typical in most operating systems.

```html
<div *appMenu>
  <button *appMenuButton>More</button>
  <ul *appMenuItems>
    <li *appMenuItem="let active = active">
      <!-- Use the `active` state to conditionally style the active item. -->
      <a [class]="active ? 'bg-blue-500 text-white' : 'bg-white text-black'" href="#settings">Settings</a>
    </li>
  </ul>
</div>
```

### TODO
- [ ] search
- [ ] complete keyboard navigation
- [ ] code cleanup
- [ ] unregister all listeners on destroy 
- [ ] error if missing child/parent components
- [ ] more tests
  - disabled menu items