import { Component } from '@angular/core';
import { AppMainComponent } from '../../app.main.component';
import { MessageService } from 'primeng/api';
import { Account, Authority } from '../../models/account.model';
import { Rule } from '../../models/rule.model';
import { Permission } from '../../models/permission.model';
import { GenericCrudComponent } from '../generic.crud.component';
import { BaseService } from '../../service/base.service';
import { AccountService } from '../../core/auth/account.service';
import { AccountCrudService } from '../../service/account.crud.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-account-crud',
  templateUrl: './../generic.crud.component.html'
})
export class AccountCrudComponent extends GenericCrudComponent<Account> {
  roles: Rule[] = [
    // Menu pour l'Administrateur :
    {
      id: 1,
      moduleKey: 'ASSURANCE_MODULE',
      libelle: 'Gestion des assurances',
      permissionIds: [1, 2, 3, 4, 5]
    },
    {
      id: 2,
      moduleKey: 'POLICE_ASSURANCE_MODULE',
      libelle: 'Gestion des polices d\'assurance',
      permissionIds: [1, 2, 3, 4, 5]
    },
    {
      id: 3,
      moduleKey: 'GARANTIE_MODULE',
      libelle: 'Gestion des garanties',
      permissionIds: [1, 2, 3, 4, 5]
    },
    {
      id: 4,
      moduleKey: 'ASSURE_MODULE',
      libelle: 'Gestion des assurés',
      permissionIds: [1, 2, 3, 4, 5]
    },
    {
      id: 5,
      moduleKey: 'SUBSCRIPTION_MODULE',
      libelle: 'Gestion des souscriptions',
      permissionIds: [1, 2, 3, 4, 5]
    },
    {
      id: 6,
      moduleKey: 'SINISTRE_MODULE',
      libelle: 'Gestion des sinistres',
      permissionIds: [1, 2, 3, 4, 5]
    },
    {
      id: 7,
      moduleKey: 'RECLAMATION_MODULE',
      libelle: 'Gestion des réclamations',
      permissionIds: [1, 2, 3, 4, 5]
    },
    {
      id: 8,
      moduleKey: 'DOCUMENT_MODULE',
      libelle: 'Gestion des documents',
      permissionIds: [1, 2, 3, 4, 5]
    },
    {
      id: 9,
      moduleKey: 'NOTIFICATION_MODULE',
      libelle: 'Gestion des notifications',
      permissionIds: [1, 2, 3, 4, 5]
    },
    {
      id: 10,
      moduleKey: 'DOSSIER_MEDICAUX_MODULE',
      libelle: 'Gestion des dossiers médicaux',
      permissionIds: [1, 2, 3, 4, 5]
    },
    {
      id: 11,
      moduleKey: 'PAIEMENT_MODULE',
      libelle: 'Gestion des paiements',
      permissionIds: [1, 2, 3, 4, 5]
    },
    {
      id: 12,
      moduleKey: 'REPORTING_MODULE',
      libelle: 'Gestion des rapports',
      permissionIds: [1, 2, 3, 4, 5]
    },
    {
      id: 13,
      moduleKey: 'USERS_MODULE',
      libelle: 'Gestion des utilisateurs',
      permissionIds: [1, 2, 3, 4, 5]
    },
    {
      id: 14,
      moduleKey: 'BRANCHE_MODULE',
      libelle: 'Gestion des branches',
      permissionIds: [1, 2, 3, 4, 5]
    },
    {
      id: 15,
      moduleKey: 'COMPANY_MODULE',
      libelle: 'Gestion de la société',
      permissionIds: [1, 2, 3, 4, 5]
    },
    {
      id: 16,
      moduleKey: 'FOURNISSEUR_MODULE',
      libelle: 'Gestion des partenaires',
      permissionIds: [1, 2, 3, 4, 5]
    },
    {
      id: 17,
      moduleKey: 'PRESTATION_MODULE',
      libelle: 'Gestion des prestations',
      permissionIds: [1, 2, 3, 4, 5]
    },
    {
      id: 18,
      moduleKey: 'FINANCEUR_MODULE',
      libelle: 'Gestion des financeurs',
      permissionIds: [1, 2, 3, 4, 5]
    },
    {
      id: 19,
      moduleKey: 'DASHBOARD_MODULE',
      libelle: 'Dashboard',
      permissionIds: [1, 2, 3, 4, 5]
    },

    // Menu pour le Fournisseur de Services :
    {
      id: 20,
      moduleKey: 'DASHBOARD_MODULE',
      libelle: 'Dashboard',
      permissionIds: [1, 2, 3, 4, 5]
    },
    {
      id: 21,
      moduleKey: 'SINISTRE_MODULE',
      libelle: 'Gestion des sinistres',
      permissionIds: [1, 4, 5]
    },
    {
      id: 22,
      moduleKey: 'PRESTATION_MODULE',
      libelle: 'Gestion des prestations',
      permissionIds: [1, 2, 3, 4, 5]
    },
    {
      id: 23,
      moduleKey: 'FINANCEUR_MODULE',
      libelle: 'Gestion des financeurs',
      permissionIds: [1, 4, 5]
    },
    {
      id: 24,
      moduleKey: 'DOSSIER_MEDICAUX_MODULE',
      libelle: 'Gestion des dossiers médicaux',
      permissionIds: [1, 2, 4, 5]
    },
    {
      id: 25,
      moduleKey: 'DOCUMENT_MODULE',
      libelle: 'Gestion des documents',
      permissionIds: [1, 2, 3, 4, 5]
    },
    {
      id: 26,
      moduleKey: 'NOTIFICATION_MODULE',
      libelle: 'Gestion des notifications',
      permissionIds: [1, 4, 5]
    },

    // Menu pour l'Agent :
    {
      id: 27,
      moduleKey: 'DASHBOARD_MODULE',
      libelle: 'Dashboard',
      permissionIds: [1, 2, 3, 4, 5]
    },
    {
      id: 28,
      moduleKey: 'ASSURANCE_MODULE',
      libelle: 'Gestion des assurances',
      permissionIds: [4, 5]
    },
    {
      id: 29,
      moduleKey: 'POLICE_ASSURANCE_MODULE',
      libelle: 'Gestion des polices d\'assurance',
      permissionIds: [4, 5]
    },
    {
      id: 30,
      moduleKey: 'GARANTIE_MODULE',
      libelle: 'Gestion des garanties',
      permissionIds: [4, 5]
    },
    {
      id: 31,
      moduleKey: 'ASSURE_MODULE',
      libelle: 'Gestion des assurés',
      permissionIds: [1, 2, 4, 5]
    },
    {
      id: 32,
      moduleKey: 'SUBSCRIPTION_MODULE',
      libelle: 'Gestion des souscriptions',
      permissionIds: [1, 2, 4, 5]
    },
    {
      id: 33,
      moduleKey: 'SINISTRE_MODULE',
      libelle: 'Gestion des sinistres',
      permissionIds: [1, 2, 4, 5]
    },
    {
      id: 34,
      moduleKey: 'RECLAMATION_MODULE',
      libelle: 'Gestion des réclamations',
      permissionIds: [1, 2, 4, 5]
    },
    {
      id: 35,
      moduleKey: 'DOSSIER_MEDICAUX_MODULE',
      libelle: 'Gestion des dossiers médicaux',
      permissionIds: [1, 2, 4, 5]
    },
    {
      id: 36,
      moduleKey: 'PAIEMENT_MODULE',
      libelle: 'Gestion des paiements',
      permissionIds: [1, 2, 4, 5]
    },
    {
      id: 37,
      moduleKey: 'DOCUMENT_MODULE',
      libelle: 'Gestion des documents',
      permissionIds: [1, 2, 3, 4, 5]
    },
    {
      id: 38,
      moduleKey: 'NOTIFICATION_MODULE',
      libelle: 'Gestion des notifications',
      permissionIds: [1, 4, 5]
    },

    // Menu pour le Client (Assuré) :
    {
      id: 39,
      moduleKey: 'ASSURANCE_MODULE',
      libelle: 'Gestion des assurances',
      permissionIds: [4, 5]
    },
    {
      id: 40,
      moduleKey: 'POLICE_ASSURANCE_MODULE',
      libelle: 'Gestion des polices d\'assurance',
      permissionIds: [4, 5]
    },
    {
      id: 41,
      moduleKey: 'GARANTIE_MODULE',
      libelle: 'Gestion des garanties',
      permissionIds: [4, 5]
    },
    {
      id: 42,
      moduleKey: 'SUBSCRIPTION_MODULE',
      libelle: 'Gestion des souscriptions',
      permissionIds: [1, 2, 3, 4, 5]
    },
    {
      id: 43,
      moduleKey: 'SINISTRE_MODULE',
      libelle: 'Gestion des sinistres',
      permissionIds: [1, 2, 3, 4, 5]
    },
    {
      id: 44,
      moduleKey: 'RECLAMATION_MODULE',
      libelle: 'Gestion des réclamations',
      permissionIds: [1, 2, 3, 4, 5]
    },
    {
      id: 45,
      moduleKey: 'DOCUMENT_MODULE',
      libelle: 'Gestion des documents',
      permissionIds: [1, 2, 3, 4, 5]
    },
    {
      id: 46,
      moduleKey: 'NOTIFICATION_MODULE',
      libelle: 'Gestion des notifications',
      permissionIds: [1, 4, 5]
    },
    {
      id: 47,
      moduleKey: 'DOSSIER_MEDICAUX_MODULE',
      libelle: 'Gestion des dossiers médicaux',
      permissionIds: [1, 2, 3, 4, 5]
    },
    {
      id: 48,
      moduleKey: 'PAIEMENT_MODULE',
      libelle: 'Gestion des paiements',
      permissionIds: [1, 2, 3, 4, 5]
    }
  ];   
  permissions: Permission[] = [
    // Permission pour ajouter un élément
    {
      id: 1,
      permissionKey: 'WRITE_PERMISSION',
      libelle: 'Ajouter'
    },
  
    // Permission pour modifier un élément
    {
      id: 2,
      permissionKey: 'EDIT_PERMISSION',
      libelle: 'Modifier'
    },
  
    // Permission pour supprimer un élément
    {
      id: 3,
      permissionKey: 'DELET_PERMISSION',
      libelle: 'Supprimer'
    },
  
    // Permission pour consulter un élément
    {
      id: 4,
      permissionKey: 'READ_PERMISSION',
      libelle: 'Consulter'
    },
  
    // Permission pour imprimer un élément
    {
      id: 5,
      permissionKey: 'PRINT_PERMISSION',
      libelle: 'Imprimer'
    },
  
    // Permission pour rechercher un élément
    {
      id: 6,
      permissionKey: 'FIND_PERMISSION',
      libelle: 'Imprimer'
    }
  ];

