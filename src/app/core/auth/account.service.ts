import { environment } from 'src/environments/environment';
// Importation des modules nécessaires depuis Angular et RxJS
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, ReplaySubject, of } from 'rxjs';
import { shareReplay, tap, catchError } from 'rxjs/operators';

// Importation des modèles et services spécifiques
import { StateStorageService } from './state-storage.service';
import { Account } from '../../models/account.model';
import { Permission } from '../../models/permission.model';
import { Notification } from '../../models/notification.model';
import { Registrant } from '../../models/registrant.model';
import { UserData } from '../../models/user-data.model';
import { DossierMedical } from '../../models/medical-record.model';
import { Souscription } from '../../models/souscription.model';
import { RuleReponse } from '../../models/rule.reponse.model';

/* // Déclaration du service injectable et accessible dans la racine de l'application
@Injectable({ providedIn: 'root' })
export class AccountService { 
  // Déclaration d'un signal pour stocker l'identité de l'utilisateur
  private userIdentity: Account | null;
  // Déclaration d'un sujet de rediffusion pour l'état d'authentification
  private authenticationState = new ReplaySubject<Account | null>(1);
  // Déclaration d'un cache pour les informations du compte
  private accountCache$?: Observable<Account> | null;

  // Déclaration de l'URL de base pour les requêtes API
  protected baseUrl = environment.apiUrl;

  // Injection des services nécessaires
  constructor(
    private http: HttpClient,
    private stateStorageService: StateStorageService,
    private router: Router
  ) {}

  // Méthode pour obtenir le compte de l'utilisateur actuellement connecté
  getCurrentAccount(): Account | null {
    return this.userIdentity;
  }

  // Méthode pour obtenir le compte de l'utilisateur actuellement connecté
  getIdForCurrentAccount(): number | null {
    return this.userIdentity?.id;
  }

  // Méthode pour sauvegarder les informations de compte via une requête POST
  save(account: Account): Observable<{}> {
    return this.http.post(`${this.baseUrl}/api/account`, account);
  }

  // Méthode pour authentifier un utilisateur et mettre à jour l'état d'authentification
  authenticate(identity: Account | null): void {
    this.userIdentity = identity; // Mise à jour du signal userIdentity
    this.authenticationState.next(this.userIdentity); // Notification de l'état d'authentification
    if (!identity) {
      this.accountCache$ = null; // Invalidation du cache si l'utilisateur est déconnecté
    }
  }

  // Méthode pour vérifier si l'utilisateur possède l'une des autorisations spécifiées
  hasAnyAuthority(authorities: string[] | string): boolean {
    const userIdentity = this.userIdentity;
    if (!userIdentity) {
      return false; // Retourne false si l'utilisateur n'est pas authentifié
    }
    if (!Array.isArray(authorities)) {
      authorities = [authorities]; // Convertit les autorisations en tableau si nécessaire
    }
    // Vérifie si l'utilisateur possède l'une des autorisations
    return userIdentity.authorities.some((authority: string) => authorities.includes(authority));
  }

  // Méthode pour récupérer l'identité de l'utilisateur, éventuellement avec force
  identity(force?: boolean): Observable<Account | null> {
    if (!this.accountCache$ || force) {
      this.accountCache$ = this.fetch().pipe(
        tap((account: Account) => {
          this.authenticate(account); // Authentifie l'utilisateur avec les données récupérées

          this.navigateToStoredUrl(); // Navigue vers l'URL précédemment stockée
        }),
        shareReplay(), // Partage et met en cache le résultat de l'observable
      );
    }
    return this.accountCache$.pipe(catchError(() => of(null))); // Gestion des erreurs
  }

  // Méthode pour vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    return this.userIdentity !== null; // Retourne true si userIdentity n'est pas null
  }

  // Méthode pour obtenir l'état d'authentification en tant qu'observable
  getAuthenticationState(): Observable<Account | null> {
    return this.authenticationState.asObservable(); // Retourne l'état d'authentification
  }

  // Méthode privée pour récupérer les informations de compte via une requête GET
  private fetch(): Observable<Account> {
    return this.http.get<Account>(`${this.baseUrl}/api/account`);
  }

  // Méthode privée pour naviguer vers l'URL précédemment stockée
  private navigateToStoredUrl(): void {
    // previousState peut être défini dans authExpiredInterceptor et userRouteAccessService
    // Si la connexion est réussie, navigue vers previousState et efface previousState
    const previousUrl = this.stateStorageService.getUrl();
    if (previousUrl) {
      this.stateStorageService.clearUrl();
      this.router.navigateByUrl(previousUrl);
    }
  }

  // Vérifie si l'utilisateur a le droit d'accès pour un module donné
  hasAccessToModule(roleKey: string): boolean {
    this.getAutorisations(this.getIdForCurrentAccount()).subscribe((roles: RuleReponse[]) => {
      return roles?.some(rule => rule?.roleKey === roleKey);
    });
    return false;
  }

  // Vérifie si l'utilisateur a le droit d'accès pour un traitement donné (ecrire, lire, modifier, suprimer ou imprimer)
  hasAccessToPermission(roleKey: string, permissionKey: string): boolean {
    this.getAutorisations(this.getIdForCurrentAccount()).subscribe((roles: RuleReponse[]) => {
      return roles?.some(rule => rule?.roleKey === roleKey && rule?.permissions?.some(permission => permission?.permissionKey === permissionKey));
    });
    return false;
  }

  // Méthode pour récupérer les information d'un utilisateur
  findUser(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/account/${userId}/user`);
  }

  // Méthode pour mettre à jour les information d'un utilisateur existante.
  updateUser(userId: number, user: any): Observable<any> {
    // Effectue une requête PUT et mappe la réponse pour convertir les dates du serveur.
    return this.http.put<any>(`${this.baseUrl}/api/account/${userId}/user`, user);
  }

  // Nouvelle méthode pour changer les authorities
  changeAuthorities(newAuthorities: string[]): void {
    if (this.userIdentity) {
      this.userIdentity.authorities = newAuthorities;
      this.authenticationState.next(this.userIdentity); // Met à jour l'état d'authentification
    }
  }

  // Méthode pour récupérer les dossiers médicaux d'un utilisateur
  getAutorisations(userId: number): Observable<RuleReponse[]> {
      return this.http.get<RuleReponse[]>(`${this.baseUrl}/api/account/${userId}/roles`);
  }

  // Méthode pour récupérer les dossiers médicaux d'un utilisateur
  getRegistrant(userId: number): Observable<Registrant> {
      return this.http.get<Registrant>(`${this.baseUrl}/api/account/${userId}/registrant`);
  }

  // Méthode pour récupérer les dossiers médicaux d'un utilisateur
  getMedicalRecords(userId: number): Observable<DossierMedical[]> {
      return this.http.get<DossierMedical[]>(`${this.baseUrl}/api/account/${userId}/dossiers`);
  }

  // Méthode pour récupérer les souscriptions d'un utilisateur
  getSouscriptions(userId: number): Observable<Souscription[]> {
      return this.http.get<Souscription[]>(`${this.baseUrl}/api/account/${userId}/souscriptions`);
  }

  // Méthode pour récupérer les notifications d'un utilisateur
  getNotifications(userId: number): Observable<Notification[]> {
      return this.http.get<Notification[]>(`${this.baseUrl}/api/account/${userId}/notifications`);
  }

  // Méthode pour récupérer les données combinées d'un utilisateur
  getUserDetails(userId: number): Observable<UserData> {
      return forkJoin({
        roles: this.getAutorisations(userId),
        registrant: this.getRegistrant(userId),
        dossiers: this.getMedicalRecords(userId),
        souscriptions: this.getSouscriptions(userId)
      });
  }
}
 */


