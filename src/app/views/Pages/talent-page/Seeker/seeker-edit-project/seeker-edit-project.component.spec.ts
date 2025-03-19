import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerEditProjectComponent } from './seeker-edit-project.component';

describe('SeekerEditProjectComponent', () => {
  let component: SeekerEditProjectComponent;
  let fixture: ComponentFixture<SeekerEditProjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeekerEditProjectComponent]
    });
    fixture = TestBed.createComponent(SeekerEditProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
