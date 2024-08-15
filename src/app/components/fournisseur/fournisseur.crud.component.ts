import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { MessageService } from 'primeng/api';
import { Fournisseur } from '../../models/fournisseur.model';
import { FournisseurService } from '../../service/fournisseur.service';
import { Prestation, PrestationStatus } from '../../models/prestation.model';
import { Branche } from '../../models/branche.model';
import { GenericCrudComponent } from '../generic.crud.component';

@Component({
  selector: 'app-fournisseur-soin-crud',
  templateUrl: './../generic.crud.component.html'
})
export class FournisseurCrudComponent extends GenericCrudComponent<Fournisseur> {
  prestations: Prestation[] = [
    {
      id: 1,
      numeroPrestation: 'PRE-001',
      label: 'Consultation Médicale Générale',
      datePrestation: new Date('2024-01-15'),
      description: 'Consultation avec un médecin généraliste.',
      montant: 5000,
      status: PrestationStatus.REMBOURSE,
      fournisseur: 1,
      financeurs: [1],
      sinistre: 1,
      documents: [1, 2]
    },
    {
      id: 2,
      numeroPrestation: 'PRE-002',
      label: 'Hospitalisation Chirurgicale',
      datePrestation: new Date('2024-02-20'),
      description: 'Hospitalisation pour une intervention chirurgicale.',
      montant: 120000,
      status: PrestationStatus.EN_ATTENTE,
      fournisseur: 2,
      financeurs: [1, 2],
      sinistre: 2,
      documents: [2, 3]
    },
    {
      id: 3,
      numeroPrestation: 'PRE-003',
      label: 'Radiologie',
      datePrestation: new Date('2024-03-10'),
      description: 'Radiographie thoracique.',
      montant: 20000,
      status: PrestationStatus.NON_REMBOURSE,
      fournisseur: 1,
      financeurs: [2],
      sinistre: 3,
      documents: [3]
    },
    {
      id: 4,
      numeroPrestation: 'PRE-004',
      label: 'Soins Dentaires',
      datePrestation: new Date('2024-04-05'),
      description: 'Traitement de caries et nettoyage dentaire.',
      montant: 15000,
      status: PrestationStatus.REMBOURSE,
      fournisseur: 1,
      financeurs: [1],
      sinistre: 4,
      documents: [4, 1]
    }
  ];
  allBranches: Branche[] = [
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

  constructor(
    appMain: AppMainComponent,
    messageService: MessageService,
    baseService: BaseService,
    accountService: AccountService,
    fb: FormBuilder,
    private fournisseurService: FournisseurService
  ) {
    super(messageService, baseService, accountService, fb, fournisseurService, appMain);
    this.entityName = 'Fournisseur';
    this.componentLink = '/admin/fournisseurs';
    this.importLink = '/import/fournisseurs';
    this.roleKey = 'FOURNISSEUR_MODULE';
    this.isTable = true;
  }
  
  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'nom', header: 'Name', type: 'text' },
      { field: 'servicesFournis', header: 'Services', type: 'textarea' },
      { field: 'adresse', header: 'Adresse', type: 'textarea' },
      { field: 'telephone', header: 'Telephone', type: 'text' },
      { field: 'email', header: 'Email', type: 'text' },
      { field: 'prestations', header: 'Prestations', type: 'list', values: [], label: 'numeroPrestation', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroPrestation', header: 'Num Prestation', type: 'text' },
          { field: 'label', header: 'Libellé', type: 'text' },
          { field: 'status', header: 'Status', type: 'enum', values: [], label: 'label', key: 'value' },
          { field: 'datePrestation', header: 'Effectuer le', type: 'date' },
          { field: 'montant', header: 'Montant', type: 'currency' }
        ]
      },
      { field: 'branches', header: 'Branches', type: 'list', values: [], label: 'code', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'code', header: 'Code', type: 'text' },
          { field: 'ville', header: 'Ville', type: 'text' },
          { field: 'isDefaut', header: 'Par defaut', type: 'boolean' }
        ]
      }
    ];
  }

  // Méthode abstraite à implémenter pour initialiser les données des colonnes de la table
  protected initializeColumnsData(): void {
    this.items = [
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
    this.loadPrestations();
    this.loadBranches();
    this.loading = false;
  }
  
  // Chargement des prestations associés à une fournisseur-soin
  loadPrestations(): void {
    this.fournisseurService.getAllPrestations().subscribe((prestations: Prestation[]) => {
        this.prestations = prestations;
    });
  }
  
  // Chargement des prestations associés à une fournisseur-soin
  loadBranches(): void {
    this.fournisseurService.getAllBranches().subscribe((branches: Branche[]) => {
        this.allBranches = branches;
    });
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['nom', 'telephone', 'pays', 'servicesFournis'];
  }

  /**
   * Assigner les valeurs aux colonnes en fonction des champs spécifiés.
   */
  protected assignColumnsValues(): void { // Ajoutez le modificateur override
    this.setColumnValues('prestations', this.prestations);
    this.setColumnValues('branches', this.allBranches);
  }
}
