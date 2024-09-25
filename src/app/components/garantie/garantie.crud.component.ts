import { PoliceAssuranceService } from './../../service/police-assurance.service';
import { Authority } from './../../models/account.model';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { MessageService } from 'primeng/api';
import { Garantie, GarantieStatus } from '../../models/garantie.model';
import { GarantieService } from '../../service/garantie.service';
import { PoliceAssurance } from '../../models/police-assurance.model';
import { GenericCrudComponent } from '../generic.crud.component';

@Component({
  selector: 'app-garantie-soin-crud',
  templateUrl: './../generic.crud.component.html'
})
export class GarantieCrudComponent extends GenericCrudComponent<Garantie> {

  // Liste pour GarantieStatus
  garantieStatus = [
    { label: 'Activée', value: GarantieStatus.ACTIVEE },
    { label: 'Expirée', value: GarantieStatus.EXPIREE },
    { label: 'Suspendue', value: GarantieStatus.SUSPENDUE }
  ];

  constructor(
    appMain: AppMainComponent,
    messageService: MessageService,
    baseService: BaseService,
    accountService: AccountService,
    fb: FormBuilder,
    garantieService: GarantieService,
    private policeAssuranceService: PoliceAssuranceService
  ) {
    super(messageService, baseService, accountService, fb, garantieService, appMain);
    this.entityName = 'Garantie';
    this.componentLink = '/admin/garanties';
    this.roleKey = 'GARANTIE_MODULE';
  }

  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'numeroGarantie', header: 'Num Garantie', type: 'text' },
      { field: 'label', header: 'Label', type: 'text' },
      { field: 'percentage', header: 'Pourcentage', type: 'percentage', access: [Authority.ADMIN] },
      { field: 'termes', header: 'Termes', type: 'textarea', access: [Authority.ADMIN] },
      { field: 'plafondAssure', header: 'Plafond assuré', type: 'currency', access: [Authority.ADMIN] },
      { field: 'dateDebut', header: 'Date de début', type: 'date', access: [Authority.ADMIN] },
      { field: 'dateFin', header: 'Date de fin', type: 'date', access: [Authority.ADMIN] },
      { field: 'status', header: 'Status', type: 'enum', values: this.garantieStatus, label: 'label', key: 'value', access: [Authority.ADMIN] },
      { field: 'polices', header: 'Polices d\'assurance', type: 'list', values: [], method: () => this.loadPolices(), label: 'numeroPolice', key: 'id', access: [Authority.SYSTEM], subfield: [
        { field: 'id', header: 'ID', type: 'id' },
        { field: 'numeroPolice', header: 'Num Police', type: 'text' },
        { field: 'label', header: 'Libelle', type: 'text' },
        { field: 'montantSouscription', header: 'Coût', type: 'currency' }
        ]
      }
    ];
  }

  // Méthode abstraite à implémenter pour initialiser tous autres fonctions
  protected initializeOthers(): void {
  }

  // Chargement des polices associés à une assurance
  async loadPolices(): Promise<PoliceAssurance[]> {
      try {
          return await this.policeAssuranceService.getWithGarantiesById(this.selectedItem.id).toPromise();
      } catch (error) {
          return [];
      }
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['numeroGarantie', 'label', 'status'];
  }
}
