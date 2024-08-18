import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { MessageService } from 'primeng/api';
import { Notification, TypeNotification } from '../../models/notification.model';
import { NotificationService } from '../../service/notification.service';
import { Account } from '../../models/account.model';
import { GenericCrudComponent } from '../generic.crud.component';

@Component({
  selector: 'app-notification-crud',
  templateUrl: './../generic.crud.component.html'
})
export class NotificationCrudComponent extends GenericCrudComponent<Notification> {
  accounts: Account[] = [
    // Compte pour un client
    {
      id: 1,
      actived: true,
      authority: 'ROLE_CLIENT',
      email: 'john.doe@example.com',
      fullName: 'Victor Nlang',
      langKey: 'en',
      login: 'victor.nlang',
      imageUrl: 'https://example.com/image1.jpg',
      roles: null
    },
    
    // Compte pour un agent
    {
      id: 2,
      actived: true,
      authority: 'ROLE_AGENT',
      email: 'jane.smith@example.com',
      fullName: 'Jane Smith',
      langKey: 'fr',
      login: 'jane.smith',
      imageUrl: 'https://example.com/image2.jpg',
      roles: null
    },
    {
      id: 3,
      actived: true,
      authority: 'ROLE_AGENT',
      email: 'john.doe@example.com',
      fullName: 'John Doe',
      langKey: 'en',
      login: 'john.doe',
      imageUrl: 'https://example.com/image1.jpg',
      roles: null
    },
    
    // Compte pour un administrateur
    {
      id: 4,
      actived: true,
      authority: 'ROLE_ADMIN',
      email: 'admin.abc@example.com',
      fullName: 'SAMB\'A Assurances Gabon S.A',
      langKey: 'en',
      login: 'admin.samba',
      imageUrl: 'https://example.com/image3.jpg',
      roles: null
    },
    
    // Compte pour un fournisseur de soins
    {
      id: 5,
      actived: true,
      authority: 'ROLE_PROVIDER',
      email: 'care.provider@example.com',
      fullName: 'Care Provider',
      langKey: 'fr',
      login: 'care.provider',
      imageUrl: 'https://example.com/image4.jpg',
      roles: null
    }
  ];

  // Liste pour TypeNotification
  notificationTypes = [
    { label: 'Information', value: TypeNotification.INFO },
    { label: 'Paiement', value: TypeNotification.PAYMENT },
    { label: 'Rappel', value: TypeNotification.REMINDER },
    { label: 'Réclamation', value: TypeNotification.CLAIM },
    { label: 'Profil', value: TypeNotification.PROFILE }
  ];

