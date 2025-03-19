import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerProfileCardComponent } from './seeker-profile-card.component';

describe('SeekerProfileCardComponent', () => {
  let component: SeekerProfileCardComponent;
  let fixture: ComponentFixture<SeekerProfileCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeekerProfileCardComponent]
    });
    fixture = TestBed.createComponent(SeekerProfileCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
