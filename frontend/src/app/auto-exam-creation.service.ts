import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AutoExamCreationService {

  readonly url: string = 'http://localhost:8080/api/auto-exam-creation';
  
  constructor(private http: HttpClient) { }

  createExam(items: Map<string, number>) {
    this.http.post(this.url, items, {withCredentials: true});
  }
  
}
