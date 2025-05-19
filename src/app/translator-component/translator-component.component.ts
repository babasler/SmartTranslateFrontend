import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { favorite } from '../models/favorite';

interface language {
  name: string;
  code: string;
}

@Component({
  selector: 'translator-component',
  imports: [FormsModule, SelectModule, TextareaModule, IftaLabelModule, ButtonModule, CardModule],
  templateUrl: './translator-component.component.html',
  styleUrl: './translator-component.component.scss',
  standalone: true
})
export class TranslatorComponentComponent implements OnInit, OnChanges {
  possibleLanguages: language[] = [];
  sourceLanguage: language = { name: '', code: '' };
  targetLanguage: language = { name: '', code: '' };
  sourceText: string = '';
  targetText: string = '';

  @Input() setSourceTextFromFavorites: string[] = [];
  @Output() addFavorite = new EventEmitter<favorite>();

  ngOnInit() {
    this.possibleLanguages = [
      { name: 'Deutsch', code: 'de' },
      { name: 'Englisch', code: 'en' },
      { name: 'Spanisch', code: 'es' },
      { name: 'Schwedisch', code: 's' },
      { name: 'Französisch', code: 'fr' } // TODO: Hier mit Restabfrage arbeiten
    ];
  }

  ngOnChanges(): void {
    this.setSourceTextFromFavoritesHandler();
  }

  clear(): void {
    this.sourceText = '';
    this.targetText = '';
    this.sourceLanguage = { name: '', code: '' };
    this.targetLanguage = { name: '', code: '' };
  }
  canSaveAsFavorite(): boolean {
    return this.sourceText.length > 0 && this.sourceLanguage.code.length > 0
  }

  setSourceTextFromFavoritesHandler(): void {
    if (this.setSourceTextFromFavorites && this.setSourceTextFromFavorites.length > 0) {
      this.setSourceText(this.setSourceTextFromFavorites[0]); // Nutze das erste Element
      this.setSourceLanguage({ name: this.setSourceTextFromFavorites[1], code: this.setSourceTextFromFavorites[2] });
    }
  }
  
  setSourceText(text: string): void {
    this.sourceText = text;
  }
  setSourceLanguage(language: language): void {
    this.sourceLanguage = language;
  }
  canTranslate(): boolean {
    return this.sourceText.length > 0 && this.sourceLanguage.code.length > 0 && this.targetLanguage.code.length > 0;
  }
  translate(): void {
    this.targetText = 'Hello World'; // TODO: Hier mit Restabfrage arbeiten
  }
  saveAsFavorite(): void {
    const newFavorite: favorite = {
      field: this.sourceText,
      language: this.sourceLanguage.name,
      languageCode: this.sourceLanguage.code,
    };
  
    this.addFavorite.emit(newFavorite); // Event auslösen
  }
}
