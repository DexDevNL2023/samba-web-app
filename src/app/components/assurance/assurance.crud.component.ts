import { ToastService } from './../../service/toast.service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { MessageService } from 'primeng/api';
import { Assurance, InsuranceType } from '../../models/assurance.model';
import { PoliceAssurance } from '../../models/police-assurance.model';
import { AssuranceService } from '../../service/assurance.service';
import { GenericCrudComponent } from '../generic.crud.component';

@Component({
  selector: 'app-assurance-crud',
  templateUrl: './../generic.crud.component.html'
})
export class AssuranceCrudComponent extends GenericCrudComponent<Assurance> {
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

  // Liste pour Enum
  insuranceTypes = [
    { label: 'Personne', value: InsuranceType.PERSONNE },
    { label: 'Bien', value: InsuranceType.BIEN },
    { label: 'Agricole', value: InsuranceType.AGRICOLE },
    { label: 'Agricole', value: InsuranceType.SANTE }
  ];

  constructor(
    appMain: AppMainComponent,
    messageService: MessageService,
    baseService: BaseService,
    accountService: AccountService,
    fb: FormBuilder,
    toastService: ToastService,
    cdr: ChangeDetectorRef,
    private assuranceService: AssuranceService
  ) {
    super(toastService, messageService, cdr, baseService, accountService, fb, assuranceService, appMain);
    this.entityName = 'Assurance';
    this.componentLink = '/admin/assurances';
    this.importLink = '/import/assurances';
    this.roleKey = 'ASSURANCE_MODULE';
  }
  
  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'nom', header: 'Name', type: 'text' },
      { field: 'type', header: 'Type', type: 'enum', values: [], label: 'label', key: 'value' },
      { field: 'description', header: 'Description', type: 'textarea' },
      { field: 'polices', header: 'Polices d\'assurance', type: 'list', values: [], label: 'numeroPolice', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroPolice', header: 'Num Police', type: 'text' },
          { field: 'label', header: 'Libellé', type: 'text' },
          { field: 'montantSouscription', header: 'Coût', type: 'currency' }
        ]
      }
    ];
  }

  // Méthode abstraite à implémenter pour initialiser les données des colonnes de la table
  protected initializeColumnsData(): void {
    this.items = [
      // Assurances Santé
      {
        id: 1,
        nom: 'Assurance Maladie Complémentaire',
        description: 'Couverture complémentaire pour les frais médicaux non pris en charge par la sécurité sociale.',
        type: InsuranceType.SANTE,
        polices: [1]
      },
      {
        id: 2,
        nom: 'Assurance Hospitalisation',
        description: 'Prise en charge des frais d\'hospitalisation en cas de maladie ou d\'accident.',
        type: InsuranceType.SANTE,
        polices: [2]
      },
    
      // Assurances Automobile
      {
        id: 3,
        nom: 'Assurance Responsabilité Civile Auto',
        description: 'Couverture pour les dommages causés à des tiers en cas d\'accident de voiture.',
        type: InsuranceType.BIEN,
        polices: [3]
      },
      {
        id: 4,
        nom: 'Assurance Tous Risques Auto',
        description: 'Couverture complète incluant les dommages au véhicule assuré, qu\'ils soient de votre faute ou non.',
        type: InsuranceType.BIEN,
        polices: [4]
      },
    
      // Assurances Agricole
      {
        id: 5,
        nom: 'Assurance Récoltes',
        description: 'Couverture contre les pertes de récoltes dues à des conditions climatiques extrêmes ou des catastrophes naturelles.',
        type: InsuranceType.AGRICOLE,
        polices: [5]
      },
      {
        id: 6,
        nom: 'Assurance Bétail',
        description: 'Protection contre les pertes dues à des maladies du bétail ou des accidents.',
        type: InsuranceType.AGRICOLE,
        polices: [6]
      },
    
      // Assurances Personne
      {
        id: 7,
        nom: 'Assurance Vie',
        description: 'Protection financière pour les bénéficiaires en cas de décès de l\'assuré.',
        type: InsuranceType.PERSONNE,
        polices: [7]
      },
      {
        id: 8,
        nom: 'Assurance Invalidité',
        description: 'Couverture pour la perte de revenus en cas d\'incapacité de travail due à une maladie ou un accident.',
        type: InsuranceType.PERSONNE,
        polices: [8]
      }
    ];
    this.loadPolices();
    this.loading = false;
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] {
    return ['nom', 'type'];
  }

  /**
   * Assigner les valeurs aux colonnes en fonction des champs spécifiés.
   */
  protected assignColumnsValues(): void {
    this.setColumnValues('type', this.insuranceTypes);
    this.setColumnValues('polices', this.polices);
  }

  // Chargement des polices associés à une assurance
  loadPolices(): void {
    this.assuranceService.getAllPolices().subscribe((polices: PoliceAssurance[]) => {
        this.polices = polices;
    });
  }
}
