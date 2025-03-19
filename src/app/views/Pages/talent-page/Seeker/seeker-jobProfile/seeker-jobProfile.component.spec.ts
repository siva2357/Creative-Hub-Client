import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerJobProfileComponent } from './seeker-jobProfile.component';

describe('SeekerMainPageComponent', () => {
  let component: SeekerJobProfileComponent;
  let fixture: ComponentFixture<SeekerJobProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeekerJobProfileComponent]
    });
    fixture = TestBed.createComponent(SeekerJobProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
