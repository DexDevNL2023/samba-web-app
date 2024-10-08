import { GenericUtils } from './../../utilities/generic-utils';
import { Assure } from './../../models/assure.model';
import { AssureService } from './../../service/assure.service';
import { Authority } from './../../models/account.model';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { MessageService } from 'primeng/api';
import { DossierMedical } from '../../models/dossier-medical.model';
import { DossierMedicalService } from '../../service/dossier-medical.service';
import { GenericCrudComponent } from '../generic.crud.component';

@Component({
  selector: 'app-medical-record-crud',
  templateUrl: './../generic.crud.component.html'
})
export class DossierMedicalCrudComponent extends GenericCrudComponent<DossierMedical> {

  constructor(
    appMain: AppMainComponent,
    messageService: MessageService,
    baseService: BaseService,
    accountService: AccountService,
    fb: FormBuilder,
    dossierMedicalService: DossierMedicalService,
    private assureService: AssureService
  ) {
    super(messageService, baseService, accountService, fb, dossierMedicalService, appMain);
    this.entityName = 'Dossier medical';
    this.componentLink = '/admin/dossiers/medicaux';
    this.roleKey = 'DOCUMENT_MODULE';
  }

  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'numDossierMedical', header: 'Reference Dossier médical', type: 'text' },
      { field: 'patient', header: 'Patient', type: 'objet', values: [], method: () => this.loadPatients(), label: 'numNiu', key: 'id', access: [Authority.ADMIN, Authority.AGENT, Authority.CLIENT], subfield: [
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

  // Méthode abstraite à implémenter pour initialiser tous autres fonctions
  protected initializeOthers(): void {
    this.formGroup.get('numDossierMedical')?.setValue(GenericUtils.GenerateNumero("DOSS"));
  }

  // Chargement des polices associés à une medical-record
  async loadPatients(): Promise<Assure[]> {
      try {
          return await this.assureService.query().toPromise();
      } catch (error) {
          return [];
      }
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['numDossierMedical', 'patient'];
  }
}
