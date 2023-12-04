import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoExamCreationComponent } from './auto-exam-creation.component';

describe('AutoExamCreationComponent', () => {
  let component: AutoExamCreationComponent;
  let fixture: ComponentFixture<AutoExamCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoExamCreationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoExamCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
