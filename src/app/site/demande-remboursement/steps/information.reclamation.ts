import { PrestationService } from './../../../service/prestation.service';
import { SinistreService } from './../../../service/sinistre.service';
import { Sinistre } from './../../../models/sinistre.model';
import { TypeReclamation } from './../../../models/reclamation.model';
import { DemandeRemboursementService } from './../../../service/demande-remboursement.service';
import { DemandeRemboursement } from '../demande-remboursement';
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
                    <div class="p-fluid">
                        <div class="field">
                            <label for="type">Type de Réclamation</label>
                            <p-dropdown id="type" [options]="typeReclamations" placeholder="Selectionnez le type de reclamation"
                                [(ngModel)]="typeInformation" optionLabel="label" optionValue="value" [showClear]="true" appendTo="body"
                                (onChange)="updateDropdownVisibility()" />
                        </div>
                        <div class="field">
                            <label for="description">Description</label>
                            <textarea id="description" [(ngModel)]="descriptionInformation" pInputTextarea placeholder="Description" rows="5" cols="30"></textarea>
                        </div>
                        <div class="field">
                            <label for="dateReclamation">Date de Réclamation</label>
                            <p-calendar [(ngModel)]="dateReclamationInformation" dateFormat="yy-mm-dd"></p-calendar>
                        </div>
                        <div class="field">
                            <label for="montantReclame">Montant Réclamé</label>
                            <inputNumber id="montantReclame" [(ngModel)]="montantReclameInformation" mode="currency" currency="XAF"
                                currencyDisplay="symbol" [minFractionDigits]="0" [maxFractionDigits]="0" [min]="0" [max]="100000000000000000" [showButtons]="true" />
                        </div>
                        <div class="field" *ngIf="showSinistreDropdown">
                            <label for="sinistre">Sinistre</label>
                            <p-dropdown id="sinistre" [options]="sinistres" placeholder="Selectionnez le sinistre"
                                [(ngModel)]="sinistreInformation" optionLabel="numeroSinistre" optionValue="id" [showClear]="true" appendTo="body" />
                        </div>
                        <div class="field" *ngIf="showPrestationDropdown">
                            <label for="prestation">Prestation</label>
                            <p-dropdown id="prestation" [options]="prestations" placeholder="Selectionnez la prestation"
                                [(ngModel)]="prestationInformation" optionLabel="numeroPrestation" optionValue="id" [showClear]="true" appendTo="body" />
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
    typeInformation: TypeReclamation;
    descriptionInformation: string;
    dateReclamationInformation: Date;
    montantReclameInformation: number;
    sinistreInformation: number;
    prestationInformation: number;
    sinistres: Sinistre[] = [];
    prestations: Prestation[] = [];
    typeReclamations = [
        { label: 'Sinistre', value: TypeReclamation.SINISTRE },
        { label: 'Prestation', value: TypeReclamation.PRESTATION }
    ];

    showSinistreDropdown: boolean = false;
    showPrestationDropdown: boolean = false;

    constructor(public appMain: DemandeRemboursement, public demandeRemboursementService: DemandeRemboursementService, public messageService: MessageService, private router: Router, private route: ActivatedRoute, private prestationService: PrestationService, private sinistreService: SinistreService) {}

    async ngOnInit() {
        this.sinistres = await this.sinistreService.query().toPromise();
        this.prestations = await this.prestationService.query().toPromise();
        this.typeInformation = this.demandeRemboursementService.getType();
        this.descriptionInformation = this.demandeRemboursementService.getDescription();
        this.dateReclamationInformation = this.demandeRemboursementService.getDateReclamation();
        this.montantReclameInformation = this.demandeRemboursementService.getMontantReclame();
        this.sinistreInformation = this.demandeRemboursementService.getSinistre();
        this.prestationInformation = this.demandeRemboursementService.getPrestation();
        // Mise à jour de la visibilité lors de l'initialisation
        this.updateDropdownVisibility();
    }

    nextPage() {
        if (this.typeInformation && this.descriptionInformation && this.dateReclamationInformation && this.montantReclameInformation) {
            this.demandeRemboursementService.setType(this.typeInformation);
            this.demandeRemboursementService.setDescription(this.descriptionInformation);
            this.demandeRemboursementService.setDateReclamation(this.dateReclamationInformation);
            this.demandeRemboursementService.setMontantReclame(this.montantReclameInformation);
            if (this.typeInformation === TypeReclamation.SINISTRE && this.sinistreInformation) {
                this.demandeRemboursementService.setSinistre(this.sinistreInformation);
            } else if (this.typeInformation === TypeReclamation.PRESTATION && this.prestationInformation) {
                this.demandeRemboursementService.setPrestation(this.prestationInformation);
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Vous devez renseigner toutes les informations de la reclamation.'
                });
            }
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

    updateDropdownVisibility() {
        if (this.typeInformation === TypeReclamation.SINISTRE) {
            this.showSinistreDropdown = true;
            this.showPrestationDropdown = false;
        } else if (this.typeInformation === TypeReclamation.PRESTATION) {
            this.showSinistreDropdown = false;
            this.showPrestationDropdown = true;
        } else {
            this.showSinistreDropdown = false;
            this.showPrestationDropdown = false;
        }
    }
}
