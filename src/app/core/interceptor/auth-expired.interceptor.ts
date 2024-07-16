// Importations nécessaires d'Angular et de RxJS
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginService } from '../../login/login.service';
import { StateStorageService } from '../auth/state-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthExpiredInterceptor implements HttpInterceptor {

  constructor(
    private loginService: LoginService,
    private stateStorageService: StateStorageService,
    private router: Router
  ) {}

  // Méthode d'interception des requêtes HTTP
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap({
        error: (err: any) => {
          if (err instanceof HttpErrorResponse && err.status === 401 && !err.url?.includes('api/account')) {
            this.handleUnauthorized();
          }
        }
      })
    );
  }

  // Méthode pour gérer le cas où l'accès est non autorisé (401)
  private handleUnauthorized(): void {
    this.stateStorageService.storeUrl(this.router.routerState.snapshot.url); // Stocke l'URL actuelle
    this.loginService.logout(); // Déconnecte l'utilisateur
    this.router.navigate(['/login']); // Redirige vers la page de connexion
  }
}
