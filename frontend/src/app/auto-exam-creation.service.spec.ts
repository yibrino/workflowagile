import { TestBed } from '@angular/core/testing';

import { AutoExamCreationService } from './auto-exam-creation.service';

describe('AutoExamCreationService', () => {
  let service: AutoExamCreationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutoExamCreationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
