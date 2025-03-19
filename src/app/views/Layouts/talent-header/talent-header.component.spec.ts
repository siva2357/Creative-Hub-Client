import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentHeaderComponent } from './talent-header.component';

describe('RecruiterHeaderComponent', () => {
  let component: TalentHeaderComponent;
  let fixture: ComponentFixture<TalentHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TalentHeaderComponent]
    });
    fixture = TestBed.createComponent(TalentHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
