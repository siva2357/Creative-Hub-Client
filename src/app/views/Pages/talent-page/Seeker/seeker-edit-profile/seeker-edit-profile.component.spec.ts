import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerEditProfileComponent } from './seeker-edit-profile.component';

describe('SeekerEditProfileComponent', () => {
  let component: SeekerEditProfileComponent;
  let fixture: ComponentFixture<SeekerEditProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeekerEditProfileComponent]
    });
    fixture = TestBed.createComponent(SeekerEditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
