// question.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private apiUrl = 'http://localhost:8000/api'; // Replace with your actual API URL
  constructor(private http: HttpClient) {}
  updateQuestionLatestVersion(questionId: number): Observable<any> {
    console.log('This is inside LatestVersion', questionId);
    const updateUrl = `${this.apiUrl}/questions/update-latest-version/${questionId}/`; // Assuming an endpoint for updating the latest version
    return this.http.patch(updateUrl, {}, { withCredentials: true });
  }

  createEditedQuestion(updatedQuestion: any): Observable<any> {
    console.log('This is inside CreatedEditedQuestion', updatedQuestion);
    const createUrl = `${this.apiUrl}/questions/create`; // Assuming an endpoint for creating a new question
    return this.http.post(createUrl, updatedQuestion, {
      withCredentials: true,
    });
  }
}
