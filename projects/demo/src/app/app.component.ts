import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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

export class AppComponent {
  title = 'demo';

  people: Person[] = [
    { id: 1, name: 'Durward Reynolds', unavailable: false },
    { id: 2, name: 'Kenton Towne', unavailable: false },
    { id: 3, name: 'Therese Wunsch', unavailable: false },
    { id: 4, name: 'Benedict Kessler', unavailable: true },
    { id: 5, name: 'Katelyn Rohan', unavailable: false },
  ];

  selectedPerson: Person | null = this.people[0];

  setSelectedPerson(person: Person | null) {
    this.selectedPerson = person;
  }
}

interface Person {
  id: number;
  name: string;
  unavailable: boolean;
}