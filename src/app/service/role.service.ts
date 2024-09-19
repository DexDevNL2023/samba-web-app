import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { GenericCrudService } from './generic.crud.service';
import { Rule } from '../models/rule.model';
import { map, catchError } from 'rxjs/operators';
import { RessourceResponse } from './../models/ressource.response.model';

@Injectable({ providedIn: 'root' })
export class RoleService extends GenericCrudService<Rule> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, 'api/roles');
    }

    // Méthode pour récupérer tous les rôles associés à un accountId
    getAllByAccountId(accountId: number): Observable<Rule[]> {
        return this.http.get<RessourceResponse<Rule[]>>(`${this.resourceUrl}/find/by/account/${accountId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer les roles par utilisateur')),
            catchError(() => of([]))
        );
    }
}
