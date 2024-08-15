import { Component } from '@angular/core';
import { AppMainComponent } from '../../app.main.component';
import { MessageService } from 'primeng/api';
import { Branche } from '../../models/branche.model';
import { Fournisseur } from '../../models/fournisseur.model';
import { GenericCrudComponent } from '../generic.crud.component';
import { BaseService } from '../../service/base.service';
import { AccountService } from '../../core/auth/account.service';
import { BrancheService } from '../../service/branche.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-branche-crud',
  templateUrl: './../generic.crud.component.html'
})
export class BrancheCrudComponent extends GenericCrudComponent<Branche> {
  partenaires: Fournisseur[] = [
    {
      id: 1,
      nom: 'Clinique Santé Plus',
      telephone: '123456789',
      email: 'contact@santeplus.com',
      adresse: '123 Rue de la Santé, Libreville - Gabon',
      servicesFournis: 'Consultations, Soins Paramédicaux',
      prestations: [1, 2],
      branches: [1]
    },
    {
      id: 2,
      nom: 'Centre Médical Bongo',
      telephone: '987654321',
      email: 'info@cmbongo.com',
      adresse: '456 Rue de la Médecine, Port-Gentil - Gabon',
      servicesFournis: 'Radiologie, Analyses de Laboratoire',
      prestations: [3, 4],
      branches: [2]
    }
  ];

  constructor(
    appMain: AppMainComponent,
    messageService: MessageService,
    baseService: BaseService,
    accountService: AccountService,
    fb: FormBuilder,
    private brancheService: BrancheService
  ) {
    super(messageService, baseService, accountService, fb, brancheService, appMain);
    this.entityName = 'Branche';
    this.componentLink = '/admin/branches';
    this.importLink = '/import/branches';
    this.roleKey = 'BRANCHE_MODULE';
    this.isTable = true;
  }
  
  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'code', header: 'Code', type: 'text' },
      { field: 'ville', header: 'Ville', type: 'text' },
      { field: 'isDefaut', header: 'Par defaut', type: 'boolean' },
      { field: 'partenaires', header: 'Partenaires', type: 'list', values: [], label: 'nom', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'nom', header: 'Nom', type: 'text' },
          { field: 'telephone', header: 'Telephone', type: 'text' },
          { field: 'email', header: 'Email', type: 'text' },
          { field: 'adresse', header: 'Adresse', type: 'text' }
        ]
      }
    ];
  }

  // Méthode abstraite à implémenter pour initialiser les données des colonnes de la table
  protected initializeColumnsData(): void {
    this.items = [
      {
        id: 1,
        code: 'DLA',
        ville: 'Branche Douala',
        isDefaut: false,
        partenaires: [1,4,5]
      },
      {
        id: 2,
        code: 'YAE',
        ville: 'Branche Yaounde',
        isDefaut: true,
        partenaires: [2,3]
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
    this.loadPartenaires();
    this.loading = false;
  }
  
  // Chargement des polices associés à une branche
  loadPartenaires(): void {
    this.brancheService.getAllPartners().subscribe((partenaires: Fournisseur[]) => {
        this.partenaires = partenaires;
    });
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['code', 'ville'];
  }

  /**
   * Assigner les valeurs aux colonnes en fonction des champs spécifiés.
   */
  protected assignColumnsValues(): void {
    this.setColumnValues('partenaires', this.partenaires);
  }
}
