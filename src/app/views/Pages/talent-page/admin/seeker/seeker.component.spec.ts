import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerComponent } from './seeker.component';

describe('SeekerComponent', () => {
  let component: SeekerComponent;
  let fixture: ComponentFixture<SeekerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeekerComponent]
    });
    fixture = TestBed.createComponent(SeekerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
