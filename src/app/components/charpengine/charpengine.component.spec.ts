import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharpengineComponent } from './charpengine.component';

describe('CharpengineComponent', () => {
  let component: CharpengineComponent;
  let fixture: ComponentFixture<CharpengineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharpengineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharpengineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
