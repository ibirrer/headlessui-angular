import { Component } from '@angular/core';

@Component({
  selector: 'app-unstyled-select',
  templateUrl: 'unstyled-select.component.html',
})
export class UnstyledSelectComponent {
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
