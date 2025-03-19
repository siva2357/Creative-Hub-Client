import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversityEditComponent } from './university-edit.component';

describe('UniversityEditComponent', () => {
  let component: UniversityEditComponent;
  let fixture: ComponentFixture<UniversityEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UniversityEditComponent]
    });
    fixture = TestBed.createComponent(UniversityEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
