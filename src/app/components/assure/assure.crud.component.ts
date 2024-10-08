import { GenericUtils } from './../../utilities/generic-utils';
import { AccountCrudService } from './../../service/account.crud.service';
import { Account, Authority } from './../../models/account.model';
import { Fournisseur } from './../../models/fournisseur.model';
import { Branche } from './../../models/branche.model';
import { DossierMedical } from './../../models/dossier-medical.model';
import { FournisseurService } from './../../service/fournisseur.service';
import { BrancheService } from './../../service/branche.service';
import { DossierMedicalService } from './../../service/dossier-medical.service';
import { SouscriptionService } from './../../service/souscription.service';
import { RegistrantService } from './../../service/registrant.service';
import { Component } from '@angular/core';
import { Assure, Gender } from '../../models/assure.model';
import { LiteRegistrant } from '../../models/lite.registrant.model';
import { PaymentFrequency, Souscription, SubscriptionStatus } from '../../models/souscription.model';
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
    assureService: AssureService,
    private registrantService: RegistrantService,
    private souscriptionService: SouscriptionService,
    private dossierMedicalService: DossierMedicalService,
    private brancheService: BrancheService,
    private fournisseurService: FournisseurService,
    private accountCrudService: AccountCrudService
  ) {
    super(messageService, baseService, accountService, fb, assureService, appMain);
    this.entityName = 'Assuré';
    this.componentLink = '/admin/assures';
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
      { field: 'sexe', header: 'Sexe', type: 'enum', values: this.genders, label: 'label', key: 'value' },
      { field: 'email', header: 'Email', type: 'text' },
      { field: 'telephone', header: 'Telephone', type: 'text' },
      { field: 'addresse', header: 'Addresse', type: 'textarea' },
      { field: 'signature', header: 'Signature', type: 'image' },
      { field: 'registrant', header: 'Registrant', type: 'objet', values: [], method: () => this.loadRegistrants(), label: 'numeroRegistrant', key: 'id', access: [Authority.ADMIN, Authority.AGENT], subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroRegistrant', header: 'Reference Registrant', type: 'text' },
          { field: 'branche', header: 'Branche', type: 'objet', values: [], method: () => this.loadBranches(), label: 'ville', key: 'id' },
          { field: 'partenaire', header: 'Partenaire', type: 'objet', values: [], method: () => this.loadPartenaires(), label: 'nom', key: 'id' }
        ]
      },
      { field: 'account', header: 'Compte', type: 'objet', values: [], method: () => this.loadAccounts(), label: 'fullName', key: 'id', access: [Authority.SYSTEM], subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'imageUrl', header: 'Avatar', type: 'image' },
          { field: 'fullName', header: 'Nom complet', type: 'text' },
          { field: 'email', header: 'Email', type: 'text' }
        ]
      },
      { field: 'dossiers', header: 'Dossiers médicaux', type: 'list', values:[], method:  () => this.loadDossiers(), label: 'numDossierMedical', key: 'id', access: [Authority.SYSTEM], subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numDossierMedical', header: 'Reference Dossier medical', type: 'text' },
          { field: 'dateUpdated', header: 'Dernière mise à jour', type: 'date' },
        ]
      },
      { field: 'souscriptions', header: 'Souscriptions', type: 'list', values: [], method: () => this.loadSouscriptions(), label: 'numeroSouscription', key: 'id', access: [Authority.SYSTEM], subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroSouscription', header: 'Reference Souscription', type: 'text' },
          { field: 'dateSouscription', header: 'Date de souscription', type: 'date' },
          { field: 'dateExpiration', header: 'Date d\'expiration', type: 'date' },
          { field: 'status', header: 'Status', type: 'enum', values: this.souscriptiontatus, label: 'label', key: 'value' },
          { field: 'frequencePaiement', header: 'Frequency', type: 'enum', values: this.frequencies, label: 'label', key: 'value' }
        ]
      }
    ];
  }

  // Méthode abstraite à implémenter pour initialiser tous autres fonctions
  protected initializeOthers(): void {
    this.formGroup.get('numNiu')?.setValue(GenericUtils.GenerateNumero("NIU"));
  }

  // Chargement aux registrants associés à une assure
  async loadRegistrants(): Promise<LiteRegistrant[]> {
      try {
          return await this.registrantService.query().toPromise();
      } catch (error) {
          return [];
      }
  }

  // Chargement des souscriptions associés à une assure
  async loadAccounts(): Promise<Account[]> {
      try {
          return await this.accountCrudService.query().toPromise();
      } catch (error) {
          return [];
      }
  }

  // Chargement des souscriptions associés à une assure
  async loadSouscriptions(): Promise<Souscription[]> {
      try {
          return await this.souscriptionService.getAllByAssureId(this.selectedItem.id).toPromise();
      } catch (error) {
          return [];
      }
  }

  // Chargement des dossiers médicaux associés à une assure
  async loadDossiers(): Promise<DossierMedical[]> {
      try {
          return await this.dossierMedicalService.getDossierMedicalWithPatientById(this.selectedItem.id).toPromise();
      } catch (error) {
          return [];
      }
  }

  // Chargement des prestations associés à une fournisseur-soin
  async loadBranches(): Promise<Branche[]> {
      try {
          return await this.brancheService.query().toPromise();
      } catch (error) {
          return [];
      }
  }

  // Chargement des polices associés à une branche
  async loadPartenaires(): Promise<Fournisseur[]> {
      try {
          return await this.fournisseurService.query().toPromise();
      } catch (error) {
          return [];
      }
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] {
    return ['numNiu', 'lastName', 'dateNaissance', 'numCni', 'email'];
  }
}
