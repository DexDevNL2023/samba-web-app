import { Prestation } from './../../models/prestation.model';
import { Sinistre } from './../../models/sinistre.model';
import { PrestationService } from './../../service/prestation.service';
import { SinistreService } from './../../service/sinistre.service';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { MessageService } from 'primeng/api';
import { Document, TypeDocument } from '../../models/document.model';
import { DocumentService } from '../../service/document.service';
import { GenericCrudComponent } from '../generic.crud.component';

@Component({
  selector: 'app-document-sinistre-crud',
  templateUrl: './../generic.crud.component.html'
})
export class DocumentCrudComponent extends GenericCrudComponent<Document> {

  // Liste pour InsuranceType
  typeDocuments = [
    { label: 'Document de sinistre', value: TypeDocument.SINISTRE },
    { label: 'Document de prestation', value: TypeDocument.PRESTATION }
  ];

  constructor(
    appMain: AppMainComponent,
    messageService: MessageService,
    baseService: BaseService,
    accountService: AccountService,
    fb: FormBuilder,
    documentService: DocumentService,
    private sinistreService: SinistreService,
    private prestationService: PrestationService
  ) {
    super(messageService, baseService, accountService, fb, documentService, appMain);
    this.entityName = 'Document';
    this.componentLink = '/admin/documents';
    this.roleKey = 'DOCUMENT_MODULE';
  }

  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'numeroDocument', header: 'Num Document', type: 'text' },
      { field: 'nom', header: 'Nom', type: 'text' },
      { field: 'type', header: 'Type', type: 'enum', values: this.typeDocuments, label: 'label', key: 'value', control: (item: any, event: any) => this.onTypeChange(item, event) },
      { field: 'description', header: 'description', type: 'textarea' },
      { field: 'url', header: 'Telecharger', type: 'url' },
      { field: 'sinistre', header: 'Sinistre', type: 'objet', values: [], method: () => this.loadSinistres(), label: 'numeroSinistre', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroSinistre', header: 'Num Sinistre', type: 'text' },
          { field: 'dateSurvenance', header: 'Date de survenance', type: 'date' },
          { field: 'montantSinistre', header: 'Montant', type: 'currency' }
        ]
      },
      { field: 'prestation', header: 'Prestation', type: 'objet', values: [], method: () => this.loadPrestations(), label: 'numeroPrestation', key: 'id', subfield: [
          { field: 'id', header: 'ID', type: 'id' },
          { field: 'numeroPrestation', header: 'Num Prestation', type: 'text' },
          { field: 'datePrestation', header: 'Date de prestation', type: 'date' },
          { field: 'montant', header: 'Montant', type: 'currency' }
        ]
      }
    ];
  }

  // Méthode abstraite à implémenter pour initialiser tous autres fonctions
  protected initializeOthers(): void {
    this.toggleVisibility('prestation', false);  // Masquer prestation
    this.toggleVisibility('sinistre', false);  // Masquer sinistre
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['nom', 'url'];
  }

  // Chargement des assures associés à une souscription
  async loadSinistres(): Promise<Sinistre[]> {
      try {
          return await this.sinistreService.query().toPromise();
      } catch (error) {
          return [];
      }
  }

  // Chargement des polices associés à une souscription
  async loadPrestations(): Promise<Prestation[]> {
      try {
          return await this.prestationService.query().toPromise();
      } catch (error) {
          return [];
      }
  }

  onTypeChange(item: any, event: any): void {
    // On récupère la valeur sélectionnée dans le dropdown (SINISTRE ou PRESTATION)
    const selectedType = event?.value;

    // Vérifier quel type de document a été sélectionné
    if (selectedType === TypeDocument.SINISTRE) {
      // Rendre visible le champ avec l'id 'sinistre' et invisible 'prestation'
      this.toggleVisibility('sinistre', true);  // Afficher sinistre
      this.toggleVisibility('prestation', false);  // Masquer prestation
    } else if (selectedType === TypeDocument.PRESTATION) {
      // Rendre visible le champ avec l'id 'prestation' et invisible 'sinistre'
      this.toggleVisibility('prestation', true);  // Afficher prestation
      this.toggleVisibility('sinistre', false);  // Masquer sinistre
    }
  }

  // Méthode pour basculer la visibilité d'un élément en utilisant son id
  toggleVisibility(fieldId: string, isVisible: boolean): void {
    const element = document.getElementById(fieldId) as HTMLSelectElement;
    if (element) {
      // Si l'élément est trouvé, modifier sa visibilité
      element.style.display = isVisible ? 'block' : 'none';
    }
  }
}
