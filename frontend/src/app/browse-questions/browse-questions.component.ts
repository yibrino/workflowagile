import { Component, OnInit } from '@angular/core';
import { ItemService } from '../services/item.service';
import { QuestionService } from '../services/question.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

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
  editing?: boolean;
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
  filteredQuestions: QuestionGroup[] = [];
  showChoices: { [topic: string]: boolean[] } = {};
  showQuestions: boolean = false;
  selectedFilter: string = 'all'; // Default filter value
  showExportButtons = false;

  constructor(
    private itemService: ItemService,
    private questionService: QuestionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.itemService.getQuestions().subscribe((data) => {
      console.log(data);
      this.questionsGroupedByTopic = this.groupQuestionsByTopic(data);
      this.initializeShowChoices();
      this.applyFilter();
    });
  }

  exportToXLSX() {
    const header = [
      'ID',
      'Topic',
      'Text',
      'Score',
      'MultipleChoiceOptions',
      'MultipleChoiceAnswers',
    ];
    const xlsxData: any[][] = [];
  
    this.questionsGroupedByTopic.forEach((group) => {
      group.questions.forEach((question) => {
        if (question.latest_version) {
          const answerTexts = question.answers.map((answer) => answer.text).join(';');
          const correctIndices: number[] = question.answers.reduce(
            (indices: number[], answer, index) => {
              if (answer.correct) {
                indices.push(index + 1); // Add 1 for 1-based indexing
              }
              return indices;
            },
            []
          );
  
          const correctIndicesString = correctIndices.join(';');
          xlsxData.push([
            question.question_id,
            question.topic,
            question.text,
            question.score,
            answerTexts,
            correctIndicesString,
          ]);
        }
      });
    });
  
    const worksheet = XLSX.utils.aoa_to_sheet([header, ...xlsxData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'questions');
    const xlsxOutput = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([xlsxOutput], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, 'questions.xlsx');
  }

  exportToJSON() {
    const jsonData: any[] = [];

    this.questionsGroupedByTopic.forEach((group) => {
      group.questions.forEach((question) => {
        if (question.latest_version) {
          const answerTexts = question.answers.map((answer) => ({
            answer_id: answer.answer_id,
            text: answer.text,
            correct: answer.correct,
          }));

          const jsonQuestion = {
            question_id: question.question_id,
            teacher: question.teacher,
            text: question.text,
            score: question.score,
            topic: question.topic,
            answers: answerTexts,
          };

          jsonData.push(jsonQuestion);
        }
      });
    });

    const jsonOutput = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    FileSaver.saveAs(blob, 'questions.json');
  }

  exportToCSV() {
    let csvData =
      'ID;Topic;Text;Score;MultipleChoiceOptions;MultipleChoiceAnswers\n';
  
    this.questionsGroupedByTopic.forEach((group) => {
      group.questions.forEach((question) => {
        if (question.latest_version) {
          const answerTexts = question.answers
            .map((answer) => `"${answer.text}"`)
            .join(';');
  
          const correctAnswersIndices = question.answers
            .map((answer, index) => (answer.correct ? index + 1 : null))
            .filter((index) => index !== null)
            .join(';');
  
          const rowData = [
            question.question_id,
            question.topic,
            question.text,
            question.score,
            answerTexts,
            correctAnswersIndices,
          ].join(';');
  
          csvData += rowData + '\n';
        }
      });
    });
  
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(blob, 'questions.csv');
  }
  

  toggleChoices(topic: string, index: number) {
    this.showChoices[topic][index] = !this.showChoices[topic][index];
  }

  startEditQuestion(question: Question) {
    question.editing = true;
  }

  saveEdit(question: Question) {
    if (question) {
      const questionId = question.question_id;

      this.questionService.updateQuestionLatestVersion(questionId).subscribe(
        (updateResponse) => {
          console.log('Latest version updated successfully:', updateResponse);

          const updatedQuestion = {
            text: question.text,
            score: question.score,
            topic: question.topic,
            answers: question.answers.map((answer) => ({
              text: answer.text,
              isCorrect: answer.correct,
            })),
          };

          this.questionService.createEditedQuestion(updatedQuestion).subscribe(
            (createResponse) => {
              console.log(
                'Edited question created successfully:',
                createResponse
              );
              question.editing = false;
              this.snackBar.open('Question Edited Successfully', 'Close', {
                duration: 3000,
                horizontalPosition: 'end',
                verticalPosition: 'top',
              });
            },
            (createError) => {
              console.error('Error creating edited question:', createError);
            }
          );
        },
        (updateError) => {
          console.error('Error updating latest version:', updateError);
        }
      );
    }
  }

  handleEditError(questionId: string, createError: any) {
    console.error('Handling edit error:', createError);
  }

  cancelEdit(question: Question) {
    question.editing = false;
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

  applyFilter() {
    this.showExportButtons = this.selectedFilter === 'latest';
    if (this.selectedFilter === 'latest') {
      this.itemService.getQuestions().subscribe((data) => {
        this.questionsGroupedByTopic = this.groupQuestionsByTopic(data);
        this.filteredQuestions = this.questionsGroupedByTopic.map((group) => ({
          topic: group.topic,
          questions: group.questions.filter(
            (question) => question.latest_version
          ),
        }));
      });
    } else {
      this.itemService.getQuestions().subscribe((data) => {
        this.questionsGroupedByTopic = this.groupQuestionsByTopic(data);
        this.filteredQuestions = this.questionsGroupedByTopic;
      });
    }
  }
}
