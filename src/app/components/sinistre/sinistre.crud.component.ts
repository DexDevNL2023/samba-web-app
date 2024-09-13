import { ToastService } from './../../service/toast.service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { MessageService } from 'primeng/api';
import { Sinistre, ClaimStatus } from '../../models/sinistre.model';
import { SinistreService } from '../../service/sinistre.service';
import { Document } from '../../models/document.model';
import { Prestation, PrestationStatus } from '../../models/prestation.model';
import { PaymentFrequency, Souscription, SubscriptionStatus } from '../../models/souscription.model';
import { GenericCrudComponent } from '../generic.crud.component';

@Component({
  selector: 'app-sinistre-crud',
  templateUrl: './../generic.crud.component.html'
})
export class SinistreCrudComponent extends GenericCrudComponent<Sinistre> {
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
  documents: Document[] = [
    {
      id: 1,
      numeroDocument: 'DOC-001',
      nom: 'Photo du Sinistre',
      description: 'Photo montrant les dommages causés par l\'accident',
      url: 'http://example.com/photo-sinistre.jpg'
    },
    {
      id: 2,
      numeroDocument: 'DOC-002',
      nom: 'Vidéo du Sinistre',
      description: 'Vidéo enregistrée par une caméra de surveillance',
      url: 'http://example.com/video-sinistre.mp4'
    },
    {
      id: 3,
      numeroDocument: 'DOC-003',
      nom: 'Facture de Réparation',
      description: 'Facture des coûts de réparation des dommages',
      url: 'http://example.com/facture-reparation.pdf'
    },
    {
      id: 4,
      numeroDocument: 'DOC-004',
      nom: 'Rapport Médical',
      description: 'Rapport médical décrivant les blessures subies',
      url: 'http://example.com/rapport-medical.pdf'
    }
  ];

