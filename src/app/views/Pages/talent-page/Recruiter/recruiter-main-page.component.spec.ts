import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterMainPageComponent } from './recruiter-main-page.component';

describe('RecruiterMainPageComponent', () => {
  let component: RecruiterMainPageComponent;
  let fixture: ComponentFixture<RecruiterMainPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecruiterMainPageComponent]
    });
    fixture = TestBed.createComponent(RecruiterMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
