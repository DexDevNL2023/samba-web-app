import { ToastService } from './../../service/toast.service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { MessageService } from 'primeng/api';
import { PoliceAssurance } from '../../models/police-assurance.model';
import { PoliceAssuranceService } from '../../service/police-assurance.service';
import { PaymentFrequency, Souscription, SubscriptionStatus } from '../../models/souscription.model';
import { Garantie, GarantieStatus } from '../../models/garantie.model';
import { Assurance, InsuranceType } from '../../models/assurance.model';
import { GenericCrudComponent } from '../generic.crud.component';

@Component({
  selector: 'app-police-assurance-crud',
  templateUrl: './../generic.crud.component.html'
})
export class PoliceAssuranceCrudComponent extends GenericCrudComponent<PoliceAssurance> {
  souscriptions: Souscription[] = [
    {
      id: 1,
      numeroSouscription: 'SUB001',
      dateSouscription: new Date('2023-01-01'),
      dateExpiration: new Date('2024-01-01'),
      status: 'ACTIVE',
      frequencePaiement: 'MENSUEL',
      assure: 1,
      police: 1,
      paiements: [1, 2, 3],
      sinistres: [1, 2]
    },
    {
      id: 2,
      numeroSouscription: 'SUB002',
      dateSouscription: new Date('2022-06-01'),
      dateExpiration: new Date('2023-06-01'),
      status: 'ON_RISK',
      frequencePaiement: 'ANNUEL',
      assure: 2,
      police: 2,
      paiements: [4],
      sinistres: [3]
    },
    {
      id: 3,
      numeroSouscription: 'SUB003',
      dateSouscription: new Date('2024-02-15'),
      dateExpiration: new Date('2025-02-15'),
      status: 'WAITING',
      frequencePaiement: 'TRIMESTRIEL',
      assure: 3,
      police: 3,
      paiements: [5, 6],
      sinistres: []
    },
    {
      id: 4,
      numeroSouscription: 'SUB004',
      dateSouscription: new Date('2021-09-01'),
      dateExpiration: new Date('2022-09-01'),
      status: 'RESILIE',
      frequencePaiement: 'SEMESTRIEL',
      assure: 4,
      police: 4,
      paiements: [7, 8],
      sinistres: [4]
    }
  ];
  garanties: Garantie[] = [
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
  assurances: Assurance[] = [
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

  // Liste pour InsuranceType
  insuranceTypes = [
    { label: 'Personne', value: InsuranceType.PERSONNE },
    { label: 'Bien', value: InsuranceType.BIEN },
    { label: 'Agricole', value: InsuranceType.AGRICOLE },
    { label: 'Agricole', value: InsuranceType.SANTE }
  ];
  garantieStatus = [
    { label: 'Activée', value: GarantieStatus.ACTIVEE },
    { label: 'Expirée', value: GarantieStatus.EXPIREE },
    { label: 'Suspendue', value: GarantieStatus.SUSPENDUE }
  ];
  frequencies = [
    { label: 'Annuel', value: PaymentFrequency.ANNUEL },
    { label: 'Mensuel', value: PaymentFrequency.MENSUEL },
    { label: 'Semestriel', value: PaymentFrequency.SEMESTRIEL },
    { label: 'Trimestriel', value: PaymentFrequency.TRIMESTRIEL }
  ];
  status = [
    { label: 'Activee', value: SubscriptionStatus.ACTIVE },
    { label: 'On risk', value: SubscriptionStatus.ON_RISK },
    { label: 'Resiliee', value: SubscriptionStatus.RESILIE },
    { label: 'En attente', value: SubscriptionStatus.WAITING }
  ];

  constructor(
    appMain: AppMainComponent,
    messageService: MessageService,
    baseService: BaseService,
    accountService: AccountService,
    fb: FormBuilder,
    toastService: ToastService,
    cdr: ChangeDetectorRef,
    private policeAssuranceService: PoliceAssuranceService
  ) {
    super(toastService, messageService, cdr, baseService, accountService, fb, policeAssuranceService, appMain);
    this.entityName = 'Police d\'assurance';
    this.componentLink = '/admin/polices/assurances';
    this.importLink = '/import/polices/assurances';
    this.roleKey = 'POLICE_ASSURANCE_MODULE';
  }
  
  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'numeroPolice', header: 'Num Police', type: 'text' },
      { field: 'label', header: 'Libellé', type: 'text' },
      { field: 'conditions', header: 'Conditions', type: 'textarea' },
      { field: 'montantSouscription', header: 'Montant', type: 'currency' },
      { field: 'assurance', header: 'Assurance', type: 'objet', values: [], label: 'nom', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'nom', header: 'Name', type: 'text' },
          { field: 'type', header: 'Type', type: 'enum', values: [], label: 'label', key: 'value' }
        ]
      },
      { field: 'garanties', header: 'Garanties', type: 'list', values: [], label: 'numeroGarantie', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroGarantie', header: 'Num Garantie', type: 'text' },
          { field: 'label', header: 'Label', type: 'text' },
          { field: 'percentage', header: 'Pourcentage', type: 'currency' },
          { field: 'plafondAssure', header: 'Plafond assuré', type: 'currency' },
          { field: 'status', header: 'Status', type: 'enum', values: [], label: 'label', key: 'value' }
        ]
      },
      { field: 'souscriptions', header: 'Souscriptions', type: 'list', values: [], label: 'numeroSouscription', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroSouscription', header: 'Num Souscription', type: 'text' },
          { field: 'dateSouscription', header: 'Date de souscription', type: 'date' },
          { field: 'dateExpiration', header: 'Date d\'expiration', type: 'date' },
          { field: 'status', header: 'Status', type: 'enum', values: [], label: 'label', key: 'value' },
          { field: 'frequencePaiement', header: 'Frequency', type: 'enum', values: [], label: 'label', key: 'value' }
        ]
      }
    ];
  }

  // Méthode abstraite à implémenter pour initialiser les données des colonnes de la table
  protected initializeColumnsData(): void {
    this.items = [
      // Polices pour Assurance Santé
      {
        id: 1,
        numeroPolice: 'S001',
        label: 'Police Assurance Maladie Complémentaire',
        conditions: 'Couverture complémentaire pour les frais médicaux non pris en charge par la sécurité sociale.',
        montantSouscription: 60000,
        assurance: 1,
        garanties: [2],
        souscriptions: [1]
      },
      {
        id: 2,
        numeroPolice: 'S002',
        label: 'Police Assurance Hospitalisation',
        conditions: 'Prise en charge des frais d\'hospitalisation en cas de maladie ou d\'accident.',
        montantSouscription: 70000,
        assurance: 2,
        garanties: [3],
        souscriptions: [2]
      },
    
      // Polices pour Assurance Automobile
      {
        id: 3,
        numeroPolice: 'A001',
        label: 'Police Responsabilité Civile Auto',
        conditions: 'Couverture pour les dommages causés à des tiers en cas d\'accident de voiture.',
        montantSouscription: 25000,
        assurance: 3,
        garanties: [1],
        souscriptions: [3]
      },
      {
        id: 4,
        numeroPolice: 'A002',
        label: 'Police Tous Risques Auto',
        conditions: 'Couverture complète incluant les dommages au véhicule assuré, qu\'ils soient de votre faute ou non.',
        montantSouscription: 35000,
        assurance: 4,
        garanties: [2],
        souscriptions: [4]
      },
    
      // Polices pour Assurance Agricole
      {
        id: 5,
        numeroPolice: 'AG001',
        label: 'Police Assurance Récoltes',
        conditions: 'Couverture contre les pertes de récoltes dues à des conditions climatiques extrêmes ou des catastrophes naturelles.',
        montantSouscription: 40000,
        assurance: 5,
        garanties: [3],
        souscriptions: [1]
      },
      {
        id: 6,
        numeroPolice: 'AG002',
        label: 'Police Assurance Bétail',
        conditions: 'Protection contre les pertes dues à des maladies du bétail ou des accidents.',
        montantSouscription: 50000,
        assurance: 6,
        garanties: [1],
        souscriptions: [2]
      },
    
      // Polices pour Assurance Personne
      {
        id: 7,
        numeroPolice: 'P001',
        label: 'Police Assurance Vie',
        conditions: 'Protection financière pour les bénéficiaires en cas de décès de l\'assuré.',
        montantSouscription: 200000,
        assurance: 7,
        garanties: [2],
        souscriptions: [3]
      },
      {
        id: 8,
        numeroPolice: 'P002',
        label: 'Police Assurance Invalidité',
        conditions: 'Couverture pour la perte de revenus en cas d\'incapacité de travail due à une maladie ou un accident.',
        montantSouscription: 120000,
        assurance: 8,
        garanties: [3],
        souscriptions: [4]
      }
    ];
    this.loadAssurances();
    this.loadGarantie();
    this.loadSouscriptions();
    this.loading = false;
  }
  
  // Chargement des assurances associés à une police-assurance
  loadAssurances(): void {
    this.policeAssuranceService.getAllAssurances().subscribe((assurances: Assurance[]) => {
        this.assurances = assurances;
    });
  }
  
  // Chargement des garanties associés à une police-assurance
  loadGarantie(): void {
    this.policeAssuranceService.getAllGaranties().subscribe((garanties: Garantie[]) => {
        this.garanties = garanties;
    });
  }
  
  // Chargement des souscriptions associés à une police-assurance
  loadSouscriptions(): void {
    this.policeAssuranceService.getAllSouscriptions().subscribe((souscriptions: Souscription[]) => {
        this.souscriptions = souscriptions;
    });
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['numeroPolice', 'label', 'conditions'];
  }

  /**
   * Assigner les valeurs aux colonnes en fonction des champs spécifiés.
   */
  protected assignColumnsValues(): void { // Ajoutez le modificateur override
    this.setColumnValues('assurance', this.assurances);
    this.setSubFieldValues('assurance', 'type', this.insuranceTypes);
    this.setColumnValues('garanties', this.garanties);
    this.setSubFieldValues('garanties', 'status', this.garantieStatus);
    this.setColumnValues('souscriptions', this.souscriptions);
    this.setSubFieldValues('souscriptions', 'status', this.status);
    this.setSubFieldValues('souscriptions', 'frequencePaiement', this.frequencies);
  }
}