  constructor(
    appMain: AppMainComponent,
    messageService: MessageService,
    baseService: BaseService,
    accountService: AccountService,
    fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    super(messageService, baseService, accountService, fb, notificationService, appMain);
    this.entityName = 'Notification';
    this.componentLink = '/admin/notifications';
    this.importLink = '/import/notifications';
    this.roleKey = 'NOTIFICATION_MODULE';
    this.isTable = true;
  }
  
  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'lu', header: 'Lu', type: 'boolean' },
      { field: 'titre', header: 'Titre', type: 'text' },
      { field: 'type', header: 'Type', type: 'enum', values: [], label: 'label', key: 'value' },
      { field: 'message', header: 'Message', type: 'textarea' },
      { field: 'dateEnvoi', header: 'Envoyé le', type: 'date' },
      { field: 'destinataire', header: 'Destinataire', type: 'objet', values: [], label: 'fullName', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'imageUrl', header: 'Avatar', type: 'image' },
          { field: 'fullName', header: 'Nom complet', type: 'text' },
          { field: 'email', header: 'Email', type: 'text' }
        ]
      },
      { field: 'emetteur', header: 'Emetteur', type: 'objet', values: [], label: 'fullName', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'imageUrl', header: 'Avatar', type: 'image' },
          { field: 'fullName', header: 'Nom complet', type: 'text' },
          { field: 'email', header: 'Email', type: 'text' }
        ]
      },
    ];
  }

  // Méthode abstraite à implémenter pour initialiser les données des colonnes de la table
  protected initializeColumnsData(): void {
    this.items = [
      {
        id: 1,
        titre: 'Bienvenue',
        message: 'Bienvenue chez SAMB\'A Assurances! Nous sommes ravis de vous compter parmi nos assurés.',
        dateEnvoi: new Date('2023-01-01T10:00:00Z'),
        lu: false,
        type: TypeNotification.INFO,
        destinataire: 1,
        emetteur: 0
      },
      {
        id: 2,
        titre: 'Paiement Reçu',
        message: 'Nous avons bien reçu votre paiement de 5000 FCFA pour votre assurance santé.',
        dateEnvoi: new Date('2023-02-15T14:30:00Z'),
        lu: true,
        type: TypeNotification.PAYMENT,
        destinataire: 1,
        emetteur: 0
      },
      {
        id: 3,
        titre: 'Rappel de Renouvellement',
        message: 'Votre assurance arrive à expiration le 2023-12-31. Veuillez la renouveler pour continuer à bénéficier de nos services.',
        dateEnvoi: new Date('2023-11-01T08:00:00Z'),
        lu: false,
        type: TypeNotification.REMINDER,
        destinataire: 1,
        emetteur: 0
      },
      {
        id: 4,
        titre: 'Nouvelle Réclamation',
        message: 'Votre réclamation pour le sinistre numéro S002 a été reçue et est en cours de traitement.',
        dateEnvoi: new Date('2023-03-22T09:45:00Z'),
        lu: true,
        type: TypeNotification.CLAIM,
        destinataire: 1,
        emetteur: 0
      },
      {
        id: 5,
        titre: 'Mise à Jour de Profil',
        message: 'Vos informations de profil ont été mises à jour avec succès.',
        dateEnvoi: new Date('2023-05-10T12:00:00Z'),
        lu: true,
        type: TypeNotification.PROFILE,
        destinataire: 1,
        emetteur: 0
      },
  
      // Notifications pour l'assurance santé
      {
        id: 6,
        titre: 'Couverture Complémentaire Maladie',
        type: TypeNotification.INFO,
        message: 'Vous avez souscrit à une couverture complémentaire pour les frais médicaux non pris en charge par la sécurité sociale.',
        dateEnvoi: new Date('2024-07-01'),
        destinataire: 1,
        emetteur: 2,
        lu: false,
      },
      {
        id: 7,
        titre: 'Nouvelle Police d\'Hospitalisation',
        type: TypeNotification.INFO,
        message: 'Votre nouvelle police d\'hospitalisation est désormais active et couvrira les frais en cas de maladie ou d\'accident.',
        dateEnvoi: new Date('2024-07-10'),
        destinataire: 1,
        emetteur: 2,
        lu: false,
      },
    
      // Notifications pour l'assurance automobile
      {
        id: 8,
        titre: 'Responsabilité Civile Auto',
        type: TypeNotification.INFO,
        message: 'Vous êtes maintenant couvert pour les dommages causés à des tiers en cas d\'accident de voiture.',
        dateEnvoi: new Date('2024-07-05'),
        destinataire: 1,
        emetteur: 5,
        lu: false,
      },
      {
        id: 9,
        titre: 'Assurance Tous Risques Auto',
        type: TypeNotification.INFO,
        message: 'Votre couverture complète inclut les dommages au véhicule assuré, qu\'ils soient de votre faute ou non.',
        dateEnvoi: new Date('2024-07-12'),
        destinataire: 1,
        emetteur: 5,
        lu: false,
      },
    
      // Notifications pour l'assurance agricole
      {
        id: 10,
        titre: 'Assurance Récoltes',
        type: TypeNotification.INFO,
        message: 'Votre police vous protège contre les pertes de récoltes dues à des conditions climatiques extrêmes ou des catastrophes naturelles.',
        dateEnvoi: new Date('2024-07-15'),
        destinataire: 1,
        emetteur: 3,
        lu: false,
      },
      {
        id: 11,
        titre: 'Assurance Bétail',
        type: TypeNotification.INFO,
        message: 'Votre police couvre les pertes dues à des maladies du bétail ou des accidents.',
        dateEnvoi: new Date('2024-07-20'),
        destinataire: 1,
        emetteur: 3,
        lu: false,
      },
    
      // Notifications pour l'assurance personne
      {
        id: 12,
        titre: 'Assurance Vie',
        type: TypeNotification.INFO,
        message: 'Votre police d\'assurance vie offre une protection financière pour vos bénéficiaires en cas de décès.',
        dateEnvoi: new Date('2024-07-25'),
        destinataire: 1,
        emetteur: 4,
        lu: false,
      },
      {
        id: 13,
        titre: 'Assurance Invalidité',
        type: TypeNotification.INFO,
        message: 'Votre couverture vous assure une protection contre la perte de revenus en cas d\'incapacité de travail due à une maladie ou un accident.',
        dateEnvoi: new Date('2024-07-28'),
        destinataire: 1,
        emetteur: 4,
        lu: false,
      }
    ];  
    this.branches = [
        {
            name: 'Branch A',
            partenaires: [
                {
                    name: 'Registrant A1',
                    data: this.items // Reuse existing items
                }
            ]
        },
        {
            name: 'Branch B',
            partenaires: [
                {
                    name: 'Registrant B1',
                    data: this.items // Reuse existing items
                }
            ]
        }
    ];
    this.loadAccounts();
    this.loading = false;
  }
  
  // Chargement des polices associés à une notification
  loadAccounts(): void {
    this.notificationService.getAllAccounts().subscribe((accounts: Account[]) => {
        this.accounts = accounts;
    });
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['titre', 'message', 'destinataire', 'emetteur', 'type'];
  }

  /**
   * Assigner les valeurs aux colonnes en fonction des champs spécifiés.
   */
  protected assignColumnsValues(): void { // Ajoutez le modificateur override
    this.setColumnValues('type', this.notificationTypes);
    this.setColumnValues('destinataire', this.accounts);
    this.setColumnValues('emetteur', this.accounts);
  }
}
