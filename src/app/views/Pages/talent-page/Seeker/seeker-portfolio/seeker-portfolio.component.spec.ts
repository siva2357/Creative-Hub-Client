import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerPortfolioComponent } from './seeker-portfolio.component';

describe('SeekerMainPageComponent', () => {
  let component: SeekerPortfolioComponent;
  let fixture: ComponentFixture<SeekerPortfolioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeekerPortfolioComponent]
    });
    fixture = TestBed.createComponent(SeekerPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
