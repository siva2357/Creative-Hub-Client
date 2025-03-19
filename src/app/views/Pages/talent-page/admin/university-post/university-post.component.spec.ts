import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversityPostComponent } from './university-post.component';

describe('UniversityPostComponent', () => {
  let component: UniversityPostComponent;
  let fixture: ComponentFixture<UniversityPostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UniversityPostComponent]
    });
    fixture = TestBed.createComponent(UniversityPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
