import { ToastService } from './../../service/toast.service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { MessageService } from 'primeng/api';
import { Financeur, FinanceurType } from '../../models/financeur.model';
import { FinanceurService } from '../../service/financeur.service';
import { Prestation, PrestationStatus, PrestationType } from '../../models/prestation.model';
import { GenericCrudComponent } from '../generic.crud.component';

@Component({
  selector: 'app-financeur-soin-crud',
  templateUrl: './../generic.crud.component.html'
})
export class FinanceurCrudComponent extends GenericCrudComponent<Financeur> {

  // Liste pour FinanceurType
  financeurTypes = [
    { label: 'Assureur', value: FinanceurType.ASSUREUR },
    { label: 'Mutuelle', value: FinanceurType.MUTUELLE },
    { label: 'Organisme public', value: FinanceurType.ORGANISME_PUBLIC }
  ];

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
    financeurService: FinanceurService
  ) {
    super(toastService, messageService, cdr, baseService, accountService, fb, financeurService, appMain);
    this.entityName = 'Financeur';
    this.componentLink = '/admin/financeurs';
    this.importLink = '/import/financeurs';
    this.roleKey = 'FINANCEUR_MODULE';
  }

  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'nom', header: 'Name', type: 'text' },
      { field: 'description', header: 'Description', type: 'textarea' },
      { field: 'type', header: 'Type', type: 'enum', values: () => this.financeurTypes, label: 'label', key: 'value' },
      { field: 'adresse', header: 'Adresse', type: 'textarea' },
      { field: 'telephone', header: 'Telephone', type: 'text' },
      { field: 'email', header: 'Email', type: 'text' },
      { field: 'prestations', header: 'Prestations', type: 'list', values: () => this.loadPrestations(), label: 'numeroPrestation', key: 'id', access: [Authority.SYSTEM], subfield: [
        { field: 'id', header: 'ID', type: 'id' },
        { field: 'numeroPrestation', header: 'Num Prestation', type: 'text' },
        { field: 'label', header: 'Libellé', type: 'text' },
        { field: 'datePrestation', header: 'Date de prestation', type: 'date' },
        { field: 'type', header: 'Type', type: 'enum', values: () => this.prestationTypes, label: 'label', key: 'value' },
        { field: 'montant', header: 'Montant', type: 'currency' },
        { field: 'status', header: 'Status', type: 'enum', values: () => this.prestationStatuses, label: 'label', key: 'value' }
        ]
      }
    ];
  }

  // Méthode abstraite à implémenter pour initialiser tous autres fonctions
  protected initializeOthers(): void {
  }

  // Chargement des prestations associés à une financeur-soin
  loadPrestations(): Rule[] {
    let data: Rule[] = [];
    this.roleService.getAllByAccountId(this.selectedItem.id).subscribe((data: Rule[]) => {
      data = data;
    });
    return data;
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['nom', 'type', 'email'];
  }
}
