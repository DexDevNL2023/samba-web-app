import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { EntityByBranch } from '../../models/entity-by-branch.model';
import { MessageService } from 'primeng/api';
import readXlsxFile from 'read-excel-file';
import { Column } from '../../models/column.model';
import { Souscription, SubscriptionStatus, PaymentFrequency, ContratAssurance, ContratType } from '../../models/souscription.model';
import { SouscriptionService } from '../../service/souscription.service';
import { PortraitComponent } from '../../shared/portrait/portrait.demo.component';
import { Reclamation, StatutReclamation, TypeReclamation } from '../../models/reclamation.model';
import { ClaimStatus, Sinistre } from '../../models/sinistre.model';
import { PoliceAssurance } from '../../models/police-assurance.model';
import { Assure, Gender } from '../../models/assure.model';
import { Paiement, PaymentStatus, PaymentType } from '../../models/paiement.model';

@Component({
  selector: 'app-souscription-crud',
  templateUrl: './../generic.crud.component.html'
})
export class SouscriptionCrudComponent implements OnInit {
  @ViewChild(PortraitComponent, { static: false }) tableComponent!: PortraitComponent;
  printPreviewVisible: boolean = false;
  rowsPerPageOptions = [5, 10, 20]; // Options pour le nombre d'éléments par page
  displayItemDialog: boolean = false; 
  selectedItemView: any;
  displayItemListDialog: boolean = false; 
  selectedItemListView: any;
  displayDialog: boolean = false; // Variable pour contrôler l'affichage du dialogue d'ajout/modification d'élément
  displayDeleteDialog: boolean = false; // Variable pour contrôler l'affichage du dialogue de suppression d'un élément
  displayDeleteItemsDialog: boolean = false; // Variable pour contrôler l'affichage du dialogue de suppression de plusieurs éléments
  selectedItem: Souscription; // Élément de type Souscription actuellement sélectionné ou en cours de modification
  selectedItems: Souscription[] = []; // Tableau d'éléments de type Souscription sélectionnés
  submitted: boolean = false; // Indicateur pour soumission de formulaire
  componentLink: string = '';
  importLink: string = '';
  entityName: string = '';
  moduleKey: string = '';
  isTable = true;
  expandedRows: { [key: string]: boolean } = {};
  isExpanded = false;
  formGroup: FormGroup; // Groupe de contrôles de formulaire
  // Déclaration de la variable loading pour contrôler l'affichage du skeleton loader
  loading: boolean = true;
  imageUrlPreview: string | ArrayBuffer | null = null;
  // Configuration des colonnes de la table
  cols: Column[] = [
    { field: 'id', header: 'ID', type: 'id' },
    { field: 'numeroSouscription', header: 'Num Souscription', type: 'text' },
    { field: 'dateSouscription', header: 'Date de souscription', type: 'date' },
    { field: 'dateExpiration', header: 'Date d\'expiration', type: 'date' },
    { field: 'montantCotisation', header: 'Montant des cotisations', type: 'currency' },
    { field: 'status', header: 'Status', type: 'enum', values: [], label: 'label', key: 'value' },
    { field: 'frequencePaiement', header: 'Frequency', type: 'enum', values: [], label: 'label', key: 'value' },
    { field: 'assure', header: 'Assuré', type: 'objet', values: [], label: 'numNiu', key: 'id', subfield: [
        { field: 'id', header: 'ID', type: 'id' },
        { field: 'numNiu', header: 'Niu', type: 'text' },
        { field: 'firstName', header: 'Nom', type: 'text' },
        { field: 'lastName', header: 'Prénom', type: 'text' },
        { field: 'addresse', header: 'Addresse', type: 'textarea' }
      ]
    },
    { field: 'police', header: 'Polices d\'assurance', type: 'objet', values: [], label: 'numeroPolice', key: 'id', subfield: [
        { field: 'id', header: 'ID', type: 'id' },
        { field: 'numeroPolice', header: 'Num Police', type: 'text' },
        { field: 'label', header: 'Libelle', type: 'text' },
        { field: 'montantSouscription', header: 'Coût', type: 'currency' }
      ]
    },
    { field: 'contrat', header: 'Contrat', type: 'objet', values: [], label: 'numeroContrat', key: 'id', subfield: [
        { field: 'id', header: 'ID', type: 'id' },
        { field: 'numeroContrat', header: 'Num Contrat', type: 'text' },
        { field: 'dateContrat', header: 'Date du contrat', type: 'date' },
        { field: 'typeContrat', header: 'Type', type: 'enum', values: [], label: 'label', key: 'value' },
        { field: 'couverture', header: 'Couverture', type: 'textarea' },
        { field: 'montantAssure', header: 'Montant assuré', type: 'currency' },
        { field: 'franchise', header: 'franchise', type: 'currency' },
        { field: 'conditions', header: 'Conditions', type: 'textarea' },
        { field: 'exclusions', header: 'Exclusions', type: 'textarea' },
        { field: 'dateDebut', header: 'Date de début', type: 'date' },
        { field: 'dateFin', header: 'Date de fin', type: 'date' }
      ]
    },
    { field: 'paiements', header: 'Paiements', type: 'list', values: [], label: 'numeroPaiement', key: 'id', subfield: [
        { field: 'id', header: 'ID', type: 'id' },
        { field: 'numeroPaiement', header: 'Num Paiement', type: 'text' },
        { field: 'datePaiement', header: 'Date du paiement', type: 'date' },
        { field: 'montant', header: 'Montant', type: 'currency' },
        { field: 'type', header: 'Type', type: 'enum', values: [], label: 'label', key: 'value' },
        { field: 'status', header: 'Status', type: 'enum', values: [], label: 'label', key: 'value' }
      ]
    },
    { field: 'sinistres', header: 'Sinistres', type: 'list', values: [], label: 'numeroSinistre', key: 'id', subfield: [
        { field: 'id', header: 'ID', type: 'id' },
        { field: 'numeroSinistre', header: 'Num Sinistre', type: 'text' },
        { field: 'label', header: 'Libellé', type: 'text' },
        { field: 'dateDeclaration', header: 'Date de declaration', type: 'date' },
        { field: 'dateTraitement', header: 'Date de traitement', type: 'date' },
        { field: 'status', header: 'Status', type: 'enum', values: [], label: 'label', key: 'value' }
      ]
    },
    { field: 'reclamations', header: 'Reclamations', type: 'list', values: [], label: 'numeroReclamation', key: 'id', subfield: [
        { field: 'id', header: 'ID', type: 'id' },
        { field: 'numeroReclamation', header: 'Num Reclamation', type: 'text' },
        { field: 'type', header: 'Type', type: 'enum', values: [], label: 'label', key: 'value' },
        { field: 'dateReclamation', header: 'Date de reclamation', type: 'date' },
        { field: 'status', header: 'Status', type: 'enum', values: [], label: 'label', key: 'value' }
      ]
    }
  ];
  
