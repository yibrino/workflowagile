// src/app/browse-questions/browse-questions.component.ts

import {Component, OnInit} from '@angular/core';
import {ItemService} from '../services/item.service';

interface Answer {
  answer_id: number;
  text: string;
  created_at: string;
  correct: boolean;
}

interface Question {
  question_id: number;
  teacher: number;
  text: string;
  score: number;
  topic: string;
  created_at: string;
  latest_version: boolean;
  answers: Answer[];
}

interface QuestionGroup {
  topic: string;
  questions: Question[];
}

@Component({
  selector: 'app-browse-questions',
  templateUrl: './browse-questions.component.html',
  styleUrls: ['./browse-questions.component.css'],
})
export class BrowseQuestionsComponent implements OnInit {
  questionsGroupedByTopic: QuestionGroup[] = [];
  showChoices: { [topic: string]: boolean[] } = {};
  showQuestions: boolean = false; // Set to false by default
  constructor(private itemService: ItemService) {
  }

  ngOnInit() {
    this.itemService.getQuestions().subscribe((data) => {
      console.log(data);
      this.questionsGroupedByTopic = this.groupQuestionsByTopic(data);
      this.initializeShowChoices();
    });
  }

  toggleChoices(topic: string, index: number) {
    this.showChoices[topic][index] = !this.showChoices[topic][index];
  }

  private groupQuestionsByTopic(questions: Question[]): QuestionGroup[] {
    const groupedQuestions: { [topic: string]: Question[] } = {};

    questions.forEach((question) => {
      if (!groupedQuestions[question.topic]) {
        groupedQuestions[question.topic] = [];
      }
      groupedQuestions[question.topic].push(question);
    });

    return Object.keys(groupedQuestions).map((topic) => ({
      topic,
      questions: groupedQuestions[topic],
    }));
  }

  private initializeShowChoices() {
    this.questionsGroupedByTopic.forEach((group) => {
      this.showChoices[group.topic] = new Array(group.questions.length).fill(
        false
      );
    });
  }
}
