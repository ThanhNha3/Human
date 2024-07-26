import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmartistMedicineComponent } from './pharmartist-medicine.component';

describe('PharmartistMedicineComponent', () => {
  let component: PharmartistMedicineComponent;
  let fixture: ComponentFixture<PharmartistMedicineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmartistMedicineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmartistMedicineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
