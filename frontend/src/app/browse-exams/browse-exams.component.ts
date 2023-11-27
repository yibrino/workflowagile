import { Component } from '@angular/core';
import { ExamService } from '../services/exam.service';
import { Exam } from '../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Question } from '../question-creation/question.model';

@Component({
  selector: 'app-browse-exams',
  templateUrl: './browse-exams.component.html',
  styleUrls: ['./browse-exams.component.css']
})
export class BrowseExamsComponent {

  exams: Exam[] = []
  selected_exam?: Exam;

  constructor(private examService: ExamService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.examService.getExams().subscribe((exams: Exam[]) => {
      this.exams = exams;
    })
  }

  openExamModal(content: any, exam_id: number) {
    this.examService.getExam(exam_id).subscribe((exam: Exam) => {
      this.selected_exam = exam;
      this.modalService.open(content, {scrollable: true, size: 'lg'});
    })
  }

  getExam(exam_id: number) {
    this.examService.getExam(exam_id).subscribe((exam: Exam) => {
      this.selected_exam = exam;
    })
  }

  activateExam(event: Event) {
    event.stopPropagation();
  }

  selected_questions: any[] = [];
  showAnswers(selected_question:Question) {
    const index = this.selected_questions.indexOf(selected_question);
    if (index === -1) {
      this.selected_questions.push(selected_question);
    } else {
      this.selected_questions.splice(index, 1);
    }
  }

}
