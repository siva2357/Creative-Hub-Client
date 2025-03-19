import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentSidebarComponent } from './talent-sidebar.component';

describe('RecruiterHeaderComponent', () => {
  let component: TalentSidebarComponent;
  let fixture: ComponentFixture<TalentSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TalentSidebarComponent]
    });
    fixture = TestBed.createComponent(TalentSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
