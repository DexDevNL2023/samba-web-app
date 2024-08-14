import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { MessageService } from 'primeng/api';
import { Paiement, PaymentStatus, PaymentType, RecuPaiement } from '../../models/paiement.model';
import { PaiementService } from '../../service/paiement.service';
import { PaymentFrequency, Souscription, SubscriptionStatus } from '../../models/souscription.model';
import { GenericCrudComponent } from '../generic.crud.component';

@Component({
  selector: 'app-paiement-crud',
  templateUrl: './../generic.crud.component.html'
})
export class PaiementCrudComponent extends GenericCrudComponent<Paiement> {
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
  recuPaiements: RecuPaiement[] = [
    // Prime de souscription
    {
      id: 1,
      numeroRecu: 'PR123456',
      dateEmission: new Date('2024-07-31'),
      montant: 50.00,
      details: "Paiement de la prime d'assurance pour le mois de juillet 2024, souscription n° 78910"
    },
    // Remboursement de frais médicaux
    {
      id: 2,
      numeroRecu: 'RM654321',
      dateEmission: new Date('2024-07-30'),
      montant: 150.00,
      details: "Remboursement pour frais médicaux après sinistre, souscription n° 12345"
    },
    // Prestation d'expertise
    {
      id: 3,
      numeroRecu: 'PRM789012',
      dateEmission: new Date('2024-07-29'),
      montant: 200.00,
      details: "Paiement pour la prestation d'expertise liée à une demande de sinistre, souscription n° 56789"
    },
    // Prime de renouvellement
    {
      id: 4,
      numeroRecu: 'PR987654',
      dateEmission: new Date('2024-06-15'),
      montant: 75.00,
      details: "Renouvellement de la prime d'assurance pour le trimestre de juillet à septembre 2024, souscription n° 34567"
    },
    // Remboursement pour pertes matérielles
    {
      id: 5,
      numeroRecu: 'RM432109',
      dateEmission: new Date('2024-07-10'),
      montant: 300.00,
      details: "Remboursement pour pertes matérielles dues à un incendie, souscription n° 67890"
    },
    // Prestation d'assistance juridique
    {
      id: 6,
      numeroRecu: 'PRM210987',
      dateEmission: new Date('2024-07-05'),
      montant: 120.00,
      details: "Paiement pour la prestation d'assistance juridique liée à un litige, souscription n° 23456"
    }
  ];  
  
