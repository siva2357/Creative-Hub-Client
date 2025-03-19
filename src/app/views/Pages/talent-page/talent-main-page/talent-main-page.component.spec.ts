import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TalentMainPageComponent } from './talent-main-page.component';

describe('TalentPageComponent', () => {
  let component: TalentMainPageComponent;
  let fixture: ComponentFixture<TalentMainPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TalentMainPageComponent]
    });
    fixture = TestBed.createComponent(TalentMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
