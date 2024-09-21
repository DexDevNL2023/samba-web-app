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
import { shareReplay, tap, catchError, map, mergeMap, switchMap } from 'rxjs/operators';

// Importation des modèles et services spécifiques
import { StateStorageService } from './state-storage.service';
import { Account } from '../../models/account.model';
import { RuleReponse } from '../../models/rule.reponse.model';
import { AccountCrudService } from '../../service/account.crud.service';

// Déclaration du service injectable et accessible dans la racine de l'application
@Injectable({ providedIn: 'root' })
export class AccountService {
  // Déclaration de l'identité de l'utilisateur et des rôles
  private userIdentity: Account | null = null;
  private rolesIdentity: RuleReponse[] = [];

  // États d'authentification et de rôles avec des sujets de rediffusion
  private authenticationState = new ReplaySubject<Account | null>(1);
  private roleState = new ReplaySubject<RuleReponse[]>(1);

  // Cache pour les informations du compte et des rôles
  private accountCache$?: Observable<Account> | null;
  private roleCache$?: Observable<RuleReponse[]> | null;

  // Base URL pour les requêtes API
  protected baseUrl = environment.apiUrl;

  constructor(
    private accountCrudService: AccountCrudService,
    private authorizationService: AuthorizationService,
    private dossierMedicalService: DossierMedicalService,
    private souscriptionService: SouscriptionService,
    private registrantService: RegistrantService,
    private stateStorageService: StateStorageService,
    private router: Router
  ) {}

  // Récupère le jeton JWT stocké
  getToken(): string {
    return this.stateStorageService.getAuthenticationToken() ?? '';
  }

  // Récupère l'utilisateur actuellement connecté
  getCurrentAccount(): Account | null {
    return this.userIdentity;
  }

  // Récupère l'ID de l'utilisateur actuellement connecté
  getIdForCurrentAccount(): number | null {
    return this.userIdentity?.id ?? null;
  }

  // Authentifie l'utilisateur et met à jour son état
  authenticate(identity: Account | null): void {
    this.userIdentity = identity;
    this.authenticationState.next(identity);
    this.accountCache$ = identity ? of(identity) : null; // Réinitialise le cache si déconnexion
  }

  // Récupère l'identité de l'utilisateur, avec possibilité de forcer la récupération, et récupère également les rôles
  /* identity(force?: boolean): Observable<Account | null> {
    // Si le cache n'existe pas ou si l'on force la récupération, on rafraîchit les données
    if (!this.accountCache$ || force) {
      this.accountCache$ = this.fetchAccount().pipe(
        tap((account: Account) => {
          //this.userIdentity = account;  // Assurez-vous que userIdentity est bien assignée ici
          this.authenticate(account); // Authentification avec les données récupérées
        }),
        mergeMap((account: Account) =>
          this.getRoles(true).pipe(
            tap({
              next: () => {
                this.navigateToStoredUrl(); // Redirection après authentification
              },
              error: (error) => {
                console.error('Erreur lors de la récupération des rôles :', error);
              }
            }),
            map(() => account) // Retourne l'utilisateur après la récupération des rôles
          )
        ),
        catchError((error) => {
          console.error('Erreur lors de la récupération du compte utilisateur :', error);
          return of(null); // Retourne null en cas d'erreur
        }),
        shareReplay(1) // Partage la réponse et évite des appels multiples
      );
    }

    // Retourne l'identité de l'utilisateur depuis le cache ou la nouvelle récupération
    return this.accountCache$;
  } */
    identity(force?: boolean): Observable<Account | null> {
      if (!this.accountCache$ || force) {
        this.accountCache$ = this.fetchAccount().pipe(
          tap((account: Account) => {
            this.authenticate(account);
          }),
          switchMap((account: Account) => {
            const userId = this.getIdForCurrentAccount();
            if (userId !== null) {
              return this.getRoles(true).pipe(
                tap({
                  next: () => {
                    this.navigateToStoredUrl();
                  },
                  error: (error) => {
                    console.error('Erreur lors de la récupération des rôles :', error);
                  }
                }),
                map(() => account)
              );
            } else {
              console.error('ID utilisateur non trouvé');
              return of(account); // Renvoyer simplement l'account sans les rôles
            }
          }),
          catchError((error) => {
            console.error('Erreur lors de la récupération du compte utilisateur :', error);
            return of(null);
          }),
          shareReplay(1)
        );
      }

      return this.accountCache$;
    }

