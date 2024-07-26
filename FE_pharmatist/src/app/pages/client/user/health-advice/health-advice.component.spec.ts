import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthAdviceComponent } from './health-advice.component';

describe('HealthAdviceComponent', () => {
  let component: HealthAdviceComponent;
  let fixture: ComponentFixture<HealthAdviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HealthAdviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthAdviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
