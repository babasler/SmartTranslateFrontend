import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly API_BASE_URL = 'http://localhost:8080/api'; // dein Backend

  constructor(private http: HttpClient) {}

  getSecureData(): Observable<string> {
    return this.http.get(`${this.API_BASE_URL}/secure-data`, { responseType: 'text' });
  }
}
