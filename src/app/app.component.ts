import { TranslatorComponentComponent } from "./translator-component/translator-component.component";
import { FavoritesComponentComponent } from "./favorites-component/favorites-component.component";
import { Component, OnInit, inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [TranslatorComponentComponent, FavoritesComponentComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'SmartTranslateFrontend';
  selectedFavoriteText: string[] = [];
  
  onFavoriteSelected(favorite: string[]): void {
    this.selectedFavoriteText = favorite;
  }
  private readonly oidcSecurityService = inject(OidcSecurityService);
  configuration$ = this.oidcSecurityService.getConfiguration();

  userData$ = this.oidcSecurityService.userData$;
  isAuthenticated = false;
  accessToken: string | null = null;


  ngOnInit(): void {
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, accessToken }) => {
      this.isAuthenticated = isAuthenticated;
      this.accessToken = accessToken;
      console.log('Auth:', isAuthenticated);
    });
  }

  login(): void {
    this.oidcSecurityService.authorize();
  }

  logout(): void {
    sessionStorage.clear();
    window.location.href =
      'https://eu-central-1gh9rdotof.auth.eu-central-1.amazoncognito.com/logout?client_id=34fiokko0g853qqd750osf419j&logout_uri=https://bastian-basler.de';
  }
}
