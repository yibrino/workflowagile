import { Component } from '@angular/core';
import { ExamService } from '../services/exam.service';
import { ActiveExam, Exam } from '../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Question } from '../question-creation/question.model';
import { ThemePalette } from '@angular/material/core';
import { AlertService } from '../alert.service';
import { Subscription, interval } from 'rxjs';
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
  selectedActiveExam?: ActiveExam;
  /*
  startDateControl = new FormControl(new Date());
  endDateControl = new FormControl(new Date());
  // Define necessary variables
  dateControl = new FormControl(new Date());
  minDate = new Date(); // Set your minimum date here
  maxDate = new Date(); // Set your maximum date here
  showSpinners = true; // Customize as needed
  stepHour = 1; // Customize as needed
  stepMinute = 1; // Customize as needed
  stepSecond = 1; // Customize as needed
  color : ThemePalette = 'primary'; // Customize as needed
*/

  date:Date = new Date();
  color : ThemePalette = 'primary'; // Customize as needed
  activeExams: ActiveExam[] = [];
  

  ngOnInit() {
    this.date.setMinutes(this.date.getMinutes() + 10);
    this.loadExams();
    //this.maxDate.setFullYear(this.maxDate.getFullYear() + 1);
  }

  openExamModal(content: any, exam_id: number) {
    this.loadExam(exam_id).subscribe((exam:Exam) => {
      this.selected_exam = exam;
      this.modalService.open(content, { scrollable: true, size: 'lg' })
    })
  }

  openActiveExamModal(content: any, activeExam : ActiveExam) {
    this.selectedActiveExam = activeExam;
    this.modalService.open(content, { scrollable: true, size: 'lg' })
  }

  activateExam(event : Event,content : any, exam_id : number) {
    event.stopPropagation();
    this.loadExam(exam_id).subscribe((exam:Exam) => {
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
    if (this.isValidDate || !this.isDeadlineSet) {
      let end_date = this.isDeadlineSet ? this.date.toISOString() : undefined;
      this.examService.startExam(exam_id,end_date!).subscribe(data => {
        let exam = this.exams.find(exam => exam.exam_id === exam_id);
        if (exam) {
          exam.is_active=true;
        }
        this.alert.showSuccessAlert('Exam started successfully.', 'Close', 3000);
        this.modalService.dismissAll();
      })
    }
  }

  copyToClipboard(event : Event) {
    event.stopPropagation();
    this.alert.showSuccessAlert("Key copied to clipboard.", "Close", 3000);
  }

  loadExam(exam_id : number) {
    return this.examService.getExam(exam_id);
  }

  loadExams() {
    this.examService.getExams().subscribe((exams:Exam[]) => {
      this.exams = exams;
    })
  }

  loadActiveExams() {
    this.examService.getActiveExams().subscribe((exams:ActiveExam[]) => {
      this.activeExams = exams;
      /*this.activeExams.forEach(exam => {
        if (parseInt(exam.duration)>0) {
          exam.duration = this.calculateTimeLeft(exam.end_date);
        }
      });*/
      this.setupTimers();
    })
  }

  onTabChange(index: number): void {
    if (index == 1 && this.activeExams.length == 0) {
      this.loadActiveExams();
    }
  }

  isValidDate: boolean = true;
  onTimeChange() {
    const currentTime = new Date();
    if (this.date > currentTime) {
      this.isValidDate = true;
    } else {
      this.isValidDate = false;
    }
  }

  isDeadlineSet: boolean = true;
  onDeadlineToggleChange() {
    this.isDeadlineSet=!this.isDeadlineSet;
  }

  timers: { [examId: string]: Subscription } = {};

  ngOnDestroy(): void {
    Object.values(this.timers).forEach(timer => timer.unsubscribe());
  }

  setupTimers(): void {
    this.activeExams.forEach(exam => {
      const intervalDuration = this.hasHours(exam) ? 60000 : 1000;
      this.updateTimeLeft(exam);
      this.timers[exam.active_exam_id] = interval(intervalDuration).subscribe(() => {
        this.updateTimeLeft(exam);
      });
    });
  }
  
  private hasHours(exam: ActiveExam): boolean {
    const now = new Date();
    const endDate = new Date(exam.end_date);
    const timeDifferenceInSeconds = Math.floor((endDate.getTime() - now.getTime()) / 1000);
  
    return Math.floor(timeDifferenceInSeconds / 3600) > 0;
  }

  updateTimeLeft(exam: ActiveExam): void {
    const now = new Date();
    const endDate = new Date(exam.end_date);
    const timeDifferenceInSeconds = Math.floor((endDate.getTime() - now.getTime()) / 1000);
    exam.duration='...'
    if (timeDifferenceInSeconds <= 0) {
      exam.duration = '0';
      if (this.timers[exam.active_exam_id]) {
        this.timers[exam.active_exam_id].unsubscribe();
      }
    } else {
      const hours = Math.floor(timeDifferenceInSeconds / 3600);
      const minutes = Math.floor((timeDifferenceInSeconds % 3600) / 60);
      const seconds = timeDifferenceInSeconds % 60;

      exam.duration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m ${seconds}s`;
    }
  }

  students = [
    { id: 123456, firstName: 'Firstname1', lastName: 'Lastname1', email: 'student1@example.com' },
    { id: 654321, firstName: 'Lastname1', lastName: 'Lastname2', email: 'student2@example.com' },
    { id: 123456, firstName: 'Firstname1', lastName: 'Lastname1', email: 'student1@example.com' },
    { id: 654321, firstName: 'Lastname1', lastName: 'Lastname2', email: 'student2@example.com' },
    { id: 123456, firstName: 'Firstname1', lastName: 'Lastname1', email: 'student1@example.com' },
    { id: 654321, firstName: 'Lastname1', lastName: 'Lastname2', email: 'student2@example.com' },
  ];
}