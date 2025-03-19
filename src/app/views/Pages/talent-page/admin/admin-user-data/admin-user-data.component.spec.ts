import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserDataPageComponent } from './admin-user-data.component';

describe('AdminUserDataPageComponent', () => {
  let component: AdminUserDataPageComponent ;
  let fixture: ComponentFixture<AdminUserDataPageComponent >;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminUserDataPageComponent ]
    });
    fixture = TestBed.createComponent(AdminUserDataPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
