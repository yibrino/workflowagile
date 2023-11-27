import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AlertService} from '../alert.service';
import {Exam} from '../models';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  readonly apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private router: Router, private alert: AlertService) {
  }

  getExams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(this.apiUrl + '/exams/', {
      withCredentials: true,
    });
  }

  getExam(exam_id: number): Observable<Exam> {
    const url = `${this.apiUrl}/exams/${exam_id}/`;
    return this.http.get<Exam>(url, {withCredentials: true});
  }

}
