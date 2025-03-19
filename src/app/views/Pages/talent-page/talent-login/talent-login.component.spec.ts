import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentLoginComponent } from './talent-login.component';

describe('TalentLoginComponent', () => {
  let component: TalentLoginComponent;
  let fixture: ComponentFixture<TalentLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TalentLoginComponent]
    });
    fixture = TestBed.createComponent(TalentLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
