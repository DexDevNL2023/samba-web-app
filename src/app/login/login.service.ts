import { AuthentificationService } from './../service/authentification.service';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Login } from './login.model';
import { AccountService } from '../core/auth/account.service';
import { Account } from '../models/account.model';
import { AccountCrudService } from '../service/account.crud.service';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(
    private accountService: AccountService,
    private authServerProvider: AuthentificationService,
    private accountCrudService: AccountCrudService
  ) {}

  login(credentials: Login): Observable<Account | null> {
    return this.authServerProvider.login(credentials).pipe(
      mergeMap(() => this.accountService.identity(true))
    );
  }

  logout(): void {
    this.accountCrudService.logout().subscribe({
      complete: () => this.accountService.authenticate(null)
    });
  }
}
