import { AccountCrudService } from './../../service/account.crud.service';
import { ToastService } from './../../service/toast.service';
import { Component, ChangeDetectorRef } from '@angular/core';
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
    { label: 'Système', value: TypeNotification.SYSTEM }  // Add the new SYSTEM type
  ];

  constructor(
    appMain: AppMainComponent,
    messageService: MessageService,
    baseService: BaseService,
    accountService: AccountService,
    fb: FormBuilder,
    toastService: ToastService,
    cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
    private accountCrudService: AccountCrudService
  ) {
    super(toastService, messageService, cdr, baseService, accountService, fb, notificationService, appMain);
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
      { field: 'type', header: 'Type', type: 'enum', values: () => this.notificationTypes, label: 'label', key: 'value' },
      { field: 'message', header: 'Message', type: 'textarea' },
      { field: 'dateEnvoi', header: 'Envoyé le', type: 'date' },
      { field: 'destinataire', header: 'Destinataire', type: 'objet', values: () => this.loadAccounts(), label: 'fullName', key: 'id', access: [Authority.SYSTEM], subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'imageUrl', header: 'Avatar', type: 'image' },
          { field: 'fullName', header: 'Nom complet', type: 'text' },
          { field: 'email', header: 'Email', type: 'text' }
        ]
      },
      { field: 'emetteur', header: 'Emetteur', type: 'objet', values: () => this.loadAccounts(), label: 'fullName', key: 'id', access: [Authority.SYSTEM], subfield: [
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
    // Charge les données du compte utilisateur actuellement authentifié lors de l'initialisation du composant
    this.accountService.identity().subscribe(account => {
      if (account) {
        // Marquer toutes les notifications non lues comme lues
        this.notificationService.markAsReadNotificationsByUserId(account.id).subscribe();

        // Check if the authenticated user has the ROLE_CLIENT authority
        if (account?.authority === Authority.CLIENT) {
          // If the user is a client, find and select the dropdown fields for emitter and recipient
          const emitterDropdown = document.getElementById('emetteur') as HTMLSelectElement;
          const recipientDropdown = document.getElementById('destinataire') as HTMLSelectElement;

          // Set the emitter dropdown to the current user's account
          if (emitterDropdown) {
            this.selectDropdownValue(emitterDropdown, account.id);
          }

          // Set the recipient dropdown to the system account (SYSTEM_ACCOUNT_ID)
          if (recipientDropdown) {
            this.selectDropdownValue(recipientDropdown, 1);
          }
        } else {
          // If the user is not a client, set both emitter and recipient to the system account
          const emitterDropdown = document.getElementById('emetteur') as HTMLSelectElement;
          const recipientDropdown = document.getElementById('destinataire') as HTMLSelectElement;

          // Set both dropdown fields to SYSTEM_ACCOUNT_ID
          if (emitterDropdown) {
            this.selectDropdownValue(emitterDropdown, 1);
          }
          if (recipientDropdown) {
            this.selectDropdownValue(recipientDropdown, 1);
          }
        }
      }
    });
  }

  // Helper method to set the value of a dropdown by ID
  private selectDropdownValue(dropdown: HTMLSelectElement, value: number | string): void {
    const option = Array.from(dropdown.options).find(opt => opt.value === value.toString());
    if (option) {
      dropdown.value = option.value;
    }
  }

  // Chargement des polices associés à une notification
  loadAccounts(): Account[] {
    let data: Account[] = [];
    this.accountCrudService.query().subscribe((data: Account[]) => {
      data = data;
    });
    return data;
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['titre', 'message', 'destinataire', 'emetteur', 'type'];
  }
}
