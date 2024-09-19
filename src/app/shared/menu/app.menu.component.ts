import { RuleReponse } from './../../models/rule.reponse.model';
import { Account } from './../../models/account.model';
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
            {
                label: 'Comptabilite',
                icon: 'pi pi-fw pi-wallet',
                items: [
                    { roleKey: 'PAIEMENT_MODULE', label: 'Paiements', icon: 'pi pi-fw pi-credit-card', routerLink: ['/admin/paiements'] },
                    { roleKey: 'RECU_PAIEMENT_MODULE', label: 'Guichets de caisse', icon: 'pi pi-fw pi-receipt', routerLink: ['/admin/recus/paiements'] }
                ]
            },
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
            {
                label: 'Comptabilite',
                icon: 'pi pi-fw pi-wallet',
                items: [
                    { roleKey: 'PAIEMENT_MODULE', label: 'Paiements', icon: 'pi pi-fw pi-credit-card', routerLink: ['/admin/paiements'] },
                    { roleKey: 'RECU_PAIEMENT_MODULE', label: 'Guichets de caisse', icon: 'pi pi-fw pi-receipt', routerLink: ['/admin/recus/paiements'] }
                ]
            },
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
        this.accountService.getAuthenticationState().subscribe(account => {
            if (account) {
                this.loadMenusBasedOnRole(account);
            }
        });
    }

    // Charge les menus en fonction du rôle de l'utilisateur authentifié
    loadMenusBasedOnRole(account: Account) {
        this.accountService.getAutorisations(account?.id).subscribe((roles: RuleReponse[]) => {
            // Vérifie si l'utilisateur possède l'autorisation indiquer
            if (this.accountService.hasAnyAuthority('ROLE_CLIENT')) {
                this.buildMenu(this.clientMenu, roles);
            } else if (this.accountService.hasAnyAuthority('ROLE_AGENT')) {
                this.buildMenu(this.agentMenu, roles);
            } else if (this.accountService.hasAnyAuthority('ROLE_ADMIN')) {
                this.buildMenu(this.adminMenu, roles);
            } else if (this.accountService.hasAnyAuthority('ROLE_PROVIDER')) {
                this.buildMenu(this.fournisseurMenu, roles);
            }
        });
    }

    /**
     * Reconstruit un menu basé sur les rôles d'accès de l'utilisateur.
     *
     * @param menu - Un tableau d'objets représentant les éléments du menu. Chaque élément peut avoir une clé de rôle (`roleKey`) et éventuellement des sous-éléments (`items`).
     * @param roles - Un tableau d'objets représentant les rôles d'accès de l'utilisateur.
     */
    buildMenu(menu: any[], roles: RuleReponse[]) {
        // Initialise un tableau temporaire pour stocker le menu filtré
        let filteredMenu = [];

        // Parcourt chaque élément du menu
        menu.forEach(item => {
            let newItem = { ...item }; // Crée une copie de l'élément

            // Si l'élément a une clé de rôle, vérifie si l'utilisateur a accès
            if (item?.roleKey) {
                if (this.accountService.hasAccessToModule(item?.roleKey, roles)) {
                    // Si l'élément contient des sous-éléments, traite-les récursivement
                    if (item?.items) {
                        newItem.items = this.buildMenu(item.items, roles);
                    }
                    filteredMenu.push(newItem);
                }
            } else {
                // Si l'élément n'a pas de clé de rôle (ex: catégories de menu)
                if (item?.items) {
                    // Applique la récursivité sur les sous-éléments
                    newItem.items = this.buildMenu(item.items, roles);
                    // Ajoute l'élément seulement si des sous-éléments sont présents après filtrage
                    if (newItem.items.length > 0) {
                        filteredMenu.push(newItem);
                    }
                } else {
                    filteredMenu.push(newItem); // Ajoute directement l'élément sans sous-éléments
                }
            }
        });

        // Met à jour le modèle avec le menu filtré
        this.model = filteredMenu;

        return filteredMenu; // Retourne le menu filtré pour un appel récursif correct
    }

    onMenuClick(event) {
        this.app.onMenuClick(event);
    }
}