  // Liste pour Gender
  paymentTypes = [
    { label: 'Prime', value: PaymentType.PRIME },
    { label: 'Remboursement', value: PaymentType.REMBOURSEMENT },
    { label: 'Prestation', value: PaymentType.PRESTATION }
  ];
  paymentStatuses = [
    { label: 'En Attente', value: PaymentStatus.PENDING },
    { label: 'Complété', value: PaymentStatus.COMPLETED },
    { label: 'Échoué', value: PaymentStatus.FAILED }
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
    private paiementService: PaiementService
  ) {
    super(messageService, baseService, accountService, fb, paiementService, appMain);
    this.entityName = 'Paiement';
    this.componentLink = '/admin/paiements';
    this.importLink = '/import/paiements';
    this.moduleKey = 'PAIEMENT_MODULE';
    this.isTable = true;
  }
  
  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'numeroPaiement', header: 'Num Paiement', type: 'text' },
      { field: 'datePaiement', header: 'Date du paiement', type: 'date' },
      { field: 'montant', header: 'Montant', type: 'currency' },
      { field: 'type', header: 'Type', type: 'enum', values: [], label: 'label', key: 'value' },
      { field: 'status', header: 'Status', type: 'enum', values: [], label: 'label', key: 'value' },
      { field: 'souscription', header: 'Souscription', type: 'objet', values: [], label: 'numeroSouscription', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroSouscription', header: 'Num Souscription', type: 'text' },
          { field: 'dateSouscription', header: 'Date de souscription', type: 'date' },
          { field: 'dateExpiration', header: 'Date d\'expiration', type: 'date' },
          { field: 'status', header: 'Status', type: 'enum', values: [], label: 'label', key: 'value' },
          { field: 'frequencePaiement', header: 'Frequency', type: 'enum', values: [], label: 'label', key: 'value' }
        ]
      },
      { field: 'recuPaiement', header: 'Reçu du paiement', type: 'objet', values: [], label: 'numeroRecu', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroRecu', header: 'Num Reçu', type: 'text' },
          { field: 'dateEmission', header: 'Date d\'émission', type: 'date' },
          { field: 'montant', header: 'Montant', type: 'currency' },
          { field: 'details', header: 'Détails', type: 'textarea' }
        ]
      }
    ];
  }

  // Méthode abstraite à implémenter pour initialiser les données des colonnes de la table
  protected initializeColumnsData(): void {
    this.items = [
      // Paiements pour Assurance Santé
      {
        id: 1,
        numeroPaiement: 'P001',
        datePaiement: new Date('2024-01-15'),
        montant: 60000,
        type: PaymentType.PRIME,
        status: PaymentStatus.COMPLETED,
        souscription: 3,
        recuPaiement: 1
      },
      {
        id: 2,
        numeroPaiement: 'P002',
        datePaiement: new Date('2024-01-20'),
        montant: 70000,
        type: PaymentType.PRIME,
        status: PaymentStatus.PENDING,
        souscription: 2,
        recuPaiement: 2
      },
    
      // Paiements pour Assurance Automobile
      {
        id: 3,
        numeroPaiement: 'P003',
        datePaiement: new Date('2024-02-10'),
        montant: 25000,
        type: PaymentType.REMBOURSEMENT,
        status: PaymentStatus.COMPLETED,
        souscription: 4,
        recuPaiement: 3
      },
      {
        id: 4,
        numeroPaiement: 'P004',
        datePaiement: new Date('2024-03-05'),
        montant: 35000,
        type: PaymentType.REMBOURSEMENT,
        status: PaymentStatus.FAILED,
        souscription: 1,
        recuPaiement: 4
      },
    
      // Paiements pour Assurance Agricole
      {
        id: 5,
        numeroPaiement: 'P005',
        datePaiement: new Date('2024-04-15'),
        montant: 40000,
        type: PaymentType.PRESTATION,
        status: PaymentStatus.COMPLETED,
        souscription: 1,
        recuPaiement: 5
      },
      {
        id: 6,
        numeroPaiement: 'P006',
        datePaiement: new Date('2024-05-20'),
        montant: 50000,
        type: PaymentType.PRESTATION,
        status: PaymentStatus.PENDING,
        souscription: 3,
        recuPaiement: 6
      },
    
      // Paiements pour Assurance Vie
      {
        id: 7,
        numeroPaiement: 'P007',
        datePaiement: new Date('2024-06-25'),
        montant: 200000,
        type: PaymentType.PRIME,
        status: PaymentStatus.COMPLETED,
        souscription: 2,
        recuPaiement: 6
      },
      {
        id: 8,
        numeroPaiement: 'P008',
        datePaiement: new Date('2024-07-10'),
        montant: 120000,
        type: PaymentType.PRIME,
        status: PaymentStatus.PENDING,
        souscription: 4,
        recuPaiement: 3
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
    this.loadSouscriptions();
    this.loadRecuPaiements();
    this.loading = false;
  }

  // Chargement des souscriptions associés à une assure
  loadSouscriptions(): void {
    this.paiementService.getAllSouscriptions().subscribe((souscriptions: Souscription[]) => {
        this.souscriptions = souscriptions;
    });
  }

  // Chargement des reçu de paiement associés à une assure
  loadRecuPaiements(): void {
    this.paiementService.getAllRecuPaiements().subscribe((recuPaiements: RecuPaiement[]) => {
        this.recuPaiements = recuPaiements;
    });
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['numeroPaiement', 'montant'];
  }

  /**
   * Assigner les valeurs aux colonnes en fonction des champs spécifiés.
   */
  protected assignColumnsValues(): void { // Ajoutez le modificateur override
    this.setColumnValues('type', this.paymentTypes);
    this.setColumnValues('status', this.paymentStatuses);
    this.setColumnValues('souscription', this.souscriptions);
    this.setSubFieldValues('souscription', 'status', this.status);
    this.setSubFieldValues('souscription', 'frequencePaiement', this.frequencies);
    this.setColumnValues('recuPaiement', this.recuPaiements);
  }
}
