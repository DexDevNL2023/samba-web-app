import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { MessageService } from 'primeng/api';
import { Reclamation, StatutReclamation, TypeReclamation } from '../../models/reclamation.model';
import { ReclamationService } from '../../service/reclamation.service';
import { PaymentFrequency, Souscription, SubscriptionStatus } from '../../models/souscription.model';
import { GenericCrudComponent } from '../generic.crud.component';

@Component({
  selector: 'app-reclamation-crud',
  templateUrl: './../generic.crud.component.html'
})
export class ReclamationCrudComponent extends GenericCrudComponent<Reclamation> {
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

  // Liste pour InsuranceType
  typeReclamations = [
    { label: 'Sinistre', value: TypeReclamation.SINISTRE },
    { label: 'Prestation', value: TypeReclamation.PRESTATION }
  ];
  statutReclamations = [
    { label: 'En cours', value: StatutReclamation.EN_COURS },
    { label: 'Approuvée', value: StatutReclamation.APPROUVEE },
    { label: 'Rejetée', value: StatutReclamation.REJETEE },
    { label: 'En attente', value: StatutReclamation.EN_ATTENTE }
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
    private reclamationService: ReclamationService
  ) {
    super(messageService, baseService, accountService, fb, reclamationService, appMain);
    this.entityName = 'Reclamation';
    this.componentLink = '/admin/reclamations';
    this.importLink = '/import/reclamations';
    this.moduleKey = 'RECLAMATION_MODULE';
    this.isTable = true;
  }
  
  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'numeroReclamation', header: 'Num Reclamation', type: 'text' },
      { field: 'type', header: 'Type', type: 'enum', values: [], label: 'label', key: 'value' },
      { field: 'dateReclamation', header: 'Date de reclamation', type: 'date' },
      { field: 'status', header: 'Status', type: 'enum', values: [], label: 'label', key: 'value' },
      { field: 'description', header: 'Description', type: 'textarea' },
      { field: 'montantReclame', header: 'Montant reclamé', type: 'currency' },
      { field: 'montantApprouve', header: 'Montant approuvé', type: 'currency' },
      { field: 'dateEvaluation', header: 'Date évaluation', type: 'date' },
      { field: 'agentEvaluateur', header: 'Agent évaluateur', type: 'text' },
      { field: 'justification', header: 'Justification', type: 'textarea' },
      { field: 'souscription', header: 'Souscription', type: 'objet', values: [], label: 'numeroSouscription', key: 'id', subfield: [
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
      {
        id: 1,
        numeroReclamation: 'REC123456',
        type: TypeReclamation.SINISTRE,
        dateReclamation: new Date('2024-03-15'),
        status: StatutReclamation.EN_COURS,
        description: 'Réclamation pour un sinistre auto.',
        montantReclame: 500000,
        montantApprouve: 450000,
        dateEvaluation: new Date('2024-03-20'),
        agentEvaluateur: 'Agent 001',
        justification: 'Dommages évalués et approuvés.',
        souscription: 4
      },
      {
        id: 2,
        numeroReclamation: 'REC654321',
        type: TypeReclamation.PRESTATION,
        dateReclamation: new Date('2024-04-10'),
        status: StatutReclamation.APPROUVEE,
        description: 'Réclamation pour des frais médicaux.',
        montantReclame: 10000,
        montantApprouve: 8000,
        dateEvaluation: new Date('2024-04-15'),
        agentEvaluateur: 'Agent 002',
        justification: 'Frais médicaux partiellement approuvés.',
        souscription: 3
      },
      {
        id: 3,
        numeroReclamation: 'REC789012',
        type: TypeReclamation.SINISTRE,
        dateReclamation: new Date('2024-05-05'),
        status: StatutReclamation.REJETEE,
        description: 'Réclamation pour des dommages agricoles.',
        montantReclame: 300000,
        montantApprouve: 0,
        dateEvaluation: new Date('2024-05-10'),
        agentEvaluateur: 'Agent 003',
        justification: 'Réclamation rejetée pour non-conformité.',
        souscription: 2
      },
      {
        id: 4,
        numeroReclamation: 'REC890123',
        type: TypeReclamation.PRESTATION,
        dateReclamation: new Date('2024-06-15'),
        status: StatutReclamation.EN_ATTENTE,
        description: 'Réclamation pour des prestations de rééducation.',
        montantReclame: 50000,
        montantApprouve: null,
        dateEvaluation: null,
        agentEvaluateur: null,
        justification: null,
        souscription: 1
      },
      {
        id: 5,
        numeroReclamation: 'REC456789',
        type: TypeReclamation.SINISTRE,
        dateReclamation: new Date('2024-07-20'),
        status: StatutReclamation.APPROUVEE,
        description: 'Réclamation pour un sinistre habitation.',
        montantReclame: 1000000,
        montantApprouve: 950000,
        dateEvaluation: new Date('2024-07-25'),
        agentEvaluateur: 'Agent 004',
        justification: 'Évaluation des dommages approuvée.',
        souscription: 1
      },
      {
        id: 6,
        numeroReclamation: 'REC321654',
        type: TypeReclamation.PRESTATION,
        dateReclamation: new Date('2024-08-01'),
        status: StatutReclamation.REJETEE,
        description: 'Réclamation pour des soins dentaires.',
        montantReclame: 15000,
        montantApprouve: 0,
        dateEvaluation: new Date('2024-08-05'),
        agentEvaluateur: 'Agent 005',
        justification: 'Réclamation rejetée pour absence de justificatifs.',
        souscription: 2
      },
      {
        id: 7,
        numeroReclamation: 'REC654987',
        type: TypeReclamation.SINISTRE,
        dateReclamation: new Date('2024-09-10'),
        status: StatutReclamation.EN_ATTENTE,
        description: 'Réclamation pour un sinistre agricole.',
        montantReclame: 200000,
        montantApprouve: null,
        dateEvaluation: null,
        agentEvaluateur: null,
        justification: null,
        souscription: 3
      },
      {
        id: 8,
        numeroReclamation: 'REC987321',
        type: TypeReclamation.PRESTATION,
        dateReclamation: new Date('2024-10-01'),
        status: StatutReclamation.EN_COURS,
        description: 'Réclamation pour des services de télémédecine.',
        montantReclame: 3000,
        montantApprouve: null,
        dateEvaluation: null,
        agentEvaluateur: null,
        justification: null,
        souscription: 4
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
    this.loading = false;
  }

  // Chargement des souscriptions associés à une reclamation
  loadSouscriptions(): void {
    this.reclamationService.getAllSouscriptions().subscribe((souscriptions: Souscription[]) => {
        this.souscriptions = souscriptions;
    });
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['numeroReclamation', 'dateReclamation', 'description'];
  }

  /**
   * Assigner les valeurs aux colonnes en fonction des champs spécifiés.
   */
  protected assignColumnsValues(): void { // Ajoutez le modificateur override
    this.setColumnValues('type', this.typeReclamations);
    this.setColumnValues('status', this.statutReclamations);
    this.setColumnValues('souscription', this.souscriptions);
    this.setSubFieldValues('souscription', 'status', this.status);
    this.setSubFieldValues('souscription', 'frequencePaiement', this.frequencies);
  }
}
