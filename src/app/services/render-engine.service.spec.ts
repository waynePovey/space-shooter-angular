import { TestBed } from '@angular/core/testing';

import { RenderEngineService } from './render-engine.service';

describe('RenderEngineService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RenderEngineService = TestBed.get(RenderEngineService);
    expect(service).toBeTruthy();
  });
});
