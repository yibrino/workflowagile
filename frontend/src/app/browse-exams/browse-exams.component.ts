import { Component } from '@angular/core';
import { ExamService } from '../services/exam.service';
import { ActiveExam, Exam } from '../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Question } from '../question-creation/question.model';
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
    this.loadExams();
    //this.maxDate.setFullYear(this.maxDate.getFullYear() + 1);
  }

  openExamModal(content: any, exam_id: number) {
    this.loadExam(exam_id);
    if (this.selected_exam) {
      this.modalService.open(content, { scrollable: true, size: 'lg' })
    }
  }

  activateExam(event : Event,content : any, exam_id : number) {
    event.stopPropagation();
    this.loadExam(exam_id);
    if (this.selected_exam) {
      this.modalService.open(content, { scrollable: true, size: 'md', centered : true })
    }
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

  copyToClipboard(event : Event) {
    event.stopPropagation();
    this.alert.showSuccessAlert("Key copied to clipboard.", "Close", 3000);
  }

  loadExam(exam_id : number) {
    this.examService.getExam(exam_id).subscribe((exam:Exam) => {
      this.selected_exam = exam;
    })
  }

  loadExams() {
    this.examService.getExams().subscribe((exams:Exam[]) => {
      this.exams = exams;
    })
  }

  loadActiveExams() {
    this.examService.getActiveExams().subscribe((exams:ActiveExam[]) => {
      this.activeExams = exams;
      this.activeExams.forEach(exam => {
        if (parseInt(exam.duration)>0) {
          exam.duration = this.calculateTimeLeft(parseInt(exam.duration));
        }
      });
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
      console.log(this.date)
      this.isValidDate = true;
    } else {
      this.isValidDate = false;
    }
  }

  isDeadlineSet: boolean = true;
  onDeadlineToggleChange() {
    this.isDeadlineSet=!this.isDeadlineSet;
  }

  calculateTimeLeft(durationInSeconds: number): string {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;
    const formattedTime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m ${seconds}s`;
    return formattedTime.trim();
  }

}