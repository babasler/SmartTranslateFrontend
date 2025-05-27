import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { favorite, favoriteDTO } from '../models/favorite';

@Injectable({ providedIn: 'root' })
export class favoriteService {
  private readonly API_BASE_URL = '/api/favorites'; // dein Backend

  constructor(private http: HttpClient) {}

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
    console.log('Adding favorite:', dto);
    return this.http.post<favoriteDTO>(this.API_BASE_URL, dto)
      .pipe(
        map(result => (this.dtoToFavorite(result))),
        catchError(this.handleError)
      );
  }

  updatefavorite(favorite: favorite): Observable<favorite> {
    console.log('Updating favorite:', favorite);
    const dto = this.favoriteToDTO(favorite);
    console.log('Updating dto:', dto);
    return this.http.put<favoriteDTO>(this.API_BASE_URL,{
      id: dto.id, // ID muss im DTO vorhanden sein 
      text: dto.text,
      languageKey : dto.languageKey
     })
      .pipe(
        map(result => (this.dtoToFavorite(result))),
        catchError(this.handleError)
      );
  }

  deletefavorite(favorite: favorite): Observable<favorite> {

    const dto = this.favoriteToDTO(favorite);
    return this.http.request<favoriteDTO>('DELETE', this.API_BASE_URL, { body: { 
      text: dto.text,
      languageKey : dto.languageKey
     } })
      .pipe(
        map(result => (this.dtoToFavorite(result))),
        catchError(this.handleError)
      );
  }

  // Mapping-Methoden
  private dtoToFavorite(favoriteDTO:favoriteDTO): favorite {
    // Passe das Mapping gf. an, falls sourceLanguage im DTO fehlt
    if(favoriteDTO == null) {
      console.log('Ungültiges favoriteDTO');
      return {id:'', text: '', languageKey: '', sourceLanguage: '' };
    }
    console.log('Mapping to favorite:', favoriteDTO.id, favoriteDTO.text, favoriteDTO.languageKey);
    return {
      id: favoriteDTO.id ,
      text: favoriteDTO.text,
      languageKey: favoriteDTO.languageKey,
      sourceLanguage: '' // oder aus DTO, falls vorhanden
    };
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

  
}