// Exemple de données pour initialiser un compte
const exampleAccount = {
  id: 1, // id
  actived: true, // actived
  authorities: ['ROLE_CLIENT'], // authorities
  email: 'victor.nlang@teleo.com', // email
  fullName: 'Victor Nlang', // fullName
  langKey: 'en', // langKey
  login: 'victor.nlang', // login
  imageUrl: '', // imageUrl
  roles: [1, 2] // roles
};

// Déclaration du service injectable et accessible dans la racine de l'application
@Injectable({ providedIn: 'root' })
export class AccountService { 
  // Déclaration d'un signal pour stocker l'identité de l'utilisateur
  private userIdentity: Account | null = exampleAccount;
  // Déclaration d'un sujet de rediffusion pour l'état d'authentification
  private authenticationState = new ReplaySubject<Account | null>(1);
  // Déclaration d'un cache pour les informations du compte
  private accountCache$?: Observable<Account> | null;

  // Déclaration de l'URL de base pour les requêtes API
  protected baseUrl = environment.apiUrl;

  // Injection des services nécessaires
  constructor(
    private http: HttpClient
  ) {}

  // Méthode pour obtenir le compte de l'utilisateur actuellement connecté
  getCurrentAccount(): Account | null {
    return this.userIdentity;
  }

  // Méthode pour obtenir le compte de l'utilisateur actuellement connecté
  getIdForCurrentAccount(): number | null {
    return this.userIdentity?.id;
  }

  // Méthode pour sauvegarder les informations de compte via une requête POST
  save(account: Account): Observable<{}> {
    return of(exampleAccount);
  }

  // Méthode pour authentifier un utilisateur et mettre à jour l'état d'authentification
  authenticate(identity: Account | null): void {
    this.userIdentity = identity; // Mise à jour du signal userIdentity
    this.authenticationState.next(this.userIdentity); // Notification de l'état d'authentification
    if (!identity) {
      this.accountCache$ = null; // Invalidation du cache si l'utilisateur est déconnecté
    }
  }

