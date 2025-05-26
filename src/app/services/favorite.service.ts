import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { favorite, favoriteDTO } from '../models/favorite';

@Injectable({ providedIn: 'root' })
export class favoriteService {
  private readonly API_BASE_URL = '/api/favorites'; // dein Backend

  constructor(private http: HttpClient) {}

  getfavorites(): Observable<{ favorites: favorite[] }> {
    return this.http.get<{ favorites: favoriteDTO[] }>(this.API_BASE_URL)
      .pipe(
        map(result => ({
          favorites: result && Array.isArray(result.favorites)
            ? result.favorites.map(dto => this.dtoToFavorite(dto))
            : []
        })),
        catchError(this.handleError)
      );
  }

  addfavorite(favorite: favorite): Observable<{ favorite: favorite }> {
    const dto = this.favoriteToDTO(favorite);
    console.log('Adding favorite:', dto);
    return this.http.post<{ favorite: favoriteDTO }>(this.API_BASE_URL, { favorite: dto })
      .pipe(
        map(result => ({ favorite: this.dtoToFavorite(result.favorite) })),
        catchError(this.handleError)
      );
  }

  updatefavorite(favorite: favorite): Observable<{ favorite: favorite }> {
    const dto = this.favoriteToDTO(favorite);
    return this.http.put<{ favorite: favoriteDTO }>(this.API_BASE_URL, { favorite: dto })
      .pipe(
        map(result => ({ favorite: this.dtoToFavorite(result.favorite) })),
        catchError(this.handleError)
      );
  }

  deletefavorite(favorite: favorite): Observable<{ favorite: favorite }> {
    const dto = this.favoriteToDTO(favorite);
    return this.http.request<{ favorite: favoriteDTO }>('DELETE', this.API_BASE_URL, { body: { favorite: dto } })
      .pipe(
        map(result => ({ favorite: this.dtoToFavorite(result.favorite) })),
        catchError(this.handleError)
      );
  }

  // Mapping-Methoden
  private dtoToFavorite(dto: favoriteDTO): favorite {
    // Passe das Mapping ggf. an, falls sourceLanguage im DTO fehlt
    return {
      text: dto.text,
      languageKey: dto.languageKey,
      sourceLanguage: '' // oder aus DTO, falls vorhanden
    };
  }

  private favoriteToDTO(fav: favorite): favoriteDTO {
    return {
      id: 0, // oder eine echte ID, falls vorhanden
      text: fav.text,
      languageKey: fav.languageKey
    };
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

