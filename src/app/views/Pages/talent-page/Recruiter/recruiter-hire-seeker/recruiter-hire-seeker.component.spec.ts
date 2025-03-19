import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterHireSeekerPageComponent } from './recruiter-hire-seeker.component';

describe('RecruiterMainPageComponent', () => {
  let component: RecruiterHireSeekerPageComponent;
  let fixture: ComponentFixture<RecruiterHireSeekerPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecruiterHireSeekerPageComponent]
    });
    fixture = TestBed.createComponent(RecruiterHireSeekerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
