import { TestBed } from '@angular/core/testing';

import { UserDogService } from './user-dog.service';

describe('UserDogService', () => {
  let service: UserDogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserDogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
