import { SouscriptionService } from './../../service/souscription.service';
import { PaymentFrequency, Souscription, SubscriptionStatus } from './../../models/souscription.model';
import { Authority } from './../../models/account.model';
import { ToastService } from './../../service/toast.service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { MessageService } from 'primeng/api';
import { ContratAssurance, ContratType } from '../../models/contrat-assurance.model';
import { GenericCrudComponent } from '../generic.crud.component';
import { ContratAssuranceService } from '../../service/contrat-assurance.service';

@Component({
  selector: 'app-contrat-assurance-crud',
  templateUrl: './../generic.crud.component.html'
})
export class ContratAssuranceCrudComponent extends GenericCrudComponent<ContratAssurance> {
  // Liste pour InsuranceType
  contratTypes = [
    { label: 'Bien', value: ContratType.BIEN },
    { label: 'Agricole', value: ContratType.AGRICOLE },
    { label: 'Personne', value: ContratType.PERSONNE },
    { label: 'Santé', value: ContratType.SANTE }
  ];
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

  constructor(
    appMain: AppMainComponent,
    messageService: MessageService,
    baseService: BaseService,
    accountService: AccountService,
    fb: FormBuilder,
    toastService: ToastService,
    cdr: ChangeDetectorRef,
    contratAssuranceService: ContratAssuranceService,
    private souscriptionService: SouscriptionService
  ) {
    super(toastService, messageService, cdr, baseService, accountService, fb, contratAssuranceService, appMain);
    this.entityName = 'Contrat d\'assurance';
    this.componentLink = '/admin/contrats/assurances';
    this.roleKey = 'CONTRAT_MODULE';
  }

  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'numeroContrat', header: 'Num Contrat', type: 'text', access: [Authority.ADMIN] },
      { field: 'dateContrat', header: 'Date du contrat', type: 'date', access: [Authority.ADMIN] },
      { field: 'typeContrat', header: 'Type', type: 'enum', values: () => this.contratTypes, label: 'label', key: 'value', access: [Authority.ADMIN] },
      { field: 'couverture', header: 'Couverture', type: 'textarea', access: [Authority.ADMIN] },
      { field: 'montantAssure', header: 'Montant assuré', type: 'currency', access: [Authority.ADMIN] },
      { field: 'franchise', header: 'franchise', type: 'currency', access: [Authority.ADMIN] },
      { field: 'conditions', header: 'Conditions', type: 'textarea', access: [Authority.ADMIN] },
      { field: 'exclusions', header: 'Exclusions', type: 'textarea', access: [Authority.ADMIN] },
      { field: 'dateDebut', header: 'Date de début', type: 'date', access: [Authority.ADMIN] },
      { field: 'dateFin', header: 'Date de fin', type: 'date', access: [Authority.ADMIN] },
      { field: 'souscriptions', header: 'Souscription', type: 'objet', values: () => this.loadSouscriptions(), label: 'numeroSouscription', key: 'id', access: [Authority.ADMIN], subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroSouscription', header: 'Num Souscription', type: 'text' },
          { field: 'dateSouscription', header: 'Date de souscription', type: 'date' },
          { field: 'dateExpiration', header: 'Date d\'expiration', type: 'date' },
          { field: 'status', header: 'Status', type: 'enum', values: () => this.soscriptionStatus, label: 'label', key: 'value' },
          { field: 'frequencePaiement', header: 'Frequency', type: 'enum', values: () => this.frequencies, label: 'label', key: 'value' }
        ]
      }
    ];
  }

  // Méthode abstraite à implémenter pour initialiser tous autres fonctions
  protected initializeOthers(): void {
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['numeroContrat', 'dateContrat', 'couverture', 'montantAssure', 'conditions', 'exclusions', 'dateDebut', 'dateFin'];
  }

  // Chargement des souscriptions associés à une police-assurance
  loadSouscriptions(): Souscription[] {
    let data: Souscription[] = [];
    this.souscriptionService.query().subscribe((data: Souscription[]) => {
      data = data;
    });
    return data;
  }
}
