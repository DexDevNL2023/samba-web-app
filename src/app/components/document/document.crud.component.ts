import { ToastService } from './../../service/toast.service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { MessageService } from 'primeng/api';
import { Document } from '../../models/document.model';
import { DocumentService } from '../../service/document.service';
import { GenericCrudComponent } from '../generic.crud.component';

@Component({
  selector: 'app-document-sinistre-crud',
  templateUrl: './../generic.crud.component.html'
})
export class DocumentCrudComponent extends GenericCrudComponent<Document> {
  
  constructor(
    appMain: AppMainComponent,
    messageService: MessageService,
    baseService: BaseService,
    accountService: AccountService,
    fb: FormBuilder,
    toastService: ToastService,
    cdr: ChangeDetectorRef,
    private documentService: DocumentService
  ) {
    super(toastService, messageService, cdr, baseService, accountService, fb, documentService, appMain);
    this.entityName = 'Document';
    this.componentLink = '/admin/documents';
    this.importLink = '/import/documents';
    this.roleKey = 'DOCUMENT_MODULE';
  }
  
  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'numeroDocument', header: 'Num Document', type: 'text' },
      { field: 'nom', header: 'Nom', type: 'text' },
      { field: 'description', header: 'description', type: 'textarea' },
      { field: 'url', header: 'Telecharger', type: 'url' }
    ];
  }

  // Méthode abstraite à implémenter pour initialiser les données des colonnes de la table
  protected initializeColumnsData(): void {
    this.items = [
      {
        id: 1,
        numeroDocument: 'DOC-001',
        nom: 'Photo du Sinistre',
        description: 'Photo montrant les dommages causés par l\'accident',
        url: 'http://example.com/photo-sinistre.jpg'
      },
      {
        id: 2,
        numeroDocument: 'DOC-002',
        nom: 'Vidéo du Sinistre',
        description: 'Vidéo enregistrée par une caméra de surveillance',
        url: 'http://example.com/video-sinistre.mp4'
      },
      {
        id: 3,
        numeroDocument: 'DOC-003',
        nom: 'Facture de Réparation',
        description: 'Facture des coûts de réparation des dommages',
        url: 'http://example.com/facture-reparation.pdf'
      },
      {
        id: 4,
        numeroDocument: 'DOC-004',
        nom: 'Rapport Médical',
        description: 'Rapport médical décrivant les blessures subies',
        url: 'http://example.com/rapport-medical.pdf'
      }
    ];
    this.loading = false;
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['nom', 'url'];
  }

  /**
   * Assigner les valeurs aux colonnes en fonction des champs spécifiés.
   */
  protected assignColumnsValues(): void { // Ajoutez le modificateur override
  }
}
