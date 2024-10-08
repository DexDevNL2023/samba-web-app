import { AuthorizationService } from './../../service/authorization.service';
import { PermissionFormRequest } from './../../models/permission.form.request';
import { PermissionService } from './../../service/permission.service';
import { RoleService } from './../../service/role.service';
import { Component } from '@angular/core';
import { AppMainComponent } from '../../app.main.component';
import { MessageService } from 'primeng/api';
import { Account, Authority } from '../../models/account.model';
import { Rule } from '../../models/rule.model';
import { Permission } from '../../models/permission.model';
import { GenericCrudComponent } from '../generic.crud.component';
import { BaseService } from '../../service/base.service';
import { AccountService } from '../../core/auth/account.service';
import { AccountCrudService } from '../../service/account.crud.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-account-crud',
  templateUrl: './../generic.crud.component.html'
})
export class AccountCrudComponent extends GenericCrudComponent<Account> {
  // Liste pour InsuranceType
  authorities = [
    { label: 'Assuré', value: Authority.CLIENT },
    { label: 'Agent', value: Authority.AGENT },
    { label: 'Administrateur', value: Authority.ADMIN },
    { label: 'Fournisseur', value: Authority.PROVIDER }
  ];

  constructor(
    appMain: AppMainComponent,
    messageService: MessageService,
    baseService: BaseService,
    accountService: AccountService,
    fb: FormBuilder,
    accountCrudService: AccountCrudService,
    private authorizationService: AuthorizationService,
    private roleService: RoleService,
    private permissionService: PermissionService
  ) {
    super(messageService, baseService, accountService, fb, accountCrudService, appMain);
    this.entityName = 'Account';
    this.componentLink = '/admin/accounts';
    this.roleKey = 'ACCOUNT_MODULE';
  }

  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'imageUrl', header: 'Avatar', type: 'image' },
      { field: 'fullName', header: 'Nom complet', type: 'text' },
      { field: 'email', header: 'Email', type: 'text' },
      { field: 'langKey', header: 'Langue', type: 'text' },
      { field: 'login', header: 'Login', type: 'text' },
      { field: 'authority', header: 'Authorisations', type: 'enum', values: this.authorities, label: 'label', key: 'value', access: [Authority.ADMIN] },
      { field: 'actived', header: 'Actif', type: 'boolean' },
      { field: 'roles', header: 'Rôles', type: 'list', values: [], method: () => this.loadRoles(), label: 'roleKey', key: 'id', access: [Authority.ADMIN], subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'libelle', header: 'Libelle', type: 'text' },
          { field: 'permissions', header: 'Permissions', type: 'list', values: [], method: () => this.loadPermissions(), label: 'libelle', key: 'id', access: [Authority.ADMIN], control: (item: any, event: any) => this.onPermissionsChange(item, event) }
        ]
      }
    ];
  }

  // Méthode abstraite à implémenter pour initialiser tous autres fonctions
  protected initializeOthers(): void {
  }

  // Chargement des rôles associés à une account
  async loadRoles(): Promise<Rule[]> {
      try {
          return await this.roleService.getAllByAccountId(this.selectedItem.id).toPromise();
      } catch (error) {
          return [];
      }
  }

  // Chargement toutes les permissions
  async loadPermissions(): Promise<Permission[]> {
      try {
          return await this.permissionService.query().toPromise();
      } catch (error) {
          return [];
      }
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['fullName', 'email', 'login', 'authority'];
  }

  onPermissionsChange(item: any, event: any): void {
    // Les permissions sélectionnées pour le champ list
    const form: PermissionFormRequest = {
      "accountId": this.selectedItem?.id,
      "moduleId": item?.id,
      "permissionIds": event?.value
    };

    // Vous pouvez ensuite mettre à jour les permissions ou effectuer d'autres actions
    this.authorizationService.changeAutorisation(form).subscribe(() => {
      this.ngOnInit();
    });
  }
}
