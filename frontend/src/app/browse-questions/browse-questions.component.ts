// src/app/browse-questions/browse-questions.component.ts

import { Component, OnInit } from '@angular/core';
import { ItemService } from '../services/item.service';

interface Question {
  question: string;
  choices: string[];
}

@Component({
  selector: 'app-browse-questions',
  templateUrl: './browse-questions.component.html',
  styleUrls: ['./browse-questions.component.css'],
})
export class BrowseQuestionsComponent implements OnInit {
  questions!: Question[];
  showChoices: boolean[] = [];

  constructor(private itemService: ItemService) {}

  ngOnInit() {
    this.itemService.getQuestions().subscribe((data) => {
      this.questions = data.questions;
      this.showChoices = new Array(this.questions.length).fill(false);
    });
  }
  toggleChoices(index: number) {
    this.showChoices[index] = !this.showChoices[index];
  }
}
