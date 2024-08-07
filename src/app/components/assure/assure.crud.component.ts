import { Component } from '@angular/core';
import { Assure, Gender } from '../../models/assure.model';
import { LiteRegistrant } from '../../models/lite.registrant.model';
import { DossierMedical } from '../../models/medical-record.model';
import { PaymentFrequency, Souscription, SubscriptionStatus } from '../../models/souscription.model';
import { Fournisseur } from '../../models/fournisseur.model';
import { Branche } from '../../models/branche.model';
import { AppMainComponent } from '../../app.main.component';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { GenericCrudComponent } from '../generic.crud.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { AssureService } from '../../service/assure.service';

@Component({
  selector: 'app-assure-crud',
  templateUrl: './../generic.crud.component.html'
})
export class AssureCrudComponent extends GenericCrudComponent<Assure> {
  registrants: LiteRegistrant[] = [
    {
      id: 1,
      numeroRegistrant: 'S001',
      branche: 1,
      partenaire: 2
    },
    {
      id: 2,
      numeroRegistrant: 'S002',
      branche: 2,
      partenaire: 1
    }
  ];
  dossiers: DossierMedical[] = [
    {
      id: 1,
      numDossierMedical: 'DM001',
      patient: 1,
      dateUpdated: new Date('2024-07-01'),
      maladiesChroniques: 'Hypertension, Diabète',
      maladiesHereditaires: 'Cardiopathie',
      interventionsChirurgicales: 'Appendicectomie en 2010',
      hospitalisations: 'Hospitalisation pour fracture en 2018',
      allergies: 'Allergie aux arachides',
      vaccins: 'Vaccin contre la grippe en 2023',
      habitudesAlimentaires: 'Régime pauvre en sel',
      consommationAlcool: 'Occasionnelle',
      consommationTabac: 'Non fumeur',
      niveauActivitePhysique: 'Modéré',
      revenusAnnuels: 5000000,
      chargesFinancieres: 2000000,
      declarationBonneSante: true,
      consentementCollecteDonnees: true,
      declarationNonFraude: true
    },
    {
      id: 2,
      numDossierMedical: 'DM002',
      patient: 2,
      dateUpdated: new Date('2024-07-02'),
      maladiesChroniques: 'Asthme',
      maladiesHereditaires: 'Aucune',
      interventionsChirurgicales: 'Chirurgie des amygdales en 2015',
      hospitalisations: 'Aucune',
      allergies: 'Aucune',
      vaccins: 'Vaccin contre la grippe en 2022',
      habitudesAlimentaires: 'Alimentation équilibrée',
      consommationAlcool: 'Jamais',
      consommationTabac: 'Non fumeur',
      niveauActivitePhysique: 'Élevé',
      revenusAnnuels: 6000000,
      chargesFinancieres: 2500000,
      declarationBonneSante: true,
      consentementCollecteDonnees: true,
      declarationNonFraude: true
    },
    {
      id: 3,
      numDossierMedical: 'DM003',
      patient: 3,
      dateUpdated: new Date('2024-07-03'),
      maladiesChroniques: 'Aucune',
      maladiesHereditaires: 'Diabète',
      interventionsChirurgicales: 'Aucune',
      hospitalisations: 'Hospitalisation pour grippe sévère en 2019',
      allergies: 'Allergie au pollen',
      vaccins: 'Vaccin contre la grippe en 2021',
      habitudesAlimentaires: 'Végétarien',
      consommationAlcool: 'Modérée',
      consommationTabac: 'Non fumeur',
      niveauActivitePhysique: 'Faible',
      revenusAnnuels: 4000000,
      chargesFinancieres: 1500000,
      declarationBonneSante: true,
      consentementCollecteDonnees: true,
      declarationNonFraude: true
    },
    {
      id: 4,
      numDossierMedical: 'DM004',
      patient: 4,
      dateUpdated: new Date('2024-07-04'),
      maladiesChroniques: 'Aucune',
      maladiesHereditaires: 'Hypertension',
      interventionsChirurgicales: 'Chirurgie du genou en 2020',
      hospitalisations: 'Aucune',
      allergies: 'Aucune',
      vaccins: 'Vaccin contre la grippe en 2020',
      habitudesAlimentaires: 'Régime riche en fibres',
      consommationAlcool: 'Occasionnelle',
      consommationTabac: 'Fumeur occasionnel',
      niveauActivitePhysique: 'Modéré',
      revenusAnnuels: 7000000,
      chargesFinancieres: 3000000,
      declarationBonneSante: true,
      consentementCollecteDonnees: true,
      declarationNonFraude: true
    }
  ];
  souscriptions: Souscription[] = [
    {
      id: 1,
      numeroSouscription: 'SUB001',
      dateSouscription: new Date('2023-01-01'),
      dateExpiration: new Date('2024-01-01'),
      status: 'ACTIVE',
      frequencePaiement: 'MENSUEL',
      assure: 1,
      police: 1,
      paiements: [1, 2, 3],
      sinistres: [1, 2]
    },
    {
      id: 2,
      numeroSouscription: 'SUB002',
      dateSouscription: new Date('2022-06-01'),
      dateExpiration: new Date('2023-06-01'),
      status: 'ON_RISK',
      frequencePaiement: 'ANNUEL',
      assure: 2,
      police: 2,
      paiements: [4],
      sinistres: [3]
    },
    {
      id: 3,
      numeroSouscription: 'SUB003',
      dateSouscription: new Date('2024-02-15'),
      dateExpiration: new Date('2025-02-15'),
      status: 'WAITING',
      frequencePaiement: 'TRIMESTRIEL',
      assure: 3,
      police: 3,
      paiements: [5, 6],
      sinistres: []
    },
    {
      id: 4,
      numeroSouscription: 'SUB004',
      dateSouscription: new Date('2021-09-01'),
      dateExpiration: new Date('2022-09-01'),
      status: 'RESILIE',
      frequencePaiement: 'SEMESTRIEL',
      assure: 4,
      police: 4,
      paiements: [7, 8],
      sinistres: [4]
    }
  ];
  allBranches: Branche[] = [
    {
      id: 1,
      code: 'DLA',
      ville: 'Branche Douala',
      isDefaut: false,
      partenaires: [1,4,5]
    },
    {
      id: 2,
      code: 'YAE',
      ville: 'Branche Yaounde',
      isDefaut: true,
      partenaires: [2,3]
    }
  ];
  partenaires: Fournisseur[] = [
    {
      id: 1,
      nom: 'Clinique Santé Plus',
      telephone: '123456789',
      email: 'contact@santeplus.com',
      adresse: '123 Rue de la Santé, Libreville - Gabon',
      servicesFournis: 'Consultations, Soins Paramédicaux',
      prestations: [1, 2],
      branches: [1]
    },
    {
      id: 2,
      nom: 'Centre Médical Bongo',
      telephone: '987654321',
      email: 'info@cmbongo.com',
      adresse: '456 Rue de la Médecine, Port-Gentil - Gabon',
      servicesFournis: 'Radiologie, Analyses de Laboratoire',
      prestations: [3, 4],
      branches: [2]
    }
  ]; 

