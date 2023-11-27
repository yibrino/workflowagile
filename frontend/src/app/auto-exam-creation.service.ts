import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AutoExamCreationService {

  readonly url = 'http://localhost:8000/api/create-automatically'

  constructor(private http: HttpClient) {
  }

  createExam(question_topics: Map<string, number>) {
    this.http.post(this.url, question_topics, {withCredentials: true})
  }

}
