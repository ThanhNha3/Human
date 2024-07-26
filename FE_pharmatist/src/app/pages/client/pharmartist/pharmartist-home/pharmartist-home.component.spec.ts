import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmartistHomeComponent } from './pharmartist-home.component';

describe('PharmartistHomeComponent', () => {
  let component: PharmartistHomeComponent;
  let fixture: ComponentFixture<PharmartistHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmartistHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmartistHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
