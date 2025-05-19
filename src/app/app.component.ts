import { Component } from '@angular/core';
import { TranslatorComponentComponent } from "./translator-component/translator-component.component";
import { FavoritesComponentComponent } from "./favorites-component/favorites-component.component";

@Component({
  selector: 'app-root',
  imports: [TranslatorComponentComponent, FavoritesComponentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'SmartTranslateFrontend';
  selectedFavoriteText: string[] = [];
  
  onFavoriteSelected(favorite: string[]): void {
    this.selectedFavoriteText = favorite;
  }
}
