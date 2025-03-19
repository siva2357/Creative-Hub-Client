import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPostComponent } from './company-post.component';

describe('CompanyPostComponent', () => {
  let component: CompanyPostComponent;
  let fixture: ComponentFixture<CompanyPostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyPostComponent]
    });
    fixture = TestBed.createComponent(CompanyPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
