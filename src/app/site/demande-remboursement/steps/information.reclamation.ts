import { Sinistre } from './../../../models/sinistre.model';
import { TypeReclamation } from './../../../models/reclamation.model';
import { DemandeRemboursementService } from './../../../service/demande-remboursement.service';
import { DemandeRemboursement } from '../demande-remboursement';
import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    template: `
        <div class="stepsdemo-content">
            <p-card>
                <ng-template pTemplate="title">Information de la reclamation</ng-template>
                <ng-template pTemplate="subtitle">Renseignez les détails de la reclamation</ng-template>
                <ng-template pTemplate="content">
                    <div class="p-fluid">
                        <div class="field">
                            <label for="dateReclamation">Date de Réclamation</label>
                            <p-calendar id="dateReclamation" [(ngModel)]="dateReclamationInformation" [showIcon]="true" inputId="icon"
                                dateFormat="dd/mm/yy" [monthNavigator]="true" [yearNavigator]="true" yearRange="1900:{{ currentYear }}"
                                placeholder="Saisir la date de reclamation"></p-calendar>
                        </div>
                        <div class="field">
                            <label for="description">Description</label>
                            <textarea id="description" [(ngModel)]="descriptionInformation" pInputTextarea placeholder="Description" rows="5" cols="30"></textarea>
                        </div>
                    </div>
                </ng-template>
                <ng-template pTemplate="footer">
                    <div class="grid grid-nogutter justify-content-end">
                        <p-button label="Suivant" (onClick)="nextPage()" icon="pi pi-angle-right" iconPos="right" [raised]="true" [rounded]="true" styleClass="p-button-info" />
                    </div>
                </ng-template>
            </p-card>
        </div>
    `
})
export class InformationReclamation implements OnInit {
    product: Sinistre = {} as Sinistre;
    typeInformation: TypeReclamation;
    descriptionInformation: string;
    dateReclamationInformation: Date;
    montantReclameInformation: number;
    sinistreInformation: number;

    constructor(public appMain: DemandeRemboursement, public demandeRemboursementService: DemandeRemboursementService, public messageService: MessageService, private router: Router, private route: ActivatedRoute) {}

    ngOnInit() {
        // Récupérer le produit sinistre
        this.product = this.demandeRemboursementService.getProductSinistre();
        console.log('Produit sinistre récupéré:', this.product);

        // Définir le type de réclamation
        this.demandeRemboursementService.setType(TypeReclamation.SINISTRE);
        console.log('Type de réclamation défini:', TypeReclamation.SINISTRE);

        // Définir le montant réclamé
        this.demandeRemboursementService.setMontantReclame(this.product.montantSinistre);
        console.log('Montant réclamé défini:', this.product.montantSinistre);

        // Définir le sinistre
        this.demandeRemboursementService.setSinistre(this.product.id);
        console.log('Sinistre défini:', this.product.id);

        if (this.product) {
            // Récupérer les informations
            this.typeInformation = this.demandeRemboursementService.getType();
            console.log('Type d\'information:', this.typeInformation);

            this.descriptionInformation = this.demandeRemboursementService.getDescription();
            console.log('Description d\'information:', this.descriptionInformation);

            this.dateReclamationInformation = this.demandeRemboursementService.getDateReclamation();
            console.log('Date de réclamation:', this.dateReclamationInformation);

            this.montantReclameInformation = this.demandeRemboursementService.getMontantReclame();
            console.log('Montant réclamé:', this.montantReclameInformation);

            this.sinistreInformation = this.demandeRemboursementService.getSinistre();
            console.log('Information sur le sinistre:', this.sinistreInformation);
        } else {
            console.warn('Aucun produit sinistre trouvé.');
        }
    }

    nextPage() {
        if (this.typeInformation && this.descriptionInformation && this.dateReclamationInformation && this.montantReclameInformation) {
            this.demandeRemboursementService.setType(this.typeInformation);
            this.demandeRemboursementService.setDescription(this.descriptionInformation);
            this.demandeRemboursementService.setDateReclamation(this.dateReclamationInformation);
            this.demandeRemboursementService.setMontantReclame(this.montantReclameInformation);
            this.demandeRemboursementService.setSinistre(this.sinistreInformation);
            // Utilisation de la navigation relative
            this.router.navigate(['../confirmation'], { relativeTo: this.route }).then(() => {
                this.appMain.updateCurrentStep();
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Vous devez renseigner toutes les informations de la reclamation.'
            });
        }
    }
}
