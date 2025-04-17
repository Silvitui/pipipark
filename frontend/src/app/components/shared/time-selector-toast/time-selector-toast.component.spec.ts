import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSelectorToastComponent } from './time-selector-toast.component';

describe('TimeSelectorToastComponent', () => {
  let component: TimeSelectorToastComponent;
  let fixture: ComponentFixture<TimeSelectorToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeSelectorToastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeSelectorToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
