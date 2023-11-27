// src/app/item.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private apiUrl = 'http://localhost:8000/api/questions/';

  constructor(private http: HttpClient) {}

  getQuestions(): Observable<any> {
    return this.http.get<any>(this.apiUrl, {withCredentials:true});
  }
}
