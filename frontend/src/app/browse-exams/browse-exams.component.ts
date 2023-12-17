import { Component } from '@angular/core';
import { ExamService } from '../services/exam.service';
import { ActiveExam, Exam } from '../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Question } from '../question-creation/question.model';
import { ThemePalette } from '@angular/material/core';
import { AlertService } from '../alert.service';
import { Subscription, interval } from 'rxjs';
import { ItemService } from '../services/item.service';
import { QuestionService } from '../services/question.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-browse-exams',
  templateUrl: './browse-exams.component.html',
  styleUrls: ['./browse-exams.component.css'],
})
export class BrowseExamsComponent {
  constructor(
    private examService: ExamService,
    private modalService: NgbModal,
    private alert: AlertService,
    private snackBar: MatSnackBar,

    private questionService: QuestionService
  ) {}

  exams: Exam[] = [];
  selected_exam?: Exam;
  selectedActiveExam?: ActiveExam;
  originalExam: Exam | undefined;
  editing: boolean = false;
  editingQuestionIndex?: number; // Declare the variable here
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

  date: Date = new Date();
  color: ThemePalette = 'primary'; // Customize as needed
  activeExams: ActiveExam[] = [];

  ngOnInit() {
    this.date.setMinutes(this.date.getMinutes() + 10);
    this.loadExams();
    //this.maxDate.setFullYear(this.maxDate.getFullYear() + 1);
  }
  cancelEdit() {
    if (this.originalExam) {
      this.selected_exam = { ...this.originalExam };
    }
    this.editing = false;
  }
  startEdit() {
    this.editing = true;
    console.log(this.selected_exam?.exam_id);

    if (this.selected_exam) {
      this.originalExam = { ...this.selected_exam };
    }

    // Set editing mode to true
  }

  openExamModal(content: any, exam_id: number) {
    this.loadExam(exam_id).subscribe({
      next: (exam: Exam) => {
        this.selected_exam = exam;
        console.log('Question after openModal', this.selected_exam.exam_id);

        this.modalService.open(content, { scrollable: true, size: 'xl' });
      },
      error: () => {
        this.alert.showErrorAlert(
          'An unexpected error occurred.',
          'Close',
          5000
        );
      },
    });
  } // Inside your component class
  editingQuestion = false;

  startEditQuestion(index: number): void {
    this.editingQuestion = true;
    this.editingQuestionIndex = index;
    console.log('Index of the current question', this.editingQuestionIndex);
  }

