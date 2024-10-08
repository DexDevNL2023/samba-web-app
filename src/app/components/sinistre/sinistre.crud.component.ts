import { GenericUtils } from './../../utilities/generic-utils';
import { Authority } from './../../models/account.model';
import { DocumentService } from './../../service/document.service';
import { SouscriptionService } from './../../service/souscription.service';
import { PrestationService } from './../../service/prestation.service';
import { SinistreService } from './../../service/sinistre.service';
import { FormBuilder } from '@angular/forms';
import { AccountService } from './../../core/auth/account.service';
import { BaseService } from './../../service/base.service';
import { MessageService } from 'primeng/api';
import { AppMainComponent } from './../../app.main.component';
import { Prestation, PrestationType, PrestationStatus } from './../../models/prestation.model';
import { Component } from '@angular/core';
import { Sinistre, SinistreStatus } from './../../models/sinistre.model';
import { GenericCrudComponent } from '../generic.crud.component';
import { Document } from './../../models/document.model';
import { PaymentFrequency, Souscription, SubscriptionStatus } from './../../models/souscription.model';


@Component({
  selector: 'app-sinistre-crud',
  templateUrl: './../generic.crud.component.html'
})
export class SinistreCrudComponent extends GenericCrudComponent<Sinistre> {

  // Liste pour InsuranceType
  sinistreStatuses = [
    { label: 'En cours', value: SinistreStatus.EN_COURS },
    { label: 'Approuvé', value: SinistreStatus.APPROUVE },
    { label: 'Clôturé', value: SinistreStatus.CLOTURE },
    { label: 'Rejeté', value: SinistreStatus.REJETE }
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
  frequencies = [
    { label: 'Annuel', value: PaymentFrequency.ANNUEL },
    { label: 'Mensuel', value: PaymentFrequency.MENSUEL },
    { label: 'Semestriel', value: PaymentFrequency.SEMESTRIEL },
    { label: 'Trimestriel', value: PaymentFrequency.TRIMESTRIEL }
  ];
  souscriptiontatus = [
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
    sinistreService: SinistreService,
    private prestationService: PrestationService,
    private souscriptionService: SouscriptionService,
    private documentService: DocumentService
  ) {
    super(messageService, baseService, accountService, fb, sinistreService, appMain);
    this.entityName = 'Sinistre';
    this.componentLink = '/admin/sinistres';
    this.roleKey = 'SINISTRE_MODULE';
  }

  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'numeroSinistre', header: 'Reference Sinistre', type: 'text' },
      { field: 'label', header: 'Libellé', type: 'text' },
      { field: 'raison', header: 'Raison', type: 'textarea' },
      { field: 'dateSurvenance', header: 'Date de survenance', type: 'date' },
      { field: 'dateDeclaration', header: 'Date de déclaration', type: 'date' },
      { field: 'dateReglement', header: 'Date de règlement', type: 'date', access: [Authority.ADMIN] },
      { field: 'datePaiement', header: 'Date de paiement', type: 'date', access: [Authority.ADMIN] },
      { field: 'dateCloture', header: 'Date de clôture', type: 'date', access: [Authority.ADMIN] },
      { field: 'status', header: 'Status', type: 'enum', values: this.sinistreStatuses, label: 'label', key: 'value', access: [Authority.ADMIN] },
      { field: 'montantSinistre', header: 'Montant du sinistre', type: 'currency' },
      { field: 'montantAssure', header: 'Montant assuré', type: 'currency' },
      { field: 'souscription', header: 'Souscription', type: 'objet', values: [], method: () => this.loadSouscriptions(), label: 'numeroSouscription', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroSouscription', header: 'Reference Souscription', type: 'text' },
          { field: 'dateSouscription', header: 'Date de souscription', type: 'date' },
          { field: 'dateExpiration', header: 'Date d\'expiration', type: 'date' },
          { field: 'status', header: 'Status', type: 'enum', values: this.souscriptiontatus, label: 'label', key: 'value' },
          { field: 'frequencePaiement', header: 'Fréquence de paiement', type: 'enum', values: this.frequencies, label: 'label', key: 'value' }
        ]
      },
      { field: 'prestations', header: 'Prestations', type: 'list', values: [], method: () => this.loadPrestations(), label: 'numeroPrestation', key: 'id', access: [Authority.SYSTEM], subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroPrestation', header: 'Reference Prestation', type: 'text' },
          { field: 'label', header: 'Libellé', type: 'text' },
          { field: 'datePrestation', header: 'Date de prestation', type: 'date' },
          { field: 'type', header: 'Type', type: 'enum', values: this.prestationTypes, label: 'label', key: 'value' },
          { field: 'montant', header: 'Montant', type: 'currency' },
          { field: 'status', header: 'Status', type: 'enum', values: this.prestationStatuses, label: 'label', key: 'value' }
        ]
      },
      { field: 'documents', header: 'Documents', type: 'list', values: [], method: () => this.loadDocuments(), label: 'numeroDocument', key: 'id', access: [Authority.SYSTEM], subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroDocument', header: 'Reference Document', type: 'text' },
          { field: 'nom', header: 'Nom', type: 'text' },
          { field: 'url', header: 'Télécharger', type: 'url' }
        ]
      }
    ];
  }

  // Méthode abstraite à implémenter pour initialiser tous autres fonctions
  protected initializeOthers(): void {
    this.formGroup.get('numeroSinistre')?.setValue(GenericUtils.GenerateNumero("SIN"));
  }

  // Chargement des souscriptions associés à une assure
  async loadSouscriptions(): Promise<Souscription[]> {
      try {
          return await this.souscriptionService.query().toPromise();
      } catch (error) {
          return [];
      }
  }

  // Chargement des polices associés à une sinistre
  async loadPrestations(): Promise<Prestation[]> {
      try {
          return await this.prestationService.getBySinistreId(this.selectedItem.id).toPromise();
      } catch (error) {
          return [];
      }
  }

  // Chargement des documents associés à une prestation
  async loadDocuments(): Promise<Document[]> {
      try {
          return await this.documentService.getAllBySinistreId(this.selectedItem.id).toPromise();
      } catch (error) {
          return [];
      }
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['numeroSinistre', 'raison', 'dateDeclaration', 'montantSinistre'];
  }
}
