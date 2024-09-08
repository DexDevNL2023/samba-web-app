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
                    { roleKey: 'ASSURANCE_MODULE', label: 'Assurances', icon: 'pi pi-fw pi-shield', routerLink: ['/admin/assurances'] },
                    { roleKey: 'POLICE_ASSURANCE_MODULE', label: 'Polices d\'assurance', icon: 'pi pi-fw pi-briefcase', routerLink: ['/admin/polices/assurances'] },
                    { roleKey: 'GARANTIE_MODULE', label: 'Garanties', icon: 'pi pi-fw pi-bookmark', routerLink: ['/admin/garanties'] },
                    { roleKey: 'SOUSCRIPTION_MODULE', label: 'Souscriptions', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/souscriptions'] },
                    { roleKey: 'CONTRAT_MODULE', label: 'Contrats d\'assurance', icon: 'pi pi-fw pi-mobile', routerLink: ['/admin/contrats/assurances'] }
                ]
            },
            {
                label: 'Gestion des sinistres',
                icon: 'pi pi-fw pi-exclamation-triangle',
                items: [
                    { roleKey: 'SINISTRE_MODULE', label: 'Sinistres', icon: 'pi pi-fw pi-exclamation-triangle', routerLink: ['/admin/sinistres'] },
                    { roleKey: 'RECLAMATION_MODULE', label: 'Reclamations', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/reclamations'] }
                ]
            },
            { roleKey: 'PAIEMENT_MODULE', label: 'Paiements', icon: 'pi pi-fw pi-credit-card', routerLink: ['/admin/paiements'] },
            { roleKey: 'DOCUMENT_MODULE', label: 'Documents', icon: 'pi pi-fw pi-folder', routerLink: ['/admin/documents'] },
            { roleKey: 'NOTIFICATION_MODULE', label: 'Notifications', icon: 'pi pi-fw pi-comment', routerLink: ['/admin/notifications'], badge: this.myNotifs.length },
            {
                label: 'Partie santé',
                icon: 'pi pi-fw pi-heart',
                items: [
                    { roleKey: 'DOSSIER_MEDICAUX_MODULE', label: 'Dossiers medicaux', icon: 'pi pi-fw pi-folder-open', routerLink: ['/admin/dossiers/medicaux'] }
                ]
            }
        ];
        
        // Menu pour l'Agent :
        this.agentMenu = [
            { roleKey: 'DASHBOARD_MODULE', label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/admin'] },
            {
                label: 'Gestion des assurances',
                icon: 'pi pi-fw pi-shield',
                items: [
                    { roleKey: 'ASSURANCE_MODULE', label: 'Assurances', icon: 'pi pi-fw pi-shield', routerLink: ['/admin/assurances'] },
                    { roleKey: 'POLICE_ASSURANCE_MODULE', label: 'Polices d\'assurance', icon: 'pi pi-fw pi-briefcase', routerLink: ['/admin/polices/assurances'] },
                    { roleKey: 'GARANTIE_MODULE', label: 'Garanties', icon: 'pi pi-fw pi-bookmark', routerLink: ['/admin/garanties'] },
                    { roleKey: 'ASSURE_MODULE', label: 'Assurés', icon: 'pi pi-fw pi-users', routerLink: ['/admin/assures'] },
                    { roleKey: 'SOUSCRIPTION_MODULE', label: 'Souscriptions', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/souscriptions'] },
                    { roleKey: 'CONTRAT_MODULE', label: 'Contrats d\'assurance', icon: 'pi pi-fw pi-mobile', routerLink: ['/admin/contrats/assurances'] }
                ]
            },
            {
                label: 'Gestion des sinistres',
                icon: 'pi pi-fw pi-exclamation-triangle',
                items: [
                    { roleKey: 'SINISTRE_MODULE', label: 'Sinistres', icon: 'pi pi-fw pi-exclamation-triangle', routerLink: ['/admin/sinistres'] },
                    { roleKey: 'RECLAMATION_MODULE', label: 'Reclamations', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/reclamations'] }
                ]
            },
            {
                label: 'Partie santé',
                icon: 'pi pi-fw pi-heart',
                items: [
                    { roleKey: 'DOSSIER_MEDICAUX_MODULE', label: 'Dossiers medicaux', icon: 'pi pi-fw pi-folder-open', routerLink: ['/admin/dossiers/medicaux'] }
                ]
            },
            { roleKey: 'PAIEMENT_MODULE', label: 'Paiements', icon: 'pi pi-fw pi-credit-card', routerLink: ['/admin/paiements'] },
            { roleKey: 'DOCUMENT_MODULE', label: 'Documents', icon: 'pi pi-fw pi-folder', routerLink: ['/admin/documents'] },
            { roleKey: 'NOTIFICATION_MODULE', label: 'Notifications', icon: 'pi pi-fw pi-comment', routerLink: ['/admin/notifications'], badge: this.myNotifs.length }
        ];
         
        // Menu pour l'Administrateur :
        this.adminMenu = [
            { roleKey: 'DASHBOARD_MODULE', label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/admin'] },
            {
                label: 'Gestion des assurances',
                icon: 'pi pi-fw pi-shield',
                items: [
                    { roleKey: 'ASSURANCE_MODULE', label: 'Assurances', icon: 'pi pi-fw pi-shield', routerLink: ['/admin/assurances'] },
                    { roleKey: 'POLICE_ASSURANCE_MODULE', label: 'Polices d\'assurance', icon: 'pi pi-fw pi-briefcase', routerLink: ['/admin/polices/assurances'] },
                    { roleKey: 'GARANTIE_MODULE', label: 'Garanties', icon: 'pi pi-fw pi-bookmark', routerLink: ['/admin/garanties'] },
                    { roleKey: 'ASSURE_MODULE', label: 'Assurés', icon: 'pi pi-fw pi-users', routerLink: ['/admin/assures'] },
                    { roleKey: 'SOUSCRIPTION_MODULE', label: 'Souscriptions', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/souscriptions'] },
                    { roleKey: 'CONTRAT_MODULE', label: 'Contrats d\'assurance', icon: 'pi pi-fw pi-mobile', routerLink: ['/admin/contrats/assurances'] }
                ]
            },
            {
                label: 'Gestion des sinistres',
                icon: 'pi pi-fw pi-exclamation-triangle',
                items: [
                    { roleKey: 'SINISTRE_MODULE', label: 'Sinistres', icon: 'pi pi-fw pi-exclamation-triangle', routerLink: ['/admin/sinistres'] },
                    { roleKey: 'RECLAMATION_MODULE', label: 'Reclamations', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/reclamations'] }
                ]
            },
            {
                label: 'Gestions des partenaires',
                icon: 'pi pi-fw pi-sitemap',
                items: [
                    { roleKey: 'FOURNISSEUR_MODULE', label: 'Partenaires', icon: 'pi pi-fw pi-sitemap', routerLink: ['/admin/fournisseurs'] },
                    { roleKey: 'PRESTATION_MODULE', label: 'Prestations', icon: 'pi pi-fw pi-wrench', routerLink: ['/admin/prestations'] },
                    { roleKey: 'FINANCEUR_MODULE', label: 'Finanseurs', icon: 'pi pi-fw pi-paypal', routerLink: ['/admin/financeurs'] }
                ]
            },
            {
                label: 'Partie santé',
                icon: 'pi pi-fw pi-heart',
                items: [
                    { roleKey: 'DOSSIER_MEDICAUX_MODULE', label: 'Dossiers medicaux', icon: 'pi pi-fw pi-folder-open', routerLink: ['/admin/dossiers/medicaux'] }
                ]
            },
            { roleKey: 'PAIEMENT_MODULE', label: 'Paiements', icon: 'pi pi-fw pi-credit-card', routerLink: ['/admin/paiements'] },
            { roleKey: 'REPORTING_MODULE', label: 'Rapports CIMA', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/admin/rapports'] },
            { roleKey: 'DOCUMENT_MODULE', label: 'Documents', icon: 'pi pi-fw pi-folder', routerLink: ['/admin/documents'] },
            { roleKey: 'NOTIFICATION_MODULE', label: 'Notifications', icon: 'pi pi-fw pi-comment', routerLink: ['/admin/notifications'], badge: this.myNotifs.length },
            {
                label: 'Paramètres',
                icon: 'pi pi-fw pi-cog',
                items: [
                    { roleKey: 'ACCOUNT_MODULE', label: 'Gestion des Utilisateurs', icon: 'pi pi-fw pi-users', routerLink: ['/admin/accounts'] },
                    { roleKey: 'BRANCHE_MODULE', label: 'Gestions des Branches', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/admin/branches'] },
                    { roleKey: 'COMPANY_MODULE', label: 'Gestions de la société', icon: 'pi pi-fw pi-building', routerLink: ['/admin/company'] },
                ]
            }
        ];
        
        // Menu pour le Fournisseur de Services :
        this.fournisseurMenu = [
            { roleKey: 'DASHBOARD_MODULE', label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/admin'] },
            {
                label: 'Gestion des sinistres',
                icon: 'pi pi-fw pi-exclamation-triangle',
                items: [
                    { roleKey: 'SINISTRE_MODULE', label: 'Sinistres', icon: 'pi pi-fw pi-exclamation-triangle', routerLink: ['/admin/sinistres'] }
                ]
            },
            {
                label: 'Gestions des partenaires',
                icon: 'pi pi-fw pi-sitemap',
                items: [
                    { roleKey: 'PRESTATION_MODULE', label: 'Prestations', icon: 'pi pi-fw pi-wrench', routerLink: ['/admin/prestations'] },
                    { roleKey: 'FINANCEUR_MODULE', label: 'Finanseurs', icon: 'pi pi-fw pi-paypal', routerLink: ['/admin/financeurs'] }
                ]
            },
            {
                label: 'Partie santé',
                icon: 'pi pi-fw pi-heart',
                items: [
                    { roleKey: 'DOSSIER_MEDICAUX_MODULE', label: 'Dossiers medicaux', icon: 'pi pi-fw pi-folder-open', routerLink: ['/admin/dossiers/medicaux'] }
                ]
            },
            { roleKey: 'DOCUMENT_MODULE', label: 'Documents', icon: 'pi pi-fw pi-folder', routerLink: ['/admin/documents'] },
            { roleKey: 'NOTIFICATION_MODULE', label: 'Notifications', icon: 'pi pi-fw pi-comment', routerLink: ['/admin/notifications'], badge: this.myNotifs.length }
        ];

        // Construire le menu
        if(this.hasAuthority('ROLE_CLIENT')) {
            this.buildMenu(this.clientMenu);
        } else if(this.hasAuthority('ROLE_AGENT')) {
            this.buildMenu(this.agentMenu);
        } else if(this.hasAuthority('ROLE_ADMIN')) {
            this.buildMenu(this.adminMenu);
        } else if(this.hasAuthority('ROLE_PROVIDER')) {
            this.buildMenu(this.fournisseurMenu);
        }
    }

    buildMenu(menu: any[]) {
        this.model = menu;
        /* menu.forEach(item => {
            if (this.hasModuleAccess(item?.roleKey)) {
                this.model.push(item);
            }
        }); */
    }

    onMenuClick(event) {
        this.app.onMenuClick(event);
    }

    // Vérifie si l'utilisateur possède l'autorisation d'accéder à un module donné
    hasModuleAccess(roleKey: string): boolean {
        //console.log(roleKey);
      return this.accountService.hasAccessToModule(roleKey);
    }

    // Vérifie si l'utilisateur possède l'autorisation indiquer
    hasAuthority(authority: string | string): boolean {
      return this.accountService.hasAnyAuthority(authority);
    }
}
