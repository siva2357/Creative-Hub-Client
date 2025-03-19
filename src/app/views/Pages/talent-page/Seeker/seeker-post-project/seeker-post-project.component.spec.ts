import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerPostProjectPageComponent  } from './seeker-post-project.component';

describe('RecruiterPostJobPageComponent', () => {
  let component: SeekerPostProjectPageComponent ;
  let fixture: ComponentFixture<SeekerPostProjectPageComponent >;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeekerPostProjectPageComponent ]
    });
    fixture = TestBed.createComponent(SeekerPostProjectPageComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
