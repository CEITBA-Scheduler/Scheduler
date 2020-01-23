import { TestBed } from '@angular/core/testing';

import { CalendarServiceService } from './calendar-service.service';

describe('CalendarServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CalendarServiceService = TestBed.get(CalendarServiceService);
    expect(service).toBeTruthy();
  });
});
