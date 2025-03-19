import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroductionLogoComponent } from './introduction-logo.component';

describe('IntroductionLogoComponent', () => {
  let component: IntroductionLogoComponent;
  let fixture: ComponentFixture<IntroductionLogoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IntroductionLogoComponent]
    });
    fixture = TestBed.createComponent(IntroductionLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
