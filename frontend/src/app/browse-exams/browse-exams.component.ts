import { Component } from '@angular/core';
import { ExamService } from '../services/exam.service';
import { ActiveExam, Exam } from '../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Question } from '../question-creation/question.model';
import { FormControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-browse-exams',
  templateUrl: './browse-exams.component.html',
  styleUrls: ['./browse-exams.component.css']
})
export class BrowseExamsComponent {

  constructor(private examService: ExamService, private modalService: NgbModal,
    private alert: AlertService) {}

  exams: Exam[] = []
  selected_exam?: Exam;
  startDateControl = new FormControl(new Date());
  endDateControl = new FormControl(new Date());
  // Define necessary variables
  dateControl = new FormControl(new Date());
  minDate = new Date(); // Set your minimum date here
  maxDate = new Date(); // Set your maximum date here
  disabled = false; // Set to true if you want to disable the input
  showSpinners = true; // Customize as needed
  showSeconds = false; // Customize as needed
  stepHour = 1; // Customize as needed
  stepMinute = 1; // Customize as needed
  stepSecond = 1; // Customize as needed
  touchUi = false; // Customize as needed
  color : ThemePalette = 'primary'; // Customize as needed
  enableMeridian = false; // Customize as needed
  disableMinute = false; // Customize as needed
  hideTime = false; // Customize as needed
  activeExams: ActiveExam[] = [];

  ngOnInit() {
    this.examService.getExams().subscribe((exams:Exam[]) => {
      this.exams = exams;
    })
    this.examService.getActiveExams().subscribe((exams:ActiveExam[]) => {
      this.activeExams = exams;
      this.startTimer();
    })
    this.maxDate.setFullYear(this.maxDate.getFullYear() + 1);
  }

  openExamModal(content: any, exam_id: number) {
    this.examService.getExam(exam_id).subscribe((exam:Exam) => {
      this.selected_exam = exam;
      this.modalService.open(content, { scrollable: true, size: 'lg' })
    })
  }

  activateExam(event : Event,content : any, exam_id : number) {
    event.stopPropagation();
    this.examService.getExam(exam_id).subscribe((exam:Exam) => {
      this.selected_exam = exam;
      this.modalService.open(content, { scrollable: true, size: 'md', centered : true })
    })
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

  runExam(exam_id : number) {
    this.examService.startExam(exam_id,this.endDateControl.value?.toISOString()!).subscribe(data => {
      this.selected_exam?.is_active!=true;
      this.alert.showSuccessAlert('Exam started successfully.', 'Close', 3000);
      this.modalService.dismissAll();
    })
  }

  stopPropagation(event : Event) {
    event.stopPropagation();
    this.alert.showSuccessAlert("Key copied to clipboard.", "Close", 3000);
  }

  private timerInterval: any;
  private startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.activeExams.forEach(activeExam => {
        let duration = parseInt(activeExam.duration.toString(), 10);
        if (duration > 0) {
          activeExam.duration = (duration - 1).toString();
        }
      });
    }, 1000); // Update every 1 second
  }

  formatTime(minutes: string): string {
    let min = parseInt(minutes);
    const remainingMinutes = Math.floor(min);
    const remainingSeconds = (min % 1) * 60;

    return `${remainingMinutes}:${remainingSeconds < 10 ? '0' : ''}${Math.floor(remainingSeconds)}`;
  }

}