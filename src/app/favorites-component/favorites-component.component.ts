import { Component, EventEmitter, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { favorite } from '../models/favorite';
import { favoriteService } from '../services/favorite.service';

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
  @Output() favoriteToTranslate = new EventEmitter<favorite>();
  cols!: Column[];
  favorites!: favorite[];
  editingFavorite: favorite | null = null; // Speichert den Favoriten, der bearbeitet wird
  editedText: string = ''; // Temporärer Text für die Bearbeitung

  constructor(private favoriteService: favoriteService) { }

  ngOnInit() {
    this.cols = [
      { field: 'number', header: 'Nummer' },
      { field: 'name', header: 'Name' },
    ];
    this.favoriteService.getfavorites().subscribe({
      next: (result: { favorites: favorite[] }) => {
        this.favorites = result.favorites;
      },
      error: err => {
        console.error('Fehler beim Abrufen der Favoriten:', err);
      }
    });

  }

  deleteFavorite(favorite: favorite) {
    const index = this.favorites.findIndex(fav => fav === favorite);
    if (index !== -1) {
      this.favoriteService.deletefavorite(favorite).subscribe({
        next: () => {
          this.favorites.splice(index, 1);
          console.log('Favorit erfolgreich gelöscht:', favorite);
        },
        error: err => {
          console.error('Fehler beim Löschen des Favoriten:', err);
        }
      });

    }
  }

  addFavorite(field: string, sourceLanguage: string, languageKey: string) {
    const newFavorite: favorite = { text: field, sourceLanguage: sourceLanguage, languageKey: languageKey };
    if (this.favorites.length >= 5 || this.isDuplicate(newFavorite)) {
      alert('You can only add 5 favorites');
      return;
    }
    this.favoriteService.addfavorite(newFavorite).subscribe({
      next: (result: { favorite: favorite }) => {
        this.favorites.push(newFavorite);
        console.log('Favorit erfolgreich hinzugefügt:', result.favorite);
      },
      error: err => {
        console.error('Fehler beim Hinzufügen des Favoriten:', err);
      }
    });
  }

  translateFavorite(favorite: favorite) {
    this.favoriteToTranslate.emit(favorite);
  }

  startEditing(favorite: favorite): void {
    this.editingFavorite = favorite;
    this.editedText = favorite.text; // Initialisiere den Text mit dem aktuellen Wert
  }

  confirmEdit(): void {
    if (this.editingFavorite) {
      this.favoriteService.updatefavorite(this.editingFavorite).subscribe({
        next: (result: { favorite: favorite }) => {
          console.log('Favorit erfolgreich aktualisiert:', result.favorite);
        },
        error: err => {
          console.error('Fehler beim Aktualisieren des Favoriten:', err);
        }
      });
      this.editingFavorite.text = this.editedText; // Aktualisiere den Favoriten
      this.editingFavorite = null; // Beende den Bearbeitungsmodus
    }
  }

  cancelEdit(): void {
    this.editingFavorite = null; // Beende den Bearbeitungsmodus ohne Änderungen
  }

  isDuplicate(favorite: favorite): boolean {
    return this.favorites.some(fav => fav.text === favorite.text && fav.sourceLanguage === favorite.sourceLanguage && fav.languageKey === favorite.languageKey);
  }
}