  // Vérifie si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    return this.userIdentity !== null;
  }

  // Retourne l'état d'authentification sous forme d'Observable
  getUserState(): Observable<Account | null> {
    return this.authenticationState.asObservable();
  }

  // Vérifie si l'utilisateur possède une ou plusieurs autorisations
  hasAnyAuthority(authorities: string[] | string): boolean {
    if (!this.userIdentity || !this.userIdentity.authority) {
      console.log('Utilisateur non authentifié ou pas d\'autorité');
      return false;
    }
    const authorityArray = Array.isArray(authorities) ? authorities : [authorities];
    return authorityArray.includes(this.userIdentity.authority as string);
  }

  // Récupère les rôles de l'utilisateur connecté, avec possibilité de forcer la récupération
  getRoles(force?: boolean): Observable<RuleReponse[]> {
    if (!this.roleCache$ || force) {
      this.roleCache$ = this.fetchRoles().pipe(
        tap((roles: RuleReponse[]) => this.setRoles(roles)),
        shareReplay()
      );
    }
    return this.roleCache$.pipe(catchError(() => of([])));
  }

  // Définit les rôles de l'utilisateur et met à jour l'état des rôles
  setRoles(roles: RuleReponse[]): void {
    this.rolesIdentity = roles ?? [];
    this.roleState.next(this.rolesIdentity);
  }

  // Retourne les rôles sous forme d'Observable
  getRoleState(): Observable<RuleReponse[]> {
    return this.roleState.asObservable();
  }

  // Vérifie si l'utilisateur a accès à un module spécifique
  hasAccessToModule(roleKey: string): boolean {
    return this.rolesIdentity.some(role => role?.roleKey === roleKey);
  }

  // Vérifie si l'utilisateur a accès à une permission spécifique
  hasAccessToPermission(roleKey: string, permissionKey: string): Observable<boolean> {
    const hasPermission = this.rolesIdentity.some(
      role => role?.roleKey === roleKey && role?.permissions?.some(permission => permission?.permissionKey === permissionKey)
    );
    return of(hasPermission); // Return as Observable
  }

  // Récupère les autorisations de l'utilisateur via le service AuthorizationService
  getAutorisations(userId: number): Observable<RuleReponse[]> {
    return this.authorizationService.getAllAutorisations(userId).pipe(catchError(() => of([])));
  }

  // Méthodes pour récupérer des données liées à l'utilisateur
  getRegistrant(userId: number): Observable<Registrant | null> {
    return this.registrantService.getByUserId(userId).pipe(catchError(() => of(null)));
  }

  getMedicalRecords(userId: number): Observable<DossierMedical[]> {
    return this.dossierMedicalService.getByUserId(userId).pipe(catchError(() => of([])));
  }

  getSouscriptions(userId: number): Observable<Souscription[]> {
    return this.souscriptionService.getByUserId(userId).pipe(catchError(() => of([])));
  }

  // Récupère les données combinées de l'utilisateur (rôles, dossiers médicaux, souscriptions)
  getUserDetails(userId: number): Observable<UserData> {
    return forkJoin({
      roles: this.getAutorisations(userId),
      registrant: this.getRegistrant(userId),
      dossiers: this.getMedicalRecords(userId),
      souscriptions: this.getSouscriptions(userId)
    });
  }

  // Méthodes privées pour récupérer les données depuis les services
  private fetchAccount(): Observable<Account> {
    return this.accountCrudService.getCurrentUser();
  }

  private fetchRoles(): Observable<RuleReponse[]> {
    return this.authorizationService.getAllAutorisations(this.getIdForCurrentAccount());
  }

  // Navigue vers l'URL stockée après connexion
  private navigateToStoredUrl(): void {
    const previousUrl = this.stateStorageService.getUrl();
    if (previousUrl) {
      this.stateStorageService.clearUrl();
      this.router.navigateByUrl(previousUrl);
    }
  }
}
