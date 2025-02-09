import { TestBed } from '@angular/core/testing';

import { PipicanService } from './pipican.service';

describe('PipicanService', () => {
  let service: PipicanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PipicanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
