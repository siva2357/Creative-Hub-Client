import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerManageProjectPageComponent  } from './seeker-manage-project.component';

describe(' SeekerManageProjectPageComponent', () => {
  let component:  SeekerManageProjectPageComponent ;
  let fixture: ComponentFixture< SeekerManageProjectPageComponent >;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SeekerManageProjectPageComponent ]
    });
    fixture = TestBed.createComponent( SeekerManageProjectPageComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
