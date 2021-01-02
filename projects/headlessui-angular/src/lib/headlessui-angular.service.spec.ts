import { TestBed } from '@angular/core/testing';

import { HeadlessuiAngularService } from './headlessui-angular.service';

describe('HeadlessuiAngularService', () => {
  let service: HeadlessuiAngularService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeadlessuiAngularService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
