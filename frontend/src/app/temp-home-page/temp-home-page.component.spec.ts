import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempHomePageComponent } from './temp-home-page.component';

describe('TempHomePageComponent', () => {
  let component: TempHomePageComponent;
  let fixture: ComponentFixture<TempHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TempHomePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TempHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
