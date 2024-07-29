import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { NotificationService } from '../../service/notification.service';
import { Notification } from '../../models/notification.model';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    clientMenu: any[];
    agentMenu: any[];
    adminMenu: any[];
    fournisseurMenu: any[];
    model: any[] = [];
    myNotifs: Notification[] | null = [];

    constructor(private accountService: AccountService, private notificationService: NotificationService, public app: AppMainComponent) { }

    ngOnInit() {
        // S'abonne à l'état des notifications non lu
        this.notificationService.getUnreadNotificationState().subscribe(notifications => {
          this.myNotifs = notifications;
        });

        // Menu pour le Client (Assuré) :
        this.clientMenu = [
            {
                label: 'Gestion des assurances',
                icon: 'pi pi-fw pi-shield',
                items: [
                    { moduleKey: 'ASSURANCE_MODULE', label: 'Assurances', icon: 'pi pi-fw pi-shield', routerLink: ['/admin/assurances'] },
                    { moduleKey: 'POLICE_ASSURANCE_MODULE', label: 'Polices d\'assurance', icon: 'pi pi-fw pi-clipboard', routerLink: ['/admin/polices/assurances'] },
                    { moduleKey: 'GARANTIE_MODULE', label: 'Garanties d\'assurance', icon: 'pi pi-fw pi-calendar-clock', routerLink: ['/admin/garanties'] },
                    { moduleKey: 'ASSURE_MODULE', label: 'Gestion des assurés', icon: 'pi pi-fw pi-users', routerLink: ['/admin/assures'] },
                    { moduleKey: 'SUBSCRIPTION_MODULE', label: 'Souscriptions', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/souscriptions'] }
                ]
            },
            {
                label: 'Gestion des sinistres',
                icon: 'pi pi-fw pi-exclamation-triangle',
                items: [
                    { moduleKey: 'SINISTRE_MODULE', label: 'Sinistres', icon: 'pi pi-fw pi-exclamation-triangle', routerLink: ['/admin/sinistres'] },
                    { moduleKey: 'RECLAMATION_MODULE', label: 'Reclamations', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/reclamations'] }
                ]
            },
            { moduleKey: 'DOCUMENT_MODULE', label: 'Documents de preuves', icon: 'pi pi-fw pi-folder', routerLink: ['/admin/documents'] },
            { moduleKey: 'NOTIFICATION_MODULE', label: 'Notifications', icon: 'pi pi-fw pi-comment', routerLink: ['/admin/notifications'], badge: this.myNotifs.length }
        ];
        
        // Menu pour l'Agent :
        this.agentMenu = [
            { moduleKey: 'DASHBOARD_MODULE', label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/admin/dashboard'] },
            {
                label: 'Gestion des assurances',
                icon: 'pi pi-fw pi-shield',
                items: [
                    { moduleKey: 'ASSURANCE_MODULE', label: 'Assurances', icon: 'pi pi-fw pi-shield', routerLink: ['/admin/assurances'] },
                    { moduleKey: 'POLICE_ASSURANCE_MODULE', label: 'Polices d\'assurance', icon: 'pi pi-fw pi-clipboard', routerLink: ['/admin/polices/assurances'] },
                    { moduleKey: 'GARANTIE_MODULE', label: 'Garanties d\'assurance', icon: 'pi pi-fw pi-calendar-clock', routerLink: ['/admin/garanties'] },
                    { moduleKey: 'ASSURE_MODULE', label: 'Gestion des assurés', icon: 'pi pi-fw pi-users', routerLink: ['/admin/assures'] },
                    { moduleKey: 'SUBSCRIPTION_MODULE', label: 'Souscriptions', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/souscriptions'] }
                ]
            },
            {
                label: 'Gestion des sinistres',
                icon: 'pi pi-fw pi-exclamation-triangle',
                items: [
                    { moduleKey: 'SINISTRE_MODULE', label: 'Sinistres', icon: 'pi pi-fw pi-exclamation-triangle', routerLink: ['/admin/sinistres'] },
                    { moduleKey: 'RECLAMATION_MODULE', label: 'Reclamations', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/reclamations'] }
                ]
            },
            {
                label: 'Partie santé',
                icon: 'pi pi-fw pi-heart',
                items: [
                    { moduleKey: 'DOSSIER_MEDICAUX_MODULE', label: 'Dossiers medicaux', icon: 'pi pi-fw pi-folder-open', routerLink: ['/admin/dossiers/medicaux'] }
                ]
            },
            { moduleKey: 'PAIEMENT_MODULE', label: 'Paiements des primes', icon: 'pi pi-fw pi-credit-card', routerLink: ['/admin/paiements'] },
            { moduleKey: 'DOCUMENT_MODULE', label: 'Documents de preuves', icon: 'pi pi-fw pi-folder', routerLink: ['/admin/documents'] },
            { moduleKey: 'NOTIFICATION_MODULE', label: 'Notifications', icon: 'pi pi-fw pi-comment', routerLink: ['/admin/notifications'], badge: this.myNotifs.length }
        ];
         
        // Menu pour l'Administrateur :
        this.adminMenu = [
            { moduleKey: 'DASHBOARD_MODULE', label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/admin/dashboard'] },
            {
                label: 'Gestion des assurances',
                icon: 'pi pi-fw pi-shield',
                items: [
                    { moduleKey: 'ASSURANCE_MODULE', label: 'Assurances', icon: 'pi pi-fw pi-shield', routerLink: ['/admin/assurances'] },
                    { moduleKey: 'POLICE_ASSURANCE_MODULE', label: 'Polices d\'assurance', icon: 'pi pi-fw pi-clipboard', routerLink: ['/admin/polices'] },
                    { moduleKey: 'GARANTIE_MODULE', label: 'Garanties d\'assurance', icon: 'pi pi-fw pi-calendar-clock', routerLink: ['/admin/garanties'] },
                    { moduleKey: 'ASSURE_MODULE', label: 'Gestion des assurés', icon: 'pi pi-fw pi-users', routerLink: ['/admin/assures'] },
                    { moduleKey: 'SUBSCRIPTION_MODULE', label: 'Souscriptions', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/souscriptions'] }
                ]
            },
            {
                label: 'Gestion des sinistres',
                icon: 'pi pi-fw pi-exclamation-triangle',
                items: [
                    { moduleKey: 'SINISTRE_MODULE', label: 'Sinistres', icon: 'pi pi-fw pi-exclamation-triangle', routerLink: ['/admin/sinistres'] },
                    { moduleKey: 'RECLAMATION_MODULE', label: 'Reclamations', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/reclamations'] }
                ]
            },
            {
                label: 'Gestions des partenaires',
                icon: 'pi pi-fw pi-sitemap',
                items: [
                    { moduleKey: 'PARTNERS_MODULE', label: 'Partenaires', icon: 'pi pi-fw pi-sitemap', routerLink: ['/admin/partenaires'] },
                    { moduleKey: 'PRESTATION_MODULE', label: 'Prestations', icon: 'pi pi-fw pi-wrench', routerLink: ['/admin/prestations'] },
                    { moduleKey: 'FINANCEUR_MODULE', label: 'Finanseurs', icon: 'pi pi-fw pi-paypal', routerLink: ['/admin/financeurs'] }
                ]
            },
            {
                label: 'Partie santé',
                icon: 'pi pi-fw pi-heart',
                items: [
                    { moduleKey: 'DOSSIER_MEDICAUX_MODULE', label: 'Dossiers medicaux', icon: 'pi pi-fw pi-folder-open', routerLink: ['/admin/dossiers/medicaux'] }
                ]
            },
            { moduleKey: 'PAIEMENT_MODULE', label: 'Historiques des Paiements', icon: 'pi pi-fw pi-credit-card', routerLink: ['/admin/paiements'] },
            { moduleKey: 'REPORTING_MODULE', label: 'Rapports CIMA', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/admin/rapports'] },
            { moduleKey: 'DOCUMENT_MODULE', label: 'Documents de preuves', icon: 'pi pi-fw pi-folder', routerLink: ['/admin/documents'] },
            { moduleKey: 'NOTIFICATION_MODULE', label: 'Notifications', icon: 'pi pi-fw pi-comment', routerLink: ['/admin/notifications'], badge: this.myNotifs.length },
            {
                label: 'Paramètres',
                icon: 'pi pi-fw pi-cog',
                items: [
                    { moduleKey: 'USERS_MODULE', label: 'Gestion des Utilisateurs', icon: 'pi pi-fw pi-users', routerLink: ['/admin/utilisateurs'] },
                    { moduleKey: 'BRANCHE_MODULE', label: 'Gestions des Branches', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/admin/branches'] },
                    { moduleKey: 'COMPANY_MODULE', label: 'Gestions de la société', icon: 'pi pi-fw pi-warehouse', routerLink: ['/admin/company'] },
                ]
            }
        ];
        
        // Menu pour le Fournisseur de Services :
        this.fournisseurMenu = [
            { moduleKey: 'DASHBOARD_MODULE', label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/admin'] },
            {
                label: 'Gestion des sinistres',
                icon: 'pi pi-fw pi-exclamation-triangle',
                items: [
                    { moduleKey: 'SINISTRE_MODULE', label: 'Sinistres', icon: 'pi pi-fw pi-exclamation-triangle', routerLink: ['/admin/sinistres'] },
                    { moduleKey: 'RECLAMATION_MODULE', label: 'Reclamations', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/reclamations'] }
                ]
            },
            {
                label: 'Gestions des partenaires',
                icon: 'pi pi-fw pi-sitemap',
                items: [
                    { moduleKey: 'PRESTATION_MODULE', label: 'Prestations', icon: 'pi pi-fw pi-wrench', routerLink: ['/admin/prestations'] },
                    { moduleKey: 'FINANCEUR_MODULE', label: 'Finanseurs', icon: 'pi pi-fw pi-paypal', routerLink: ['/admin/financeurs'] }
                ]
            },
            {
                label: 'Partie santé',
                icon: 'pi pi-fw pi-heart',
                items: [
                    { moduleKey: 'DOSSIER_MEDICAUX_MODULE', label: 'Dossiers medicaux', icon: 'pi pi-fw pi-folder-open', routerLink: ['/admin/dossiers/medicaux'] }
                ]
            },
            { moduleKey: 'DOCUMENT_MODULE', label: 'Documents de preuves', icon: 'pi pi-fw pi-folder', routerLink: ['/admin/documents'] },
            { moduleKey: 'NOTIFICATION_MODULE', label: 'Notifications', icon: 'pi pi-fw pi-comment', routerLink: ['/admin/notifications'], badge: this.myNotifs.length }
        ];

        // Construire le menu
        if(this.hasAuthority('ROLE_CLIENT')) {
            this.buildMenu(this.clientMenu);
        } else if(this.hasAuthority('ROLE_AGENT')) {
            this.buildMenu(this.agentMenu);
        } else if(this.hasAuthority('ROLE_ADMINISTRATOR')) {
            this.buildMenu(this.adminMenu);
        } else if(this.hasAuthority('ROLE_PROVIDER')) {
            this.buildMenu(this.fournisseurMenu);
        }
    }

    buildMenu(menu: any[]) {
        this.model = menu;
        /* menu.forEach(item => {
            if (this.hasModuleAccess(item?.moduleKey)) {
                this.model.push(item);
            }
        }); */
    }

    onMenuClick(event) {
        this.app.onMenuClick(event);
    }

    // Vérifie si l'utilisateur possède l'autorisation d'accéder à un module donné
    hasModuleAccess(moduleKey: string): boolean {
        //console.log(moduleKey);
      return this.accountService.hasAccessToModule(moduleKey);
    }

    // Vérifie si l'utilisateur possède l'autorisation indiquer
    hasAuthority(authority: string | string): boolean {
      return this.accountService.hasAnyAuthority(authority);
    }
}
