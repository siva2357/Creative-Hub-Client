import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerAccountSettingsPageComponent } from './seeker-account-settings-page.component';

describe('SeekerAccountSettingsPageComponent', () => {
  let component: SeekerAccountSettingsPageComponent;
  let fixture: ComponentFixture<SeekerAccountSettingsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeekerAccountSettingsPageComponent]
    });
    fixture = TestBed.createComponent(SeekerAccountSettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
