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
  private intervalId: any; // To hold the interval ID

  constructor(
    private accountService: AccountService,
    private notificationService: NotificationService,
    private loginService: LoginService,
    private router: Router,
    public app: AppMainComponent
  ) {}

  ngOnInit(): void {
    const account: Account = this.accountService.getCurrentAccount();
    if (account) {
      this.loadUnreadNotifications(account.id);
    }

    this.accountService.getUserState().subscribe(account => {
      if (account) {
        this.account = account;
        this.loadUnreadNotifications(account.id);
      }
    });

    this.notificationService.getUnreadNotificationState().subscribe(notifications => {
      this.myNotifs = notifications;
    });

    // Start checking for new notifications every 30 seconds
    this.intervalId = setInterval(() => {
      if (this.account) {
        this.loadUnreadNotifications(this.account.id);
      }
    }, 90000);
  }

  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  loadUnreadNotifications(userId: number): void {
    this.notificationService.getUnreadNotificationsByUserId(userId).subscribe(notifications => {
      this.myNotifs = notifications; // Update notifications
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
