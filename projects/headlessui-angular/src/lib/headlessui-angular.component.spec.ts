import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadlessuiAngularComponent } from './headlessui-angular.component';

describe('HeadlessuiAngularComponent', () => {
  let component: HeadlessuiAngularComponent;
  let fixture: ComponentFixture<HeadlessuiAngularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadlessuiAngularComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadlessuiAngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
