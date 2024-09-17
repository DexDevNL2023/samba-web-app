import { Authority } from './../../models/account.model';
import { ToastService } from './../../service/toast.service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { Assure, Gender } from '../../models/assure.model';
import { LiteRegistrant } from '../../models/lite.registrant.model';
import { DossierMedical } from '../../models/dossier-medical.model';
import { PaymentFrequency, Souscription, SubscriptionStatus } from '../../models/souscription.model';
import { Fournisseur } from '../../models/fournisseur.model';
import { Branche } from '../../models/branche.model';
import { AppMainComponent } from '../../app.main.component';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { GenericCrudComponent } from '../generic.crud.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { AssureService } from '../../service/assure.service';

@Component({
  selector: 'app-assure-crud',
  templateUrl: './../generic.crud.component.html'
})
export class AssureCrudComponent extends GenericCrudComponent<Assure> {

  // Liste pour Gender
  genders = [
    { label: 'Male', value: Gender.MALE },
    { label: 'Female', value: Gender.FEMALE },
    { label: 'Other', value: Gender.OTHER }
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
    toastService: ToastService,
    cdr: ChangeDetectorRef,
    assureService: AssureService
  ) {
    super(toastService, messageService, cdr, baseService, accountService, fb, assureService, appMain);
    this.entityName = 'Assuré';
    this.componentLink = '/admin/assures';
    this.importLink = '/import/assures';
    this.roleKey = 'ASSURE_MODULE';
  }

  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'numNiu', header: 'Niu', type: 'text' },
      { field: 'firstName', header: 'Nom', type: 'text' },
      { field: 'lastName', header: 'Prénom', type: 'text' },
      { field: 'dateNaissance', header: 'Né(e) le', type: 'date' },
      { field: 'numCni', header: 'CNI', type: 'text' },
      { field: 'sexe', header: 'Sexe', type: 'enum', values: () => this.genders, label: 'label', key: 'value' },
      { field: 'email', header: 'Email', type: 'text' },
      { field: 'telephone', header: 'Telephone', type: 'text' },
      { field: 'addresse', header: 'Addresse', type: 'textarea' },
      { field: 'signature', header: 'Signature', type: 'image' },
      { field: 'registrant', header: 'Registrant', type: 'objet', values: () => this.loadRegistrants(), label: 'numeroRegistrant', key: 'id', access: [Authority.ADMIN, Authority.AGENT], subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroRegistrant', header: 'Num Registrant', type: 'text' },
          { field: 'branche', header: 'Branche', type: 'objet', values: () => this.loadBranches(), label: 'ville', key: 'id' },
          { field: 'partenaire', header: 'Partenaire', type: 'objet', values: () => this.loadPartenaires(), label: 'nom', key: 'id' }
        ]
      },
      { field: 'account', header: 'Compte', type: 'objet', values: () => this.loadAccounts(), label: 'fullName', key: 'id', access: [Authority.SYSTEM], subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'imageUrl', header: 'Avatar', type: 'image' },
          { field: 'fullName', header: 'Nom complet', type: 'text' },
          { field: 'email', header: 'Email', type: 'text' }
        ]
      },
      { field: 'dossiers', header: 'Dossiers médicaux', type: 'list', values: () => this.loadDossiers(), label: 'numDossierMedical', key: 'id', access: [Authority.SYSTEM], subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numDossierMedical', header: 'Num Dossier medical', type: 'text' },
          { field: 'dateUpdated', header: 'Dernière mise à jour', type: 'date' },
        ]
      },
      { field: 'souscriptions', header: 'Souscriptions', type: 'list', values: () => this.loadSouscriptions(), label: 'numeroSouscription', key: 'id', access: [Authority.SYSTEM], subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroSouscription', header: 'Num Souscription', type: 'text' },
          { field: 'dateSouscription', header: 'Date de souscription', type: 'date' },
          { field: 'dateExpiration', header: 'Date d\'expiration', type: 'date' },
          { field: 'status', header: 'Status', type: 'enum', values: () => this.souscriptiontatus, label: 'label', key: 'value' },
          { field: 'frequencePaiement', header: 'Frequency', type: 'enum', values: () => this.frequencies, label: 'label', key: 'value' }
        ]
      }
    ];
  }

  // Méthode abstraite à implémenter pour initialiser tous autres fonctions
  protected initializeOthers(): void {
  }

  // Chargement aux registrants associés à une assure
  loadRegistrants(): Rule[] {
    let data: Rule[] = [];
    this.roleService.getAllByAccountId(this.selectedItem.id).subscribe((data: Rule[]) => {
      data = data;
    });
    return data;
  }

  loadAccounts(): Rule[] {
    let data: Rule[] = [];
    this.roleService.getAllByAccountId(this.selectedItem.id).subscribe((data: Rule[]) => {
      data = data;
    });
    return data;
  }

  // Chargement des souscriptions associés à une assure
  loadSouscriptions(): Rule[] {
    let data: Rule[] = [];
    this.roleService.getAllByAccountId(this.selectedItem.id).subscribe((data: Rule[]) => {
      data = data;
    });
    return data;
  }

  // Chargement des dossiers médicaux associés à une assure
  loadDossiers(): Rule[] {
    let data: Rule[] = [];
    this.roleService.getAllByAccountId(this.selectedItem.id).subscribe((data: Rule[]) => {
      data = data;
    });
    return data;
  }

  // Chargement des prestations associés à une fournisseur-soin
  loadBranches(): Rule[] {
    let data: Rule[] = [];
    this.roleService.getAllByAccountId(this.selectedItem.id).subscribe((data: Rule[]) => {
      data = data;
    });
    return data;
  }

  // Chargement des polices associés à une branche
  loadPartenaires(): Rule[] {
    let data: Rule[] = [];
    this.roleService.getAllByAccountId(this.selectedItem.id).subscribe((data: Rule[]) => {
      data = data;
    });
    return data;
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] {
    return ['numNiu', 'lastName', 'dateNaissance', 'numCni', 'email'];
  }
}
