// Importations nécessaires d'Angular et de RxJS
import { isDevMode, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from './account.service';
import { StateStorageService } from './state-storage.service';

// Service injectable pour protéger les routes avec CanActivate
@Injectable({
  providedIn: 'root'
})
export class UserRouteAccessService implements CanActivate {

  constructor(
    private accountService: AccountService,
    private stateStorageService: StateStorageService,
    private router: Router
  ) {}

  // Méthode CanActivate pour protéger l'accès à une route
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.accountService.identity().pipe(
      map(account => {
        if (account) {
          const authorities = (next.data && next.data['authorities']) ? next.data['authorities'] : [];

          if (!authorities || authorities.length === 0 || this.accountService.hasAnyAuthority(authorities)) {
            return true; // Autoriser l'accès à la route
          }

          if (isDevMode()) {
            console.error('User does not have any of the required authorities:', authorities);
          }

          this.router.navigate(['accessdenied']);
          return false;
        }

        this.stateStorageService.storeUrl(state.url);
        this.router.navigate(['/login']);
        return false;
      })
    );
  }
}
