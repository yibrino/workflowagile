import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutoExamCreationService {

  readonly url: string = 'http://localhost:8000/api/exams/create-automatically/';

  constructor(private http: HttpClient) { }

  createExam(items: Map<string, number>, title:string, description:string) : Observable<any> {
    const requestData = {
      items: Array.from(items.entries()).map(([topic, num_questions]) => ({ topic, num_questions }))
    };
    return this.http.post(this.url, {requestData,title,description}, {withCredentials: true})
  }

}
