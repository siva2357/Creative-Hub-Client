import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerMainPageComponent } from './seeker-main-page.component';

describe('RecruiterMainPageComponent', () => {
  let component: SeekerMainPageComponent;
  let fixture: ComponentFixture<SeekerMainPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeekerMainPageComponent]
    });
    fixture = TestBed.createComponent(SeekerMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
