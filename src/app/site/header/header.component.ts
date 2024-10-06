import { Authority } from './../../models/account.model';
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
    menu: any[] = []; // Menu items basés sur le rôle de l'utilisateur

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
            this.loadMenuForRole(account.authority);
            this.loadUnreadNotifications(account.id);
        }

        this.accountService.getUserState().subscribe(account => {
            if (account) {
                this.account = account;
                this.isLoggedIn = true;
                this.loadMenuForRole(account.authority);
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

    loadMenuForRole(role: Authority | null): void {
        switch (role) {
            case Authority.CLIENT:
                this.menu = [
                    { label: 'Gérer mon profil', icon: 'pi pi-user', routerLink: '/admin/profile' },
                    { label: 'Souscrire à une police d\'assurance', icon: 'pi pi-cart-plus', routerLink: '/site' },
                    { label: 'Mes souscriptions', icon: 'pi pi-star', routerLink: '/site/souscription/list' },
                    { label: 'Demande un remboursement', icon: 'pi pi-id-card', routerLink: '/site/sinistre/list' },
                    { label: 'Explorer nos produits d\'assurance', icon: 'pi pi-list', routerLink: '/admin/assurances' },
                    { label: 'Historique des paiements', icon: 'pi pi-calendar', routerLink: '/admin/paiements' },
                    { label: 'Déconnexion', icon: 'pi pi-sign-out', action: () => this.logout() }
                ];
                break;
            case Authority.AGENT:
                this.menu = [
                    { label: 'Gérer mon profil', icon: 'pi pi-user', routerLink: '/admin/profile' },
                    { label: 'Mes operations', icon: 'pi pi-list', routerLink: '/admin' },
                    { label: 'Déconnexion', icon: 'pi pi-sign-out', action: () => this.logout() }
                ];
                break;
            case Authority.ADMIN:
                this.menu = [
                    { label: 'Gérer les utilisateurs', icon: 'pi pi-users', routerLink: '/admin/accounts' },
                    { label: 'Mes activités', icon: 'pi pi-list', routerLink: '/admin' },
                    { label: 'Déconnexion', icon: 'pi pi-sign-out', action: () => this.logout() }
                ];
                break;
            case Authority.PROVIDER:
                this.menu = [
                    { label: 'Gérer mon profil', icon: 'pi pi-user', routerLink: '/admin/profile' },
                    { label: 'Demande un remboursement', icon: 'pi pi-id-card', routerLink: '/site/prestation/list' },
                    { label: 'Effectuer une prestation', icon: 'pi pi-exclamation-triangle', routerLink: '/site/assure/list' },
                    { label: 'Déconnexion', icon: 'pi pi-sign-out', action: () => this.logout() }
                ];
                break;
            default:
                this.menu = [];
        }
    }
}
