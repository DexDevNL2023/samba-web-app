import { Souscription } from './../../models/souscription.model';
import { PrestationService } from './../../service/prestation.service';
import { SouscriptionService } from './../../service/souscription.service';
import { SinistreService } from './../../service/sinistre.service';
import { PaiementService } from './../../service/paiement.service';
import { Authority } from './../../models/account.model';
import { PaymentType, PaymentMode, Paiement } from './../../models/paiement.model';
import { Sinistre, SinistreStatus } from './../../models/sinistre.model';
import { Prestation, PrestationStatus, PrestationType } from './../../models/prestation.model';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { MessageService } from 'primeng/api';
import { Reclamation, StatutReclamation, TypeReclamation } from '../../models/reclamation.model';
import { ReclamationService } from '../../service/reclamation.service';
import { PaymentFrequency, SubscriptionStatus } from '../../models/souscription.model';
import { GenericCrudComponent } from '../generic.crud.component';

@Component({
  selector: 'app-reclamation-crud',
  templateUrl: './../generic.crud.component.html'
})
export class ReclamationCrudComponent extends GenericCrudComponent<Reclamation> {

  // Liste pour InsuranceType
  typeReclamations = [
    { label: 'Sinistre', value: TypeReclamation.SINISTRE },
    { label: 'Prestation', value: TypeReclamation.PRESTATION }
  ];
  statutReclamations = [
    { label: 'En cours', value: StatutReclamation.EN_COURS },
    { label: 'Approuvée', value: StatutReclamation.APPROUVEE },
    { label: 'Rejetée', value: StatutReclamation.REJETEE }
  ];
  frequencies = [
    { label: 'Annuel', value: PaymentFrequency.ANNUEL },
    { label: 'Mensuel', value: PaymentFrequency.MENSUEL },
    { label: 'Semestriel', value: PaymentFrequency.SEMESTRIEL },
    { label: 'Trimestriel', value: PaymentFrequency.TRIMESTRIEL }
  ];
  souscriptiontatus = [
    { label: 'On risk', value: SubscriptionStatus.ON_RISK },
    { label: 'Resiliee', value: SubscriptionStatus.RESILIE },
    { label: 'En attente', value: SubscriptionStatus.WAITING }
  ];
  prestationTypes = [
    { label: 'Bien', value: PrestationType.BIEN },
    { label: 'Agricole', value: PrestationType.AGRICOLE },
    { label: 'Personne', value: PrestationType.PERSONNE },
    { label: 'Santé', value: PrestationType.SANTE }
  ];
  prestationStatuses = [
    { label: 'Non remboursé', value: PrestationStatus.NON_REMBOURSE },
    { label: 'En attente', value: PrestationStatus.EN_COURS },
    { label: 'Remboursé', value: PrestationStatus.REMBOURSE }
  ];
  sinistreStatuses = [
    { label: 'En cours', value: SinistreStatus.EN_COURS },
    { label: 'Approuvé', value: SinistreStatus.APPROUVE },
    { label: 'Clôturé', value: SinistreStatus.CLOTURE },
    { label: 'Rejeté', value: SinistreStatus.REJETE }
  ];
  paymentTypes = [
    { label: 'Prime', value: PaymentType.PRIME },
    { label: 'Remboursement', value: PaymentType.REMBOURSEMENT },
    { label: 'Prestation', value: PaymentType.PRESTATION }
  ];
  paymentModes = [
    { label: 'Virement bancaire', value: PaymentMode.BANK_TRANSFER },
    { label: 'Especes', value: PaymentMode.CASH },
    { label: 'PayPal', value: PaymentMode.PAYPAL },
    { label: 'Stripe', value: PaymentMode.STRIPE },
    { label: 'Moov Money', value: PaymentMode.MOOV },
    { label: 'Airtel Money', value: PaymentMode.AIRTEL }
  ];

