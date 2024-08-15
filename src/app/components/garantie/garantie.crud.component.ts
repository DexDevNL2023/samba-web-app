import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { MessageService } from 'primeng/api';
import { Garantie, GarantieStatus } from '../../models/garantie.model';
import { GarantieService } from '../../service/garantie.service';
import { PoliceAssurance } from '../../models/police-assurance.model';
import { GenericCrudComponent } from '../generic.crud.component';

@Component({
  selector: 'app-garantie-soin-crud',
  templateUrl: './../generic.crud.component.html'
})
export class GarantieCrudComponent extends GenericCrudComponent<Garantie> {
  polices: PoliceAssurance[] = [
    // Polices pour Assurance Santé
    {
      id: 1,
      numeroPolice: 'S001',
      label: 'Police Assurance Maladie Complémentaire',
      conditions: 'Couverture complémentaire pour les frais médicaux non pris en charge par la sécurité sociale.',
      montantSouscription: 60000,
      assurance: 1,
      garanties: [1, 2],
      souscriptions: [1, 2, 3]
    },
    {
      id: 2,
      numeroPolice: 'S002',
      label: 'Police Assurance Hospitalisation',
      conditions: 'Prise en charge des frais d\'hospitalisation en cas de maladie ou d\'accident.',
      montantSouscription: 70000,
      assurance: 1,
      garanties: [3, 4],
      souscriptions: [4, 5]
    },
  
    // Polices pour Assurance Automobile
    {
      id: 3,
      numeroPolice: 'A001',
      label: 'Police Responsabilité Civile Auto',
      conditions: 'Couverture pour les dommages causés à des tiers en cas d\'accident de voiture.',
      montantSouscription: 25000,
      assurance: 2,
      garanties: [5],
      souscriptions: [6, 7]
    },
    {
      id: 4,
      numeroPolice: 'A002',
      label: 'Police Tous Risques Auto',
      conditions: 'Couverture complète incluant les dommages au véhicule assuré, qu\'ils soient de votre faute ou non.',
      montantSouscription: 35000,
      assurance: 2,
      garanties: [6, 7],
      souscriptions: [8, 9]
    },
  
    // Polices pour Assurance Agricole
    {
      id: 5,
      numeroPolice: 'AG001',
      label: 'Police Assurance Récoltes',
      conditions: 'Couverture contre les pertes de récoltes dues à des conditions climatiques extrêmes ou des catastrophes naturelles.',
      montantSouscription: 40000,
      assurance: 3,
      garanties: [8, 9],
      souscriptions: [10, 11]
    },
    {
      id: 6,
      numeroPolice: 'AG002',
      label: 'Police Assurance Bétail',
      conditions: 'Protection contre les pertes dues à des maladies du bétail ou des accidents.',
      montantSouscription: 50000,
      assurance: 3,
      garanties: [10],
      souscriptions: [12, 13]
    },
  
    // Polices pour Assurance Personne
    {
      id: 7,
      numeroPolice: 'P001',
      label: 'Police Assurance Vie',
      conditions: 'Protection financière pour les bénéficiaires en cas de décès de l\'assuré.',
      montantSouscription: 200000,
      assurance: 4,
      garanties: [11],
      souscriptions: [14, 15]
    },
    {
      id: 8,
      numeroPolice: 'P002',
      label: 'Police Assurance Invalidité',
      conditions: 'Couverture pour la perte de revenus en cas d\'incapacité de travail due à une maladie ou un accident.',
      montantSouscription: 120000,
      assurance: 4,
      garanties: [12],
      souscriptions: [16, 17]
    }
  ];

  // Liste pour GarantieStatus
  garantieStatus = [
    { label: 'Activée', value: GarantieStatus.ACTIVEE },
    { label: 'Expirée', value: GarantieStatus.EXPIREE },
    { label: 'Suspendue', value: GarantieStatus.SUSPENDUE }
  ];

  constructor(
    appMain: AppMainComponent,
    messageService: MessageService,
    baseService: BaseService,
    accountService: AccountService,
    fb: FormBuilder,
    private garantieService: GarantieService
  ) {
    super(messageService, baseService, accountService, fb, garantieService, appMain);
    this.entityName = 'Garantie';
    this.componentLink = '/admin/garanties';
    this.importLink = '/import/garanties';
    this.roleKey = 'GARANTIE_MODULE';
    this.isTable = true;
  }
  
  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'numeroGarantie', header: 'Num Garantie', type: 'text' },
      { field: 'label', header: 'Label', type: 'text' },
      { field: 'percentage', header: 'Pourcentage', type: 'currency' },
      { field: 'termes', header: 'Termes', type: 'textarea' },
      { field: 'plafondAssure', header: 'Plafond assuré', type: 'currency' },
      { field: 'dateDebut', header: 'Date de début', type: 'date' },
      { field: 'dateFin', header: 'Date de fin', type: 'date' },
      { field: 'status', header: 'Status', type: 'enum', values: [], label: 'label', key: 'value' },
      { field: 'polices', header: 'Polices d\'assurance', type: 'list', values: [], label: 'numeroPolice', key: 'id', subfield: [
        { field: 'id', header: 'ID', type: 'id' },
        { field: 'numeroPolice', header: 'Num Police', type: 'text' },
        { field: 'label', header: 'Libelle', type: 'text' },
        { field: 'montantSouscription', header: 'Coût', type: 'currency' }
        ]
      }
    ];
  }

  // Méthode abstraite à implémenter pour initialiser les données des colonnes de la table
  protected initializeColumnsData(): void {
    this.items = [
      {
        id: 1,
        numeroGarantie: 'GAR-001',
        label: 'Assurance Santé Avenir',
        percentage: 80,
        termes: 'Couvre 80% des frais médicaux avec un plafond de 100,000 XAF par an.',
        plafondAssure: 100000,
        dateDebut: new Date('2023-01-01'),
        dateFin: new Date('2023-12-31'),
        status: GarantieStatus.ACTIVEE,
        polices: [1, 2, 3]
      },
      {
        id: 2,
        numeroGarantie: 'GAR-002',
        label: 'Mutuelle Bien-Être',
        percentage: 70,
        termes: 'Couvre 70% des frais de soins paramédicaux avec un plafond de 50,000 XAF par an.',
        plafondAssure: 50000,
        dateDebut: new Date('2023-01-01'),
        dateFin: new Date('2023-12-31'),
        status: GarantieStatus.ACTIVEE,
        polices: [4, 8]
      },
      {
        id: 3,
        numeroGarantie: 'GAR-003',
        label: 'Caisse Nationale de Sécurité Sociale',
        percentage: 100,
        termes: 'Couvre 100% des frais médicaux pour les travailleurs enregistrés.',
        plafondAssure: 200000,
        dateDebut: new Date('2023-01-01'),
        dateFin: new Date('2023-12-31'),
        status: GarantieStatus.ACTIVEE,
        polices: [5, 6, 7]
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
    this.loadPolices();
    this.loading = false;
  }
  
  // Chargement des polices associés à une garantie-soin
  loadPolices(): void {
    this.garantieService.getAllPolices().subscribe((polices: PoliceAssurance[]) => {
        this.polices = polices;
    });
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['numeroGarantie', 'label', 'status'];
  }

  /**
   * Assigner les valeurs aux colonnes en fonction des champs spécifiés.
   */
  protected assignColumnsValues(): void { // Ajoutez le modificateur override
    this.setColumnValues('status', this.garantieStatus);
    this.setColumnValues('polices', this.polices);
  }
}
