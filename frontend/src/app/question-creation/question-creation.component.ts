

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormArray } from '@angular/forms';
import { QuestionService } from './question.service';  
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Question, Answer } from './question.model';

@Component({
  selector: 'app-question',
  templateUrl: './question-creation.component.html',
  styleUrls: ['./question-creation.component.css'],
})
export class QuestionCreationComponent implements OnInit {
  questionForm: FormGroup;
  topics: string[] = []; 

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
          isCorrect: [false] 
        })//,
      
      ]),
      score: [null, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    });
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


  removeAnswer(index: number): void {
    this.answers.removeAt(index);
  }

  submitQuestion(): void {
    const newQuestion = 
    this.questionForm.value;

    this.questionService.addQuestion(newQuestion).subscribe((response) => {
      
    });

    this.questionForm.reset();
  }

 
}
