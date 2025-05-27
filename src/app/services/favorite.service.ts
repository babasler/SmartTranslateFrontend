import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { favorite, favoriteDTO } from '../models/favorite';

@Injectable({ providedIn: 'root' })
export class favoriteService {
  private readonly API_BASE_URL = '/api/favorites'; // dein Backend

  constructor(private http: HttpClient) { }

  getfavorites(): Observable<favorite[]> {
    return this.http.get<favoriteDTO[]>(this.API_BASE_URL)
      .pipe(
        map(result => (result && Array.isArray(result)
          ? result.map(dto => this.dtoToFavorite(dto))
          : []
        )),
        catchError(this.handleError)
      );
  }

  addfavorite(favorite: favorite): Observable<favorite> {
    const dto = this.favoriteToDTO(favorite);
    return this.http.post<favoriteDTO | favoriteDTO[]>(this.API_BASE_URL, dto)
      .pipe(
        map(result => {
          const dtoResult = Array.isArray(result) ? result[0] : result;
          return this.dtoToFavorite(dtoResult);
        }),
        catchError(this.handleError)
      );
  }

  updatefavorite(favorite: favorite): Observable<favorite> {
    const dto = this.favoriteToDTO(favorite);
    return this.http.put<favoriteDTO | favoriteDTO[]>(this.API_BASE_URL, {
      id: dto.id,
      text: dto.text,
      languageKey: dto.languageKey
    })
      .pipe(
        map(result => {
          const dtoResult = Array.isArray(result) ? result[0] : result;
          return this.dtoToFavorite(dtoResult);
        }),
        catchError(this.handleError)
      );
  }

  deletefavorite(favorite: favorite): void {
    const dto = this.favoriteToDTO(favorite);
    console.log('Deleting favorite:', dto.id, dto.text, dto.languageKey);
    this.http.delete(this.API_BASE_URL, {
      body: {
        id: dto.id,
        text: dto.text,
        languageKey: dto.languageKey
      }
    })
    .pipe(
      catchError(this.handleError)
    )
    .subscribe({
      next: () => console.log('Delete request sent to backend'),
      error: err => console.error('Fehler beim Löschen:', err)
    });
  }

  // Mapping-Methoden
  private dtoToFavorite(favoriteDTO: favoriteDTO): favorite { 
    console.log('Mapping to favorite:', favoriteDTO.id, favoriteDTO.text, favoriteDTO.languageKey);
    return {
      id: favoriteDTO.id, // oder eine echte ID, falls vorhanden
      text: favoriteDTO.text,
      languageKey: favoriteDTO.languageKey,
      sourceLanguage: this.getLangugageFromKey(favoriteDTO.languageKey) // Hier kannst du eine Standard-Sprache setzen oder anpassen 
    }
  }

  private favoriteToDTO(fav: favorite): favoriteDTO {
    return {
      id: fav.id, // oder eine echte ID, falls vorhanden
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

  private getLangugageFromKey(languageKey: string): string {
    // Hier kannst du eine Logik implementieren, um die Sprache aus dem languageKey zu extrahieren
    // Zum Beispiel:
    switch (languageKey) {
      case 'en':
        return 'Englisch';
      case 'de':
        return 'Deutsch';
      case 'fr':
        return 'Französisch';
      case 'es':
        return 'Spanisch';
      case 's':
        return 'Schwedisch';
      default:
        return 'Unknown Language'; // Standardwert, falls kein passender Key gefunden wird
    }
  }
}
