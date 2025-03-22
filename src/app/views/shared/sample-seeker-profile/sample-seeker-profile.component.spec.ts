import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleSeekerProfileComponent } from './sample-seeker-profile.component';

describe('SeekerProfileCardComponent', () => {
  let component: SampleSeekerProfileComponent;
  let fixture: ComponentFixture<SampleSeekerProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SampleSeekerProfileComponent]
    });
    fixture = TestBed.createComponent(SampleSeekerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
