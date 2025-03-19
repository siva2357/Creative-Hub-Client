import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerDashboardComponent } from './seeker-dashboard.component';

describe('SeekerDashboardComponent', () => {
  let component: SeekerDashboardComponent;
  let fixture: ComponentFixture<SeekerDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeekerDashboardComponent]
    });
    fixture = TestBed.createComponent(SeekerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
