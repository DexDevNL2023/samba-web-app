import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { NotificationService } from '../../service/notification.service';
import { Notification } from '../../models/notification.model';
import { LoginService } from '../../login/login.service';
import { Account } from '../../models/account.model';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {
  account: Account | null = null; // Variable pour stocker le compte utilisateur
  // Variable pour stocker les notifications de l'utilisateur
  myNotifs: Notification[] | null = [];

  constructor(
    private accountService: AccountService,
    private notificationService: NotificationService,
    private loginService: LoginService,
    private router: Router,
    public app: AppMainComponent
  ) {}

  ngOnInit(): void {
    // On recupere l'utilisateur actuel
    const account: Account = this.accountService.getCurrentAccount();
    if (account) {
      // Récupère les notifications non lu de l'utilisateur une fois qu'il est authentifié
      this.notificationService.getUnreadNotificationsByUserId(account.id);
    }

    // S'abonne à l'état d'authentification pour obtenir le compte utilisateur
    this.accountService.getUserState().subscribe(account => {
      this.account = account;
      if (account) {
        // Récupère les notifications non lu de l'utilisateur une fois qu'il est authentifié
        this.notificationService.getUnreadNotificationsByUserId(account.id);
      }
    });

    // S'abonne à l'état des notifications non lu
    this.notificationService.getUnreadNotificationState().subscribe(notifications => {
      this.myNotifs = notifications;
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
}
