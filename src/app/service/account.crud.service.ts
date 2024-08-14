import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Account } from '../models/account.model';
import { GenericCrudService } from './generic.crud.service';
import { Observable, tap } from 'rxjs';
import { Rule } from '../models/rule.model';
import { AccountService } from '../core/auth/account.service';

@Injectable({ providedIn: 'root' })
export class AccountCrudService extends GenericCrudService<Account> {

  constructor(private accountService: AccountService, http: HttpClient) {
      super(http, 'accounts');
  }

  // Méthode pour récupérer toutes les rôles associées à un account
  getAllRoles(): Observable<Rule[]> {
      return this.http.get<Rule[]>(`${this.baseUrl}/${this.endpoint}/all/polices`);
  }

  // Change permission
  changePermission(form): Observable<Account> {
    return this.http.put<Account>(`${this.baseUrl}/${this.endpoint}/change/permission`, JSON.stringify(form))
      .pipe(
        tap((account: Account) => {
          this.accountService.authenticate(account);
        })
      );
  }
}
