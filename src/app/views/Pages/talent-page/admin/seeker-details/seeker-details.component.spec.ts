import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerDetailsComponent } from './seeker-details.component';

describe('SeekerDetailsComponent', () => {
  let component: SeekerDetailsComponent;
  let fixture: ComponentFixture<SeekerDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeekerDetailsComponent]
    });
    fixture = TestBed.createComponent(SeekerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
