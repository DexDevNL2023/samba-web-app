import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { NotificationService } from '../../service/notification.service';
import { Account } from '../../core/auth/account.model';
import { Notification } from '../../models/notification.model';
import { LoginService } from '../../login/login.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {
  account: Account | null = null; // Variable pour stocker le compte utilisateur
  // Variable pour stocker les notifications de l'utilisateur
  /* notifications: Notification[] | null = [
    {
      id: 1,
      message: "Votre paiement a été reçu.",
      dateEnvoi: new Date("2024-07-14T08:00:00Z"),
      type: "PAIEMENT",
      isRead: false,
      utilisateur: {
        id: 123
      }
    },
    {
      id: 2,
      message: "Votre souscription a été approuvée.",
      dateEnvoi: new Date("2024-07-13T12:00:00Z"),
      type: "SOUSCRIPTION",
      isRead: false,
      utilisateur: {
        id: 123
      }
    },
    {
      id: 3,
      message: "Un sinistre a été déclaré.",
      dateEnvoi: new Date("2024-07-12T09:00:00Z"),
      type: "SINISTRE",
      isRead: false,
      utilisateur: {
        id: 123
      }
    }
  ]; */
  myNotifs: Notification[] | null = [
    {
      id: 1,
      message: "Une nouvelle souscription a été reçue.",
      dateEnvoi: new Date("2024-07-14T08:00:00Z"),
      type: "SOUSCRIPTION",
      isRead: false,
      utilisateur: {
        id: 101
      }
    },
    {
      id: 2,
      message: "Un paiement de prime a été effectué.",
      dateEnvoi: new Date("2024-07-13T12:00:00Z"),
      type: "PAIEMENT",
      isRead: false,
      utilisateur: {
        id: 101
      }
    },
    {
      id: 3,
      message: "Un sinistre a été déclaré par un client.",
      dateEnvoi: new Date("2024-07-12T09:00:00Z"),
      type: "SINISTRE",
      isRead: false,
      utilisateur: {
        id: 101
      }
    },
    {
      id: 4,
      message: "Une demande de documentation a été reçue.",
      dateEnvoi: new Date("2024-07-11T11:30:00Z"),
      type: "REQUEST",
      isRead: false,
      utilisateur: {
        id: 101
      }
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
 
  // Ouvre le chat des notifications
  openNotifications(): void {
    if(this.hasAuthority(['ROLE_CLIENT'])) {
      this.router.navigate(['/admin/notifications']);
    } else{
      this.router.navigate(['/admin/clients']);
    }
  }

  // Méthode pour vérifier si l'utilisateur a toutes les autorisations dans une liste
  hasAuthority(rules: string[]): boolean {
    // Vérifie si l'autorité spécifiée est présente dans la liste des autorisations
    return rules.every(authority => this.account.authorities?.includes(authority));
  }
}
