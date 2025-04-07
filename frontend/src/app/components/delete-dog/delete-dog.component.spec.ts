import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDogComponent } from './delete-dog.component';

describe('DeleteDogComponent', () => {
  let component: DeleteDogComponent;
  let fixture: ComponentFixture<DeleteDogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteDogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteDogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
