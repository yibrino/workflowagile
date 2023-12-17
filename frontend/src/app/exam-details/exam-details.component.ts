import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamService } from '../services/exam.service';
import { Exam } from '../models';

@Component({
  selector: 'app-exam-details',
  templateUrl: './exam-details.component.html',
  styleUrls: ['./exam-details.component.css'],
})
export class ExamDetailsComponent implements OnInit {
  examId?: number;
  exam?: Exam;
  constructor(
    private route: ActivatedRoute,
    private examService: ExamService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const examId = Number(params.get('id'));

      if (!isNaN(examId)) {
        this.examService.getExam(examId).subscribe((exam: Exam) => {
          this.exam = exam;
          console.log('Exam inside exam Detail component', exam);
        });
      }
    });
  }
}
