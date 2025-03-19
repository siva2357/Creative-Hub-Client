import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditJobPostFormComponent } from './job-post-edit-form.component';

describe('JobPostFormComponent', () => {
  let component: EditJobPostFormComponent;
  let fixture: ComponentFixture<EditJobPostFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditJobPostFormComponent]
    });
    fixture = TestBed.createComponent(EditJobPostFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
