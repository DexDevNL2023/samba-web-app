import { ChangePasswordRequest } from './../models/change.password.request';
import { UserRequest } from './../models/user.request.model';
import { StateStorageService } from './../core/auth/state-storage.service';
import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Account } from '../models/account.model';
import { GenericCrudService } from './generic.crud.service';
import { Observable, tap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RessourceResponse } from './../models/ressource.response.model';
import { UserResponse } from '../models/user.response.model';

@Injectable({ providedIn: 'root' })
export class AccountCrudService extends GenericCrudService<Account> {

  constructor(http: HttpClient, toastService: ToastService,
    private stateStorageService: StateStorageService) {
        super(http, toastService, '/api/accounts');
  }

  // Mettre à jour le profil de l'utilisateur
  updateProfile(profileRequest: UserRequest): Observable<UserResponse> {
    return this.http.post<RessourceResponse<UserResponse>>(`${this.baseUrl}/${this.endpoint}/update/profile`, profileRequest).pipe(
      map(response => this.handleResponse(response, 'Mise à jour du profil')),
      catchError(error => this.handleError(error, 'Mise à jour du profil'))
    );
  }

  // Récupérer le profil par ID du compte
  getProfile(accountId: number): Observable<UserResponse> {
    return this.http.get<RessourceResponse<UserResponse>>(`${this.baseUrl}/${this.endpoint}/get/profile/${accountId}`).pipe(
      map(response => this.handleResponse(response, 'Récupération du profil')),
      catchError(error => this.handleError(error, 'Récupération du profil'))
    );
  }

  // Récupérer les informations de l'utilisateur courant
  getCurrentUser(): Observable<Account> {
    return this.http.get<RessourceResponse<Account>>(`${this.baseUrl}/${this.endpoint}/me`).pipe(
        map(response => this.handleResponse(response, 'Récupérer les informations de l\'utilisateur courant')),
        catchError(error => this.handleError(error, 'Récupérer les informations de l\'utilisateur courant'))
    );
  }

  // Déconnexion de l'utilisateur
  logout(): Observable<boolean> {
    return this.http.post<RessourceResponse<boolean>>(`${this.baseUrl}/${this.endpoint}/logout`, {}).pipe(
        tap(() => {
          this.stateStorageService.clearAuthenticationToken();  // Effet secondaire pour vider le token
        }),
        map(response => this.handleResponse(response, 'Déconnexion de l\'utilisateur')),
        catchError(error => this.handleError(error, 'Déconnexion de l\'utilisateur'))
    );
  }

  // Changer le mot de passe de l'utilisateur
  changePassword(form: ChangePasswordRequest): Observable<Account> {
    return this.http.put<RessourceResponse<Account>>(`${this.baseUrl}/${this.endpoint}/change/password`, form).pipe(
        map(response => this.handleResponse(response, 'Changer le mot de passe de l\'utilisateur')),
        catchError(error => this.handleError(error, 'Changer le mot de passe de l\'utilisateur'))
    );
  }

  // Suspendre un utilisateur
  suspend(userId: number): Observable<Account> {
    return this.http.delete<RessourceResponse<Account>>(`${this.baseUrl}/${this.endpoint}/suspend/${userId}`).pipe(
        map(response => this.handleResponse(response, 'Suspendre un utilisateur')),
        catchError(error => this.handleError(error, 'Suspendre un utilisateur'))
    );
  }

  // Récupérer les utilisateurs en fonction de leur rôle
  getUserWithRolesById(roleId: number): Observable<Account[]> {
    return this.http.get<RessourceResponse<Account[]>>(`${this.baseUrl}/${this.endpoint}/find/by/role/${roleId}`).pipe(
        map(response => this.handleResponse(response, 'Récupérer les utilisateurs en fonction de leur rôle')),
        catchError(error => this.handleError(error, 'Récupérer les utilisateurs en fonction de leur rôle'))
    );
  }
}
