import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { favorite } from '../models/favorite';

@Injectable({ providedIn: 'root' })
export class favoriteService {
  private readonly API_BASE_URL = 'http://localhost:8080/'; // dein Backend

  constructor(private http: HttpClient) {}

  getfavorites(): Observable<{ favorites: favorite[] }> {
    return this.http.get<{ favorites: favorite[] }>(this.API_BASE_URL)
      .pipe(catchError(this.handleError));
  }

  addfavorite(favorite: favorite): Observable<{ favorite: favorite }> {
    return this.http.post<{ favorite: favorite }>(this.API_BASE_URL, { favorite })
      .pipe(catchError(this.handleError));
  }

  updatefavorite(favorite: favorite): Observable<{ favorite: favorite }> {
    return this.http.put<{ favorite: favorite }>(this.API_BASE_URL, { favorite })
      .pipe(catchError(this.handleError));
  }

  deletefavorite(favorite: favorite): Observable<{ favorite: favorite }> {
    return this.http.request<{ favorite: favorite }>('DELETE', this.API_BASE_URL, { body: { favorite } })
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

