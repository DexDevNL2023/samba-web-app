import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Account } from '../models/account.model';
import { GenericCrudService } from './generic.crud.service';
import { Observable } from 'rxjs';
import { Rule } from '../models/rule.model';

@Injectable({ providedIn: 'root' })
export class AccountCrudService extends GenericCrudService<Account> {

  constructor(http: HttpClient) {
      super(http, 'accounts');
  }

  // Méthode pour récupérer toutes les rôles associées à un account
  getAllRoles(): Observable<Rule[]> {
      return this.http.get<Rule[]>(`${this.baseUrl}/${this.endpoint}/all/polices`);
  }
}
