import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { favorite, favoriteDTO } from '../models/favorite';
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

export class FavoritesComponentComponent implements OnChanges {
  @Output() favoriteToTranslate = new EventEmitter<favorite>();
  @Input() newFavorite: favorite = { id: '', text: '', sourceLanguage: '', languageKey: '' };
  cols!: Column[];
  favorites: favorite[] = []; // Array für Favoriten
  editingFavorite: favorite | null = null; // Speichert den Favoriten, der bearbeitet wird
  editedText: string = ''; // Temporärer Text für die Bearbeitung

  constructor(private favoriteService: favoriteService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['newFavorite'] && changes['newFavorite'].currentValue.text) {
      this.setNewFavoriteHandler(changes['newFavorite'].currentValue);
    }
  }

  setNewFavoriteHandler(newFavorite: favorite): void {
    console.log('Neuer Favorit empfangen:', newFavorite);
    this.addFavorite(newFavorite.id, newFavorite.text, newFavorite.sourceLanguage, newFavorite.languageKey);
  }

  ngOnInit() {
    this.cols = [
      { field: 'number', header: 'Nummer' },
      { field: 'name', header: 'Name' },
    ];
    this.favoriteService.getfavorites().subscribe({
      next: (favorites: favorite[]) => {
        this.favorites = favorites;
        console.log('Favoriten erfolgreich abgerufen:', this.favorites);
      },
      error: err => {
        console.error('Fehler beim Abrufen der Favoriten:', err);
      }
    });

  }


  deleteFavorite(favorite: favorite) {
    const index = this.favorites.findIndex(fav => fav.id === favorite.id);
    if (index !== -1) {
      this.favoriteService.deletefavorite(favorite)
      this.favorites.splice(index, 1);
      console.log('Favorit erfolgreich gelöscht:', favorite);
    }
    else {
      console.error('Favorit nicht gefunden:', favorite);
    }
  }

  addFavorite(id: string, field: string, sourceLanguage: string, languageKey: string) {
    const newFavorite: favorite = { id: id, text: field, sourceLanguage: sourceLanguage, languageKey: languageKey };
    if (this.favorites.length >= 5 || this.isDuplicate(newFavorite)) {
      alert('You can only add 5 favorites');
      return;
    }
    this.favoriteService.addfavorite(newFavorite).subscribe({
      next: (favorite) => {
        this.favorites.push(favorite);
        console.log('Favorit erfolgreich hinzugefügt:', favorite);
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
      this.editingFavorite.text = this.editedText; // Aktualisiere den Favoriten
      console.log('Aktualisiere Favorit:', this.editingFavorite);
      this.favoriteService.updatefavorite(this.editingFavorite).subscribe({
        next: (favorite) => {
          console.log('Favorit erfolgreich aktualisiert:', favorite);
        },
        error: err => {
          console.error('Fehler beim Aktualisieren des Favoriten:', err);
        }
      });
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
