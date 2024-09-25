import { SinistreStatus } from './../../models/sinistre.model';
import { DocumentService } from './../../service/document.service';
import { FinanceurService } from './../../service/financeur.service';
import { SinistreService } from './../../service/sinistre.service';
import { FournisseurService } from './../../service/fournisseur.service';
import { SouscriptionService } from './../../service/souscription.service';
import { Fournisseur } from './../../models/fournisseur.model';
import { Document } from './../../models/document.model';
import { Financeur } from './../../models/financeur.model';
import { Authority } from './../../models/account.model';
import { PaymentFrequency, Souscription, SubscriptionStatus } from './../../models/souscription.model';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { MessageService } from 'primeng/api';
import { Prestation, PrestationType, PrestationStatus } from '../../models/prestation.model';
import { PrestationService } from '../../service/prestation.service';
import { Sinistre } from '../../models/sinistre.model';
import { GenericCrudComponent } from '../generic.crud.component';

@Component({
  selector: 'app-prestation-crud',
  templateUrl: './../generic.crud.component.html'
})
export class PrestationCrudComponent extends GenericCrudComponent<Prestation> {

  // Liste pour InsuranceType
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
  sinistreStatuses = [
    { label: 'En cours', value: SinistreStatus.EN_COURS },
    { label: 'Approuvé', value: SinistreStatus.APPROUVE },
    { label: 'Clôturé', value: SinistreStatus.CLOTURE },
    { label: 'Rejeté', value: SinistreStatus.REJETE }
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

  constructor(
    appMain: AppMainComponent,
    messageService: MessageService,
    baseService: BaseService,
    accountService: AccountService,
    fb: FormBuilder,
    prestationService: PrestationService,
    private souscriptionService: SouscriptionService,
    private fournisseurService: FournisseurService,
    private sinistreService: SinistreService,
    private financeurService: FinanceurService,
    private documentService: DocumentService
  ) {
    super(messageService, baseService, accountService, fb, prestationService, appMain);
    this.entityName = 'Prestation';
    this.componentLink = '/admin/prestations';
    this.roleKey = 'PRESTATION_MODULE';
  }

  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'numeroPrestation', header: 'Num Prestation', type: 'text' },
      { field: 'label', header: 'Libellé', type: 'text' },
      { field: 'datePrestation', header: 'Date de prestation', type: 'date' },
      { field: 'type', header: 'Type', type: 'enum', values: this.prestationTypes, label: 'label', key: 'value' },
      { field: 'description', header: 'Description', type: 'textarea' },
      { field: 'montant', header: 'Montant', type: 'currency' },
      { field: 'status', header: 'Status', type: 'enum', values: this.prestationStatuses, label: 'label', key: 'value', access: [Authority.ADMIN] },
      { field: 'souscription', header: 'Souscription', type: 'objet', values: [], method: () => this.loadSouscriptions(), label: 'numeroSouscription', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroSouscription', header: 'Num Souscription', type: 'text' },
          { field: 'dateSouscription', header: 'Date de souscription', type: 'date' },
          { field: 'dateExpiration', header: 'Date d\'expiration', type: 'date' },
          { field: 'status', header: 'Status', type: 'enum', values: this.souscriptionStatus, label: 'label', key: 'value' },
          { field: 'frequencePaiement', header: 'Frequency', type: 'enum', values: this.frequencies, label: 'label', key: 'value' }
        ]
      },
      { field: 'fournisseur', header: 'Fournisseur', type: 'objet', values: [], method: () => this.loadFournisseurs(), label: 'nom', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'nom', header: 'Nom', type: 'text' },
          { field: 'telephone', header: 'Telephone', type: 'text' },
          { field: 'email', header: 'Email', type: 'text' },
          { field: 'adresse', header: 'Adresse', type: 'text' }
        ]
      },
      { field: 'sinistre', header: 'Sinistre', type: 'objet', values: [], method: () => this.loadSinistres(), label: 'numeroSinistre', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroSinistre', header: 'Num Sinistre', type: 'text' },
          { field: 'label', header: 'Libellé', type: 'text' },
          { field: 'dateDeclaration', header: 'Date de declaration', type: 'date' },
          { field: 'dateTraitement', header: 'Date de traitement', type: 'date' },
          { field: 'status', header: 'Status', type: 'enum', values: this.sinistreStatuses, label: 'label', key: 'value' }
        ]
      },
      { field: 'financeurs', header: 'Financeurs', type: 'list', values: [], method: () => this.loadFinanceurs(), label: 'nom', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'nom', header: 'Name', type: 'text' },
          { field: 'adresse', header: 'Adresse', type: 'textarea' },
          { field: 'telephone', header: 'Telephone', type: 'text' },
          { field: 'email', header: 'Email', type: 'text' }
        ]
      },
      { field: 'documents', header: 'Documents', type: 'list', values: [], method: () => this.loadDocuments(), label: 'numeroDocument', key: 'id', access: [Authority.SYSTEM], subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroDocument', header: 'Num Document', type: 'text' },
          { field: 'nom', header: 'Nom', type: 'text' },
          { field: 'url', header: 'Telecharger', type: 'url' }
        ]
      }
    ];
  }

  // Méthode abstraite à implémenter pour initialiser tous autres fonctions
  protected initializeOthers(): void {
  }

  // Chargement des souscriptions associés à une assure
  async loadSouscriptions(): Promise<Souscription[]> {
      try {
          return await this.souscriptionService.query().toPromise();
      } catch (error) {
          return [];
      }
  }

  // Chargement des fournisseurs associés à une prestation
  async loadFournisseurs(): Promise<Fournisseur[]> {
      try {
          return await this.fournisseurService.query().toPromise();
      } catch (error) {
          return [];
      }
  }

  // Chargement des sinistres associés à une prestation
  async loadSinistres(): Promise<Sinistre[]> {
      try {
          return await this.sinistreService.query().toPromise();
      } catch (error) {
          return [];
      }
  }

  // Chargement des financeurs associés à une prestation
  async loadFinanceurs(): Promise<Financeur[]> {
      try {
          return await this.financeurService.query().toPromise();
      } catch (error) {
          return [];
      }
  }

  // Chargement des documents associés à une prestation
  async loadDocuments(): Promise<Document[]> {
      try {
          return await this.documentService.getAllByPrestationId(this.selectedItem.id).toPromise();
      } catch (error) {
          return [];
      }
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['numeroPrestation', 'souscription', 'label', 'datePrestation', 'montant'];
  }
}
