import { DemandeRemboursementService } from './../../../service/demande-remboursement.service';
import { ReclamationPrestation } from './../reclamation-prestation';
import { TypeReclamation } from '../../../models/reclamation.model';
import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Prestation } from '../../../models/prestation.model';

@Component({
    template: `
        <div class="stepsdemo-content">
            <p-card>
                <ng-template pTemplate="title">Information de la reclamation</ng-template>
                <ng-template pTemplate="subtitle">Renseignez les détails de la reclamation</ng-template>
                <ng-template pTemplate="content">
                    <div class="field">
                        <label for="dateReclamation">Date de Réclamation</label>
                        <p-calendar id="dateReclamation" [(ngModel)]="dateReclamationInformation" [showIcon]="true" inputId="icon"
                            dateFormat="dd/mm/yy" [monthNavigator]="true" [yearNavigator]="true" yearRange="1900:{{ currentYear }}"
                            placeholder="Saisir la date de reclamation"></p-calendar>
                    </div>
                    <div class="p-fluid">
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
export class InformationPrestation implements OnInit {
    product: Prestation = {} as Prestation;
    typeInformation: TypeReclamation;
    descriptionInformation: string;
    dateReclamationInformation: Date;
    montantReclameInformation: number;
    prestationInformation: number;

    constructor(public appMain: ReclamationPrestation, public demandeRemboursementService: DemandeRemboursementService, public messageService: MessageService, private router: Router, private route: ActivatedRoute) {}

    async ngOnInit() {
        this.product = this.demandeRemboursementService.getProductPrestation();
        this.demandeRemboursementService.setType(TypeReclamation.PRESTATION);
        this.demandeRemboursementService.setMontantReclame(this.product.montant);
        this.demandeRemboursementService.setPrestation(this.product.id);
        if (this.product) {
            this.typeInformation = this.demandeRemboursementService.getType();
            this.descriptionInformation = this.demandeRemboursementService.getDescription();
            this.dateReclamationInformation = this.demandeRemboursementService.getDateReclamation();
            this.montantReclameInformation = this.demandeRemboursementService.getMontantReclame();
            this.prestationInformation = this.demandeRemboursementService.getPrestation();
        }
    }

    nextPage() {
        if (this.typeInformation && this.descriptionInformation && this.dateReclamationInformation && this.montantReclameInformation) {
            this.demandeRemboursementService.setType(this.typeInformation);
            this.demandeRemboursementService.setDescription(this.descriptionInformation);
            this.demandeRemboursementService.setDateReclamation(this.dateReclamationInformation);
            this.demandeRemboursementService.setMontantReclame(this.montantReclameInformation);
            this.demandeRemboursementService.setPrestation(this.prestationInformation);
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
