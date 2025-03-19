import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudPageComponent } from './cloud-page.component';

describe('CloudPageComponent', () => {
  let component: CloudPageComponent;
  let fixture: ComponentFixture<CloudPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CloudPageComponent]
    });
    fixture = TestBed.createComponent(CloudPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
