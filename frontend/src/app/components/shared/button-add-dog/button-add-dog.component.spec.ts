import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonAddDogComponent } from './button-add-dog.component';

describe('ButtonAddDogComponent', () => {
  let component: ButtonAddDogComponent;
  let fixture: ComponentFixture<ButtonAddDogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonAddDogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonAddDogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
