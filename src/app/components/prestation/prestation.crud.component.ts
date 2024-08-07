import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { MessageService } from 'primeng/api';
import { Prestation, PrestationType, PrestationStatus } from '../../models/prestation.model';
import { PrestationService } from '../../service/prestation.service';
import { Financeur, FinanceurType } from '../../models/financeur.model';
import { Fournisseur } from '../../models/fournisseur.model';
import { Document } from '../../models/document.model';
import { ClaimStatus, Sinistre } from '../../models/sinistre.model';
import { GenericCrudComponent } from '../generic.crud.component';

@Component({
  selector: 'app-prestation-crud',
  templateUrl: './../generic.crud.component.html'
})
export class PrestationCrudComponent extends GenericCrudComponent<Prestation> {
  fournisseurs: Fournisseur[] = [
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
  financeurs: Financeur[] = [
    {
      id: 1,
      nom: 'Assurance Santé Avenir',
      description: 'Assurance offrant des couvertures complètes pour les soins médicaux.',
      type: FinanceurType.ASSUREUR,
      adresse: '123 Avenue de la Santé, Ville A - Pays A',
      telephone: '0123456789',
      email: 'contact@assurancesanteavenir.com',
      prestations: [1, 2, 4]
    },
    {
      id: 2,
      nom: 'Mutuelle Bien-Être',
      description: 'Mutuelle spécialisée dans les soins paramédicaux et la prévention.',
      type: FinanceurType.MUTUELLE,
      adresse: '456 Rue de la Mutuelle, Ville B - Pays B',
      telephone: '0987654321',
      email: 'info@mutuellebienetre.com',
      prestations: [1, 3]
    },
    {
      id: 3,
      nom: 'Caisse Nationale de Sécurité Sociale',
      description: 'Organisme public offrant des prestations de santé aux travailleurs.',
      type: FinanceurType.ORGANISME_PUBLIC,
      adresse: '789 Boulevard de la Sécurité, Capitale C',
      telephone: '0223344556',
      email: 'cnss@securitesociale.gouv',
      prestations: [2, 3, 4]
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
  sinistres: Sinistre[] = [
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

  // Liste pour InsuranceType
  prestationTypes = [
    { label: 'Bien', value: PrestationType.BIEN },
    { label: 'Agricole', value: PrestationType.AGRICOLE },
    { label: 'Personne', value: PrestationType.PERSONNE },
    { label: 'Santé', value: PrestationType.SANTE }
  ];
  prestationStatuses = [
    { label: 'Non remboursé', value: PrestationStatus.NON_REMBOURSE },
    { label: 'En attente', value: PrestationStatus.EN_ATTENTE },
    { label: 'Remboursé', value: PrestationStatus.REMBOURSE }
  ];
  claimStatuses = [
    { label: 'En attente', value: ClaimStatus.EN_ATTENTE },
    { label: 'Approuvé', value: ClaimStatus.APPROUVE },
    { label: 'Annulé', value: ClaimStatus.ANNULE }
  ];

  constructor(
    appMain: AppMainComponent,
    messageService: MessageService,
    baseService: BaseService,
    accountService: AccountService,
    fb: FormBuilder,
    private prestationService: PrestationService
  ) {
    super(messageService, baseService, accountService, fb, prestationService, appMain);
    this.entityName = 'Prestation';
    this.componentLink = '/admin/prestations';
    this.importLink = '/import-prestation';
    this.moduleKey = 'PRESTATION_MODULE';
    this.isTable = true;
  }
  
  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'numeroPrestation', header: 'Num Prestation', type: 'text' },
      { field: 'label', header: 'Libellé', type: 'text' },
      { field: 'datePrestation', header: 'Date de prestation', type: 'date' },
      { field: 'type', header: 'Type', type: 'enum', values: [], label: 'label', key: 'value' },
      { field: 'description', header: 'Description', type: 'textarea' },
      { field: 'montant', header: 'Montant', type: 'currency' },
      { field: 'status', header: 'Status', type: 'enum', values: [], label: 'label', key: 'value' },
      { field: 'fournisseur', header: 'Fournisseur', type: 'objet', values: [], label: 'nom', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'nom', header: 'Nom', type: 'text' },
          { field: 'telephone', header: 'Telephone', type: 'text' },
          { field: 'email', header: 'Email', type: 'text' },
          { field: 'adresse', header: 'Adresse', type: 'text' }
        ]
      },
      { field: 'sinistre', header: 'Sinistre', type: 'objet', values: [], label: 'numeroSinistre', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroSinistre', header: 'Num Sinistre', type: 'text' },
          { field: 'label', header: 'Libellé', type: 'text' },
          { field: 'dateDeclaration', header: 'Date de declaration', type: 'date' },
          { field: 'dateTraitement', header: 'Date de traitement', type: 'date' },
          { field: 'status', header: 'Status', type: 'enum', values: [], label: 'label', key: 'value' }
        ]
      },
      { field: 'financeurs', header: 'Financeurs', type: 'list', values: [], label: 'nom', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'nom', header: 'Name', type: 'text' },
          { field: 'adresse', header: 'Adresse', type: 'textarea' },
          { field: 'telephone', header: 'Telephone', type: 'text' },
          { field: 'email', header: 'Email', type: 'text' }
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
      {
        id: 1,
        numeroPrestation: 'PRE-001',
        label: 'Consultation Médicale Générale',
        datePrestation: new Date('2024-01-15'),
        type: PrestationType.SANTE,
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
        type: PrestationType.AGRICOLE,
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
        type: PrestationType.BIEN,
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
        type: PrestationType.PERSONNE,
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
    this.loadFournisseurs();
    this.loadSinistres();
    this.loadFinanceurs();
    this.loadDocuments();
    this.loading = false;
  }
  
  // Chargement des fournisseurs associés à une prestation
  loadFournisseurs(): void {
    this.prestationService.getAllFournisseurs().subscribe((fournisseurs: Fournisseur[]) => {
        this.fournisseurs = fournisseurs;
    });
  }
  
  // Chargement des sinistres associés à une prestation
  loadSinistres(): void {
    this.prestationService.getAllSinistres().subscribe((sinistres: Sinistre[]) => {
        this.sinistres = sinistres;
    });
  }
  
  // Chargement des financeurs associés à une prestation
  loadFinanceurs(): void {
    this.prestationService.getAllFinanceurs().subscribe((financeurs: Financeur[]) => {
        this.financeurs = financeurs;
    });
  }
  
  // Chargement des documents associés à une prestation
  loadDocuments(): void {
    this.prestationService.getAllDocuments().subscribe((documents: Document[]) => {
        this.documents = documents;
    });
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['numeroPrestation', 'label', 'datePrestation', 'montant'];
  }

  /**
   * Assigner les valeurs aux colonnes en fonction des champs spécifiés.
   */
  protected assignColumnsValues(): void { // Ajoutez le modificateur override
    this.setColumnValues('type', this.prestationTypes);
    this.setColumnValues('status', this.prestationStatuses);
    this.setColumnValues('fournisseur', this.fournisseurs);
    this.setColumnValues('sinistre', this.sinistres);
    this.setSubFieldValues('sinistre', 'status', this.claimStatuses);
    this.setColumnValues('financeurs', this.financeurs);
    this.setColumnValues('documents', this.documents);
  }
}
