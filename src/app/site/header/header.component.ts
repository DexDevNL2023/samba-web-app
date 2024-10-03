import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { NotificationService } from '../../service/notification.service';
import { Notification } from '../../models/notification.model';
import { LoginService } from '../../login/login.service';
import { Account } from '../../models/account.model';

@Component({
    selector: 'app-site-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent {
    isLoggedIn = false; // Indique si l'utilisateur est connecté
    account: Account | null = null; // Variable pour stocker le compte utilisateur
    myNotifs: Notification[] | null = []; // Stocke les notifications de l'utilisateur
    isAccountMenuVisible = false; // Gère la visibilité du menu "Mon compte"
    isNotificationsMenuVisible = false; // Gère la visibilité du menu des notifications
    private intervalId: any; // To hold the interval ID

    constructor(
        private accountService: AccountService,
        private notificationService: NotificationService,
        private loginService: LoginService,
        private router: Router
    ) {}

    ngOnInit(): void {
        const account: Account = this.accountService.getCurrentAccount();
        if (account) {
            this.isLoggedIn = true;
            this.loadUnreadNotifications(account.id);
        }

        this.accountService.getUserState().subscribe(account => {
            if (account) {
                this.account = account;
                this.isLoggedIn = true;
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

    // Bascule l'affichage du menu "Mon compte"
    toggleAccountMenu(): void {
        this.isAccountMenuVisible = !this.isAccountMenuVisible;
    }

    // Bascule l'affichage du menu Notifications
    toggleNotificationsMenu(): void {
        this.isNotificationsMenuVisible = !this.isNotificationsMenuVisible;
    }

    // Déconnecte l'utilisateur
    logout(): void {
        this.loginService.logout();
        this.isLoggedIn = false; // Simule une déconnexion
    }

    // Ouvre les notifications
    openNotifications(): void {
        this.router.navigate(['/admin/notifications']);
    }

    goToHome(): void {
        this.router.navigate(['/site']);
    }
}
