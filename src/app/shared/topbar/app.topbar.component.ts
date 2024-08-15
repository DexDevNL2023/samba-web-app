import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { NotificationService } from '../../service/notification.service';
import { Notification, TypeNotification } from '../../models/notification.model';
import { LoginService } from '../../login/login.service';
import { Account } from '../../models/account.model';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {
  account: Account | null = null; // Variable pour stocker le compte utilisateur
  // Variable pour stocker les notifications de l'utilisateur
  myNotifs: Notification[] | null = [
    {
      id: 1,
      titre: 'Bienvenue',
      message: 'Bienvenue chez SAMB\'A Assurances! Nous sommes ravis de vous compter parmi nos assurés.',
      dateEnvoi: new Date('2023-01-01T10:00:00Z'),
      lu: false,
      type: TypeNotification.INFO,
      destinataire: 1,
      emetteur: 0
    },
    {
      id: 2,
      titre: 'Paiement Reçu',
      message: 'Nous avons bien reçu votre paiement de 5000 FCFA pour votre assurance santé.',
      dateEnvoi: new Date('2023-02-15T14:30:00Z'),
      lu: true,
      type: TypeNotification.PAYMENT,
      destinataire: 1,
      emetteur: 0
    },
    {
      id: 3,
      titre: 'Rappel de Renouvellement',
      message: 'Votre assurance arrive à expiration le 2023-12-31. Veuillez la renouveler pour continuer à bénéficier de nos services.',
      dateEnvoi: new Date('2023-11-01T08:00:00Z'),
      lu: false,
      type: TypeNotification.REMINDER,
      destinataire: 1,
      emetteur: 0
    },
    {
      id: 4,
      titre: 'Nouvelle Réclamation',
      message: 'Votre réclamation pour le sinistre numéro S002 a été reçue et est en cours de traitement.',
      dateEnvoi: new Date('2023-03-22T09:45:00Z'),
      lu: true,
      type: TypeNotification.CLAIM,
      destinataire: 1,
      emetteur: 0
    },
    {
      id: 5,
      titre: 'Mise à Jour de Profil',
      message: 'Vos informations de profil ont été mises à jour avec succès.',
      dateEnvoi: new Date('2023-05-10T12:00:00Z'),
      lu: true,
      type: TypeNotification.PROFILE,
      destinataire: 1,
      emetteur: 0
    }
  ];
  
  constructor(
    private accountService: AccountService, 
    private notificationService: NotificationService, 
    private loginService: LoginService, 
    private router: Router,
    public app: AppMainComponent
  ) {}
  
  ngOnInit(): void {
    // S'abonne à l'état d'authentification pour obtenir le compte utilisateur
    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
      if (account) {
        // Récupère les notifications non lu de l'utilisateur une fois qu'il est authentifié
        this.notificationService.getUnreadNotificationByUtilisateur(account.id).subscribe();
      }
    });

    // S'abonne à l'état des notifications non lu
    this.notificationService.getUnreadNotificationState().subscribe(notifications => {
      //this.myNotifs = notifications;
    });
  }

  // Ouvre le composant de profil
  openProfile(): void {
    this.router.navigate(['/admin/profile']);
  }

  // Ouvre le composant de password
  openChangePassword(): void {
    this.router.navigate(['/admin/password']);
  }

  // Déconnecte l'utilisateur
  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
 
  // Ouvre les notifications
  openNotifications(): void {
    this.router.navigate(['/admin/notifications']);
  }

  // Méthode pour vérifier si l'utilisateur a toutes les autorisations dans une liste
  hasAuthority(roles: string[]): boolean {
    // Vérifie si l'autorité spécifiée est présente dans la liste des autorisations
    return roles.every(authority => this.account.authorities?.includes(authority));
  }
}
