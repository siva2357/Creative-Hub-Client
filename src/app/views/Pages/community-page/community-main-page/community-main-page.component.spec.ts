import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityMainPageComponent } from './community-main-page.component';

describe('CommunityMainPageComponent', () => {
  let component: CommunityMainPageComponent;
  let fixture: ComponentFixture<CommunityMainPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommunityMainPageComponent]
    });
    fixture = TestBed.createComponent(CommunityMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
