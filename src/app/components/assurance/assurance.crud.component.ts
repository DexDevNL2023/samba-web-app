import { Authority } from './../../models/account.model';
import { ToastService } from './../../service/toast.service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { MessageService } from 'primeng/api';
import { Assurance, InsuranceType } from '../../models/assurance.model';
import { PoliceAssurance } from '../../models/police-assurance.model';
import { AssuranceService } from '../../service/assurance.service';
import { GenericCrudComponent } from '../generic.crud.component';
import { PoliceAssuranceService } from '../../service/police-assurance.service';

@Component({
  selector: 'app-assurance-crud',
  templateUrl: './../generic.crud.component.html'
})
export class AssuranceCrudComponent extends GenericCrudComponent<Assurance> {
  // Liste pour Enum
  insuranceTypes = [
    { label: 'Personne', value: InsuranceType.PERSONNE },
    { label: 'Bien', value: InsuranceType.BIEN },
    { label: 'Agricole', value: InsuranceType.AGRICOLE },
    { label: 'Agricole', value: InsuranceType.SANTE }
  ];

  constructor(
    appMain: AppMainComponent,
    messageService: MessageService,
    baseService: BaseService,
    accountService: AccountService,
    fb: FormBuilder,
    toastService: ToastService,
    cdr: ChangeDetectorRef,
    assuranceService: AssuranceService,
    private policeAssuranceService: PoliceAssuranceService
  ) {
    super(toastService, messageService, cdr, baseService, accountService, fb, assuranceService, appMain);
    this.entityName = 'Assurance';
    this.componentLink = '/admin/assurances';
    this.importLink = '/import/assurances';
    this.roleKey = 'ASSURANCE_MODULE';
  }

  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'nom', header: 'Name', type: 'text' },
      { field: 'type', header: 'Type', type: 'enum', values: () => this.insuranceTypes, label: 'label', key: 'value' },
      { field: 'description', header: 'Description', type: 'textarea' },
      { field: 'polices', header: 'Polices d\'assurance', type: 'list', values: () => this.loadPolices(), label: 'numeroPolice', key: 'id', access: [Authority.SYSTEM], subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroPolice', header: 'Num Police', type: 'text' },
          { field: 'label', header: 'Libellé', type: 'text' },
          { field: 'montantSouscription', header: 'Coût', type: 'currency' }
        ]
      }
    ];
  }

  // Méthode abstraite à implémenter pour initialiser tous autres fonctions
  protected initializeOthers(): void {
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] {
    return ['nom', 'type'];
  }

  // Chargement des polices associés à une assurance
  loadPolices(): PoliceAssurance[] {
    let data: PoliceAssurance[] = [];
    this.policeAssuranceService.getAllWithAssuranceById(this.selectedItem.id).subscribe((data: PoliceAssurance[]) => {
      data = data;
    });
    return data;
  }
}
