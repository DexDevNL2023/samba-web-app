import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { MessageService } from 'primeng/api';
import { DossierMedical } from '../../models/medical-record.model';
import { MedicalRecordService } from '../../service/medical-record.service';
import { Assure, Gender } from '../../models/assure.model';
import { GenericCrudComponent } from '../generic.crud.component';

@Component({
  selector: 'app-medical-record-crud',
  templateUrl: './../generic.crud.component.html'
})
export class DossierMedicalCrudComponent extends GenericCrudComponent<DossierMedical> {
  patients: Assure[] = [
    {
      id: 1,
      numNiu: 'NIU001',
      lastName: 'Dupont',
      firstName: 'Jean',
      email: 'jean.dupont@example.com',
      dateNaissance: new Date('1980-05-20'),
      numCni: 'CNI123456',
      sexe: Gender.MALE,
      telephone: '+241612345678',
      addresse: '123 Rue Principale, Libreville, Gabon',
      signature: 'signature001.png',
      registrant: 1,
      dossiers: [1, 2],
      souscriptions: [1, 2]
    },
    {
      id: 2,
      numNiu: 'NIU002',
      lastName: 'Ngoma',
      firstName: 'Marie',
      email: 'marie.ngoma@example.com',
      dateNaissance: new Date('1990-07-15'),
      numCni: 'CNI789012',
      sexe: Gender.FEMALE,
      telephone: '+241623456789',
      addresse: '456 Avenue de la Paix, Port-Gentil, Gabon',
      signature: 'signature002.png',
      registrant: 2,
      dossiers: [3],
      souscriptions: [3]
    },
    {
      id: 3,
      numNiu: 'NIU003',
      lastName: 'Moukagni',
      firstName: 'Paul',
      email: 'paul.moukagni@example.com',
      dateNaissance: new Date('1975-03-10'),
      numCni: 'CNI345678',
      sexe: Gender.MALE,
      telephone: '+241634567890',
      addresse: '789 Boulevard des Nations, Franceville, Gabon',
      signature: 'signature003.png',
      registrant: 3,
      dossiers: [4],
      souscriptions: [4, 5]
    }
  ];

