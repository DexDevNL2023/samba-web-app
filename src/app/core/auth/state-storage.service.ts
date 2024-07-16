// Importation du décorateur Injectable d'Angular
import { Injectable } from '@angular/core';

// Déclaration de la classe comme injectable dans l'injecteur racine
@Injectable({ providedIn: 'root' })
export class StateStorageService {
  // Déclaration des clés de stockage pour les différentes données
  private previousUrlKey = 'previousUrl';
  private authenticationKey = 'authenticationToken';
  private localeKey = 'locale';

  // Méthode pour stocker une URL dans le sessionStorage
  storeUrl(url: string): void {
    sessionStorage.setItem(this.previousUrlKey, JSON.stringify(url));
  }

  // Méthode pour récupérer l'URL stockée depuis le sessionStorage
  getUrl(): string | null {
    const previousUrl = sessionStorage.getItem(this.previousUrlKey);
    return previousUrl ? (JSON.parse(previousUrl) as string | null) : previousUrl;
  }

  // Méthode pour supprimer l'URL stockée du sessionStorage
  clearUrl(): void {
    sessionStorage.removeItem(this.previousUrlKey);
  }

  // Méthode pour stocker le jeton d'authentification soit dans le localStorage soit dans le sessionStorage
  storeAuthenticationToken(authenticationToken: string, rememberMe: boolean): void {
    authenticationToken = JSON.stringify(authenticationToken); // Sérialisation du jeton en chaîne JSON
    this.clearAuthenticationToken(); // Nettoyage des anciens jetons
    if (rememberMe) {
      localStorage.setItem(this.authenticationKey, authenticationToken); // Stockage dans le localStorage si "rememberMe" est vrai
    } else {
      sessionStorage.setItem(this.authenticationKey, authenticationToken); // Sinon, stockage dans le sessionStorage
    }
  }

  // Méthode pour récupérer le jeton d'authentification depuis le localStorage ou le sessionStorage
  getAuthenticationToken(): string | null {
    const authenticationToken = localStorage.getItem(this.authenticationKey) ?? sessionStorage.getItem(this.authenticationKey);
    return authenticationToken ? (JSON.parse(authenticationToken) as string | null) : authenticationToken;
  }

  // Méthode pour supprimer le jeton d'authentification du localStorage et du sessionStorage
  clearAuthenticationToken(): void {
    sessionStorage.removeItem(this.authenticationKey);
    localStorage.removeItem(this.authenticationKey);
  }

  // Méthode pour stocker la locale (langue) dans le sessionStorage
  storeLocale(locale: string): void {
    sessionStorage.setItem(this.localeKey, locale);
  }

  // Méthode pour récupérer la locale (langue) depuis le sessionStorage
  getLocale(): string | null {
    return sessionStorage.getItem(this.localeKey);
  }

  // Méthode pour supprimer la locale (langue) du sessionStorage
  clearLocale(): void {
    sessionStorage.removeItem(this.localeKey);
  }
}
