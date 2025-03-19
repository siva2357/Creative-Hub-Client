import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerLaunchpadComponent } from './seeker-launchPad.component';

describe('SeekerLaunchpadComponent', () => {
  let component: SeekerLaunchpadComponent;
  let fixture: ComponentFixture<SeekerLaunchpadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeekerLaunchpadComponent]
    });
    fixture = TestBed.createComponent(SeekerLaunchpadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
