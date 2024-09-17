import { StateStorageService } from './../core/auth/state-storage.service';
import { SignupRequest } from './../models/signup.request';
import { Login } from './../login/login.model';
import { JwtAuthentication } from './../models/Jwt.authentication.model';
import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Account } from '../models/account.model';
import { GenericCrudService } from './generic.crud.service';
import { Observable, tap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RessourceResponse } from './../models/ressource.response.model';

@Injectable({ providedIn: 'root' })
export class AuthentificationService extends GenericCrudService<Account> {

    constructor(http: HttpClient, toastService: ToastService,
        private stateStorageService: StateStorageService) {
        super(http, toastService, '/api/authentifications');
    }

    // Login User
    login(loginRequest: Login): Observable<JwtAuthentication> {
        return this.http.post<RessourceResponse<JwtAuthentication>>(`${this.baseUrl}/login`, loginRequest).pipe(
            tap(response => {
                this.stateStorageService.storeAuthenticationToken(response.content.accessToken, loginRequest.rememberMe); // Stockage du jeton JWT dans le stockage de l'état
            }),
            map(response => this.handleResponse(response, "L'utilisateur s'est connecté avec succès!")),
            catchError(error => this.handleError(error, "Erreur lors de la connexion"))
        );
    }

    // Login using QR code
    loginUsingQrCode(email: string): Observable<JwtAuthentication> {
        return this.http.post<RessourceResponse<JwtAuthentication>>(`${this.baseUrl}/usingqr/${email}`, {}).pipe(
            tap(response => {
                this.stateStorageService.storeAuthenticationToken(response.content.accessToken, false); // Stockage du jeton JWT dans le stockage de l'état
            }),
            map(response => this.handleResponse(response, "L'utilisateur s'est connecté avec succès!")),
            catchError(error => this.handleError(error, "Erreur lors de la connexion via QR code"))
        );
    }

    // Register a new user
    register(signUpRequest: SignupRequest): Observable<Account> {
        return this.http.post<RessourceResponse<Account>>(`${this.baseUrl}/register`, signUpRequest).pipe(
            map(response => this.handleResponse(response, "Utilisateur enregistré avec succès!")),
            catchError(error => this.handleError(error, "Erreur lors de l'enregistrement"))
        );
    }

    // Verify registration token
    verifyToken(token: string): Observable<string> {
        return this.http.post<RessourceResponse<string>>(`${this.baseUrl}/token/verify/${token}`, {}).pipe(
            map(response => this.handleResponse(response, "Vérification de l'enregistrement avec succès!")),
            catchError(error => this.handleError(error, "Erreur lors de la vérification du token"))
        );
    }

    // Resend verification token
    resendToken(token: string): Observable<boolean> {
        return this.http.post<RessourceResponse<boolean>>(`${this.baseUrl}/token/resend/${token}`, {}).pipe(
            map(response => this.handleResponse(response, "Renvoyer le jeton d'enregistrement avec succès!")),
            catchError(error => this.handleError(error, "Erreur lors de l'envoi du token"))
        );
    }

    // Forgot password
    forgotPassword(email: string): Observable<boolean> {
        return this.http.post<RessourceResponse<boolean>>(`${this.baseUrl}/password/forgot/${email}`, {}).pipe(
            map(response => this.handleResponse(response, "Jeton de mot de passe oublié envoyer avec succès!")),
            catchError(error => this.handleError(error, "Erreur lors de la demande de réinitialisation du mot de passe"))
        );
    }

    // Reset password
    resetPassword(token: string, newPassword: string): Observable<boolean> {
        return this.http.post<RessourceResponse<boolean>>(`${this.baseUrl}/password/reset`, { token, newPassword }).pipe(
            map(response => this.handleResponse(response, "Réinitialiser le mot de passe avec succès!")),
            catchError(error => this.handleError(error, "Erreur lors de la réinitialisation du mot de passe"))
        );
    }
}
