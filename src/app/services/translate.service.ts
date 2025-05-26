import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { translation } from '../models/translation';

@Injectable({ providedIn: 'root' })
export class favoriteService {
  private readonly API_BASE_URL = '/api/translation'; // dein Backend

  constructor(private http: HttpClient) {}

  translate(translation: translation): Observable<{ translation: translation }> {
    return this.http.post<{ translation: translation }>(this.API_BASE_URL, { translation })
      .pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error?.error) {
      const { code, message } = error.error.error;
      console.error(`API Error - Code: ${code}, Message: ${message}`);
    } else {
      console.error('Unknown error occurred:', error);
    }
    return throwError(() => new Error(error.message || 'Unknown error'));
  }

}