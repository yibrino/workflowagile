

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormArray } from '@angular/forms';
import { QuestionService } from './question.service';  
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Question, Answer } from './question.model';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-question',
  templateUrl: './question-creation.component.html',
  styleUrls: ['./question-creation.component.css'],
})
export class QuestionCreationComponent implements OnInit {
  questionForm: FormGroup;
  topics: string[] = ["tru"]; 
  showDeleteErrorMessage: boolean = false;
  hasCorrectAnswer: boolean = true;

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,  
    private http: HttpClient
  ) {
    this.questionForm = this.fb.group({
      text: ['', Validators.required],
      topic: [null],
      answers: this.fb.array([
        this.fb.group({
          text: ['', Validators.required], 
          isCorrect: [true] 
        }),
        this.fb.group({
          text: ['', Validators.required], 
          isCorrect: [false] 
        }),
      
      ]),
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

  
  checkCorrectAnswers(): void {
    const correctAnswers = this.answers.value.filter((answer: any) => answer.isCorrect);
    this.hasCorrectAnswer = correctAnswers.length > 0;
  }


  get answers(): any {
    return this.questionForm.get('answers');
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


  addAnswer(): void {
    this.answers.push( this.fb.group({
      text: ['', Validators.required], 
      isCorrect: [false] 
    }));
  }

  onTopicSelected(event: MatSelectChange): void {
    const selectedTopic = event.value;
    this.questionForm.patchValue({ topic: selectedTopic });
  }

  removeAnswer(index: number): void {
    const answers = this.answers as FormArray;
  
    if (answers.length === 2) {
      this.updateShowErrorMessage();
      
    } 
    else {
      answers.removeAt(index);
    }
  }
  



  submitQuestion(): void {
    this.questionForm.markAllAsTouched();
  
    // Check if there are at least two answers with non-empty texts
    const answerControls = this.answers.controls as FormGroup[];
    const validAnswers = answerControls.filter((answer) => answer.get('text')?.value.trim() !== null && answer.get('text')?.value.trim() !== '' );
  
    if (this.questionForm.valid && validAnswers.length >= 2 && this.hasCorrectAnswer) {
      const newQuestion = this.questionForm.value;
      console.log(newQuestion);
      /* this.questionService.addQuestion(newQuestion).subscribe((response) => {
          
      });*/
  
      this.questionForm.reset();
    }
    else {
     this.updateShowErrorMessage();
    }
  }
  
  
}