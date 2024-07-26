import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionHistoryDetailComponent } from './prescription-history-detail.component';

describe('PrescriptionHistoryDetailComponent', () => {
  let component: PrescriptionHistoryDetailComponent;
  let fixture: ComponentFixture<PrescriptionHistoryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrescriptionHistoryDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionHistoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
