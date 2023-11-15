import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Topic, Question } from './question.model';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private apiUrl = 'http://backend:8000/api';//django api

  constructor(private http: HttpClient) {}

  //get topics
  getTopics(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}topics/`);
  }

 

  addQuestion(question: Question): Observable<Question> {
    return this.http.post<Question>(`${this.apiUrl}questions/`, question);
  }
}
