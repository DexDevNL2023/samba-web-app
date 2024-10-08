import { GenericUtils } from './../../utilities/generic-utils';
import { RecuPaiementService } from './../../service/recu-paiement.service';
import { RecuPaiement, RecuPaymentType } from './../../models/Recu-paiement.model';
import { Authority } from '../../models/account.model';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { MessageService } from 'primeng/api';
import { Paiement, PaymentMode, PaymentType } from '../../models/paiement.model';
import { PaiementService } from '../../service/paiement.service';
import { GenericCrudComponent } from '../generic.crud.component';

@Component({
  selector: 'app-paiement-crud',
  templateUrl: './../generic.crud.component.html'
})
export class RecuPaiementCrudComponent extends GenericCrudComponent<RecuPaiement> {

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
  recuPaymentTypes = [
    { label: 'Encaissement', value: RecuPaymentType.ENCAISSEMENT },
    { label: 'Décaissement', value: RecuPaymentType.DECAISSEMENT }
  ];

  constructor(
    appMain: AppMainComponent,
    messageService: MessageService,
    baseService: BaseService,
    accountService: AccountService,
    fb: FormBuilder,
    recuPaiementService: RecuPaiementService,
    private paiementService: PaiementService
  ) {
    super(messageService, baseService, accountService, fb, recuPaiementService, appMain);
    this.entityName = 'Recu de paiement';
    this.componentLink = '/admin/recus/paiements';
    this.roleKey = 'RECU_PAIEMENT_MODULE';
  }

  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'numeroRecu', header: 'Reference Recu', type: 'text' },
      { field: 'dateEmission', header: 'Date d\'emission', type: 'date' },
      { field: 'montant', header: 'Montant', type: 'currency' },
      { field: 'type', header: 'Type', type: 'enum', values: this.recuPaymentTypes, label: 'label', key: 'value', access: [Authority.ADMIN, Authority.AGENT] },
      { field: 'paiement', header: 'Paiement', type: 'objet', values: [], method: () => this.loadPaiements(), label: 'numeroPaiement', key: 'id', access: [Authority.ADMIN, Authority.AGENT], subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroPaiement', header: 'Reference Paiement', type: 'text' },
          { field: 'datePaiement', header: 'Date du paiement', type: 'date' },
          { field: 'montant', header: 'Montant', type: 'currency' },
          { field: 'type', header: 'Type', type: 'enum', values: this.paymentTypes, label: 'label', key: 'value' },
          { field: 'mode', header: 'Mode', type: 'enum', values: this.paymentModes, label: 'label', key: 'value' }
        ]
      }
    ];
  }

  // Méthode abstraite à implémenter pour initialiser tous autres fonctions
  protected initializeOthers(): void {
    this.formGroup.get('numeroRecu')?.setValue(GenericUtils.GenerateNumero("REC"));
  }

  // Chargement des reçu de paiement associés à une assure
  async loadPaiements(): Promise<Paiement[]> {
      try {
          return await this.paiementService.query().toPromise();
      } catch (error) {
          return [];
      }
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['numeroRecu', 'montant'];
  }
}
