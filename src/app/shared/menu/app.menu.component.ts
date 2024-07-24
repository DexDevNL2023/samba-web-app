import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';

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

    constructor(private accountService: AccountService, public app: AppMainComponent) { }

    ngOnInit() {
        // Menu pour le Client (Assuré) :
        this.clientMenu = [
            { moduleKey: 'CONSULTER_ASSURANCE_MODULE', label: 'Souscrire à une Assurance', icon: 'pi pi-fw pi-shield', routerLink: ['/admin/effectuer//souscriptions'] },
            { moduleKey: 'DECLARER_SINISTRE_MODULE', label: 'Déclarer un Sinistre', icon: 'pi pi-fw pi-exclamation-triangle', routerLink: ['/admin/declaration/sinistres'] },
            { moduleKey: 'EFFECTUER_PAIEMENT_MODULE', label: 'Effectuer un Paiement', icon: 'pi pi-fw pi-credit-card', routerLink: ['/admin/effectuer/paiements'] },
            { moduleKey: 'EFFECTUER_RECLAMATION_MODULE', label: 'Faite vos Reclamations', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/effectuer/reclamations'] }
        ];
        
        // Menu pour l'Agent :
        this.agentMenu = [
            { moduleKey: 'DASHBOARD_MODULE', label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/admin/dashboard'] },
            { moduleKey: 'ASSURANCE_MODULE', label: 'Gestion des Assures', icon: 'pi pi-fw pi-users', routerLink: ['/admin/utilisateurs'] },
            { moduleKey: 'SUBSCRIPTION_MODULE', label: 'Gestion des Souscriptions', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/souscriptions'] },
            { moduleKey: 'SINISTRE_MODULE', label: 'Gestion des Sinistres', icon: 'pi pi-fw pi-exclamation-triangle', routerLink: ['/admin/sinistres'] },
            { moduleKey: 'RECLAMATION_MODULE', label: 'Gestion des Reclamations', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/reclamations'] },
            { moduleKey: 'SANTE_MODULE', label: 'Gestion des Dossiers Medicaux', icon: 'pi pi-fw pi-folder-open', routerLink: ['/admin/dossiers/medicaux'] }
        ];
         
        // Menu pour l'Administrateur :
        this.adminMenu = [
            { moduleKey: 'DASHBOARD_MODULE', label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/admin/dashboard'] },
            { moduleKey: 'USERS_MODULE', label: 'Gestion des Utilisateurs', icon: 'pi pi-fw pi-users', routerLink: ['/admin/utilisateurs'] },
            { moduleKey: 'BRANCHE_MODULE', label: 'Gestions des Branches', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/admin/branches'] },
            { moduleKey: 'ASSURANCE_MODULE', label: 'Gestion des Assurances', icon: 'pi pi-fw pi-shield', routerLink: ['/admin/assurances'] },
            { moduleKey: 'SUBSCRIPTION_MODULE', label: 'Gestion des Souscriptions', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/souscriptions'] },
            {
                label: 'Gestion des sinistres',
                icon: 'pi pi-fw pi-exclamation-triangle',
                items: [
                    { moduleKey: 'SINISTRE_MODULE', label: 'Sinistres', icon: 'pi pi-fw pi-exclamation-triangle', routerLink: ['/admin/sinistres'] },
                    { moduleKey: 'DOCUMENT_SINISTRE_MODULE', label: 'Documents des Sinistres', icon: 'pi pi-fw pi-exclamation-triangle', routerLink: ['/admin/document-sinistres'] },
                ]
            },
            { moduleKey: 'RECLAMATION_MODULE', label: 'Gestion des Reclamations', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/reclamations'] },
            { moduleKey: 'PAIEMENT_MODULE', label: 'Historiques des Paiements', icon: 'pi pi-fw pi-credit-card', routerLink: ['/admin/paiements'] },
            { moduleKey: 'REPPORTING_MODULE', label: 'Générer vos Rapports', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/admin/rapports'] },
            { moduleKey: 'PARTNERS_MODULE', label: 'Gestions des Partenaires', icon: 'pi pi-fw pi-sitemap', routerLink: ['/admin/partenaires'] },
            { moduleKey: 'PRESTATION_MODULE', label: 'Prestations de Soins', icon: 'pi pi-fw pi-heart', routerLink: ['/admin/prestations'] },
            { moduleKey: 'SANTE_MODULE', label: 'Gestion des Dossiers Medicaux', icon: 'pi pi-fw pi-folder-open', routerLink: ['/admin/dossiers/medicaux'] }
        ];
        
        // Menu pour le Fournisseur de Soins :
        this.fournisseurMenu = [
            { moduleKey: 'DASHBOARD_MODULE', label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/admin'] },
            { moduleKey: 'PRESTATION_MODULE', label: 'Prestations de Soins', icon: 'pi pi-fw pi-heart', routerLink: ['/admin/prestations'] },
            { moduleKey: 'PRESTATION_MODULE', label: 'Prestations de Soins', icon: 'pi pi-fw pi-heart', routerLink: ['/admin/prestations'] },
            { moduleKey: 'SINISTRE_MODULE', label: 'Gestion des Sinistres', icon: 'pi pi-fw pi-exclamation-triangle', routerLink: ['/admin/sinistres'] }
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
