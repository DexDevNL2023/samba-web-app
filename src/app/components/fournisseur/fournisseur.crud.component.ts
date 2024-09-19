import { Branche } from './../../models/branche.model';
import { BrancheService } from './../../service/branche.service';
import { LiteRegistrant } from './../../models/lite.registrant.model';
import { RegistrantService } from './../../service/registrant.service';
import { AccountCrudService } from './../../service/account.crud.service';
import { PrestationService } from './../../service/prestation.service';
import { Prestation, PrestationStatus, PrestationType } from './../../models/prestation.model';
import { Account, Authority } from './../../models/account.model';
import { ToastService } from './../../service/toast.service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { MessageService } from 'primeng/api';
import { Fournisseur } from '../../models/fournisseur.model';
import { FournisseurService } from '../../service/fournisseur.service';
import { GenericCrudComponent } from '../generic.crud.component';

@Component({
  selector: 'app-fournisseur-soin-crud',
  templateUrl: './../generic.crud.component.html'
})
export class FournisseurCrudComponent extends GenericCrudComponent<Fournisseur> {

  // Liste pour PrestationStatus
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
    toastService: ToastService,
    cdr: ChangeDetectorRef,
    fournisseurService: FournisseurService,
    private prestationService: PrestationService,
    private accountCrudService: AccountCrudService,
    private registrantService: RegistrantService,
    private brancheService: BrancheService
  ) {
    super(toastService, messageService, cdr, baseService, accountService, fb, fournisseurService, appMain);
    this.entityName = 'Fournisseur';
    this.componentLink = '/admin/fournisseurs';
    this.roleKey = 'FOURNISSEUR_MODULE';
  }

  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'nom', header: 'Name', type: 'text' },
      { field: 'servicesFournis', header: 'Services', type: 'textarea' },
      { field: 'adresse', header: 'Adresse', type: 'textarea' },
      { field: 'telephone', header: 'Telephone', type: 'text' },
      { field: 'email', header: 'Email', type: 'text' },
      { field: 'branches', header: 'Branches', type: 'list', values: () => this.loadBranches(), label: 'code', key: 'id', access: [Authority.ADMIN, Authority.AGENT], subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'code', header: 'Code', type: 'text' },
          { field: 'ville', header: 'Ville', type: 'text' },
          { field: 'isDefaut', header: 'Par defaut', type: 'boolean' }
        ]
      },
      { field: 'account', header: 'Compte', type: 'objet', values: () => this.loadAccounts(), label: 'fullName', key: 'id', access: [Authority.SYSTEM], subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'imageUrl', header: 'Avatar', type: 'image' },
          { field: 'fullName', header: 'Nom complet', type: 'text' },
          { field: 'email', header: 'Email', type: 'text' }
        ]
      },
      { field: 'prestations', header: 'Prestations', type: 'list', values: () => this.loadPrestations(), label: 'numeroPrestation', key: 'id', access: [Authority.SYSTEM], subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroPrestation', header: 'Num Prestation', type: 'text' },
          { field: 'label', header: 'Libellé', type: 'text' },
          { field: 'datePrestation', header: 'Date de prestation', type: 'date' },
          { field: 'type', header: 'Type', type: 'enum', values: () => this.prestationTypes, label: 'label', key: 'value' },
          { field: 'montant', header: 'Montant', type: 'currency' },
          { field: 'status', header: 'Status', type: 'enum', values: () => this.prestationStatuses, label: 'label', key: 'value' }
        ]
      },
      { field: 'registrant', header: 'Registrants', type: 'list', values: () => this.loadRegistrants(), label: 'numeroRegistrant', key: 'id', access: [Authority.SYSTEM], subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroRegistrant', header: 'Num Registrant', type: 'text' },
          { field: 'branche', header: 'Branche', type: 'objet', values: () => this.loadBranches(), label: 'ville', key: 'id' }
        ]
      }
    ];
  }

  // Méthode abstraite à implémenter pour initialiser tous autres fonctions
  protected initializeOthers(): void {
  }

  // Chargement des prestations associés à une fournisseur-soin
  loadPrestations(): Prestation[] {
    let data: Prestation[] = [];
    this.prestationService.getByFournisseurId(this.selectedItem.id).subscribe((data: Prestation[]) => {
      data = data;
    });
    return data;
  }

  // Chargement aux registrants associés à une assure
  loadRegistrants(): LiteRegistrant[] {
    let data: LiteRegistrant[] = [];
    this.registrantService.getByFournisseurId(this.selectedItem.id).subscribe((data: LiteRegistrant[]) => {
      data = data;
    });
    return data;
  }

  loadAccounts(): Account[] {
    let data: Account[] = [];
    this.accountCrudService.query().subscribe((data: Account[]) => {
      data = data;
    });
    return data;
  }

  // Chargement des prestations associés à une fournisseur-soin
  loadBranches(): Branche[] {
    let data: Branche[] = [];
    this.brancheService.query().subscribe((data: Branche[]) => {
      data = data;
    });
    return data;
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['nom', 'telephone', 'pays', 'servicesFournis'];
  }
}
