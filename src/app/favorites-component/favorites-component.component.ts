import { Component, EventEmitter, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { favorite } from '../models/favorite';

interface Column {
  field: string;
  header: string;
}


@Component({
  selector: 'favorites-component',
  imports: [TableModule, CommonModule, ButtonModule, FormsModule],
  standalone: true,
  templateUrl: './favorites-component.component.html',
  styleUrl: './favorites-component.component.scss'
})
export class FavoritesComponentComponent {
  @Output() favoriteToTranslate = new EventEmitter<string[]>();
  cols!: Column[];
  favorites!: favorite[];
  editingFavorite: favorite | null = null; // Speichert den Favoriten, der bearbeitet wird
  editedText: string = ''; // Temporärer Text für die Bearbeitung


  ngOnInit() {
    this.cols = [
      { field: 'number', header: 'Nummer' },
      { field: 'name', header: 'Name' },
    ];
    this.favorites = [
      { field: 'Pizza', language: 'Englisch', languageCode: 'en' },
      { field: 'Pasta', language: 'Englisch', languageCode: 'en' },
      { field: 'Salat', language: 'Englisch', languageCode: 'en' },
      { field: 'Sushi', language: 'Englisch', languageCode: 'en' },
      { field: 'Burger', language: 'Englisch', languageCode: 'en' },

    ];
  }

  deleteFavorite(favorite: favorite) {
    const index = this.favorites.findIndex(fav => fav === favorite);
    if (index !== -1) {
      this.favorites.splice(index, 1);
    }
  }

  addFavorite(field: string, language: string, languageCode: string) {
    const newFavorite: favorite = { field: field, language: language, languageCode: languageCode };
    if (this.favorites.length >= 5 || this.isDuplicate(newFavorite)) {
      alert('You can only add 5 favorites');
      return;
    }
    this.favorites.push(newFavorite);
  }
  
  translateFavorite(favorite: favorite) {
    const toSend: string[] = [favorite.field, favorite.language, favorite.languageCode];
    this.favoriteToTranslate.emit(toSend);
  }

  startEditing(favorite: favorite): void {
    this.editingFavorite = favorite;
    this.editedText = favorite.field; // Initialisiere den Text mit dem aktuellen Wert
  }

  confirmEdit(): void {
    if (this.editingFavorite) {
      this.editingFavorite.field = this.editedText; // Aktualisiere den Favoriten
      this.editingFavorite = null; // Beende den Bearbeitungsmodus
    }
  }

  cancelEdit(): void {
    this.editingFavorite = null; // Beende den Bearbeitungsmodus ohne Änderungen
  }

  isDuplicate(favorite: favorite): boolean {
    return this.favorites.some(fav => fav.field === favorite.field && fav.language === favorite.language && fav.languageCode === favorite.languageCode);
  }
}
