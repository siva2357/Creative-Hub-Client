import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishMainPageComponent } from './publish-main-page.component';

describe('PublishMainPageComponent', () => {
  let component: PublishMainPageComponent;
  let fixture: ComponentFixture<PublishMainPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PublishMainPageComponent]
    });
    fixture = TestBed.createComponent(PublishMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
