# headlessui-angular

Tries to bring headless components (https://headlessui.dev) to Angular.

_This project is in a very early stage and not much more than a proof of concept._

A set of completely unstyled, fully accessible UI components for Angular, designed to integrate beautifully with Tailwind CSS.


## Menu Button (Dropdown)

[View live demo](https://ibirrer.github.io/headlessui-angular/)

### Basic example

Menu Buttons are built using the `*hlMenu`, `*hlMenuButton`, `*hlMenuItems`, and `*hlMenuItem` directives.

The menu button `*hlMenuButton` will automatically open/close the `*hlMenuItems` when clicked, and when the menu is open, the list of items receives focus and is automatically navigable via the keyboard.


```html
<div *hlMenu>
  <button *hlMenuButton>More</button>
  <ul *hlMenuItems>
    <li *hlMenuItem="let active = active">
      <a [class.bg-blue-500]="active" href="#account-settings">Account settings</a>
    </li>
    <li *hlMenuItem="let active = active">
      <a [class.bg-blue-500]="active" href="#documentation">Documentation</a>
    </li>
    <li *hlMenuItem="let active = active; disabled: true">
      <span>Invite a friend (coming soon!)</span>
    </li>
  </ul>
</div>
```

### Styling the active item

This is a headless component so there are no styles included by default. Instead, the components expose useful information via let expressions that you can use to apply the styles you'd like to apply yourself.

To style the active `*hlMenuItem` you can read the `active` state, which tells you whether or not that menu item is the item that is currently focused via the mouse or keyboard.

You can use this state to conditionally apply whatever active/focus styles you like, for instance a blue background like is typical in most operating systems.

```html
<div *hlMenu>
  <button *hlMenuButton>More</button>
  <ul *hlMenuItems>
    <li *hlMenuItem="let active = active">
      <!-- Use the `active` state to conditionally style the active item. -->
      <a [class]="active ? 'bg-blue-500 text-white' : 'bg-white text-black'" href="#settings">Settings</a>
    </li>
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
        <ul *hlMenuItems @toggleAnimation>
            <li *hlMenuItem="let active = active">Item A</li>
        </ul>
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

### TODO
- [ ] search
- [ ] complete keyboard navigation and focus handling
- [x] focus button after click on item
- [x] choose with space and enter
- [x] don't toggle it item is disabled
- [ ] code cleanup
- [ ] unregister all listeners on destroy 
- [ ] error if missing child/parent components
- [ ] more tests
  - disabled menu items