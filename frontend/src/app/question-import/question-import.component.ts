import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { QuestionService } from '../question-creation/question.service';
import { Answer, Question } from '../question-creation/question.model';
import { AlertService } from '../alert.service';

enum FileType {
  Excel = 'application/vnd.ms-excel',
  ExcelOpenXML = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  JSON = 'application/json',
}

@Component({
  selector: 'app-question-import',
  templateUrl: './question-import.component.html',
  styleUrls: ['./question-import.component.css'],
})
export class QuestionImportComponent {
  excelHeaders: string[] = [];
  excelData: any[] = [];
  questions: Question[] = [];
  jsonQuestions: any;

  constructor(
    private questionService: QuestionService,
    private alertService: AlertService
  ) {}

  onFileChange(event: any) {
    // Get the selected file
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const fileReader: FileReader = new FileReader();

      fileReader.onload = (event: any) => {
        const fileData = event.target.result;
        try {
          // Check if the file is an Excel file
          if (
            selectedFile.type === FileType.Excel ||
            selectedFile.type === FileType.ExcelOpenXML
          ) {
            // Extract data from the Excel file
            const workbook = XLSX.read(fileData, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Extract headers
            this.excelHeaders = Object.keys(sheet)
              .filter(
                (cellAddress) =>
                  cellAddress[0] !== '!' && cellAddress[1] === '1'
              )
              .map((cellAddress) => sheet[cellAddress].v);

            // this.excelHeaders = [];
            // for (const cellAddress in sheet) {
            //   if (cellAddress[0] === '!') continue;
            //   if (cellAddress[1] === '1') {
            //     this.excelHeaders.push(sheet[cellAddress].v);
            //   }
            // }

            // Extract data
            this.excelData = XLSX.utils.sheet_to_json(sheet);
          } else if (selectedFile.type === FileType.JSON) {
            // Assign the JSON file to the jsonQuestions variable
            this.jsonQuestions = JSON.parse(fileData);
          } else {
            console.error('Invalid file type!');
            // Display an error alert
            this.alertService.showErrorAlert(
              'Invalid file type!',
              'Close',
              5000
            );
          }
        } catch (error) {
          console.error('Error reading file:', error);
          // Display an error alert
          this.alertService.showErrorAlert(
            'Error reading file!',
            'Close',
            5000
          );
        }
      };

      fileReader.readAsBinaryString(selectedFile);
    }
  }

  onSubmit() {
    if (this.jsonQuestions) {
      this.questions = this.jsonQuestions;
      this.jsonQuestions = null;
    } else {
      // Process the data from the Excel file
      this.questions = this.processData(this.excelData);
    }

    // Send the questions to the server
    this.questionService.importQuestions(this.questions).subscribe({
      next: (next: number) => {
        this.alertService.showSuccessAlert(
          `Successfully added ${next} questions!`,
          'Close',
          5000
        );
      },
      error: (error: any) => {
        // Display an error alert
        this.alertService.showErrorAlert('An error occurred!', 'Close', 5000);
      },
    });
  }

  processData(excelData: any[]): Question[] {
    const questions: Question[] = [];
    excelData.forEach((rowData) => {
      const question: Question = this.createQuestion(rowData);
      questions.push(question);
    });
    return questions;
  }

  createQuestion(rowData: any): Question {
    const question: Question = {
      question_id: rowData['ID'],
      text: rowData['Text'],
      score: rowData['Score'],
      topic: rowData['Topic'],
      latest_version: true,
      answers: [],
    };

    const options: string[] = rowData['MultipleChoiceOptions'].split(';');
    const correctAnswerIndices: Set<number> =
      this.getCorrectAnswerIndices(rowData);

    options.forEach((option: string, index: number) => {
      const answer: Answer = this.createAnswer(
        option,
        index,
        correctAnswerIndices
      );
      question.answers.push(answer);
    });

    return question;
  }

  getCorrectAnswerIndices(rowData: any): Set<number> {
    let correctAnswerIndices: Set<number> = new Set();
    if (typeof rowData['MultipleChoiceAnswers'] === 'number') {
      correctAnswerIndices = new Set([rowData['MultipleChoiceAnswers']]);
    } else if (typeof rowData['MultipleChoiceAnswers'] === 'string') {
      const answerParts: string[] = rowData['MultipleChoiceAnswers'].split(';');
      correctAnswerIndices = new Set(
        answerParts.map((index: string) => parseInt(index))
      );
    }
    return correctAnswerIndices;
  }

  createAnswer(
    option: string,
    index: number,
    correctAnswerIndices: Set<number>
  ): Answer {
    const answer: Answer = {
      text: option.trim(),
      correct: correctAnswerIndices.has(index + 1),
      latest_version: true,
    };
    return answer;
  }
}
