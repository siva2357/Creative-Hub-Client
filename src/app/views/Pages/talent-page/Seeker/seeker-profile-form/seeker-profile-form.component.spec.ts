import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerProfileFormComponent } from './seeker-profile-form.component';

describe('SeekerProfileFormComponent', () => {
  let component: SeekerProfileFormComponent;
  let fixture: ComponentFixture<SeekerProfileFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeekerProfileFormComponent]
    });
    fixture = TestBed.createComponent(SeekerProfileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
