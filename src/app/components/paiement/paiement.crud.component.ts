import { GenericUtils } from './../../utilities/generic-utils';
import { RecuPaiement } from './../../models/Recu-paiement.model';
import { RecuPaiementService } from './../../service/recu-paiement.service';
import { ReclamationService } from './../../service/reclamation.service';
import { SouscriptionService } from './../../service/souscription.service';
import { Authority } from './../../models/account.model';
import { Reclamation, StatutReclamation, TypeReclamation } from './../../models/reclamation.model';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { MessageService } from 'primeng/api';
import { Paiement, PaymentMode, PaymentType } from '../../models/paiement.model';
import { PaiementService } from '../../service/paiement.service';
import { PaymentFrequency, Souscription, SubscriptionStatus } from '../../models/souscription.model';
import { GenericCrudComponent } from '../generic.crud.component';

@Component({
  selector: 'app-paiement-crud',
  templateUrl: './../generic.crud.component.html'
})
export class PaiementCrudComponent extends GenericCrudComponent<Paiement> {

  // Liste pour Gender
  paymentTypes = [
    { label: 'Prime', value: PaymentType.PRIME },
    { label: 'Remboursement', value: PaymentType.REMBOURSEMENT },
    { label: 'Prestation', value: PaymentType.PRESTATION }
  ];
  paymentModes = [
    { label: 'Virement Bancaire', value: PaymentMode.BANK_TRANSFER },
    { label: 'Espèces', value: PaymentMode.CASH },
    { label: 'Stripe', value: PaymentMode.STRIPE },
    { label: 'PayPal', value: PaymentMode.PAYPAL },
    { label: 'Moov Money', value: PaymentMode.MOOV },
    { label: 'Airtel Money', value: PaymentMode.AIRTEL }
  ];
  frequencies = [
    { label: 'Annuel', value: PaymentFrequency.ANNUEL },
    { label: 'Mensuel', value: PaymentFrequency.MENSUEL },
    { label: 'Semestriel', value: PaymentFrequency.SEMESTRIEL },
    { label: 'Trimestriel', value: PaymentFrequency.TRIMESTRIEL }
  ];
  souscriptionStatus = [
    { label: 'On risk', value: SubscriptionStatus.ON_RISK },
    { label: 'Resiliee', value: SubscriptionStatus.RESILIE },
    { label: 'En attente', value: SubscriptionStatus.WAITING }
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

  constructor(
    appMain: AppMainComponent,
    messageService: MessageService,
    baseService: BaseService,
    accountService: AccountService,
    fb: FormBuilder,
    paiementService: PaiementService,
    private souscriptionService: SouscriptionService,
    private reclamationService: ReclamationService,
    private recuPaiementService: RecuPaiementService
  ) {
    super(messageService, baseService, accountService, fb, paiementService, appMain);
    this.entityName = 'Paiement';
    this.componentLink = '/admin/paiements';
    this.roleKey = 'PAIEMENT_MODULE';
  }

  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'numeroPaiement', header: 'Reference Paiement', type: 'text' },
      { field: 'datePaiement', header: 'Date du paiement', type: 'date' },
      { field: 'montant', header: 'Montant', type: 'currency' },
      { field: 'type', header: 'Type', type: 'enum', values: this.paymentTypes, label: 'label', key: 'value', access: [Authority.ADMIN] },
      { field: 'mode', header: 'Mode de Paiement', type: 'enum', values: this.paymentModes, label: 'label', key: 'value' },
      { field: 'souscription', header: 'Souscription', type: 'objet', values: [], method: () => this.loadSouscriptions(), label: 'numeroSouscription', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroSouscription', header: 'Reference Souscription', type: 'text' },
          { field: 'dateSouscription', header: 'Date de souscription', type: 'date' },
          { field: 'dateExpiration', header: 'Date d\'expiration', type: 'date' },
          { field: 'status', header: 'Status', type: 'enum', values: this.souscriptionStatus, label: 'label', key: 'value' },
          { field: 'frequencePaiement', header: 'Frequency', type: 'enum', values: this.frequencies, label: 'label', key: 'value' }
        ]
      },
      { field: 'reclamation', header: 'Reclamation', type: 'objet', values: [], method: () => this.loadRecuReclamations(), label: 'numeroReclamation', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroReclamation', header: 'Reference Reclamation', type: 'text' },
          { field: 'type', header: 'Type', type: 'enum', values: this.typeReclamations, label: 'label', key: 'value' },
          { field: 'dateReclamation', header: 'Date de reclamation', type: 'date' },
          { field: 'status', header: 'Status', type: 'enum', values: this.statutReclamations, label: 'label', key: 'value' }
        ]
      },
      { field: 'recuPaiements', header: 'Reçu du paiement', type: 'list', values: [], method: () => this.loadRecuPaiements(), label: 'numeroRecu', key: 'id', access: [Authority.SYSTEM], subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroRecu', header: 'Reference Reçu', type: 'text' },
          { field: 'dateEmission', header: 'Date d\'émission', type: 'date' },
          { field: 'montant', header: 'Montant', type: 'currency' },
          { field: 'details', header: 'Détails', type: 'textarea' }
        ]
      }
    ];
  }

  // Méthode abstraite à implémenter pour initialiser tous autres fonctions
  protected initializeOthers(): void {
    this.formGroup.get('numeroPaiement')?.setValue(GenericUtils.GenerateNumero("PAY"));
    // Vérifier si l'utilisateur authentifié a l'autorité ROLE_CLIENT
    if (this.hasAuthority([Authority.CLIENT])) {
      this.formGroup.get('type')?.setValue(PaymentType.PRIME);
    }
  }

  // Chargement des souscriptions associés à une assure
  async loadSouscriptions(): Promise<Souscription[]> {
      try {
          return await this.souscriptionService.query().toPromise();
      } catch (error) {
          return [];
      }
  }

  // Chargement des reçu de paiement associés à une assure
  async loadRecuReclamations(): Promise<Reclamation[]> {
      try {
          return await this.reclamationService.query().toPromise();
      } catch (error) {
          return [];
      }
  }

  // Chargement des reçu de paiement associés à une assure
  async loadRecuPaiements(): Promise<RecuPaiement[]> {
      try {
          return await this.recuPaiementService.getByPaiementId(this.selectedItem.id).toPromise();
      } catch (error) {
          return [];
      }
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['numeroPaiement', 'montant'];
  }
}