  // Méthode pour vérifier si l'utilisateur possède l'une des autorisations spécifiées
  hasAnyAuthority(authorities: string[] | string): boolean {
    const userIdentity = this.userIdentity;
    if (!userIdentity) {
      return false; // Retourne false si l'utilisateur n'est pas authentifié
    }
    if (!Array.isArray(authorities)) {
      authorities = [authorities]; // Convertit les autorisations en tableau si nécessaire
    }
    // Vérifie si l'utilisateur possède l'une des autorisations
    return userIdentity.authorities.some((authority: string) => authorities.includes(authority));
  }

  // Méthode pour récupérer l'identité de l'utilisateur, éventuellement avec force
  identity(force?: boolean): Observable<Account | null> {
    if (!this.accountCache$ || force) {
      this.accountCache$ = this.fetch().pipe(
        tap((account: Account) => {
          this.authenticate(account); // Authentifie l'utilisateur avec les données récupérées
        }),
        shareReplay(), // Partage et met en cache le résultat de l'observable
      );
    }
    return this.accountCache$.pipe(catchError(() => of(null))); // Gestion des erreurs
  }

  // Méthode pour vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    return this.userIdentity !== null; // Retourne true si userIdentity n'est pas null
  }

  // Méthode pour obtenir l'état d'authentification en tant qu'observable
  getAuthenticationState(): Observable<Account | null> {
    return this.authenticationState.asObservable(); // Retourne l'état d'authentification
  }

  // Méthode privée pour récupérer les informations de compte via une requête GET
  private fetch(): Observable<Account> {
    return of(exampleAccount);
  }

  // Vérifie si l'utilisateur a le droit d'accès pour un module donné
  hasAccessToModule(roleKey: string): boolean {
    this.getAutorisations(this.getIdForCurrentAccount()).subscribe((roles: RuleReponse[]) => {
      return roles?.some(rule => rule?.roleKey === roleKey);
    });
    return false;
  } 

  // Vérifie si l'utilisateur a le droit d'accès pour un traitement donné (ecrire, lire, modifier, suprimer ou imprimer)
  hasAccessToPermission(roleKey: string, permissionKey: string): boolean {
    this.getAutorisations(this.getIdForCurrentAccount()).subscribe((roles: RuleReponse[]) => {
      return roles?.some(rule => rule?.roleKey === roleKey && rule?.permissions?.some(permission => permission?.permissionKey === permissionKey));
    });
    return false;
  }

  // Méthode pour récupérer les information d'un utilisateur
  findUser(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/account/${userId}/user`);
  }

  // Méthode pour mettre à jour les information d'un utilisateur existante.
  updateUser(userId: number, user: any): Observable<any> {
    // Effectue une requête PUT et mappe la réponse pour convertir les dates du serveur.
    return this.http.put<any>(`${this.baseUrl}/api/account/${userId}/user`, user);
  }

  // Nouvelle méthode pour changer les authorities
  changeAuthorities(newAuthorities: string[]): void {
    if (this.userIdentity) {
      this.userIdentity.authorities = newAuthorities;
      this.authenticationState.next(this.userIdentity); // Met à jour l'état d'authentification
    }
  }

  // Méthode pour récupérer les dossiers médicaux d'un utilisateur
  getAutorisations(userId: number): Observable<RuleReponse[]> {
      return this.http.get<RuleReponse[]>(`${this.baseUrl}/api/account/${userId}/roles`);
  }

  // Méthode pour récupérer les dossiers médicaux d'un utilisateur
  getRegistrant(userId: number): Observable<Registrant> {
      return this.http.get<Registrant>(`${this.baseUrl}/api/account/${userId}/registrant`);
  }

  // Méthode pour récupérer les dossiers médicaux d'un utilisateur
  getMedicalRecords(userId: number): Observable<DossierMedical[]> {
      return this.http.get<DossierMedical[]>(`${this.baseUrl}/api/account/${userId}/dossiers`);
  }

  // Méthode pour récupérer les souscriptions d'un utilisateur
  getSouscriptions(userId: number): Observable<Souscription[]> {
      return this.http.get<Souscription[]>(`${this.baseUrl}/api/account/${userId}/souscriptions`);
  }

  // Méthode pour récupérer les notifications d'un utilisateur
  getNotifications(userId: number): Observable<Notification[]> {
      return this.http.get<Notification[]>(`${this.baseUrl}/api/account/${userId}/notifications`);
  }

  // Méthode pour récupérer les données combinées d'un utilisateur
  getUserDetails(userId: number): Observable<UserData> {
      return forkJoin({
        roles: this.getAutorisations(userId),
        registrant: this.getRegistrant(userId),
        dossiers: this.getMedicalRecords(userId),
        souscriptions: this.getSouscriptions(userId)
      });
  }
}

