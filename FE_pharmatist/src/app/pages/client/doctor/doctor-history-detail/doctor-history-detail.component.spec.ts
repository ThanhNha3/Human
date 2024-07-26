import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorHistoryDetailComponent } from './doctor-history-detail.component';

describe('DoctorHistoryDetailComponent', () => {
  let component: DoctorHistoryDetailComponent;
  let fixture: ComponentFixture<DoctorHistoryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorHistoryDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorHistoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
