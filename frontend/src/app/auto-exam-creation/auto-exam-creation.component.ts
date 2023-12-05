import {Component, OnInit} from '@angular/core';
import {AutoExamCreationService} from "../auto-exam-creation.service";
import {QuestionService} from "../question-creation/question.service";
import {MatAutocomplete} from "@angular/material/autocomplete";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import { AlertService } from '../alert.service';

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
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {
    this.examForm = this.formBuilder.group({
      title: ['', Validators.required], // New input: title
      description: ['', Validators.required], // New input: description
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
      return this.examForm.get('rows');
    }
  }
  
  ngOnInit() {
    this.items = new Map<string, number>();
    this.questions_service.getTopics().subscribe(
      (data: String[]) => {
        let topicsArray = Array.from(new Set(data));
        this.dropdownOptions = topicsArray;
      }
    );
  }
  
  addRow() {
    if (this.formBuilder) {
      this.rows.push(this.formBuilder.group({
        topic: ['', Validators.required],
        num_questions: [0, Validators.required]
      }));
    }
  }
  
  removeRow(index: number) {
    const rows = this.rows as FormArray;
    rows.removeAt(index);
  }
  
  generateExam() {
    if (this.examForm?.valid) {
      this.items?.clear();
  
      const title = this.examForm.get('title')!.value;
      const description = this.examForm.get('description')!.value;
  
      const formRows = this.rows.controls as FormGroup[];
      formRows.forEach((row: any) => {
        const topic = row.get('topic').value;
        const number = row.get('num_questions').value;
  
        this.items?.set(topic, number);
      });
      if (this.items) {
        this.auto_creation_service.createExam(this.items,title,description).subscribe({
          next: (data) => {
            this.alertService.showSuccessAlert("Exam created successfully", "Close", 3000);
            this.examForm!.reset();
          },
          error: (error) => {
            this.alertService.showErrorAlert("An unexpected error occurred", "", 5000);
          }
        });
      }
    } else {
      this.alertService.showErrorAlert("Please fill all the fields", "", 5000);
    }
  }
}  
