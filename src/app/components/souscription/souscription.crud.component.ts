import { ToastService } from './../../service/toast.service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { MessageService } from 'primeng/api';
import { Souscription, SubscriptionStatus, PaymentFrequency } from '../../models/souscription.model';
import { SouscriptionService } from '../../service/souscription.service';
import { Reclamation, StatutReclamation, TypeReclamation } from '../../models/reclamation.model';
import { ClaimStatus, Sinistre } from '../../models/sinistre.model';
import { PoliceAssurance } from '../../models/police-assurance.model';
import { Assure, Gender } from '../../models/assure.model';
import { Paiement, PaymentStatus, PaymentType } from '../../models/paiement.model';
import { ContratAssurance, ContratType } from '../../models/contrat-assurance.model';
import { GenericCrudComponent } from '../generic.crud.component';

@Component({
  selector: 'app-souscription-crud',
  templateUrl: './../generic.crud.component.html'
})
export class SouscriptionCrudComponent extends GenericCrudComponent<Souscription> {
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
    appMain: AppMainComponent,
    messageService: MessageService,
    baseService: BaseService,
    accountService: AccountService,
    fb: FormBuilder,
    toastService: ToastService,
    cdr: ChangeDetectorRef,
    private souscriptionService: SouscriptionService
  ) {
    super(toastService, messageService, cdr, baseService, accountService, fb, souscriptionService, appMain);
    this.entityName = 'Souscription';
    this.componentLink = '/admin/souscriptions';
    this.importLink = '/import/souscriptions';
    this.roleKey = 'SOUSCRIPTION_MODULE';
  }
  
  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
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
  }

  // Méthode abstraite à implémenter pour initialiser les données des colonnes de la table
  protected initializeColumnsData(): void {
    this.items = [
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
    this.loadAssures();
    this.loadPolices();
    this.loadContrats();
    this.loadPaiements();
    this.loadSinistres();
    this.loadReclamations();
    this.loading = false;
  }
  
  // Chargement des assures associés à une souscription
  loadAssures(): void {
    this.souscriptionService.getAllAssures().subscribe((assures: Assure[]) => {
        this.assures = assures;
    });
  }
  
  // Chargement des polices associés à une souscription
  loadPolices(): void {
    this.souscriptionService.getAllPolices().subscribe((polices: PoliceAssurance[]) => {
        this.polices = polices;
    });
  }
  
  // Chargement des contrats associés à une souscription
  loadContrats(): void {
    this.souscriptionService.getAllContrats().subscribe((contrats: ContratAssurance[]) => {
        this.contrats = contrats;
    });
  }
  
  // Chargement des paiements associés à une souscription
  loadPaiements(): void {
    this.souscriptionService.getAllPaiements().subscribe((paiements: Paiement[]) => {
        this.paiements = paiements;
    });
  }
  
  // Chargement des sinistres associés à une souscription
  loadSinistres(): void {
    this.souscriptionService.getAllSinistres().subscribe((sinistres: Sinistre[]) => {
        this.sinistres = sinistres;
    });
  }
  
  // Chargement des reclamations associés à une souscription
  loadReclamations(): void {
    this.souscriptionService.getAllReclamations().subscribe((reclamations: Reclamation[]) => {
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
  protected assignColumnsValues(): void { // Ajoutez le modificateur override
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
}
