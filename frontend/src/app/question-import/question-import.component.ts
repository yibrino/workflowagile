import {Component} from '@angular/core';
import * as XLSX from 'xlsx';
import {QuestionService} from "../question-creation/question.service";
import {Answer, Question} from "../question-creation/question.model";
import {AlertService} from "../alert.service";

@Component({
  selector: 'app-question-import',
  templateUrl: './question-import.component.html',
  styleUrls: ['./question-import.component.css']
})
export class QuestionImportComponent {

  excelHeaders: string[] = [];
  excelData: any[] = [];
  questions: Question[] = []


  constructor(private questionService: QuestionService, private alertService: AlertService) {
  }

  onFileChange(event: any) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const fileReader: FileReader = new FileReader();

      fileReader.onload = (event: any) => {
        const fileData = event.target.result;
        const workbook = XLSX.read(fileData, {type: 'binary'});
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Extract headers
        this.excelHeaders = [];
        for (const cellAddress in sheet) {
          if (cellAddress[0] === '!') continue;
          if (cellAddress[1] === '1') {
            this.excelHeaders.push(sheet[cellAddress].v);
          }
        }

        // Extract data
        this.excelData = XLSX.utils.sheet_to_json(sheet);
      };

      fileReader.readAsBinaryString(selectedFile);
    }
  }

  onSubmit() {
    this.questions = []
    // Process and send data based on predefined columns
    this.excelData.forEach((rowData) => {
      // Generate unique ID for the question
      // const questionId = uuidv4();

      const question: Question = {
        question_id: rowData['ID'],
        text: rowData['Text'],
        score: rowData['Score'],
        topic: rowData['Topic'],
        latest_version: true,
        answers: [],
      };

      // Process MultipleChoiceOptions
      const options = rowData['MultipleChoiceOptions'].split(';');
      let correctAnswerIndices: Set<number> = new Set();

      // Check if MultipleChoiceAnswers is a number or a string
      if (typeof rowData['MultipleChoiceAnswers'] === 'number') {
        // If it's a single number, create a set with that number
        correctAnswerIndices = new Set([rowData['MultipleChoiceAnswers']]);
      } else if (typeof rowData['MultipleChoiceAnswers'] === 'string') {
        // If it's a string, split and convert each part to an integer
        const answerParts = rowData['MultipleChoiceAnswers'].split(';');
        correctAnswerIndices = new Set(
          answerParts.map((index: string) => parseInt(index))
        );
      }

      options.forEach((option: string, index: number) => {
        const answer: Answer = {
          text: option.trim(),
          correct: correctAnswerIndices.has(index + 1),
          latest_version: true
        }
        question.answers.push(answer)
      })

      this.questions.push(question)
    })

    this.questionService.importQuestions(this.questions).subscribe(
      next => {
        this.alertService.showSuccessAlert(`Successfully added ${next} questions!`, 'Close', 5000)
      },
      error => {
        this.alertService.showErrorAlert("An error occurred!", "Close", 5000)
      }
    )
  }

}
