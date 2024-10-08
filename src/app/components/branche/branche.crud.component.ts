import { FournisseurService } from './../../service/fournisseur.service';
import { Authority } from './../../models/account.model';
import { Component } from '@angular/core';
import { AppMainComponent } from '../../app.main.component';
import { MessageService } from 'primeng/api';
import { Branche } from '../../models/branche.model';
import { Fournisseur } from '../../models/fournisseur.model';
import { GenericCrudComponent } from '../generic.crud.component';
import { BaseService } from '../../service/base.service';
import { AccountService } from '../../core/auth/account.service';
import { BrancheService } from '../../service/branche.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-branche-crud',
  templateUrl: './../generic.crud.component.html'
})
export class BrancheCrudComponent extends GenericCrudComponent<Branche> {

  constructor(
    appMain: AppMainComponent,
    messageService: MessageService,
    baseService: BaseService,
    accountService: AccountService,
    fb: FormBuilder,
    brancheService: BrancheService,
    private fournisseurService: FournisseurService
  ) {
    super(messageService, baseService, accountService, fb, brancheService, appMain);
    this.entityName = 'Branche';
    this.componentLink = '/admin/branches';
    this.roleKey = 'BRANCHE_MODULE';
  }

  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'code', header: 'Code', type: 'text' },
      { field: 'ville', header: 'Ville', type: 'text' },
      { field: 'isDefaut', header: 'Par defaut', type: 'boolean' },
      { field: 'registrants', header: 'Partenaires', type: 'list', values: [], method: () => this.loadPartenaires(), label: 'nom', key: 'id', access: [Authority.SYSTEM], subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'nom', header: 'Nom', type: 'text' },
          { field: 'telephone', header: 'Telephone', type: 'text' },
          { field: 'email', header: 'Email', type: 'text' },
          { field: 'adresse', header: 'Adresse', type: 'text' }
        ]
      }
    ];
  }

  // Méthode abstraite à implémenter pour initialiser tous autres fonctions
  protected initializeOthers(): void {
  }

  // Chargement des polices associés à une branche
  async loadPartenaires(): Promise<Fournisseur[]> {
      try {
          return await this.fournisseurService.getFournisseurWithBranchesById(this.selectedItem.id).toPromise();
      } catch (error) {
          return [];
      }
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['code', 'ville'];
  }
}
