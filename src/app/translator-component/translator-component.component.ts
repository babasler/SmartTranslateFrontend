import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { favorite } from '../models/favorite';
import { translationService } from '../services/translate.service';
import { translation } from '../models/translation';

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

  @Input() setSourceTextFromFavorites: favorite = { id:'',text: '', sourceLanguage: '', languageKey: '' };
  @Output() addFavorite = new EventEmitter<favorite>();
  constructor(private translationService: translationService) { }

  ngOnInit() {
    this.possibleLanguages = [
      { name: 'Deutsch', code: 'de' },
      { name: 'Englisch', code: 'en' },
      { name: 'Spanisch', code: 'es' },
      { name: 'Schwedisch', code: 'se' },
      { name: 'Französisch', code: 'fr' }      
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
    if (this.setSourceTextFromFavorites ) {
      this.setSourceText(this.setSourceTextFromFavorites.text); // Nutze das erste Element
      this.setSourceLanguage({ name: this.setSourceTextFromFavorites.sourceLanguage, code: this.setSourceTextFromFavorites.languageKey });
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
    if (!this.canTranslate()) {
      return; // Übersetzung nur durchführen, wenn alle Bedingungen erfüllt sind
    }
    console.log('Übersetze:', this.sourceText, 'von', this.sourceLanguage.code, 'nach', this.targetLanguage.code);
    this.translationService.translate(this.sourceText, this.sourceLanguage.code, this.targetLanguage.code)
      .subscribe((result: translation) => {
        // Assuming result has a property 'translatedText'
        this.targetText = result.text;
      });
  }
  saveAsFavorite(): void {
    const newFavorite: favorite = {
      id: '', // ID wird beim Hinzufügen nicht benötigt, wird vom Backend generiert
      text: this.sourceText,
      sourceLanguage: this.sourceLanguage.name,
      languageKey: this.sourceLanguage.code,
    };
  
    this.addFavorite.emit(newFavorite); // Event auslösen
  }
}
