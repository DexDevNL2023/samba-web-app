import { ToastService } from './../../service/toast.service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { MessageService } from 'primeng/api';
import { Financeur, FinanceurType } from '../../models/financeur.model';
import { FinanceurService } from '../../service/financeur.service';
import { Prestation, PrestationStatus } from '../../models/prestation.model';
import { GenericCrudComponent } from '../generic.crud.component';

@Component({
  selector: 'app-financeur-soin-crud',
  templateUrl: './../generic.crud.component.html'
})
export class FinanceurCrudComponent extends GenericCrudComponent<Financeur> {
  prestations: Prestation[] = [
    {
      id: 1,
      numeroPrestation: 'PRE-001',
      label: 'Consultation Médicale Générale',
      datePrestation: new Date('2024-01-15'),
      description: 'Consultation avec un médecin généraliste.',
      montant: 5000,
      status: PrestationStatus.REMBOURSE,
      fournisseur: 1,
      financeurs: [1],
      sinistre: 1,
      documents: [1, 2]
    },
    {
      id: 2,
      numeroPrestation: 'PRE-002',
      label: 'Hospitalisation Chirurgicale',
      datePrestation: new Date('2024-02-20'),
      description: 'Hospitalisation pour une intervention chirurgicale.',
      montant: 120000,
      status: PrestationStatus.EN_ATTENTE,
      fournisseur: 2,
      financeurs: [1, 2],
      sinistre: 2,
      documents: [2, 3]
    },
    {
      id: 3,
      numeroPrestation: 'PRE-003',
      label: 'Radiologie',
      datePrestation: new Date('2024-03-10'),
      description: 'Radiographie thoracique.',
      montant: 20000,
      status: PrestationStatus.NON_REMBOURSE,
      fournisseur: 1,
      financeurs: [2],
      sinistre: 3,
      documents: [3]
    },
    {
      id: 4,
      numeroPrestation: 'PRE-004',
      label: 'Soins Dentaires',
      datePrestation: new Date('2024-04-05'),
      description: 'Traitement de caries et nettoyage dentaire.',
      montant: 15000,
      status: PrestationStatus.REMBOURSE,
      fournisseur: 1,
      financeurs: [1],
      sinistre: 4,
      documents: [4, 1]
    }
  ];

  // Liste pour FinanceurType
  financeurTypes = [
    { label: 'Assureur', value: FinanceurType.ASSUREUR },
    { label: 'Mutuelle', value: FinanceurType.MUTUELLE },
    { label: 'Organisme public', value: FinanceurType.ORGANISME_PUBLIC }
  ];

  // Liste pour PrestationStatus
  prestationStatus = [
    { label: 'Non Remboursé', value: PrestationStatus.NON_REMBOURSE },
    { label: 'En Attente', value: PrestationStatus.EN_ATTENTE },
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
    private financeurService: FinanceurService
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
      { field: 'type', header: 'Type', type: 'enum', values: [], label: 'label', key: 'value' },
      { field: 'adresse', header: 'Adresse', type: 'textarea' },
      { field: 'telephone', header: 'Telephone', type: 'text' },
      { field: 'email', header: 'Email', type: 'text' },
      { field: 'prestations', header: 'Prestations', type: 'list', values: [], label: 'numeroPrestation', key: 'id', subfield: [
        { field: 'id', header: 'ID', type: 'id' },
        { field: 'numeroPrestation', header: 'Num Prestation', type: 'text' },
        { field: 'label', header: 'Libellé', type: 'text' },
          { field: 'status', header: 'Status', type: 'enum', values: [], label: 'label', key: 'value' },
          { field: 'datePrestation', header: 'Effectuer le', type: 'date' },
          { field: 'montant', header: 'Montant', type: 'currency' }
        ]
      }
    ];
  }

  // Méthode abstraite à implémenter pour initialiser les données des colonnes de la table
  protected initializeColumnsData(): void {
    this.items = [
      {
        id: 1,
        nom: 'Assurance Santé Avenir',
        description: 'Assurance offrant des couvertures complètes pour les soins médicaux.',
        type: FinanceurType.ASSUREUR,
        adresse: '123 Avenue de la Santé, Ville A - Pays A',
        telephone: '0123456789',
        email: 'contact@assurancesanteavenir.com',
        prestations: [1, 2, 4]
      },
      {
        id: 2,
        nom: 'Mutuelle Bien-Être',
        description: 'Mutuelle spécialisée dans les soins paramédicaux et la prévention.',
        type: FinanceurType.MUTUELLE,
        adresse: '456 Rue de la Mutuelle, Ville B - Pays B',
        telephone: '0987654321',
        email: 'info@mutuellebienetre.com',
        prestations: [1, 3]
      },
      {
        id: 3,
        nom: 'Caisse Nationale de Sécurité Sociale',
        description: 'Organisme public offrant des prestations de santé aux travailleurs.',
        type: FinanceurType.ORGANISME_PUBLIC,
        adresse: '789 Boulevard de la Sécurité, Capitale C',
        telephone: '0223344556',
        email: 'cnss@securitesociale.gouv',
        prestations: [2, 3, 4]
      }
    ];
    this.loadPrestations();
    this.loading = false;
  }

  // Chargement des prestations associés à une financeur-soin
  loadPrestations(): void {
    this.financeurService.getAllPrestations().subscribe((prestations: Prestation[]) => {
        this.prestations = prestations;
    });
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['nom', 'type', 'email'];
  }

  /**
   * Assigner les valeurs aux colonnes en fonction des champs spécifiés.
   */
  protected assignColumnsValues(): void { // Ajoutez le modificateur override
    this.setColumnValues('type', this.financeurTypes);
    this.setColumnValues('prestations', this.prestations);
    this.setSubFieldValues('prestations', 'status', this.prestationStatus);
  }
}
