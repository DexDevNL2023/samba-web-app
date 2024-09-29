import { SouscriptionService } from './../../service/souscription.service';
import { GarantieService } from './../../service/garantie.service';
import { AssuranceService } from './../../service/assurance.service';
import { Authority } from './../../models/account.model';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { MessageService } from 'primeng/api';
import { PoliceAssurance } from '../../models/police-assurance.model';
import { PoliceAssuranceService } from '../../service/police-assurance.service';
import { PaymentFrequency, Souscription, SubscriptionStatus } from '../../models/souscription.model';
import { Garantie, GarantieStatus } from '../../models/garantie.model';
import { Assurance, InsuranceType } from '../../models/assurance.model';
import { GenericCrudComponent } from '../generic.crud.component';

@Component({
  selector: 'app-police-assurance-crud',
  templateUrl: './../generic.crud.component.html'
})
export class PoliceAssuranceCrudComponent extends GenericCrudComponent<PoliceAssurance> {

  // Liste pour InsuranceType
  insuranceTypes = [
    { label: 'Personne', value: InsuranceType.PERSONNE },
    { label: 'Bien', value: InsuranceType.BIEN },
    { label: 'Agricole', value: InsuranceType.AGRICOLE },
    { label: 'Agricole', value: InsuranceType.SANTE }
  ];
  garantieStatus = [
    { label: 'Activée', value: GarantieStatus.ACTIVEE },
    { label: 'Expirée', value: GarantieStatus.EXPIREE },
    { label: 'Suspendue', value: GarantieStatus.SUSPENDUE }
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
    policeAssuranceService: PoliceAssuranceService,
    private souscriptionService: SouscriptionService,
    private assuranceService: AssuranceService,
    private garantieService: GarantieService
  ) {
    super(messageService, baseService, accountService, fb, policeAssuranceService, appMain);
    this.entityName = 'Police d\'assurance';
    this.componentLink = '/admin/polices/assurances';
    this.roleKey = 'POLICE_ASSURANCE_MODULE';
  }

  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'numeroPolice', header: 'Num Police', type: 'text' },
      { field: 'imageUrl', header: 'Image', type: 'image' },
      { field: 'label', header: 'Libellé', type: 'text' },
      { field: 'dureeCouverture', header: 'Durée de couverture', type: 'number, access: [Authority.ADMIN]' },
      { field: 'conditions', header: 'Conditions', type: 'textarea', access: [Authority.ADMIN] },
      { field: 'montantSouscription', header: 'Montant', type: 'currency', access: [Authority.ADMIN] },
      { field: 'assurance', header: 'Assurance', type: 'objet', values: [], method: () => this.loadAssurances(), label: 'nom', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'nom', header: 'Name', type: 'text' },
          { field: 'type', header: 'Type', type: 'enum', values: this.insuranceTypes, label: 'label', key: 'value' }
        ]
      },
      { field: 'garanties', header: 'Garanties', type: 'list', values: [], method: () => this.loadGaranties(), label: 'numeroGarantie', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroGarantie', header: 'Num Garantie', type: 'text' },
          { field: 'label', header: 'Label', type: 'text' },
          { field: 'percentage', header: 'Pourcentage', type: 'currency' },
          { field: 'plafondAssure', header: 'Plafond assuré', type: 'currency' },
          { field: 'status', header: 'Status', type: 'enum', values: this.garantieStatus, label: 'label', key: 'value' }
        ]
      },
      { field: 'souscriptions', header: 'Souscriptions', type: 'list', values: [], method: () => this.loadSouscriptions(), label: 'numeroSouscription', key: 'id', access: [Authority.SYSTEM], subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroSouscription', header: 'Num Souscription', type: 'text' },
          { field: 'dateSouscription', header: 'Date de souscription', type: 'date' },
          { field: 'dateExpiration', header: 'Date d\'expiration', type: 'date' },
          { field: 'status', header: 'Status', type: 'enum', values: this.frequencies, label: 'label', key: 'value' },
          { field: 'frequencePaiement', header: 'Frequency', type: 'enum', values: this.souscriptionStatus, label: 'label', key: 'value' }
        ]
      }
    ];
  }

  // Méthode abstraite à implémenter pour initialiser tous autres fonctions
  protected initializeOthers(): void {
  }

  // Chargement des assurances associés à une police-assurance
  async loadAssurances(): Promise<Assurance[]> {
      try {
          return await this.assuranceService.query().toPromise();
      } catch (error) {
          return [];
      }
  }

  // Chargement des garanties associés à une police-assurance
  async loadGaranties(): Promise<Garantie[]> {
      try {
          return await this.garantieService.query().toPromise();
      } catch (error) {
          return [];
      }
  }

  // Chargement des souscriptions associés à une police-assurance
  async loadSouscriptions(): Promise<Souscription[]> {
      try {
          return await this.souscriptionService.getAllByPoliceId(this.selectedItem.id).toPromise();
      } catch (error) {
          return [];
      }
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['numeroPolice', 'label', 'conditions'];
  }
}
