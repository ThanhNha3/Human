import { TestBed } from '@angular/core/testing';

import { AssemblyAIService } from './assemblyai.service';

describe('AssemblyaiService', () => {
  let service: AssemblyAIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssemblyAIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