  // Liste pour InsuranceType
  claimStatuses = [
    { label: 'En attente', value: ClaimStatus.EN_ATTENTE },
    { label: 'Approuvé', value: ClaimStatus.APPROUVE },
    { label: 'Annulé', value: ClaimStatus.ANNULE }
  ];
  prestationStatuses = [
    { label: 'Non remboursé', value: PrestationStatus.NON_REMBOURSE },
    { label: 'En attente', value: PrestationStatus.EN_ATTENTE },
    { label: 'Remboursé', value: PrestationStatus.REMBOURSE }
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
    private sinistreService: SinistreService
  ) {
    super(toastService, messageService, cdr, baseService, accountService, fb, sinistreService, appMain);
    this.entityName = 'Sinistre';
    this.componentLink = '/admin/sinistres';
    this.importLink = '/import/sinistres';
    this.roleKey = 'SINISTRE_MODULE';
  }
  
  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'numeroSinistre', header: ' Num Sinistre', type: 'text' },
      { field: 'label', header: 'Libellé', type: 'text' },
      { field: 'raison', header: 'Raison', type: 'textarea' },
      { field: 'dateDeclaration', header: 'Date de déclaration', type: 'date' },
      { field: 'dateTraitement', header: 'Date de traiment', type: 'date' },
      { field: 'status', header: 'Type', type: 'enum', values: [], label: 'label', key: 'value' },
      { field: 'montantSinistre', header: 'Montant du sinistre', type: 'currency' },
      { field: 'montantAssure', header: 'Montant assuré', type: 'currency' },
      { field: 'souscription', header: 'Souscription', type: 'objet', values: [], label: 'numeroSouscription', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroSouscription', header: 'Num Souscription', type: 'text' },
          { field: 'dateSouscription', header: 'Date de souscription', type: 'date' },
          { field: 'dateExpiration', header: 'Date d\'expiration', type: 'date' },
          { field: 'status', header: 'Status', type: 'enum', values: [], label: 'label', key: 'value' },
          { field: 'frequencePaiement', header: 'Frequency', type: 'enum', values: [], label: 'label', key: 'value' }
        ]
      },
      { field: 'prestations', header: 'Prestations', type: 'list', values: [], label: 'numeroPrestation', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroPrestation', header: 'Num Prestation', type: 'text' },
          { field: 'label', header: 'Libellé', type: 'text' },
          { field: 'status', header: 'Status', type: 'enum', values: [], label: 'label', key: 'value' },
          { field: 'datePrestation', header: 'Effectuer le', type: 'date' },
          { field: 'montant', header: 'Montant', type: 'currency' }
        ]
      },
      { field: 'documents', header: 'Documents', type: 'list', values: [], label: 'numeroDocument', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroDocument', header: 'Num Document', type: 'text' },
          { field: 'nom', header: 'Nom', type: 'text' },
          { field: 'url', header: 'Telecharger', type: 'url' }
        ]
      }
    ];
  }

  // Méthode abstraite à implémenter pour initialiser les données des colonnes de la table
  protected initializeColumnsData(): void {
    this.items = [
      // Assurance Bien
      {
        id: 1,
        numeroSinistre: 'SIN123456',
        label: 'Accident de voiture',
        raison: 'Collision avec un autre véhicule',
        dateDeclaration: new Date('2024-03-15'),
        dateTraitement: new Date('2024-03-20'),
        status: ClaimStatus.APPROUVE,
        montantSinistre: 500000,
        montantAssure: 450000,
        souscription: 1,
        prestations: [1, 2],
        documents: [1, 2]
      },
      {
        id: 2,
        numeroSinistre: 'SIN654321',
        label: 'Incendie de maison',
        raison: 'Court-circuit électrique',
        dateDeclaration: new Date('2024-05-10'),
        dateTraitement: new Date('2024-05-15'),
        status: ClaimStatus.EN_ATTENTE,
        montantSinistre: 2000000,
        montantAssure: 1800000,
        souscription: 2,
        prestations: [3, 4],
        documents: [3, 4]
      },
      // Assurance Agricole
      {
        id: 3,
        numeroSinistre: 'SIN789012',
        label: 'Inondation de champs',
        raison: 'Fortes pluies',
        dateDeclaration: new Date('2024-06-01'),
        dateTraitement: new Date('2024-06-05'),
        status: ClaimStatus.APPROUVE,
        montantSinistre: 300000,
        montantAssure: 250000,
        souscription: 3,
        prestations: [3],
        documents: [1]
      },
      {
        id: 4,
        numeroSinistre: 'SIN890123',
        label: 'Sécheresse',
        raison: 'Absence de pluie prolongée',
        dateDeclaration: new Date('2024-07-15'),
        dateTraitement: new Date('2024-07-20'),
        status: ClaimStatus.EN_ATTENTE,
        montantSinistre: 150000,
        montantAssure: 120000,
        souscription: 4,
        prestations: [4],
        documents: []
      },
      // Assurance Personne
      {
        id: 5,
        numeroSinistre: 'SIN456789',
        label: 'Accident de travail',
        raison: 'Chute d\'une échelle',
        dateDeclaration: new Date('2024-08-05'),
        dateTraitement: new Date('2024-08-10'),
        status: ClaimStatus.APPROUVE,
        montantSinistre: 50000,
        montantAssure: 45000,
        souscription: 2,
        prestations: [3, 1],
        documents: [1, 2]
      },
      {
        id: 6,
        numeroSinistre: 'SIN321654',
        label: 'Décès',
        raison: 'Cause naturelle',
        dateDeclaration: new Date('2024-09-01'),
        dateTraitement: new Date('2024-09-05'),
        status: ClaimStatus.APPROUVE,
        montantSinistre: 100000,
        montantAssure: 95000,
        souscription: 3,
        prestations: [1, 2],
        documents: [2]
      },
      // Assurance Santé
      {
        id: 7,
        numeroSinistre: 'SIN654987',
        label: 'Hospitalisation',
        raison: 'Chirurgie d\'appendicite',
        dateDeclaration: new Date('2024-10-10'),
        dateTraitement: new Date('2024-10-15'),
        status: ClaimStatus.APPROUVE,
        montantSinistre: 70000,
        montantAssure: 65000,
        souscription: 2,
        prestations: [3, 4],
        documents: [3, 4]
      },
      {
        id: 8,
        numeroSinistre: 'SIN987321',
        label: 'Consultation médicale',
        raison: 'Fièvre élevée',
        dateDeclaration: new Date('2024-11-01'),
        dateTraitement: new Date('2024-11-05'),
        status: ClaimStatus.EN_ATTENTE,
        montantSinistre: 2000,
        montantAssure: 1500,
        souscription: 1,
        prestations: [2],
        documents: []
      }
    ];
    this.loadSouscriptions();
    this.loadPrestations();
    this.loadDocuments();
    this.loading = false;
  }

  // Chargement des souscriptions associés à une assure
  loadSouscriptions(): void {
    this.sinistreService.getAllSouscriptions().subscribe((souscriptions: Souscription[]) => {
        this.souscriptions = souscriptions;
    });
  }
  
  // Chargement des polices associés à une sinistre
  loadPrestations(): void {
    this.sinistreService.getAllPrestations().subscribe((prestations: Prestation[]) => {
        this.prestations = prestations;
    });
  }
  
  // Chargement des documents associés à une prestation
  loadDocuments(): void {
    this.sinistreService.getAllDocuments().subscribe((documents: Document[]) => {
        this.documents = documents;
    });
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['numeroSinistre', 'raison', 'dateDeclaration', 'montantSinistre'];
  }

  /**
   * Assigner les valeurs aux colonnes en fonction des champs spécifiés.
   */
  protected assignColumnsValues(): void { // Ajoutez le modificateur override
    this.setColumnValues('status', this.claimStatuses);
    this.setColumnValues('souscription', this.souscriptions);
    this.setSubFieldValues('souscription', 'status', this.status);
    this.setSubFieldValues('souscription', 'frequencePaiement', this.frequencies);
    this.setColumnValues('prestations', this.prestations);
    this.setSubFieldValues('prestations', 'status', this.prestationStatuses);
    this.setColumnValues('documents', this.documents);
  }
}
