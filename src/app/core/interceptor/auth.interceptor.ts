// Importations nécessaires d'Angular et RxJS
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StateStorageService } from '../auth/state-storage.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(private stateStorageService: StateStorageService) {}

  // Déclaration de l'URL de base pour les requêtes API, provenant des variables d'environnement
  protected baseUrl = environment.apiUrl;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Vérifie si l'URL de la requête est valide et commence par http
    if (!request.url || (request.url.startsWith('http') && !(this.baseUrl && request.url.startsWith(this.baseUrl)))) {
      return next.handle(request); // Si l'URL n'est pas valide ou ne correspond pas à la base URL, passe la requête au prochain gestionnaire sans modification
    }

    const token: string | null = this.stateStorageService.getAuthenticationToken(); // Récupère le jeton d'authentification du service de stockage d'état
    if (token) {
      // Clone la requête en ajoutant un en-tête Authorization avec le jeton
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(request); // Passe la requête (modifiée ou non) au prochain gestionnaire
  }
}
