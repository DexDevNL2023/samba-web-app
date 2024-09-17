import { PermissionFormRequest } from './../models/permission.form.request';
import { RuleReponse } from './../models/rule.reponse.model';
import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Account } from '../models/account.model';
import { GenericCrudService } from './generic.crud.service';
import { Observable, tap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RessourceResponse } from './../models/ressource.response.model';

@Injectable({ providedIn: 'root' })
export class AuthorizationService extends GenericCrudService<Account> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, '/api/autorisations');
    }

    // Récupérer les autorisations pour un utilisateur donné
    getAllAutorisations(userId: number): Observable<RuleReponse[]> {
        return this.http.get<RessourceResponse<RuleReponse[]>>(`${this.baseUrl}/${userId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer les autorisations')),
            catchError(error => this.handleError(error, 'Récupérer les autorisations'))
        );
    }

    // Changer les autorisations
    changeAutorisation(dto: PermissionFormRequest): Observable<Account> {
        return this.http.put<RessourceResponse<Account>>(`${this.baseUrl}/change/autorisations`, dto).pipe(
            map(response => this.handleResponse(response, 'Changer les autorisations')),
            catchError(error => this.handleError(error, 'Changer les autorisations'))
        );
    }

    // Récupérer le login de l'utilisateur courant
    getCurrentUserLogin(): Observable<string | null> {
        return this.http.get<string>(`${this.baseUrl}/current/user/name`).pipe(
            catchError(error => this.handleError(error, 'Récupérer le login de l\'utilisateur courant'))
        );
    }

    // Récupérer le JWT de l'utilisateur courant
    getCurrentUserJWT(): Observable<string | null> {
        return this.http.get<string>(`${this.baseUrl}/current/user/jwt`).pipe(
            catchError(error => this.handleError(error, 'Récupérer le JWT de l\'utilisateur courant'))
        );
    }

    // Vérifier si l'utilisateur courant a une autorité spécifique
    hasCurrentUserThisAuthority(authority: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.baseUrl}/current/user/have/this/authoritie/${authority}`).pipe(
            catchError(error => this.handleError(error, 'Vérifier l\'autorité de l\'utilisateur courant'))
        );
    }

    // Vérifier si l'utilisateur courant a au moins une des autorités spécifiées
    hasCurrentUserAnyOfAuthorities(...authorities: string[]): Observable<boolean> {
        return this.http.get<boolean>(`${this.baseUrl}/current/user/any/Of/authorities/${authorities.join(',')}`).pipe(
            catchError(error => this.handleError(error, 'Vérifier si l\'utilisateur courant a une des autorités'))
        );
    }

    // Vérifier si l'utilisateur courant n'a aucune des autorités spécifiées
    hasCurrentUserNoneOfAuthorities(...authorities: string[]): Observable<boolean> {
        return this.http.get<boolean>(`${this.baseUrl}/current/user/none/Of/authorities/${authorities.join(',')}`).pipe(
            catchError(error => this.handleError(error, 'Vérifier si l\'utilisateur courant n\'a aucune des autorités'))
        );
    }

    // Vérifier si l'utilisateur courant est authentifié
    isAuthenticated(): Observable<boolean> {
        return this.http.get<boolean>(`${this.baseUrl}/current/user/is/authenticated`).pipe(
            catchError(error => this.handleError(error, 'Vérifier l\'authentification de l\'utilisateur courant'))
        );
    }
}
