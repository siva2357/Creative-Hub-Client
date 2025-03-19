import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentSignUpComponent } from './talent-sign-up.component';

describe('TalentSignUpComponent', () => {
  let component: TalentSignUpComponent;
  let fixture: ComponentFixture<TalentSignUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TalentSignUpComponent]
    });
    fixture = TestBed.createComponent(TalentSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
