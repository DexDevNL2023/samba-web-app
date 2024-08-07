import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { MessageService } from 'primeng/api';
import { ContratAssurance, ContratType } from '../../models/contrat-assurance.model';
import { GenericCrudComponent } from '../generic.crud.component';
import { ContratAssuranceService } from '../../service/contrat-assurance.service';

@Component({
  selector: 'app-contrat-assurance-crud',
  templateUrl: './../generic.crud.component.html'
})
export class ContratAssuranceCrudComponent extends GenericCrudComponent<ContratAssurance> {
  // Liste pour InsuranceType
  contratTypes = [
    { label: 'Bien', value: ContratType.BIEN },
    { label: 'Agricole', value: ContratType.AGRICOLE },
    { label: 'Personne', value: ContratType.PERSONNE },
    { label: 'Santé', value: ContratType.SANTE }
  ];

  constructor(
    appMain: AppMainComponent,
    messageService: MessageService,
    baseService: BaseService,
    accountService: AccountService,
    fb: FormBuilder,
    private contratAssuranceService: ContratAssuranceService
  ) {
    super(messageService, baseService, accountService, fb, contratAssuranceService, appMain);
    this.entityName = 'Contrat d\'assurance';
    this.componentLink = '/admin/contras/assurances';
    this.importLink = '/import-contrat-assurance';
    this.moduleKey = 'CONTRAT_MODULE';
    this.isTable = true;
  }
  
  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'numeroContrat', header: 'Num Contrat', type: 'text' },
      { field: 'dateContrat', header: 'Date du contrat', type: 'date' },
      { field: 'typeContrat', header: 'Type', type: 'enum', values: [], label: 'label', key: 'value' },
      { field: 'couverture', header: 'Couverture', type: 'textarea' },
      { field: 'montantAssure', header: 'Montant assuré', type: 'currency' },
      { field: 'franchise', header: 'franchise', type: 'currency' },
      { field: 'conditions', header: 'Conditions', type: 'textarea' },
      { field: 'exclusions', header: 'Exclusions', type: 'textarea' },
      { field: 'dateDebut', header: 'Date de début', type: 'date' },
      { field: 'dateFin', header: 'Date de fin', type: 'date' }
    ];
  }

  // Méthode abstraite à implémenter pour initialiser les données des colonnes de la table
  protected initializeColumnsData(): void {
    this.items = [
      {
        id: 1,
        numeroContrat: 'CON001',
        dateContrat: new Date('2023-01-01'),
        typeContrat: 'PERSONNE',
        couverture: 'Assurance vie',
        montantAssure: 1000000,
        franchise: 10000,
        conditions: 'Pas de couverture en cas de suicide au cours des deux premières années du contrat.',
        exclusions: 'Accidents de sport extrême tels que le parachutisme, le parapente, etc.',
        dateDebut: new Date('2023-01-01'),
        dateFin: new Date('2024-01-01')
      },
      {
        id: 2,
        numeroContrat: 'CON002',
        dateContrat: new Date('2022-06-01'),
        typeContrat: 'BIEN',
        couverture: 'Assurance habitation',
        montantAssure: 500000,
        franchise: 5000,
        conditions: 'Couverture pour incendie uniquement, à condition que les mesures de sécurité contre l\'incendie soient respectées.',
        exclusions: 'Dégâts des eaux dus à une négligence de l\'assuré, comme un robinet laissé ouvert.',
        dateDebut: new Date('2022-06-01'),
        dateFin: new Date('2023-06-01')
      },
      {
        id: 3,
        numeroContrat: 'CON003',
        dateContrat: new Date('2024-02-15'),
        typeContrat: 'AGRICOLE',
        couverture: 'Assurance récolte',
        montantAssure: 200000,
        franchise: 2000,
        conditions: 'Couverture pour perte de récolte due aux intempéries, sous réserve d\'une déclaration de perte dans les 48 heures.',
        exclusions: 'Perte due aux parasites en l\'absence de traitements préventifs recommandés.',
        dateDebut: new Date('2024-02-15'),
        dateFin: new Date('2025-02-15')
      },
      {
        id: 4,
        numeroContrat: 'CON004',
        dateContrat: new Date('2021-09-01'),
        typeContrat: 'SANTE',
        couverture: 'Assurance santé complète',
        montantAssure: 300000,
        franchise: 3000,
        conditions: 'Couverture pour hospitalisation et médicaments prescrits, avec une franchise applicable pour chaque admission hospitalière.',
        exclusions: 'Soins dentaires à l\'exception des urgences médicales dentaires.',
        dateDebut: new Date('2021-09-01'),
        dateFin: new Date('2022-09-01')
      },
      {
        id: 5,
        numeroContrat: 'CON005',
        dateContrat: new Date('2023-03-01'),
        typeContrat: 'PERSONNE',
        couverture: 'Assurance invalidité',
        montantAssure: 400000,
        franchise: 4000,
        conditions: 'Couverture pour invalidité permanente résultant d\'un accident ou d\'une maladie, sous réserve d\'une évaluation médicale.',
        exclusions: 'Invalidité temporaire ou partielle, conditions préexistantes non déclarées.',
        dateDebut: new Date('2023-03-01'),
        dateFin: new Date('2024-03-01')
      },
      {
        id: 6,
        numeroContrat: 'CON006',
        dateContrat: new Date('2022-12-01'),
        typeContrat: 'BIEN',
        couverture: 'Assurance voiture',
        montantAssure: 600000,
        franchise: 6000,
        conditions: 'Couverture pour accidents et vol, à condition que le véhicule soit équipé d\'un dispositif antivol approuvé.',
        exclusions: 'Usure normale du véhicule, dommages causés par une utilisation inappropriée.',
        dateDebut: new Date('2022-12-01'),
        dateFin: new Date('2023-12-01')
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
    this.loading = false;
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['numeroContrat', 'dateContrat', 'couverture', 'montantAssure', 'conditions', 'exclusions', 'dateDebut', 'dateFin'];
  }

  /**
   * Assigner les valeurs aux colonnes en fonction des champs spécifiés.
   */
  protected assignColumnsValues(): void { // Ajoutez le modificateur override
    this.setColumnValues('typeContrat', this.contratTypes);
  }
}