  // Liste pour Gender
  genders = [
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' },
    { label: 'Other', value: 'OTHER' }
  ];
  frequencies = [
    { label: 'Annuel', value: PaymentFrequency.ANNUEL },
    { label: 'Mensuel', value: PaymentFrequency.MENSUEL },
    { label: 'Semestriel', value: PaymentFrequency.SEMESTRIEL },
    { label: 'Trimestriel', value: PaymentFrequency.TRIMESTRIEL }
  ];
  status = [
    { label: 'Activee', value: SubscriptionStatus.ACTIVE },
    { label: 'On risk', value: SubscriptionStatus.ON_RISK },
    { label: 'Resiliee', value: SubscriptionStatus.RESILIE },
    { label: 'En attente', value: SubscriptionStatus.WAITING }
  ];

  constructor(
    appMain: AppMainComponent,
    messageService: MessageService,
    baseService: BaseService,
    accountService: AccountService,
    fb: FormBuilder,
    private assureService: AssureService
  ) {
    super(messageService, baseService, accountService, fb, assureService, appMain);
    this.entityName = 'Assuré';
    this.componentLink = '/admin/assures';
    this.importLink = '/import-assure';
    this.moduleKey = 'ASSURE_MODULE';
    this.isTable = true;
  }
  
  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'numNiu', header: 'Niu', type: 'text' },
      { field: 'firstName', header: 'Nom', type: 'text' },
      { field: 'lastName', header: 'Prénom', type: 'text' },
      { field: 'dateNaissance', header: 'Né(e) le', type: 'date' },
      { field: 'numCni', header: 'CNI', type: 'text' },
      { field: 'sexe', header: 'Sexe', type: 'enum', values: [], label: 'label', key: 'value' },
      { field: 'email', header: 'Email', type: 'text' },
      { field: 'telephone', header: 'Telephone', type: 'text' },
      { field: 'addresse', header: 'Addresse', type: 'textarea' },
      { field: 'signature', header: 'Signature', type: 'image' },
      { field: 'registrant', header: 'Registrant', type: 'objet', values: [], label: 'numeroRegistrant', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroRegistrant', header: 'Num Registrant', type: 'text' },
          { field: 'branche', header: 'Branche', type: 'objet', values: [], label: 'ville', key: 'id' },
          { field: 'partenaire', header: 'Partenaire', type: 'objet', values: [], label: 'nom', key: 'id' }
        ]
      },
      { field: 'dossiers', header: 'Dossiers médicaux', type: 'list', values: [], label: 'numDossierMedical', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numDossierMedical', header: 'Num Dossier medical', type: 'text' },
          { field: 'dateUpdated', header: 'Dernière mise à jour', type: 'date' },
        ]
      },
      { field: 'souscriptions', header: 'Souscriptions', type: 'list', values: [], label: 'numeroSouscription', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroSouscription', header: 'Num Souscription', type: 'text' },
          { field: 'dateSouscription', header: 'Date de souscription', type: 'date' },
          { field: 'dateExpiration', header: 'Date d\'expiration', type: 'date' },
          { field: 'status', header: 'Status', type: 'enum', values: [], label: 'label', key: 'value' },
          { field: 'frequencePaiement', header: 'Frequency', type: 'enum', values: [], label: 'label', key: 'value' }
        ]
      }
    ];
  }

  // Méthode abstraite à implémenter pour initialiser les données des colonnes de la table
  protected initializeColumnsData(): void {
    this.items = [
      {
        id: 1,
        numNiu: 'NIU123456789',
        lastName: 'Doe',
        firstName: 'John',
        dateNaissance: new Date('1985-01-15'),
        numCni: 'CNI12345678',
        sexe: Gender.MALE,
        email: 'john.doe@example.com',
        telephone: '1234567890',
        addresse: '123 Main St, Douala',
        signature: 'john_doe_signature.png',
        registrant: 1,
        dossiers: [1],
        souscriptions: [4]
      },
      {
        id: 2,
        numNiu: 'NIU987654321',
        lastName: 'Smith',
        firstName: 'Jane',
        dateNaissance: new Date('1990-07-22'),
        numCni: 'CNI87654321',
        sexe: Gender.FEMALE,
        email: 'jane.smith@example.com',
        telephone: '0987654321',
        addresse: '456 Elm St, Yaoundé',
        signature: 'jane_smith_signature.png',
        registrant: 2,
        dossiers: [2],
        souscriptions: [1]
      },
      {
        id: 3,
        numNiu: 'NIU555555555',
        lastName: 'Nguyen',
        firstName: 'Thi',
        dateNaissance: new Date('1988-03-12'),
        numCni: 'CNI55555555',
        sexe: Gender.FEMALE,
        email: 'thi.nguyen@example.com',
        telephone: '5555555555',
        addresse: '789 Maple St, Bafoussam',
        signature: 'thi_nguyen_signature.png',
        registrant: 1,
        dossiers: [3],
        souscriptions: [3]
      },
      {
        id: 4,
        numNiu: 'NIU333333333',
        lastName: 'Johnson',
        firstName: 'Chris',
        dateNaissance: new Date('1995-09-25'),
        numCni: 'CNI33333333',
        sexe: Gender.OTHER,
        email: 'chris.johnson@example.com',
        telephone: '3333333333',
        addresse: '321 Oak St, Garoua',
        signature: 'chris_johnson_signature.png',
        registrant: 2,
        dossiers: [4],
        souscriptions: [2]
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
    this.loadRegistrants();
    this.loadSouscriptions();
    this.loadDossiers();
    this.loadBranches();
    this.loadPartenaires();
    this.loading = false;
  }

  // Chargement aux registrants associés à une assure
  loadRegistrants(): void {
    this.assureService.getAllRegistrants().subscribe((registrants: LiteRegistrant[]) => {
        this.registrants = registrants;
    });
  }

  // Chargement des souscriptions associés à une assure
  loadSouscriptions(): void {
    this.assureService.getAllSouscriptions().subscribe((souscriptions: Souscription[]) => {
        this.souscriptions = souscriptions;
    });
  }
  
  // Chargement des dossiers médicaux associés à une assure
  loadDossiers(): void {
    this.assureService.getAllDossiers().subscribe((dossiers: DossierMedical[]) => {
        this.dossiers = dossiers;
    });
  }

  // Chargement des prestations associés à une fournisseur-soin
  loadBranches(): void {
    this.assureService.getAllBranches().subscribe((branches: Branche[]) => {
        this.allBranches = branches;
    });
  }
  
  // Chargement des polices associés à une branche
  loadPartenaires(): void {
    this.assureService.getAllPartners().subscribe((partenaires: Fournisseur[]) => {
        this.partenaires = partenaires;
    });
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] {
    return ['numNiu', 'lastName', 'dateNaissance', 'numCni', 'email'];
  }

  /**
   * Assigner les valeurs aux colonnes en fonction des champs spécifiés.
   */
 protected assignColumnsValues(): void {
    this.setColumnValues('registrant', this.registrants);
    this.setSubFieldValues('registrant', 'branche', this.allBranches);
    this.setSubFieldValues('registrant', 'partenaire', this.partenaires);
    this.setColumnValues('dossiers', this.dossiers);
    this.setColumnValues('souscriptions', this.souscriptions);
    this.setSubFieldValues('souscriptions', 'status', this.status);
    this.setSubFieldValues('souscriptions', 'frequencePaiement', this.frequencies);
  }
}