  items: Souscription[] = [
    {
      id: 1,
      numeroSouscription: 'SUB001',
      dateSouscription: new Date('2023-01-01'),
      dateExpiration: new Date('2024-01-01'),
      montantCotisation: 50000,
      status: 'ACTIVE',
      frequencePaiement: 'MENSUEL',
      assure: 1,
      police: 1,
      contrat: 1,
      paiements: [1, 2, 3],
      sinistres: [1, 2],
      reclamations: [1]
    },
    {
      id: 2,
      numeroSouscription: 'SUB002',
      dateSouscription: new Date('2022-06-01'),
      dateExpiration: new Date('2023-06-01'),
      montantCotisation: 60000,
      status: 'ON_RISK',
      frequencePaiement: 'ANNUEL',
      assure: 2,
      police: 2,
      contrat: 2,
      paiements: [4],
      sinistres: [3],
      reclamations: [2]
    },
    {
      id: 3,
      numeroSouscription: 'SUB003',
      dateSouscription: new Date('2024-02-15'),
      dateExpiration: new Date('2025-02-15'),
      montantCotisation: 70000,
      status: 'WAITING',
      frequencePaiement: 'TRIMESTRIEL',
      assure: 3,
      police: 3,
      contrat: 3,
      paiements: [5, 6],
      sinistres: [],
      reclamations: []
    },
    {
      id: 4,
      numeroSouscription: 'SUB004',
      dateSouscription: new Date('2021-09-01'),
      dateExpiration: new Date('2022-09-01'),
      montantCotisation: 80000,
      status: 'RESILIE',
      frequencePaiement: 'SEMESTRIEL',
      assure: 4,
      police: 4,
      contrat: 4,
      paiements: [7, 8],
      sinistres: [4],
      reclamations: [3]
    },
    {
      id: 5,
      numeroSouscription: 'SUB005',
      dateSouscription: new Date('2023-03-01'),
      dateExpiration: new Date('2024-03-01'),
      montantCotisation: 45000,
      status: 'ACTIVE',
      frequencePaiement: 'MENSUEL',
      assure: 1,
      police: 5,
      contrat: 5,
      paiements: [5, 3],
      sinistres: [],
      reclamations: []
    },
    {
      id: 6,
      numeroSouscription: 'SUB006',
      dateSouscription: new Date('2022-12-01'),
      dateExpiration: new Date('2023-12-01'),
      montantCotisation: 55000,
      status: 'ON_RISK',
      frequencePaiement: 'ANNUEL',
      assure: 4,
      police: 6,
      contrat: 6,
      paiements: [4, 6],
      sinistres: [5],
      reclamations: [4]
    }
  ]; 
  branches: EntityByBranch<Souscription>[] = [
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
  assures: Assure[] = [
    {
      id: 1,
      numNiu: 'NIU123456789',
      lastName: 'Doe',
      firstName: 'John',
      dateNaissance: new Date('1985-01-15'),
      numCni: 'CNI12345678',
      sexe: Gender.MALE,
      email: 'john.doe@example.com',
      telephone: '1234567890',
      addresse: '123 Main St, Douala',
      signature: 'john_doe_signature.png',
      registrant: 1,
      dossiers: [1],
      souscriptions: [4]
    },
    {
      id: 2,
      numNiu: 'NIU987654321',
      lastName: 'Smith',
      firstName: 'Jane',
      dateNaissance: new Date('1990-07-22'),
      numCni: 'CNI87654321',
      sexe: Gender.FEMALE,
      email: 'jane.smith@example.com',
      telephone: '0987654321',
      addresse: '456 Elm St, Yaoundé',
      signature: 'jane_smith_signature.png',
      registrant: 2,
      dossiers: [2],
      souscriptions: [1]
    },
    {
      id: 3,
      numNiu: 'NIU555555555',
      lastName: 'Nguyen',
      firstName: 'Thi',
      dateNaissance: new Date('1988-03-12'),
      numCni: 'CNI55555555',
      sexe: Gender.FEMALE,
      email: 'thi.nguyen@example.com',
      telephone: '5555555555',
      addresse: '789 Maple St, Bafoussam',
      signature: 'thi_nguyen_signature.png',
      registrant: 1,
      dossiers: [3],
      souscriptions: [3]
    },
    {
      id: 4,
      numNiu: 'NIU333333333',
      lastName: 'Johnson',
      firstName: 'Chris',
      dateNaissance: new Date('1995-09-25'),
      numCni: 'CNI33333333',
      sexe: Gender.OTHER,
      email: 'chris.johnson@example.com',
      telephone: '3333333333',
      addresse: '321 Oak St, Garoua',
      signature: 'chris_johnson_signature.png',
      registrant: 2,
      dossiers: [4],
      souscriptions: [2]
    }
  ];
  polices: PoliceAssurance[] = [
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
  contrats: ContratAssurance[] = [
    {
      id: 1,
      numeroContrat: 'CON001',
      dateContrat: new Date('2023-01-01'),
      typeContrat: 'PERSONNE',
      couverture: 'Assurance vie',
      montantAssure: 1000000,
      franchise: 10000,
      conditions: 'Pas de couverture en cas de suicide au cours des deux premières années du contrat.',
      exclusions: 'Accidents de sport extrême tels que le parachutisme, le parapente, etc.',
      dateDebut: new Date('2023-01-01'),
      dateFin: new Date('2024-01-01')
    },
    {
      id: 2,
      numeroContrat: 'CON002',
      dateContrat: new Date('2022-06-01'),
      typeContrat: 'BIEN',
      couverture: 'Assurance habitation',
      montantAssure: 500000,
      franchise: 5000,
      conditions: 'Couverture pour incendie uniquement, à condition que les mesures de sécurité contre l\'incendie soient respectées.',
      exclusions: 'Dégâts des eaux dus à une négligence de l\'assuré, comme un robinet laissé ouvert.',
      dateDebut: new Date('2022-06-01'),
      dateFin: new Date('2023-06-01')
    },
    {
      id: 3,
      numeroContrat: 'CON003',
      dateContrat: new Date('2024-02-15'),
      typeContrat: 'AGRICOLE',
      couverture: 'Assurance récolte',
      montantAssure: 200000,
      franchise: 2000,
      conditions: 'Couverture pour perte de récolte due aux intempéries, sous réserve d\'une déclaration de perte dans les 48 heures.',
      exclusions: 'Perte due aux parasites en l\'absence de traitements préventifs recommandés.',
      dateDebut: new Date('2024-02-15'),
      dateFin: new Date('2025-02-15')
    },
    {
      id: 4,
      numeroContrat: 'CON004',
      dateContrat: new Date('2021-09-01'),
      typeContrat: 'SANTE',
      couverture: 'Assurance santé complète',
      montantAssure: 300000,
      franchise: 3000,
      conditions: 'Couverture pour hospitalisation et médicaments prescrits, avec une franchise applicable pour chaque admission hospitalière.',
      exclusions: 'Soins dentaires à l\'exception des urgences médicales dentaires.',
      dateDebut: new Date('2021-09-01'),
      dateFin: new Date('2022-09-01')
    },
    {
      id: 5,
      numeroContrat: 'CON005',
      dateContrat: new Date('2023-03-01'),
      typeContrat: 'PERSONNE',
      couverture: 'Assurance invalidité',
      montantAssure: 400000,
      franchise: 4000,
      conditions: 'Couverture pour invalidité permanente résultant d\'un accident ou d\'une maladie, sous réserve d\'une évaluation médicale.',
      exclusions: 'Invalidité temporaire ou partielle, conditions préexistantes non déclarées.',
      dateDebut: new Date('2023-03-01'),
      dateFin: new Date('2024-03-01')
    },
    {
      id: 6,
      numeroContrat: 'CON006',
      dateContrat: new Date('2022-12-01'),
      typeContrat: 'BIEN',
      couverture: 'Assurance voiture',
      montantAssure: 600000,
      franchise: 6000,
      conditions: 'Couverture pour accidents et vol, à condition que le véhicule soit équipé d\'un dispositif antivol approuvé.',
      exclusions: 'Usure normale du véhicule, dommages causés par une utilisation inappropriée.',
      dateDebut: new Date('2022-12-01'),
      dateFin: new Date('2023-12-01')
    }
  ];
  paiements: Paiement[] = [
    // Paiements pour Assurance Santé
    {
      id: 1,
      numeroPaiement: 'P001',
      datePaiement: new Date('2024-01-15'),
      montant: 60000,
      type: PaymentType.PRIME,
      status: PaymentStatus.COMPLETED,
      souscription: 3
    },
    {
      id: 2,
      numeroPaiement: 'P002',
      datePaiement: new Date('2024-01-20'),
      montant: 70000,
      type: PaymentType.PRIME,
      status: PaymentStatus.PENDING,
      souscription: 2
    },
  
    // Paiements pour Assurance Automobile
    {
      id: 3,
      numeroPaiement: 'P003',
      datePaiement: new Date('2024-02-10'),
      montant: 25000,
      type: PaymentType.REMBOURSEMENT,
      status: PaymentStatus.COMPLETED,
      souscription: 4
    },
    {
      id: 4,
      numeroPaiement: 'P004',
      datePaiement: new Date('2024-03-05'),
      montant: 35000,
      type: PaymentType.REMBOURSEMENT,
      status: PaymentStatus.FAILED,
      souscription: 1
    },
  
    // Paiements pour Assurance Agricole
    {
      id: 5,
      numeroPaiement: 'P005',
      datePaiement: new Date('2024-04-15'),
      montant: 40000,
      type: PaymentType.PRESTATION,
      status: PaymentStatus.COMPLETED,
      souscription: 1
    },
    {
      id: 6,
      numeroPaiement: 'P006',
      datePaiement: new Date('2024-05-20'),
      montant: 50000,
      type: PaymentType.PRESTATION,
      status: PaymentStatus.PENDING,
      souscription: 3
    },
  
    // Paiements pour Assurance Vie
    {
      id: 7,
      numeroPaiement: 'P007',
      datePaiement: new Date('2024-06-25'),
      montant: 200000,
      type: PaymentType.PRIME,
      status: PaymentStatus.COMPLETED,
      souscription: 2
    },
    {
      id: 8,
      numeroPaiement: 'P008',
      datePaiement: new Date('2024-07-10'),
      montant: 120000,
      type: PaymentType.PRIME,
      status: PaymentStatus.PENDING,
      souscription: 4
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
  reclamations: Reclamation[] = [
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

  // Liste pour InsuranceType
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
  genders = [
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' },
    { label: 'Other', value: 'OTHER' }
  ];
  contratTypes = [
    { label: 'Bien', value: ContratType.BIEN },
    { label: 'Agricole', value: ContratType.AGRICOLE },
    { label: 'Personne', value: ContratType.PERSONNE },
    { label: 'Santé', value: ContratType.SANTE }
  ];
  claimStatuses = [
    { label: 'En attente', value: ClaimStatus.EN_ATTENTE },
    { label: 'Approuvé', value: ClaimStatus.APPROUVE },
    { label: 'Annulé', value: ClaimStatus.ANNULE }
  ];
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

  constructor(
    private messageService: MessageService,
    private baseService: BaseService,
    private accountService: AccountService,
    private fb: FormBuilder, // Service pour construire des formulaires
    private service: SouscriptionService, // Service pour les opérations CRUD génériques
    public appMain: AppMainComponent // Donne acces aux methodes de app.main.component depuis le composant fille
  ) {
    // Initialisation du groupe de contrôles de formulaire avec les contrôles créés
    this.formGroup = this.fb.group(this.createFormControls());
    this.entityName = 'Souscription';
    this.componentLink = '/admin/souscriptions';
    this.importLink = '/import-souscription';
    this.moduleKey = 'ASSURANCE_MODULE';
    this.isTable = true;
  }

  ngOnInit() {
    this.initializeData();
    // Initialise les colonnes de la table
    //this.loadAssures();
    //this.loadPolices();
    //this.loadContrats();
    //this.loadPaiements();
    //this.loadSinistres();
    //this.loadReclamations();
    this.assignColumnValues();
    this.getRequiredFields();
    this.updateBreadcrumb(); // Mettre à jour le breadcrumb initial

    // Simulate fetching data from a service
    //this.fetchBranches();
  }

  // Sample data initialization
  private initializeData(): void {
    this.loading = false;
  }
  
  // Chargement des assures associés à une souscription
  loadAssures(): void {
    this.service.getAllAssures().subscribe((assures: Assure[]) => {
        this.assures = assures;
    });
  }
  
  // Chargement des polices associés à une souscription
  loadPolices(): void {
    this.service.getAllPolices().subscribe((polices: PoliceAssurance[]) => {
        this.polices = polices;
    });
  }
  
  // Chargement des contrats associés à une souscription
  loadContrats(): void {
    this.service.getAllContrats().subscribe((contrats: ContratAssurance[]) => {
        this.contrats = contrats;
    });
  }
  
  // Chargement des paiements associés à une souscription
  loadPaiements(): void {
    this.service.getAllPaiements().subscribe((paiements: Paiement[]) => {
        this.paiements = paiements;
    });
  }
  
  // Chargement des sinistres associés à une souscription
  loadSinistres(): void {
    this.service.getAllSinistres().subscribe((sinistres: Sinistre[]) => {
        this.sinistres = sinistres;
    });
  }
  
  // Chargement des reclamations associés à une souscription
  loadReclamations(): void {
    this.service.getAllReclamations().subscribe((reclamations: Reclamation[]) => {
        this.reclamations = reclamations;
    });
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['numeroSouscription', 'dateSouscription', 'dateExpiration', 'montantCotisation', 'assure', 'police'];
  }

  /**
   * Assigner les valeurs aux colonnes en fonction des champs spécifiés.
   */
  protected assignColumnValues(): void { // Ajoutez le modificateur override
    this.setColumnValues('status', this.status);
    this.setColumnValues('frequencePaiement', this.frequencies);
    this.setColumnValues('assure', this.assures);
    this.setColumnValues('police', this.polices);
    this.setColumnValues('contrat', this.contrats);
    this.setSubFieldValues('contrat', 'typeContrat', this.contratTypes);
    this.setColumnValues('paiements', this.paiements);
    this.setSubFieldValues('paiements', 'type', this.paymentTypes);
    this.setSubFieldValues('paiements', 'status', this.paymentStatuses);
    this.setColumnValues('sinistres', this.sinistres);
    this.setSubFieldValues('sinistres', 'status', this.claimStatuses);
    this.setColumnValues('reclamations', this.reclamations);
    this.setSubFieldValues('reclamations', 'type', this.typeReclamations);
    this.setSubFieldValues('reclamations', 'status', this.statutReclamations);
  }
  
  /**
   * Met à jour les valeurs d'une colonne spécifique.
   * @param field - Le champ de la colonne à mettre à jour.
   * @param values - Les valeurs à assigner à la colonne.
   */
  protected setColumnValues(field: string, values: any[]) {
    const column = this.cols.find(col => col.field === field);
    if (column) {
      column.values = values;
    }
  }

  /**
   * Met à jour les valeurs d'un sous-champ spécifique dans les colonnes.
   * @param parentField - Le champ parent contenant le sous-champ.
   * @param subField - Le sous-champ à mettre à jour.
   * @param values - Les valeurs à assigner au sous-champ.
   */
  protected setSubFieldValues(parentField: string, subField: string, values: any[]) {
    const parentColumn = this.cols.find(col => col.field === parentField);
    if (parentColumn && parentColumn.subfield) {
      const subColumn = parentColumn.subfield.find(sub => sub.field === subField);
      if (subColumn) {
        subColumn.values = values;
      }
    }
  }

  protected fetchBranches(): void {
    // Au chargement du composant, récupère tous les éléments via le service
    if(this.isTable) {
      this.service.query().subscribe(data => {
        this.items = data;
        this.loading = false; // Marque le chargement comme terminé une fois que les données sont récupérées
      });
    } else {
      this.service.queryByBranch().subscribe(data => {
        this.branches = data;
        this.items = this.branches.flatMap(branch => branch.partenaires?.flatMap(partenaire => partenaire.data) || []);
        this.loading = false; // Marque le chargement comme terminé une fois que les données sont récupérées
      });
    }
  }

  protected updateBreadcrumb() {
    // Mettre à jour le breadcrumb en fonction du contexte
    const breadcrumbItems = [
      { label: 'Home', routerLink: '/admin' },
      { label: this.entityName, routerLink: this.componentLink }
    ];

    this.appMain.setBreadcrumbItems(breadcrumbItems); // Call the public method instead
  }

  /**
   * Ouvre la vue d'un élément spécifique à partir de l'ID et du champ.
   * @param item - L'objet contenant les informations sur le champ et l'ID.
   */
  openItemView(item: { field: string, id: number }) {
      if (item && item.id != null && item.field) {
          const { id, field } = item;

          // Trouver la colonne correspondante à partir des colonnes configurées
          const column = this.cols.find(col => col.field === field);

          if (column) {
              // Assurer que la colonne a des valeurs à filtrer
              const values = column.values;

              if (values) {
                  // Filtrer l'élément en fonction des IDs et du champ clé
                  const filteredData = this.filterItemById(id, values, 'id');

                  if (filteredData) {
                      // Configurer la vue de l'élément avec les colonnes et l'élément trouvé
                      this.selectedItemView = { cols: column.subfield || [], data: filteredData };
                      this.displayItemDialog = true;
                  } else {
                      console.error(`No item found with ID: ${id} in field: ${field}`);
                  }
              } else {
                  console.error(`No values found for field: ${field}`);
              }
          } else {
              console.error(`Column with field: ${field} not found.`);
          }
      } else {
          console.error('Invalid item parameters provided.');
      }
  }

  /**
   * Retourne l'élément correspondant à l'ID fourni.
   * @param id - ID à rechercher.
   * @param values - Liste des éléments à filtrer.
   * @param key - Clé de l'élément à comparer (par exemple, 'id').
   * @returns - L'élément correspondant à l'ID ou `null` si aucun élément n'est trouvé.
   */
  private filterItemById(id: number, values: any[], key: string): any | null {
      return values.find(item => item[key] === id) || null;
  }

  /**
   * Ouvre la vue de la liste des éléments en filtrant selon les IDs fournis.
   * @param item - L'objet contenant les colonnes et les données de l'élément.
   */
  openItemListView(item: { field: string, ids: number[] }) {
      if (item && item.ids && item.field) {
          const ids = item.ids; // Liste des IDs à filtrer
          const field = item.field; // Champ de type 'list'

          // Trouver la colonne correspondante à partir des colonnes configurées
          const column = this.cols.find(col => col.field === field);

          if (column) {
              // Assurer que la colonne a des valeurs à filtrer
              const values = column.values;
              if (values) {
                  // Filtrer les éléments en fonction des IDs et du champ clé
                  const filteredDatas = this.filterItemsByIds(ids, values, 'id');
                  
                  // Configurer la vue de la liste avec les colonnes et les données filtrées
                  this.selectedItemListView = { cols: column.subfield || [], data: filteredDatas };
                  this.displayItemListDialog = true;
              } else {
                  console.error(`No values found for field: ${field}`);
              }
          } else {
              console.error(`Column with field: ${field} not found.`);
          }
      } else {
          console.error('Invalid item parameters provided.');
      }
  }

  /**
   * Retourne les éléments correspondant aux IDs fournis.
   * @param ids - Liste des IDs à rechercher.
   * @param values - Liste des éléments à filtrer.
   * @param key - Clé de l'élément à comparer (par exemple, 'id').
   * @returns - Liste des éléments correspondant aux IDs.
   */
  private filterItemsByIds(ids: number[], values: any[], key: string): any[] {
      return values.filter(item => ids.includes(item[key]));
  }

  // Method to calculate the total number of subscriptions for a given branch
  protected calculateTotalSubscriptions(branch: EntityByBranch<Souscription>): number {
    return branch.partenaires?.reduce((total, registrant) => total + (registrant.data?.length || 0), 0) || 0;
  }

  // Method to get the severity class based on the subscription status
  protected getSeverity(status: string): string {
    switch (status) {
      // Cas pour le statut de souscription
      case 'ACTIVE':
          return 'info';
      case 'ON_RISK':
          return 'success';
      case 'WATTING':
          return 'warning';
      case 'RESILIE':
          return 'danger';

      // Cas pour InsuranceType
      case 'PERSONNE':
          return 'info';
      case 'BIEN':
          return 'primary';
      case 'AGRICOLE':
          return 'success';
      case 'SANTE':
          return 'warning';

      // Cas pour GarantieStatus
      case 'ACTIVE':
          return 'success';
      case 'EXPIREE':
          return 'danger';
      case 'SUSPENDUE':
          return 'warning';

      // Cas pour NotificationType
      case 'PAIEMENT':
          return 'info';
      case 'SOUSCRIPTION':
          return 'primary';
      case 'SINISTRE':
          return 'danger';
      case 'REQUEST':
          return 'warning';

      // Cas pour PaymentType
      case 'PRIME':
          return 'success';
      case 'REMBOURSEMENT':
          return 'info';
      case 'PRESTATION':
          return 'primary';

      // Cas pour PaymentStatus
      case 'PENDING':
          return 'warning';
      case 'COMPLETED':
          return 'success';
      case 'FAILED':
          return 'danger';

      // Cas pour PrestationStatus
      case 'NON_REMBOURSE':
          return 'danger';
      case 'EN_ATTENTE':
          return 'warning';
      case 'REMBOURSE':
          return 'success';

      // Cas pour RapportType
      case 'PERFORMANCE':
          return 'primary';
      case 'PAIEMENT':
          return 'info';
      case 'SINISTRE':
          return 'danger';

      // Cas pour ReclamationStatus
      case 'EN_COURS':
          return 'warning';
      case 'RESOLUE':
          return 'success';
      case 'REJETEE':
          return 'danger';

      // Cas pour ClaimStatus
      case 'EN_ATTENTE':
          return 'warning';
      case 'APPROUVE':
          return 'success';
      case 'ANNULE':
          return 'danger';

      // Cas pour Gender
      case 'MALE':
          return 'info';
      case 'FEMALE':
          return 'primary';
      case 'OTHER':
          return 'warning';

      default:
          return 'default';
    }
  }

  protected expandAll() {
    this.isExpanded = !this.isExpanded;

    if (this.isExpanded) {
      this.branches.forEach(branch => {
        this.expandedRows[branch.name] = true;
        branch.partenaires.forEach((registrant: any) => {
          this.expandedRows[registrant.name] = true;
        });
      });
    } else {
      this.expandedRows = {};
    }
  }

  protected getAllFields() {
    return this.cols.map(col => col.field);
  }

  protected onFileSelected(event: any): void {
      const file = event.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
              this.imageUrlPreview = reader.result;
          };
          reader.readAsDataURL(file);
      }
  }

  // Improved error handling in onFileChange()
  protected async onFileChange($event: any) {
    try {
      let input = $event.files as FileList;
      if (input.length > 0) {
        const data = await readXlsxFile(input[0]);
        const processedData = this.processExcelData(data);
        this.baseService.create(this.importLink, processedData).subscribe(
          data => {
            console.log(data);
            this.ngOnInit();
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de l\'importation.', life: 5000 });
          }
        );
      } else {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Fichier incorrect!", life: 5000 });
      }
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: e.message || 'Erreur inconnue', life: 5000 });
    }
  }

  // Helper method for processing Excel data
  protected processExcelData(data: any[]): any[] {
    let listes: any[] = [];
    data.slice(1).forEach(row => {
      let item: any = {};
      row.forEach((value, index) => {
        item[data[0][index]] = value;
      });
      listes.push(item);
    });
    return listes;
  }

  // Méthode privée pour créer les contrôles de formulaire requis
  protected createFormControls(): { [key: string]: FormControl } {
      const controls: { [key: string]: FormControl } = {}; // Initialise un objet vide pour les contrôles de formulaire
      const requiredFields = this.getRequiredFields(); // Récupère la liste des champs requis
      console.log(requiredFields);

      this.cols.forEach(col => { // Parcours toutes les colonnes
          const isRequired = requiredFields.includes(col.field); // Vérifie si le champ est requis
          console.log(col);
          console.log(isRequired);

          switch (col.type) {
              case 'id':
                  if (isRequired) {
                      controls[col.field] = new FormControl({ value: null, disabled: true }, Validators.required);
                  } else {
                      controls[col.field] = new FormControl({ value: null, disabled: true });
                  }
                  break;
              case 'boolean':
                  if (isRequired) {
                      controls[col.field] = new FormControl(false, Validators.required);
                  } else {
                      controls[col.field] = new FormControl(false);
                  }
                  break;
              case 'currency':
                  if (isRequired) {
                      controls[col.field] = new FormControl(0, [Validators.required, Validators.min(0)]);
                  } else {
                      controls[col.field] = new FormControl(0);
                  }
                  break;
              case 'objet':
                  if (isRequired) {
                      controls[col.field] = new FormControl(null, Validators.required);
                  } else {
                      controls[col.field] = new FormControl(null);
                  }
                  break;
              case 'list':
                  if (isRequired) {
                      controls[col.field] = new FormControl([], Validators.required);
                  } else {
                      controls[col.field] = new FormControl([]);
                  }
                  break;
              default:
                  if (isRequired) {
                      controls[col.field] = new FormControl('', Validators.required);
                  } else {
                      controls[col.field] = new FormControl('');
                  }
                  break;
          }
      });
      return controls; // Retourne les contrôles de formulaire créés
  }

  // Méthode privée pour mettre à jour les contrôles de formulaire avec les valeurs de l'élément en cours d'édition// Méthode privée pour mettre à jour les contrôles de formulaire lors de l'édition
  protected updateFormControls(): void {
      this.getAllFields().forEach(field => {
          const value = this.selectedItem[field] || '';
          this.formGroup.get(field)?.setValue(value);
      });
  }

  protected getEnumLabel(enumType: any, value: string) {
    const enumObj = enumType.find((e: any) => e.value === value);
    return enumObj ? enumObj.label : value;
  }

  // Méthode pour ouvrir le dialogue d'ajout d'un nouvel élément
  protected openNew() {
    this.selectedItem = {} as Souscription; // Initialise un nouvel élément
    this.submitted = false; // Réinitialise le soumission du formulaire
    this.displayDialog = true; // Affiche le dialogue d'ajout/modification
  }

  // Méthode pour ouvrir le dialogue de suppression de plusieurs éléments
  protected deleteSelectedItems() {
    this.displayDeleteItemsDialog = true; // Affiche le dialogue de suppression de plusieurs éléments
  }

  // Méthode pour éditer un élément spécifique
  protected editItem(item: Souscription) {
    this.selectedItem = { ...item }; // Copie l'élément à éditer dans la variable item
    this.updateFormControls(); // Met à jour les contrôles de formulaire lors de l'édition
    this.displayDialog = true; // Affiche le dialogue d'ajout/modification
  }

  // Méthode pour supprimer un élément spécifique
  protected deleteItem(item: Souscription) {
    this.displayDeleteDialog = true; // Affiche le dialogue de suppression d'un élément
    this.selectedItem = { ...item }; // Copie l'élément à supprimer dans la variable item
  }

  // Méthode pour confirmer la suppression de plusieurs éléments sélectionnés
  protected confirmDeleteSelected() {
    this.displayDeleteItemsDialog = false; // Ferme le dialogue de suppression de plusieurs éléments
    this.selectedItems.forEach(selectedItem => {
      this.service.delete((selectedItem as any).id).subscribe(() => { // Supprime chaque élément sélectionné via le service
        this.items = this.items.filter(val => val !== selectedItem); // Met à jour le tableau d'éléments après suppression
      });
    });
    this.appMain.showErrorViaToast('Successful', this.entityName + ' Deleted'); // Affiche un message de succès pour la suppression
    this.selectedItems = []; // Réinitialise les éléments sélectionnés
  }

  // Méthode pour confirmer la suppression d'un élément spécifique
  protected confirmDelete() {
    this.displayDeleteDialog = false; // Ferme le dialogue de suppression d'un élément
    this.service.delete((this.selectedItem as any).id).subscribe(() => { // Supprime l'élément via le service
      this.items = this.items.filter(val => val !== this.selectedItem); // Met à jour le tableau d'éléments après suppression
      this.appMain.showWarnViaToast('Successful', this.entityName + ' Deleted'); // Affiche un message de succès pour la suppression
      this.selectedItem = {} as Souscription; // Réinitialise l'élément
    });
  }

  // Méthode pour masquer le dialogue d'ajout/modification
  protected hideDialog() {
    this.displayDialog = false; // Masque le dialogue d'ajout/modification
    this.submitted = false; // Réinitialise le soumission du formulaire
    this.formGroup.reset(); // Réinitialise les contrôles de formulaire
  }

  // Méthode pour sauvegarder un nouvel élément ou mettre à jour un élément existant
  protected saveItem() {
    this.submitted = true; // Indique que le formulaire est soumis

    if (this.formGroup.valid) { // Vérifie la validité du formulaire
      this.selectedItem = { ...this.formGroup.value }; // Copie les valeurs du formulaire dans l'élément à sauvegarder
      if ((this.selectedItem as any).id) { // Si l'élément a un ID, effectue une mise à jour
        this.service.update(this.selectedItem).subscribe(() => { // Met à jour l'élément via le service
          this.items[this.findIndexById((this.selectedItem as any).id)] = this.selectedItem; // Met à jour le tableau d'éléments avec l'élément mis à jour
          this.appMain.showInfoViaToast('Successful', this.entityName + ' Updated'); // Affiche un message de succès pour la mise à jour
          this.items = [...this.items]; // Met à jour le tableau d'éléments
          this.displayDialog = false; // Masque le dialogue d'ajout/modification
          this.selectedItem = {} as Souscription; // Réinitialise l'élément
          this.formGroup.reset(); // Réinitialise les contrôles de formulaire
        });
      } else { // Sinon, crée un nouvel élément
        this.service.create(this.selectedItem).subscribe(newItem => { // Crée un nouvel élément via le service
          this.items.push(newItem); // Ajoute le nouvel élément au tableau d'éléments
          this.appMain.showSuccessViaToast('Successful', this.entityName + ' Created'); // Affiche un message de succès pour la création
          this.items = [...this.items]; // Met à jour le tableau d'éléments
          this.displayDialog = false; // Masque le dialogue d'ajout/modification
          this.selectedItem = {} as Souscription; // Réinitialise l'élément
          this.formGroup.reset(); // Réinitialise les contrôles de formulaire
        });
      }
    }
  }

  // Méthode pour trouver l'index d'un élément dans le tableau d'éléments par son ID
  protected findIndexById(id: string): number {
    let index = -1; // Initialise l'index à -1 (non trouvé)
    for (let i = 0; i < this.items.length; i++) { // Parcours tous les éléments du tableau
      if ((this.items[i] as any).id === id) { // Si l'ID de l'élément correspond à celui recherché
        index = i; // Met à jour l'index trouvé
        break; // Sort de la boucle
      }
    }
    return index; // Retourne l'index trouvé ou -1 si non trouvé
  }

  // Méthode pour appliquer un filtre global sur la table
  protected onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains'); // Applique le filtre global sur la table
  }

  // Vérifie si l'utilisateur possède l'autorisation d'accéder à un traitement donné
  protected hasAccessToPermission(permissionKey: string): boolean {
    return this.accountService.hasAccessToPermission(this.moduleKey, permissionKey);
  }

  protected exportExcel(){
    this.baseService.generateExcel(this.entityName, this.items);
  }

  showPrintPreview() {
      this.printPreviewVisible = true;
  }
}
