import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {QuestionService} from "../question-creation/question.service";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {AlertService} from "../alert.service";
import {MatSelectChange} from "@angular/material/select";
@Component({
  selector: 'app-question-open',
  templateUrl: './question-open.component.html',
  styleUrls: ['./question-open.component.css'],
})
export class QuestionOpenComponent {

  questionForm: FormGroup;
  topics: string[] = [];
  showDeleteErrorMessage: boolean = false;

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private http: HttpClient,
    private alertService: AlertService
  ) {
    this.questionForm = this.fb.group({
      text: ['', Validators.required],
      topic: [null],
      score: [null, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    });

  }

  updateShowErrorMessage(): void {
    this.showDeleteErrorMessage = true;
    setTimeout(
      () => {
        this.showDeleteErrorMessage = false;
      }, 3000
    );
  }


  ngOnInit(): void {
    this.fetchTopics();
  }

  fetchTopics(): void {
    this.questionService.getTopics().subscribe((topics) => {
      this.topics = topics;
    });

  }


  isTopicListVisible(): boolean {
    const topicControl = this.questionForm.get('topic');
    const isTextEmpty = topicControl?.value === null || topicControl?.value === '';
    return isTextEmpty;
  }



  onTopicSelected(event: MatSelectChange): void {
    //binds selected topic with input field in order to visualize it
    const selectedTopic = event.value;
    this.questionForm.patchValue({ topic: selectedTopic });
  }



  submitQuestion(): void {
    this.questionForm.markAllAsTouched();


    if (this.questionForm.valid) {
      const newQuestion = this.questionForm.value;

      this.questionService.addQuestion(newQuestion).subscribe(

        (response) => {
          this.alertService.showSuccessAlert(`Question successfully added!`, 'Close', 5000)
          this.questionForm.reset();
        },
        (error) => {

          if (error instanceof HttpErrorResponse && error.status === 400) {
            this.alertService.showErrorAlert("An error occurred!", "Close", 5000)
          } else {
            this.alertService.showErrorAlert("Unknown error occurred!", "Close", 5000)
          }
        }

      );


    }
  }


}
