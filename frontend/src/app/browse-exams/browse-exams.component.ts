import { Component } from '@angular/core';
import { ExamService } from '../services/exam.service';
import { Exam } from '../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-browse-exams',
  templateUrl: './browse-exams.component.html',
  styleUrls: ['./browse-exams.component.css']
})
export class BrowseExamsComponent {

  constructor(private examService: ExamService, private modalService: NgbModal) {}

  exams: Exam[] = []
  selected_exam?: Exam;

  ngOnInit() {
    this.examService.getExams().subscribe((exams:Exam[]) => {
      this.exams = exams;
    })
  }

  openExamModal(content: any, exam_id: number) {
    this.examService.getExam(exam_id).subscribe((exam:Exam) => {
      this.selected_exam = exam;
      this.modalService.open(content, { scrollable: true, size: 'lg' });
    })
  }

  getExam(exam_id:number) {
    this.examService.getExam(exam_id).subscribe((exam:Exam) => {
      this.selected_exam = exam;
    })
  }

  activateExam(event : Event) {
    event.stopPropagation();
  }

}
