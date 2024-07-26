import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorPrescriptionComponent } from './doctor-prescription.component';

describe('DoctorPrescriptionComponent', () => {
  let component: DoctorPrescriptionComponent;
  let fixture: ComponentFixture<DoctorPrescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorPrescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
