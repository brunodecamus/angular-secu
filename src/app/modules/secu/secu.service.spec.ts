import { TestBed } from '@angular/core/testing';

import { SecuService } from './secu.service';

describe('SecuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SecuService = TestBed.get(SecuService);
    expect(service).toBeTruthy();
  });
});
