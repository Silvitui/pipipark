import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DogDetailModalComponent } from './dog-detail-modal.component';

describe('DogDetailModalComponent', () => {
  let component: DogDetailModalComponent;
  let fixture: ComponentFixture<DogDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DogDetailModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DogDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
