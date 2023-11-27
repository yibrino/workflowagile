import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseExamsComponent } from './browse-exams.component';

describe('BrowseExamsComponent', () => {
  let component: BrowseExamsComponent;
  let fixture: ComponentFixture<BrowseExamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowseExamsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowseExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