  // Liste pour InsuranceType
  authorities = [
    { label: 'Assuré', value: Authority.CLIENT },
    { label: 'Agent', value: Authority.AGENT },
    { label: 'Administrateur', value: Authority.ADMIN },
    { label: 'Fournisseur', value: Authority.PROVIDER }
  ];

  constructor(
    appMain: AppMainComponent,
    messageService: MessageService,
    baseService: BaseService,
    accountService: AccountService,
    fb: FormBuilder,
    private accountCrudService: AccountCrudService
  ) {
    super(messageService, baseService, accountService, fb, accountCrudService, appMain);
    this.entityName = 'Account';
    this.componentLink = '/admin/accounts';
    this.importLink = '/import/accounts';
    this.moduleKey = 'ACCOUNT_MODULE';
    this.isTable = true;
  }

  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'imageUrl', header: 'Avatar', type: 'image' },
      { field: 'fullName', header: 'Nom complet', type: 'text' },
      { field: 'email', header: 'Email', type: 'text' },
      { field: 'langKey', header: 'Langue', type: 'text' },
      { field: 'login', header: 'Login', type: 'text' },
      { field: 'authorities', header: 'Authorisations', type: 'enum', values: [], label: 'label', key: 'value' },
      { field: 'actived', header: 'Actif', type: 'boolean' },
      { field: 'ruleIds', header: 'Rôles', type: 'list', values: [], label: 'moduleKey', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'moduleKey', header: 'Clé', type: 'text' },
          { field: 'libelle', header: 'Libelle', type: 'text' },
          { field: 'permissionIds', header: 'Permissions', type: 'list', values: [], label: 'libelle', key: 'id' }
        ]
      }
    ];
  }

  // Méthode abstraite à implémenter pour initialiser les données des colonnes de la table
  protected initializeColumnsData(): void {
    this.items = [
      // Compte pour un client
      {
        id: 1,
        actived: true,
        authorities: ['ROLE_CLIENT'],
        email: 'john.doe@example.com',
        fullName: 'Victor Nlang',
        langKey: 'en',
        login: 'victor.nlang',
        imageUrl: 'assets/demo/images/avatar/amyelsner.png',
        ruleIds: [39, 40, 41, 42, 43, 44, 45, 46, 47, 48]
      },
      
      // Compte pour un agent
      {
        id: 2,
        actived: true,
        authorities: ['ROLE_AGENT'],
        email: 'jane.smith@example.com',
        fullName: 'Jane Smith',
        langKey: 'fr',
        login: 'jane.smith',
        imageUrl: 'assets/demo/images/avatar/annafali.png',
        ruleIds: [27, 28, 29, 30, 31, 32, 33, 34, 35, 35, 36, 37, 38]
      },
      {
        id: 3,
        actived: true,
        authorities: ['ROLE_AGENT'],
        email: 'john.doe@example.com',
        fullName: 'John Doe',
        langKey: 'en',
        login: 'john.doe',
        imageUrl: 'assets/demo/images/avatar/asiyajavayant.png',
        ruleIds: [27, 28, 29, 30, 31, 32, 33, 34, 35, 35, 36, 37, 38]
      },
      
      // Compte pour un administrateur
      {
        id: 4,
        actived: true,
        authorities: ['ROLE_ADMIN'],
        email: 'admin.abc@example.com',
        fullName: 'SAMB\'A Assurances Gabon S.A',
        langKey: 'en',
        login: 'admin.samba',
        imageUrl: 'assets/demo/images/avatar/bernardodominic.png',
        ruleIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
      },
      
      // Compte pour un fournisseur de soins
      {
        id: 5,
        actived: true,
        authorities: ['ROLE_PROVIDER'],
        email: 'care.provider@example.com',
        fullName: 'Care Provider',
        langKey: 'fr',
        login: 'care.provider',
        imageUrl: 'assets/demo/images/avatar/elwinsharvill.png',
        ruleIds: [20, 21, 22, 23, 24, 25, 26]
      }
    ];
    this.branches = [
        {
            name: 'Branch A',
            partenaires: [
                {
                    name: 'Registrant A1',
                    data: this.items // Reuse existing items
                }
            ]
        },
        {
            name: 'Branch B',
            partenaires: [
                {
                    name: 'Registrant B1',
                    data: this.items // Reuse existing items
                }
            ]
        }
    ];
    this.loadRoles();
    this.loading = false;
  }

  // Chargement des rôles associés à une account
  loadRoles(): void {
    this.accountCrudService.getAllRoles().subscribe((roles: Rule[]) => {
        this.roles = roles;
    });
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['fullName', 'email', 'login', 'authorities'];
  }

  /**
   * Assigner les valeurs aux colonnes en fonction des champs spécifiés.
   */
  protected assignColumnsValues(): void { // Ajoutez le modificateur override
    this.setColumnValues('ruleIds', this.roles);
    this.setSubFieldValues('ruleIds', 'permissionIds', this.permissions);
  }

  updatePermission(id: number, event: any){
    if(this.hasAuthority(['ROLE_ADMIN'])) {
      const form: any = {
        "accountId": this.selectedItem?.id,
        "moduleId": event?.id,
        "permissionIds": event?.permissionIds
      };

      this.accountCrudService.changePermission(form).subscribe(data => {
        this.ngOnInit();    
      });
    }
  }

  // Méthode pour obtenir les autorisations de l'utilisateur sous forme de texte
  getAuthoritiesAsText(): string {
    return this.selectedItem?.authorities?.join(', ');
  }

  // Méthode pour vérifier si l'utilisateur a toutes les autorisations dans une liste
  hasAuthority(authorities: string[]): boolean {
    return this.selectedItem?.authorities?.some(auth => authorities.includes(auth)) || false;
  }
}
