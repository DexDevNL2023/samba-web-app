// Importation des modules nécessaires depuis Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Importation des services et modèles internes nécessaires
import { StateStorageService } from './state-storage.service';
import { environment } from '../../../environments/environment';
import { Login } from '../../login/login.model';

// Définition du type JwtToken pour représenter le jeton JWT
type JwtToken = {
  id_token: string;
};

// Décoration de la classe comme injectable dans l'injecteur racine
@Injectable({ providedIn: 'root' })
export class AuthServerProvider {
  // Déclaration de l'URL de base pour les requêtes API, provenant des variables d'environnement
  protected baseUrl = environment.apiUrl;

  // Injection des services HttpClient et StateStorageService
  constructor(
    private http: HttpClient,
    private stateStorageService: StateStorageService
  ) {}

  // Méthode pour récupérer le jeton d'authentification stocké
  getToken(): string {
    return this.stateStorageService.getAuthenticationToken() ?? '';
  }

  // Méthode pour gérer la connexion de l'utilisateur
  login(credentials: Login): Observable<void> {
    return this.http
      .post<JwtToken>(`${this.baseUrl}/api/authenticate`, credentials) // Envoi des informations de connexion à l'API pour authentification
      .pipe(map(response => this.authenticateSuccess(response, credentials.rememberMe))); // Gestion de la réponse et stockage du jeton
  }

  // Méthode pour gérer la déconnexion de l'utilisateur
  logout(): Observable<void> {
    return new Observable(observer => {
      this.stateStorageService.clearAuthenticationToken(); // Suppression du jeton d'authentification stocké
      observer.complete(); // Indication que l'observable est complété
    });
  }

  // Méthode privée pour gérer le succès de l'authentification
  private authenticateSuccess(response: JwtToken, rememberMe: boolean): void {
    this.stateStorageService.storeAuthenticationToken(response.id_token, rememberMe); // Stockage du jeton JWT dans le stockage de l'état
  }
}
