import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniDogCardComponent } from './mini-dog-card.component';

describe('MiniDogCardComponent', () => {
  let component: MiniDogCardComponent;
  let fixture: ComponentFixture<MiniDogCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniDogCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniDogCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
