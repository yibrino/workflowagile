import { Component, OnInit } from '@angular/core';
import { QuestionService } from "../question-creation/question.service";
import { AlertService } from "../alert.service";
import { Question } from "../question-creation/question.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Exam } from "../models";
import { ExamService } from "../services/exam.service";

@Component({
  selector: 'app-create-exam',
  templateUrl: './create-exam.component.html',
  styleUrls: ['./create-exam.component.css']
})
export class CreateExamComponent implements OnInit {

  questions: Question[] = []
  pickedQuestions: Question[] = []
  calculatedScore: number = 0
  examForm: FormGroup;

  constructor(private questionService: QuestionService, private fb: FormBuilder,
              private examService: ExamService, private alertService: AlertService) {
    this.examForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.maxLength(1023)],
    });
  }

  ngOnInit(): void {

    this.questionService.getQuestions().subscribe(
      data => {
        this.questions = data
      }
    )

  }

  onQuestionClickHandler(question: Question) {
    if (this.checkIfIncluded(question)) {
      this.removeQuestionFromExam(question)
    } else {
      this.addQuestionToExam(question)
    }
  }

  private addQuestionToExam(question: Question) {
    this.pickedQuestions.push(question)
    this.calculatedScore += question.score
  }

  private removeQuestionFromExam(question: Question) {
    const index = this.pickedQuestions.indexOf(question)
    if (index > -1) {
      this.pickedQuestions.splice(index, 1)
      this.calculatedScore -= question.score
    }
  }

  checkIfIncluded(question: Question) {
    return this.pickedQuestions.includes(question)
  }

  submitExam() {
    if (this.pickedQuestions.length < 1) {
      this.alertService.showErrorAlert('No question selected!', 'CLOSE', 5000)
      return
    }
    if (this.examForm.valid) {
      const exam: Exam = this.examForm.value
      exam.questions = this.pickedQuestions
      console.log(exam)
      this.examService.createExam(exam).subscribe(
        data => {
          this.alertService.showSuccessAlert('Exam has been created!', 'CLOSE', 5000)
        }, error => {
          console.log(error)
          this.alertService.showErrorAlert('An error occurred', 'CLOSE', 5000)
        }
      )

    }
  }

}
