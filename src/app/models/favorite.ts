export interface favorite {
    id: string; // Optional, da es beim Hinzufügen nicht benötigt wird
    text: string;
    languageKey: string;
    sourceLanguage: string;
}

export interface favoriteDTO {
  id: string;
  text: string;
  languageKey: string;
} 

