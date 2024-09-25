import { AssureService } from './../../service/assure.service';
import { PoliceAssuranceService } from './../../service/police-assurance.service';
import { ContratAssuranceService } from './../../service/contrat-assurance.service';
import { PaiementService } from './../../service/paiement.service';
import { SinistreService } from './../../service/sinistre.service';
import { ReclamationService } from './../../service/reclamation.service';
import { Authority } from './../../models/account.model';
import { PrestationStatus, PrestationType } from './../../models/prestation.model';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { MessageService } from 'primeng/api';
import { Souscription, SubscriptionStatus, PaymentFrequency } from '../../models/souscription.model';
import { SouscriptionService } from '../../service/souscription.service';
import { Reclamation, StatutReclamation, TypeReclamation } from '../../models/reclamation.model';
import { Sinistre, SinistreStatus } from '../../models/sinistre.model';
import { PoliceAssurance } from '../../models/police-assurance.model';
import { Assure } from '../../models/assure.model';
import { Paiement, PaymentMode, PaymentType } from '../../models/paiement.model';
import { ContratAssurance, ContratType } from '../../models/contrat-assurance.model';
import { GenericCrudComponent } from '../generic.crud.component';

@Component({
  selector: 'app-souscription-crud',
  templateUrl: './../generic.crud.component.html'
})
export class SouscriptionCrudComponent extends GenericCrudComponent<Souscription> {

  // Liste pour InsuranceType
  frequencies = [
    { label: 'Annuel', value: PaymentFrequency.ANNUEL },
    { label: 'Mensuel', value: PaymentFrequency.MENSUEL },
    { label: 'Semestriel', value: PaymentFrequency.SEMESTRIEL },
    { label: 'Trimestriel', value: PaymentFrequency.TRIMESTRIEL }
  ];
  soscriptionStatus = [
    { label: 'On risk', value: SubscriptionStatus.ON_RISK },
    { label: 'Resiliee', value: SubscriptionStatus.RESILIE },
    { label: 'En attente', value: SubscriptionStatus.WAITING }
  ];
  contratTypes = [
    { label: 'Bien', value: ContratType.BIEN },
    { label: 'Agricole', value: ContratType.AGRICOLE },
    { label: 'Personne', value: ContratType.PERSONNE },
    { label: 'Santé', value: ContratType.SANTE }
  ];
  sinistreStatuses = [
    { label: 'En cours', value: SinistreStatus.EN_COURS },
    { label: 'Approuvé', value: SinistreStatus.APPROUVE },
    { label: 'Clôturé', value: SinistreStatus.CLOTURE },
    { label: 'Rejeté', value: SinistreStatus.REJETE }
  ];
  paymentTypes = [
    { label: 'Prime', value: PaymentType.PRIME },
    { label: 'Remboursement', value: PaymentType.REMBOURSEMENT },
    { label: 'Prestation', value: PaymentType.PRESTATION }
  ];
  paymentModes = [
    { label: 'Virement bancaire', value: PaymentMode.BANK_TRANSFER },
    { label: 'Especes', value: PaymentMode.CASH },
    { label: 'PayPal', value: PaymentMode.PAYPAL },
    { label: 'Stripe', value: PaymentMode.STRIPE },
    { label: 'Moov Money', value: PaymentMode.MOOV },
    { label: 'Airtel Money', value: PaymentMode.AIRTEL }
  ];
  typeReclamations = [
    { label: 'Sinistre', value: TypeReclamation.SINISTRE },
    { label: 'Prestation', value: TypeReclamation.PRESTATION }
  ];
  statutReclamations = [
    { label: 'En cours', value: StatutReclamation.EN_COURS },
    { label: 'Approuvée', value: StatutReclamation.APPROUVEE },
    { label: 'Rejetée', value: StatutReclamation.REJETEE }
  ];
  prestationTypes = [
    { label: 'Bien', value: PrestationType.BIEN },
    { label: 'Agricole', value: PrestationType.AGRICOLE },
    { label: 'Personne', value: PrestationType.PERSONNE },
    { label: 'Santé', value: PrestationType.SANTE }
  ];
  prestationStatuses = [
    { label: 'Non remboursé', value: PrestationStatus.NON_REMBOURSE },
    { label: 'En attente', value: PrestationStatus.EN_COURS },
    { label: 'Remboursé', value: PrestationStatus.REMBOURSE }
  ];

