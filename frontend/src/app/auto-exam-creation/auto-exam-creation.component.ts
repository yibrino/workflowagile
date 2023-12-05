import { Component, OnInit } from '@angular/core';
import { AutoExamCreationService } from '../auto-exam-creation.service';
import { QuestionService } from '../question-creation/question.service';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auto-exam-creation',
  templateUrl: './auto-exam-creation.component.html',
  styleUrls: ['./auto-exam-creation.component.css'],
})
export class AutoExamCreationComponent implements OnInit {
  examForm?: FormGroup;
  items?: Map<string, number>;
  dropdownOptions: String[] = [];

  constructor(
    private auto_creation_service: AutoExamCreationService,
    private questions_service: QuestionService,
    private formBuilder: FormBuilder
  ) {
    this.examForm = this.formBuilder.group({
      rows: this.formBuilder.array([
        this.formBuilder.group({
          topic: ['', Validators.required],
          num_questions: [0, Validators.required],
        }),
      ]),
    });
  }

  get rows(): any {
    if (this.examForm) {
      console.log(this.examForm);
      return this.examForm.get('rows');
    }
  }

  ngOnInit() {
    this.items = new Map<string, number>();
    this.questions_service.getTopics().subscribe(
      (data: String[]) => this.dropdownOptions = data
    );
    this.questions_service
      .getTopics()
      .subscribe((data: String[]) => (this.dropdownOptions = data));
  }

  addRow() {
    if (this.formBuilder) {
      this.rows.push(
        this.formBuilder.group({
          topic: ['', Validators.required],
          num_questions: [0, Validators.required],
        })
      );
    }
  }

  removeRow(index: number) {
    const rows = this.rows as FormArray;
    rows.removeAt(index);
  }

  generateExam() {
    if (this.examForm?.valid) {
      this.items?.clear();

      const formRows = this.rows.controls as FormGroup[];
      formRows.forEach((row: any) => {
        const topic = row.get('topic').value;
        const number = row.get('num_questions').value;

        this.items?.set(topic, number);
      });
      if (this.items) {
        this.auto_creation_service.createExam(this.items);
      }
      this.examForm.reset();
    } else {
      console.error('Form is invalid');
    }
  }
}
