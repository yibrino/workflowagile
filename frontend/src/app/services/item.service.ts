// src/app/item.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private apiUrl = 'http://127.0.0.1:8000/api/jsonquestions/';

  constructor(private http: HttpClient) {}

  getQuestions(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
