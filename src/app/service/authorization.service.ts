import { PermissionFormRequest } from './../models/permission.form.request';
import { RuleReponse } from './../models/rule.reponse.model';
import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Account } from '../models/account.model';
import { GenericCrudService } from './generic.crud.service';
import { Observable, tap, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RessourceResponse } from './../models/ressource.response.model';

@Injectable({ providedIn: 'root' })
export class AuthorizationService extends GenericCrudService<Account> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, 'api/autorisations');
    }

    // Récupérer les autorisations pour un utilisateur donné
    getAllAutorisations(userId: number): Observable<RuleReponse[]> {
        return this.http.get<RessourceResponse<RuleReponse[]>>(`${this.resourceUrl}/${userId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer les autorisations')),
            catchError(() => of([]))
        );
    }

    // Changer les autorisations
    changeAutorisation(dto: PermissionFormRequest): Observable<Account> {
        return this.http.put<RessourceResponse<Account>>(`${this.resourceUrl}/change/autorisations`, dto).pipe(
            map(response => this.handleResponse(response, 'Changer les autorisations')),
            catchError(() => of(null))
        );
    }

    // Récupérer le login de l'utilisateur courant
    getCurrentUserLogin(): Observable<string | null> {
        return this.http.get<RessourceResponse<string>>(`${this.resourceUrl}/current/user/name`).pipe(
            map(response => this.handleResponse(response, 'Récupérer le login de l\'utilisateur courant')),
            catchError(() => of(null))
        );
    }

    // Récupérer le JWT de l'utilisateur courant
    getCurrentUserJWT(): Observable<string | null> {
        return this.http.get<RessourceResponse<string>>(`${this.resourceUrl}/current/user/jwt`).pipe(
            map(response => this.handleResponse(response, 'Récupérer le JWT de l\'utilisateur courant')),
            catchError(() => of(null))
        );
    }

    // Vérifier si l'utilisateur courant a une autorité spécifique
    hasCurrentUserThisAuthority(authorities: string[] | string): Observable<boolean> {
        return this.http.get<RessourceResponse<boolean>>(`${this.resourceUrl}/current/user/have/this/authoritie/${authorities}`).pipe(
            map(response => this.handleResponse(response, 'Vérifier l\'autorité de l\'utilisateur courant')),
            catchError(() => of(false))
        );
    }

    // Vérifier si l'utilisateur courant a au moins une des autorités spécifiées
    hasCurrentUserAnyOfAuthorities(...authorities: string[]): Observable<boolean> {
        return this.http.get<RessourceResponse<boolean>>(`${this.resourceUrl}/current/user/any/Of/authorities/${authorities.join(',')}`).pipe(
            map(response => this.handleResponse(response, 'Vérifier si l\'utilisateur courant a une des autorités')),
            catchError(() => of(false))
        );
    }

    // Vérifier si l'utilisateur courant n'a aucune des autorités spécifiées
    hasCurrentUserNoneOfAuthorities(...authorities: string[]): Observable<boolean> {
        return this.http.get<RessourceResponse<boolean>>(`${this.resourceUrl}/current/user/none/Of/authorities/${authorities.join(',')}`).pipe(
            map(response => this.handleResponse(response, 'Vérifier si l\'utilisateur courant n\'a aucune des autorités')),
            catchError(() => of(false))
        );
    }

    // Vérifier si l'utilisateur courant est authentifié
    isAuthenticated(): Observable<boolean> {
        return this.http.get<RessourceResponse<boolean>>(`${this.resourceUrl}/current/user/is/authenticated`).pipe(
            map(response => this.handleResponse(response, 'Vérifier l\'authentification de l\'utilisateur courant')),
            catchError(() => of(false))
        );
    }
}
