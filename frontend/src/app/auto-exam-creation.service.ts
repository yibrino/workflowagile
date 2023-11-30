import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AutoExamCreationService {

  readonly url: string = 'http://localhost:8000/api/exams/create-automatically/';

  constructor(private http: HttpClient) { }

  createExam(items: Map<string, number>) {
    const requestData = {
      items: Array.from(items.entries()).map(([topic, num_questions]) => ({ topic, num_questions }))
    };
    this.http.post(this.url, requestData, {withCredentials: true}).subscribe((error) => console.log(error));
  }

}
