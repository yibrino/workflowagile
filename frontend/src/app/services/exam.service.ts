import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertService } from '../alert.service';
import * as http from "http";
import { ActiveExam, Exam } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  readonly apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private router: Router, private alert: AlertService) {}

  getExams() : Observable<Exam[]> {
    return this.http.get<Exam[]>(this.apiUrl + '/exams/', {
      withCredentials: true,
    });
  }

  getExam(exam_id : number) : Observable<Exam> {
    const url = `${this.apiUrl}/exams/${exam_id}/`;
    return this.http.get<Exam>(url, {withCredentials: true});
  }

  createExam(exam: Exam): Observable<Exam> {
    const url = `${this.apiUrl}/exams/create`
    return this.http.post<Exam>(url, exam, {withCredentials: true})
  }

  startExam(exam_id : number,end_date:string) : Observable<any> {
    return this.http.post<any>(this.apiUrl+"/active-exam/", {'exam':exam_id,'end_date':end_date}, {withCredentials: true});
  }

  getActiveExams() : Observable<ActiveExam[]> {
    return this.http.get<ActiveExam[]>(this.apiUrl + '/active-exam/', {
      withCredentials: true,
      });
  }

  removeActiveExam(exam_id : number) : Observable<any> {
    const url = `${this.apiUrl}/active-exam/${exam_id}/`;
    return this.http.delete<any>(url, {withCredentials: true});
  }

}