  constructor(
    appMain: AppMainComponent,
    messageService: MessageService,
    baseService: BaseService,
    accountService: AccountService,
    fb: FormBuilder,
    private medicalRecordService: MedicalRecordService
  ) {
    super(messageService, baseService, accountService, fb, medicalRecordService, appMain);
    this.entityName = 'Dossier medical';
    this.componentLink = '/admin/dossiers/medicaux';
    this.importLink = '/import/dossiers/medicaux';
    this.roleKey = 'DOCUMENT_MODULE';
    this.isTable = true;
  }
  
  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'numDossierMedical', header: 'Num Dossier médical', type: 'text' },
      { field: 'patient', header: 'Patient', type: 'objet', values: [], label: 'numNiu', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numNiu', header: 'Niu', type: 'text' },
          { field: 'firstName', header: 'Nom', type: 'text' },
          { field: 'lastName', header: 'Prénom', type: 'text' },
          { field: 'addresse', header: 'Addresse', type: 'textarea' }
        ]
      },
      { field: 'dateUpdated', header: 'Dernière mise à jour', type: 'date' },
      { field: 'maladiesChroniques', header: 'Maladies chroniques', type: 'textarea' },
      { field: 'maladiesHereditaires', header: 'Maladies hereditaires', type: 'textarea' },
      { field: 'interventionsChirurgicales', header: 'Interventions chirurgicales', type: 'textarea' },
      { field: 'hospitalisations', header: 'Hospitalisations', type: 'textarea' },
      { field: 'allergies', header: 'Allergies', type: 'textarea' },
      { field: 'vaccins', header: 'Vaccins', type: 'textarea' },
      { field: 'habitudesAlimentaires', header: 'Habitudes alimentaires', type: 'textarea' },
      { field: 'consommationAlcool', header: 'Consommation alcool', type: 'textarea' },
      { field: 'consommationTabac', header: 'Consommation tabac', type: 'textarea' },
      { field: 'niveauActivitePhysique', header: 'Niveau activite physique', type: 'textarea' },
      { field: 'revenusAnnuels', header: 'Revenus annuels', type: 'currency' },
      { field: 'chargesFinancieres', header: 'Charges financieres', type: 'currency' },
      { field: 'declarationBonneSante', header: 'Declaration bonne sante', type: 'boolean' },
      { field: 'consentementCollecteDonnees', header: 'Consentement collecte données', type: 'boolean' },
      { field: 'declarationNonFraude', header: 'Declaration non-fraude', type: 'boolean' }
    ];
  }

  // Méthode abstraite à implémenter pour initialiser les données des colonnes de la table
  protected initializeColumnsData(): void {
    this.items = [
      {
        id: 1,
        numDossierMedical: 'DM123456',
        patient: 1,
        dateUpdated: new Date('2023-07-15'),
        maladiesChroniques: 'Hypertension, Diabète',
        maladiesHereditaires: 'Maladie cardiaque',
        interventionsChirurgicales: 'Appendicectomie en 2018',
        hospitalisations: 'Hospitalisation pour pneumonie en 2020',
        allergies: 'Allergie aux arachides',
        vaccins: 'Vaccin contre la grippe, Vaccin contre l\'hépatite B',
        habitudesAlimentaires: 'Régime équilibré, riche en fruits et légumes',
        consommationAlcool: 'Occasionnelle',
        consommationTabac: 'Non-fumeur',
        niveauActivitePhysique: 'Modéré, 3 fois par semaine',
        revenusAnnuels: 35000,
        chargesFinancieres: 15000,
        declarationBonneSante: true,
        consentementCollecteDonnees: true,
        declarationNonFraude: true,
      },
      {
        id: 2,
        numDossierMedical: 'DM654321',
        patient: 2,
        dateUpdated: new Date('2023-07-20'),
        maladiesChroniques: 'Asthme',
        maladiesHereditaires: 'Diabète',
        interventionsChirurgicales: 'Chirurgie du genou en 2015',
        hospitalisations: 'Hospitalisation pour crise d\'asthme en 2019',
        allergies: 'Aucune connue',
        vaccins: 'Vaccin contre la rougeole, Vaccin contre la rubéole',
        habitudesAlimentaires: 'Régime pauvre en glucides',
        consommationAlcool: 'Modérée',
        consommationTabac: 'Non-fumeur',
        niveauActivitePhysique: 'Intense, 5 fois par semaine',
        revenusAnnuels: 50000,
        chargesFinancieres: 20000,
        declarationBonneSante: true,
        consentementCollecteDonnees: true,
        declarationNonFraude: true,
      },
      {
        id: 3,
        numDossierMedical: 'DM789012',
        patient: 3,
        dateUpdated: new Date('2023-07-25'),
        maladiesChroniques: 'Aucune',
        maladiesHereditaires: 'Hypertension',
        interventionsChirurgicales: 'Aucune',
        hospitalisations: 'Hospitalisation pour fracture du bras en 2017',
        allergies: 'Allergie aux antibiotiques',
        vaccins: 'Vaccin contre la polio, Vaccin contre la varicelle',
        habitudesAlimentaires: 'Régime végétarien',
        consommationAlcool: 'Non',
        consommationTabac: 'Non-fumeur',
        niveauActivitePhysique: 'Léger, 1 fois par semaine',
        revenusAnnuels: 45000,
        chargesFinancieres: 18000,
        declarationBonneSante: true,
        consentementCollecteDonnees: true,
        declarationNonFraude: true,
      },
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
    this.loadPatients();
    this.loading = false;
  }
  
  // Chargement des polices associés à une medical-record
  loadPatients(): void {
    this.medicalRecordService.getAllPatients().subscribe((patients: Assure[]) => {
        this.patients = patients;
    });
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['numDossierMedical', 'patient'];
  }

  /**
   * Assigner les valeurs aux colonnes en fonction des champs spécifiés.
   */
  protected assignColumnsValues(): void { // Ajoutez le modificateur override
    this.setColumnValues('patient', this.patients);
  }
}
