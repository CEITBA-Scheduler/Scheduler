import { TestBed } from '@angular/core/testing';

import { DbServicesService } from './db-services.service';

describe('DbServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DbServicesService = TestBed.get(DbServicesService);
    expect(service).toBeTruthy();
  });
});