  constructor(
    appMain: AppMainComponent,
    messageService: MessageService,
    baseService: BaseService,
    accountService: AccountService,
    fb: FormBuilder,
    souscriptionService: SouscriptionService,
    private reclamationService: ReclamationService,
    private sinistreService: SinistreService,
    private paiementService: PaiementService,
    private contratAssuranceService: ContratAssuranceService,
    private policeAssuranceService: PoliceAssuranceService,
    private assureService: AssureService
  ) {
    super(messageService, baseService, accountService, fb, souscriptionService, appMain);
    this.entityName = 'Souscription';
    this.componentLink = '/admin/souscriptions';
    this.roleKey = 'SOUSCRIPTION_MODULE';
  }

  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'numeroSouscription', header: 'Num Souscription', type: 'text' },
      { field: 'dateSouscription', header: 'Date de souscription', type: 'date' },
      { field: 'dateExpiration', header: 'Date d\'expiration', type: 'date', access: [Authority.ADMIN] },
      { field: 'montantCotisation', header: 'Montant des cotisations', type: 'currency', access: [Authority.ADMIN] },
      { field: 'status', header: 'Status', type: 'enum', values: this.soscriptionStatus, label: 'label', key: 'value' },
      { field: 'frequencePaiement', header: 'Frequency', type: 'enum', values: this.frequencies, label: 'label', key: 'value' },
      { field: 'assure', header: 'Assuré', type: 'objet', values: [], method: () => this.loadAssures(), label: 'numNiu', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numNiu', header: 'Niu', type: 'text' },
          { field: 'firstName', header: 'Nom', type: 'text' },
          { field: 'lastName', header: 'Prénom', type: 'text' },
          { field: 'addresse', header: 'Addresse', type: 'textarea' }
        ]
      },
      { field: 'police', header: 'Polices d\'assurance', type: 'objet', values: [], method: () => this.loadPolices(), label: 'numeroPolice', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroPolice', header: 'Num Police', type: 'text' },
          { field: 'label', header: 'Libelle', type: 'text' },
          { field: 'montantSouscription', header: 'Coût', type: 'currency' }
        ]
      },
      { field: 'contrats', header: 'Contrats', type: 'list', values: [], method: () => this.loadContrats(), label: 'numeroContrat', key: 'id', access: [Authority.SYSTEM], subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroContrat', header: 'Num Contrat', type: 'text' },
          { field: 'dateContrat', header: 'Date du contrat', type: 'date' },
          { field: 'typeContrat', header: 'Type', type: 'enum', values: this.contratTypes, label: 'label', key: 'value' },
          { field: 'couverture', header: 'Couverture', type: 'textarea' },
          { field: 'montantAssure', header: 'Montant assuré', type: 'currency' },
          { field: 'franchise', header: 'franchise', type: 'currency' },
          { field: 'conditions', header: 'Conditions', type: 'textarea' },
          { field: 'exclusions', header: 'Exclusions', type: 'textarea' },
          { field: 'dateDebut', header: 'Date de début', type: 'date' },
          { field: 'dateFin', header: 'Date de fin', type: 'date' }
        ]
      },
      { field: 'paiements', header: 'Paiements', type: 'list', values: [], method: () => this.loadPaiements(), label: 'numeroPaiement', key: 'id', access: [Authority.SYSTEM], subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroPaiement', header: 'Num Paiement', type: 'text' },
          { field: 'datePaiement', header: 'Date du paiement', type: 'date' },
          { field: 'montant', header: 'Montant', type: 'currency' },
          { field: 'type', header: 'Type', type: 'enum', values: this.paymentTypes, label: 'label', key: 'value' },
          { field: 'mode', header: 'Mode', type: 'enum', values: this.paymentModes, label: 'label', key: 'value' }
        ]
      },
      { field: 'sinistres', header: 'Sinistres', type: 'list', values: [], method: () => this.loadSinistres(), label: 'numeroSinistre', key: 'id', access: [Authority.SYSTEM], subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroSinistre', header: 'Num Sinistre', type: 'text' },
          { field: 'label', header: 'Libellé', type: 'text' },
          { field: 'dateDeclaration', header: 'Date de declaration', type: 'date' },
          { field: 'dateTraitement', header: 'Date de traitement', type: 'date' },
          { field: 'status', header: 'Status', type: 'enum', values: this.sinistreStatuses, label: 'label', key: 'value' }
        ]
      },
      { field: 'reclamations', header: 'Reclamations', type: 'list', values: [], method: () => this.loadReclamations(), label: 'numeroReclamation', key: 'id', access: [Authority.SYSTEM], subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroReclamation', header: 'Num Reclamation', type: 'text' },
          { field: 'type', header: 'Type', type: 'enum', values: this.typeReclamations, label: 'label', key: 'value' },
          { field: 'dateReclamation', header: 'Date de reclamation', type: 'date' },
          { field: 'status', header: 'Status', type: 'enum', values: this.statutReclamations, label: 'label', key: 'value' }
        ]
      },
      { field: 'prestations', header: 'Prestations', type: 'list', values: [], method: () => this.loadReclamations(), label: 'numeroPrestation', key: 'id', access: [Authority.SYSTEM], subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroPrestation', header: 'Num Prestation', type: 'text' },
          { field: 'label', header: 'Libellé', type: 'text' },
          { field: 'datePrestation', header: 'Date de prestation', type: 'date' },
          { field: 'type', header: 'Type', type: 'enum', values: this.prestationTypes, label: 'label', key: 'value' },
          { field: 'montant', header: 'Montant', type: 'currency' },
          { field: 'status', header: 'Status', type: 'enum', values: this.prestationStatuses, label: 'label', key: 'value' }
        ]
      }
    ];
  }

  // Méthode abstraite à implémenter pour initialiser tous autres fonctions
  protected initializeOthers(): void {
  }

  // Chargement des assures associés à une souscription
  async loadAssures(): Promise<Assure[]> {
      try {
          return await this.assureService.query().toPromise();
      } catch (error) {
          return [];
      }
  }

  // Chargement des polices associés à une souscription
  async loadPolices(): Promise<PoliceAssurance[]> {
      try {
          return await this.policeAssuranceService.query().toPromise();
      } catch (error) {
          return [];
      }
  }

  // Chargement des contrats associés à une souscription
  async loadContrats(): Promise<ContratAssurance[]> {
      try {
          return await this.contratAssuranceService.getContratsBySouscriptionId(this.selectedItem.id).toPromise();
      } catch (error) {
          return [];
      }
  }

  // Chargement des paiements associés à une souscription
  async loadPaiements(): Promise<Paiement[]> {
      try {
          return await this.paiementService.getPaiementsBySouscriptionId(this.selectedItem.id).toPromise();
      } catch (error) {
          return [];
      }
  }

  // Chargement des sinistres associés à une souscription
  async loadSinistres(): Promise<Sinistre[]> {
      try {
          return await this.sinistreService.getBySouscriptionId(this.selectedItem.id).toPromise();
      } catch (error) {
          return [];
      }
  }

  // Chargement des reclamations associés à une souscription
  async loadReclamations(): Promise<Reclamation[]> {
      try {
          return await this.reclamationService.getBySouscriptionId(this.selectedItem.id).toPromise();
      } catch (error) {
          return [];
      }
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['numeroSouscription', 'dateSouscription', 'dateExpiration', 'montantCotisation', 'assure', 'police'];
  }
}