  constructor(
    appMain: AppMainComponent,
    messageService: MessageService,
    baseService: BaseService,
    accountService: AccountService,
    fb: FormBuilder,
    reclamationService: ReclamationService,
    private prestationService: PrestationService,
    private souscriptionService: SouscriptionService,
    private sinistreService: SinistreService,
    private paiementService: PaiementService
  ) {
    super(messageService, baseService, accountService, fb, reclamationService, appMain);
    this.entityName = 'Reclamation';
    this.componentLink = '/admin/reclamations';
    this.roleKey = 'RECLAMATION_MODULE';
  }

  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected initializeColumns(): void {
    // Configuration des colonnes de la table
    this.cols = [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'numeroReclamation', header: 'Num Reclamation', type: 'text' },
      { field: 'type', header: 'Type', type: 'enum', values: this.typeReclamations, label: 'label', key: 'value', control: (item: any, event: any) => this.onTypeChange(item, event) },
      { field: 'dateReclamation', header: 'Date de reclamation', type: 'date' },
      { field: 'status', header: 'Status', type: 'enum', values: this.statutReclamations, label: 'label', key: 'value', access: [Authority.ADMIN] },
      { field: 'description', header: 'Description', type: 'textarea' },
      { field: 'montantReclame', header: 'Montant reclamé', type: 'currency' },
      { field: 'montantApprouve', header: 'Montant approuvé', type: 'currency', access: [Authority.ADMIN] },
      { field: 'dateEvaluation', header: 'Date évaluation', type: 'date', access: [Authority.ADMIN, Authority.AGENT] },
      { field: 'agentEvaluateur', header: 'Agent évaluateur', type: 'text', access: [Authority.ADMIN, Authority.AGENT] },
      { field: 'justification', header: 'Justification', type: 'textarea', access: [Authority.ADMIN, Authority.AGENT] },
      { field: 'souscription', header: 'Souscription', type: 'objet', values: [], method: () => this.loadSouscriptions(), label: 'numeroSouscription', key: 'id', subfield: [
        { field: 'id', header: 'ID', type: 'id' },
        { field: 'numeroSouscription', header: 'Num Souscription', type: 'text' },
        { field: 'dateSouscription', header: 'Date de souscription', type: 'date' },
        { field: 'dateExpiration', header: 'Date d\'expiration', type: 'date' },
        { field: 'status', header: 'Status', type: 'enum', values: this.souscriptiontatus, label: 'label', key: 'value' },
        { field: 'frequencePaiement', header: 'Frequency', type: 'enum', values:this.frequencies, label: 'label', key: 'value' }
      ]
      },
      { field: 'sinistre', header: 'Sinistre', type: 'object', values: [], method: () => this.loadSinistres(), label: 'numeroSinistre', key: 'id', subfield: [
        { field: 'id', header: 'ID', type: 'id' },
        { field: 'numeroSinistre', header: 'Num Sinistre', type: 'text' },
        { field: 'label', header: 'Libellé', type: 'text' },
        { field: 'dateDeclaration', header: 'Date de declaration', type: 'date' },
        { field: 'dateTraitement', header: 'Date de traitement', type: 'date' },
        { field: 'status', header: 'Status', type: 'enum', values: this.sinistreStatuses, label: 'label', key: 'value' }
      ]
      },
      { field: 'prestation', header: 'Prestation', type: 'object', values: [], method: () => this.loadPrestations(), label: 'typePrestation', key: 'id', subfield: [
        { field: 'id', header: 'ID', type: 'id' },
        { field: 'numeroPrestation', header: 'Num Prestation', type: 'text' },
        { field: 'label', header: 'Libellé', type: 'text' },
        { field: 'datePrestation', header: 'Date de prestation', type: 'date' },
        { field: 'type', header: 'Type', type: 'enum', values: this.prestationTypes, label: 'label', key: 'value' },
        { field: 'montant', header: 'Montant', type: 'currency' },
        { field: 'status', header: 'Status', type: 'enum', values: this.prestationStatuses, label: 'label', key: 'value' }
      ]
      },
      { field: 'paiements', header: 'Paiements', type: 'list', values: [], method: () => this.loadPaiements(), label: 'montantPaiement', key: 'id', access: [Authority.SYSTEM], subfield: [
        { field: 'id', header: 'ID', type: 'id' },
        { field: 'numeroPaiement', header: 'Num Paiement', type: 'text' },
        { field: 'datePaiement', header: 'Date du paiement', type: 'date' },
        { field: 'montant', header: 'Montant', type: 'currency' },
        { field: 'type', header: 'Type', type: 'enum', values: this.paymentTypes, label: 'label', key: 'value' },
        { field: 'mode', header: 'Mode', type: 'enum', values: this.paymentModes, label: 'label', key: 'value' }
      ]
      }
    ];
  }

  // Méthode abstraite à implémenter pour initialiser tous autres fonctions
  protected initializeOthers(): void {
    this.toggleVisibility('prestation', false);  // Masquer prestation
    this.toggleVisibility('sinistre', false);  // Masquer sinistre
  }

  // Chargement des souscriptions associés à une assure
  loadSouscriptions(): Souscription[] {
    let data: Souscription[] = [];
    this.souscriptionService.query().subscribe((data: Souscription[]) => {
      data = data;
    });
    return data;
  }

  // Chargement des sinistres associés à une prestation
  loadSinistres(): Sinistre[] {
    let data: Sinistre[] = [];
    this.sinistreService.query().subscribe((data: Sinistre[]) => {
      data = data;
    });
    return data;
  }

  // Chargement des prestations associés à une fournisseur-soin
  loadPrestations(): Prestation[] {
    let data: Prestation[] = [];
    this.prestationService.query().subscribe((data: Prestation[]) => {
      data = data;
    });
    return data;
  }

  // Chargement des reçu de paiement associés à une assure
  loadPaiements(): Paiement[] {
    let data: Paiement[] = [];
    this.paiementService.getPaiementByReclamationId(this.selectedItem.id).subscribe((data: Paiement[]) => {
      data = data;
    });
    return data;
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['numeroReclamation', 'dateReclamation', 'description'];
  }

  onTypeChange(item: any, event: any): void {
    // On récupère la valeur sélectionnée dans le dropdown (SINISTRE ou PRESTATION)
    const selectedType = event?.value;

    // Vérifier quel type de reclamation a été sélectionné
    if (selectedType === TypeReclamation.SINISTRE) {
      // Rendre visible le champ avec l'id 'sinistre' et invisible 'prestation'
      this.toggleVisibility('sinistre', true);  // Afficher sinistre
      this.toggleVisibility('prestation', false);  // Masquer prestation
    } else if (selectedType === TypeReclamation.PRESTATION) {
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
