import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForDeveloperComponent } from './for-developer.component';

describe('ForDeveloperComponent', () => {
  let component: ForDeveloperComponent;
  let fixture: ComponentFixture<ForDeveloperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForDeveloperComponent]
    });
    fixture = TestBed.createComponent(ForDeveloperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
