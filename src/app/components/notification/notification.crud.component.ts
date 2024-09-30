import { AccountCrudService } from './../../service/account.crud.service';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { MessageService } from 'primeng/api';
import { Notification, TypeNotification } from '../../models/notification.model';
import { NotificationService } from '../../service/notification.service';
import { Account, Authority } from '../../models/account.model';
import { GenericCrudComponent } from '../generic.crud.component';

@Component({
  selector: 'app-notification-crud',
  templateUrl: './../generic.crud.component.html'
})
export class NotificationCrudComponent extends GenericCrudComponent<Notification> {

  // Liste pour TypeNotification
  notificationTypes = [
    { label: 'Information', value: TypeNotification.INFO },
    { label: 'Paiement', value: TypeNotification.PAYMENT },
    { label: 'Rappel', value: TypeNotification.REMINDER },
    { label: 'Réclamation', value: TypeNotification.CLAIM },
    { label: 'Profil', value: TypeNotification.PROFILE },
    { label: 'Système', value: TypeNotification.SYSTEM }
  ];

  constructor(
    appMain: AppMainComponent,
    messageService: MessageService,
    baseService: BaseService,
    accountService: AccountService,
    fb: FormBuilder,
    private notificationService: NotificationService,
    private accountCrudService: AccountCrudService
  ) {
    super(messageService, baseService, accountService, fb, notificationService, appMain);
    this.entityName = 'Notification';
    this.componentLink = '/admin/notifications';
    this.roleKey = 'NOTIFICATION_MODULE';
  }

  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'lu', header: 'Lu', type: 'boolean' },
      { field: 'titre', header: 'Titre', type: 'text' },
      { field: 'type', header: 'Type', type: 'enum', values: this.notificationTypes, label: 'label', key: 'value' },
      { field: 'message', header: 'Message', type: 'textarea' },
      { field: 'dateEnvoi', header: 'Envoyé le', type: 'date' },
      { field: 'destinataire', header: 'Destinataire', type: 'objet', values: [], method: () => this.loadAccounts(), label: 'fullName', key: 'id', access: [Authority.SYSTEM], subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'imageUrl', header: 'Avatar', type: 'image' },
          { field: 'fullName', header: 'Nom complet', type: 'text' },
          { field: 'email', header: 'Email', type: 'text' }
        ]
      },
      { field: 'emetteur', header: 'Emetteur', type: 'objet', values: [], method: () => this.loadAccounts(), label: 'fullName', key: 'id', access: [Authority.SYSTEM], subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'imageUrl', header: 'Avatar', type: 'image' },
          { field: 'fullName', header: 'Nom complet', type: 'text' },
          { field: 'email', header: 'Email', type: 'text' }
        ]
      },
    ];
  }

  // Méthode abstraite à implémenter pour initialiser tous autres fonctions
  protected initializeOthers(): void {
    // On recupere l'utilisateur actuel
    const account: Account = this.accountService.getCurrentAccount();
    if (account) {
      // Marquer les notifications comme lue
      this.notificationService.markAsReadNotificationsByUserId(account.id);
    }

    // S'abonne à l'état d'authentification pour obtenir le compte utilisateur
    this.accountService.getUserState().subscribe(account => {
      if (account) {
        // Marquer les notifications comme lue
        this.notificationService.markAsReadNotificationsByUserId(account.id);
      }
    });

    // S'abonne à l'état des notifications non lu
    this.notificationService.getUnreadNotificationState().subscribe(notifications => {
      // Marquer les notifications comme lue
      this.notificationService.markAsReadNotificationsByUserId(account.id);
    });

    // Vérifier si l'utilisateur authentifié a l'autorité ROLE_CLIENT
    if (this.hasAuthority([Authority.CLIENT])) {
        // Si l'utilisateur est un client, sélectionner l'ID du compte client pour l'émetteur et le système pour le destinataire
        this.formGroup.get('emetteur')?.setValue(this.accountService.getIdForCurrentAccount());
        this.formGroup.get('destinataire')?.setValue(1); // 1 étant l'ID du compte système
    } else {
        // Si l'utilisateur n'est pas un client, sélectionner l'ID du système pour les deux champs
        this.formGroup.get('emetteur')?.setValue(1);
        this.formGroup.get('destinataire')?.setValue(1);
    }
  }

  // Helper method to set the value of a dropdown by ID
  private selectDropdownValue(dropdown: HTMLSelectElement, value: number | string): void {
    const option = Array.from(dropdown.options).find(opt => opt.value === value.toString());
    if (option) {
      dropdown.value = option.value;
    }
  }

  // Chargement des polices associés à une notification
  async loadAccounts(): Promise<Account[]> {
      try {
          return await this.accountCrudService.query().toPromise();
      } catch (error) {
          return [];
      }
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] {
    return ['titre', 'message', 'type'];
  }
}
