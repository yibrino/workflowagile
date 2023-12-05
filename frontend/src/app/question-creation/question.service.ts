import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Topic, Question } from './question.model';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private apiUrl = 'http://localhost:8000/api/';//django api

  constructor(private http: HttpClient) {}

  //get topics
  getTopics(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}topics`, {withCredentials:true});
  }



  addQuestion(question: Question): Observable<Question> {
    return this.http.post<Question>(`${this.apiUrl}questions/create`, question, {withCredentials:true});
  }

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}questions/`, {withCredentials:true});
  }

  importQuestions(questions: Question[]): Observable<number> {
    console.log('Import questions')
    return this.http.post<number>(`${this.apiUrl}questions/import`, questions, {withCredentials:true});
  }
}
