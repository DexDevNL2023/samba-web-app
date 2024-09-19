import { Souscription } from './../../models/souscription.model';
import { SouscriptionService } from './../../service/souscription.service';
import { DossierMedical } from './../../models/dossier-medical.model';
import { DossierMedicalService } from './../../service/dossier-medical.service';
import { Registrant } from './../../models/registrant.model';
import { RegistrantService } from './../../service/registrant.service';
import { UserData } from './../../models/user-data.model';
import { AuthorizationService } from './../../service/authorization.service';
import { environment } from 'src/environments/environment';
// Importation des modules nécessaires depuis Angular et RxJS
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable, ReplaySubject, of } from 'rxjs';
import { shareReplay, tap, catchError } from 'rxjs/operators';

// Importation des modèles et services spécifiques
import { StateStorageService } from './state-storage.service';
import { Account } from '../../models/account.model';
import { RuleReponse } from '../../models/rule.reponse.model';
import { AccountCrudService } from '../../service/account.crud.service';

// Déclaration du service injectable et accessible dans la racine de l'application
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
    private accountCrudService: AccountCrudService,
    private authorizationService: AuthorizationService,
    private dossierMedicalService: DossierMedicalService,
    private souscriptionService: SouscriptionService,
    private registrantService: RegistrantService,
    private stateStorageService: StateStorageService,
    private router: Router
  ) {}

  // Méthode pour récupérer le jeton d'authentification stocké
  getToken(): string {
    return this.stateStorageService.getAuthenticationToken() ?? '';
  }

  // Méthode pour obtenir le compte de l'utilisateur actuellement connecté
  getCurrentAccount(): Account | null {
    return this.userIdentity;
  }

  // Méthode pour obtenir le compte de l'utilisateur actuellement connecté
  getIdForCurrentAccount(): number | null {
    return this.userIdentity?.id;
  }

  // Méthode pour authentifier un utilisateur et mettre à jour l'état d'authentification
  authenticate(identity: Account | null): void {
    if (identity) {
      this.userIdentity = identity;
      this.authenticationState.next(this.userIdentity); // Mise à jour de l'état d'authentification
    } else {
      this.accountCache$ = null; // Invalidation du cache si l'utilisateur est déconnecté
    }
  }

  // Méthode pour récupérer l'identité de l'utilisateur, éventuellement avec force
  identity(force?: boolean): Observable<Account | null> {
    if (!this.accountCache$ || force) {
      this.accountCache$ = this.fetch().pipe(
        tap((account: Account) => {
          this.authenticate(account); // Authentification avec les données récupérées
          this.navigateToStoredUrl(); // Redirection après authentification
        }),
        shareReplay(),
      );
    }
    return this.accountCache$.pipe(catchError(() => of(null)));
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
    return this.accountCrudService.getCurrentUser();
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

  // Méthode pour vérifier si l'utilisateur possède l'une des autorisations spécifiées
  hasAnyAuthority(authorities: string[] | string): boolean {
    // Vérification si l'utilisateur est authentifié
    if (!this.userIdentity || !this.userIdentity.authority) {
      return false; // Retourne false si l'utilisateur n'est pas authentifié ou n'a pas d'autorité
    }

    // Si 'authorities' n'est pas un tableau, le convertir en tableau
    if (!Array.isArray(authorities)) {
      authorities = [authorities];
    }

    // Vérification si l'utilisateur possède l'une des autorisations spécifiées
    return authorities.some((authority: string) => authority === this.userIdentity.authority);
  }

  // Vérifie si l'utilisateur a le droit d'accès pour un module donné
  hasAccessToModule(roleKey: string, roles: RuleReponse[]): boolean {
    return roles?.some(rule => rule?.roleKey === roleKey);
  }

  // Vérifie si l'utilisateur a le droit d'accès pour un traitement donné (ecrire, lire, modifier, suprimer ou imprimer)
  hasAccessToPermission(roleKey: string, permissionKey: string, roles: RuleReponse[]): boolean {
    return roles?.some(rule => rule?.roleKey === roleKey && rule?.permissions?.some(permission => permission?.permissionKey === permissionKey));
  }

  // Méthode pour récupérer les dossiers médicaux d'un utilisateur
  getAutorisations(userId: number): Observable<RuleReponse[]> {
      return this.authorizationService.getAllAutorisations(userId).pipe(
        catchError(() => of([])) // En cas d'erreur, renvoie un tableau vide
      );
  }

  // Méthode pour récupérer les dossiers médicaux d'un utilisateur
  getRegistrant(userId: number): Observable<Registrant | null> {
      return this.registrantService.getByUserId(userId).pipe(
        catchError(() => of(null)) // En cas d'erreur, renvoie null
      );
  }

  // Méthode pour récupérer les dossiers médicaux d'un utilisateur
  getMedicalRecords(userId: number): Observable<DossierMedical[]> {
      return this.dossierMedicalService.getByUserId(userId).pipe(
        catchError(() => of([])) // En cas d'erreur, renvoie un tableau vide
      );
  }

  // Méthode pour récupérer les souscriptions d'un utilisateur
  getSouscriptions(userId: number): Observable<Souscription[]> {
      return this.souscriptionService.getByUserId(userId).pipe(
        catchError(() => of([])) // En cas d'erreur, renvoie un tableau vide
      );
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