import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterAccountSettingsPageComponent } from './recruiter-account-settings-page.component';

describe('RecruiterAccountSettingsPageComponent', () => {
  let component: RecruiterAccountSettingsPageComponent;
  let fixture: ComponentFixture<RecruiterAccountSettingsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecruiterAccountSettingsPageComponent]
    });
    fixture = TestBed.createComponent(RecruiterAccountSettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