  cancelEditQuestion(): void {
    this.editingQuestion = false;
  }
  saveChangesQuestion(question: Question) {
    if (question) {
      const questionId = question.question_id;
      console.log('Question after i clicked save button', question);

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
          console.log('Updated Question', updatedQuestion);

          this.questionService.createEditedQuestion(updatedQuestion).subscribe(
            (createResponse) => {
              console.log(
                'response after created in the database:',
                createResponse
              );
              console.log('Response updated ID', createResponse.question_id);

              // Update the ID of the currently edited question in the exam
              if (this.selected_exam) {
                const indexOfEditedQuestion =
                  this.selected_exam.questions.findIndex(
                    (q) => q.question_id === questionId
                  );
                console.log(' indexOfEditedQuestion', indexOfEditedQuestion);

                // Update the ID of the question in the exam
                this.examService
                  .updateQuestionId(
                    this.selected_exam.exam_id,
                    indexOfEditedQuestion,
                    createResponse.question_id
                  )
                  .subscribe(
                    (updatedExam) => {
                      console.log(
                        'Question ID updated successfully in the exam:',
                        updatedExam
                      );
                      this.loadExam;
                    },

                    (updateError) => {
                      console.error(
                        'Error updating question ID in the exam:',
                        updateError
                      );
                    }
                  );
              }

              this.editingQuestion = false;

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

  // saveChangesQuestion(question: Question): void {
  //   console.log('Question Edited', question);
  //   // Implement logic to save changes (e.g., send data to a server)
  //   this.editingQuestion = false;
  //   this.editingQuestionIndex = null;
  // }

  openActiveExamModal(content: any, activeExam: ActiveExam) {
    this.selectedActiveExam = activeExam;
    this.modalService.open(content, { scrollable: true, size: 'lg' });
  }

  activateExam(event: Event, content: any, exam_id: number) {
    event.stopPropagation();
    this.loadExam(exam_id).subscribe({
      next: (exam: Exam) => {
        this.selected_exam = exam;
        this.modalService.open(content, {
          scrollable: true,
          size: 'md',
          centered: true,
        });
      },
      error: () => {
        this.alert.showErrorAlert(
          'An unexpected error occurred.',
          'Close',
          5000
        );
      },
    });
  }

  selected_questions: any[] = [];
  showAnswers(selected_question: Question) {
    const index = this.selected_questions.indexOf(selected_question);
    if (index === -1) {
      this.selected_questions.push(selected_question);
    } else {
      this.selected_questions.splice(index, 1);
    }
  }

  runExam(exam_id: number) {
    if (this.isValidDate || !this.isDeadlineSet) {
      let end_date = this.isDeadlineSet ? this.date.toISOString() : undefined;
      this.examService.startExam(exam_id, end_date!).subscribe({
        next: () => {
          let exam = this.exams.find((exam) => exam.exam_id === exam_id);
          if (exam) {
            exam.is_active = true;
          }
          this.alert.showSuccessAlert(
            'Exam started successfully.',
            'Close',
            3000
          );
          this.modalService.dismissAll();
        },
        error: () => {
          this.alert.showErrorAlert(
            'An unexpected error occurred.',
            'Close',
            5000
          );
        },
      });
    }
  }

  copyToClipboard(event: Event) {
    event.stopPropagation();
    this.alert.showSuccessAlert('Key copied to clipboard.', 'Close', 3000);
  }

  loadExam(exam_id: number) {
    return this.examService.getExam(exam_id);
  }

  loadExams() {
    this.examService.getExams().subscribe({
      next: (exams: Exam[]) => {
        this.exams = exams;
      },
    });
  }

  loadActiveExams() {
    this.examService.getActiveExams().subscribe({
      next: (activeExams: ActiveExam[]) => {
        this.activeExams = activeExams;
        this.setupTimers();
      },
    });
  }

  stopExam(exam_id: number) {
    this.examService.removeActiveExam(exam_id).subscribe({
      next: (value) => {
        let deleted = this.activeExams.splice(
          this.activeExams.findIndex(
            (activeExam) => activeExam.active_exam_id === exam_id
          ),
          1
        );
        let exam = this.exams.find(
          (exam) => exam.exam_id === deleted[0].exam.exam_id
        );
        if (exam) {
          exam.is_active = false;
        }
        this.alert.showSuccessAlert(
          'Exam stopped successfully.',
          'Close',
          3000
        );
        this.modalService.dismissAll();
      },
      error: (err) => {
        this.alert.showErrorAlert(
          'An unexpected error occurred.',
          'Close',
          5000
        );
      },
    });
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
    this.isDeadlineSet = !this.isDeadlineSet;
  }

  timers: { [examId: string]: Subscription } = {};

  ngOnDestroy(): void {
    Object.values(this.timers).forEach((timer) => timer.unsubscribe());
  }

  setupTimers(): void {
    this.activeExams.forEach((exam) => {
      const intervalDuration = this.hasHours(exam) ? 60000 : 1000;
      this.updateTimeLeft(exam);
      this.timers[exam.active_exam_id] = interval(intervalDuration).subscribe(
        () => {
          this.updateTimeLeft(exam);
        }
      );
    });
  }

  private hasHours(exam: ActiveExam): boolean {
    const now = new Date();
    const endDate = new Date(exam.end_date);
    const timeDifferenceInSeconds = Math.floor(
      (endDate.getTime() - now.getTime()) / 1000
    );

    return Math.floor(timeDifferenceInSeconds / 3600) > 0;
  }

  updateTimeLeft(exam: ActiveExam): void {
    const now = new Date();
    const endDate = new Date(exam.end_date);
    const timeDifferenceInSeconds = Math.floor(
      (endDate.getTime() - now.getTime()) / 1000
    );
    exam.duration = '...';
    if (timeDifferenceInSeconds <= 0) {
      exam.duration = '0';
      if (this.timers[exam.active_exam_id]) {
        this.timers[exam.active_exam_id].unsubscribe();
      }
    } else {
      const hours = Math.floor(timeDifferenceInSeconds / 3600);
      const minutes = Math.floor((timeDifferenceInSeconds % 3600) / 60);
      const seconds = timeDifferenceInSeconds % 60;

      exam.duration =
        hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m ${seconds}s`;
    }
  }

  students = [
    {
      id: 123456,
      firstName: 'Firstname1',
      lastName: 'Lastname1',
      email: 'student1@example.com',
    },
    {
      id: 654321,
      firstName: 'Lastname1',
      lastName: 'Lastname2',
      email: 'student2@example.com',
    },
    {
      id: 123456,
      firstName: 'Firstname1',
      lastName: 'Lastname1',
      email: 'student1@example.com',
    },
    {
      id: 654321,
      firstName: 'Lastname1',
      lastName: 'Lastname2',
      email: 'student2@example.com',
    },
    {
      id: 123456,
      firstName: 'Firstname1',
      lastName: 'Lastname1',
      email: 'student1@example.com',
    },
    {
      id: 654321,
      firstName: 'Lastname1',
      lastName: 'Lastname2',
      email: 'student2@example.com',
    },
  ];
}
