import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishPageComponent } from './publish-page.component';

describe('PublishPageComponent', () => {
  let component: PublishPageComponent;
  let fixture: ComponentFixture<PublishPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PublishPageComponent]
    });
    fixture = TestBed.createComponent(PublishPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
