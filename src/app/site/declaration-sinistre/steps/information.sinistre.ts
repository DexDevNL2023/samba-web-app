import { DeclareSinistreService } from '../../../service/declare-sinistre.service';
import { DeclarationSinistre } from '../declaration-sinistre';
import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    template: `
        <div class="stepsdemo-content">
            <p-card>
                <ng-template pTemplate="title">Information du sinistre</ng-template>
                <ng-template pTemplate="subtitle">Renseignez les détails du sinistre</ng-template>
                <ng-template pTemplate="content">
                    <div class="p-fluid">
                        <div class="field">
                            <label for="label">Libellé du sinistre</label>
                            <input id="label" [(ngModel)]="labelInformation" pInputText placeholder="Libellé" />
                        </div>
                        <div class="field">
                            <label for="raison">Raison</label>
                            <textarea id="raison" [(ngModel)]="raisonInformation" pInputTextarea placeholder="Raison" rows="5" cols="30"></textarea>
                        </div>
                        <div class="field">
                            <label for="dateSurvenance">Date de survenance</label>
                            <p-calendar [(ngModel)]="dateSurvenanceInformation" dateFormat="yy-mm-dd"></p-calendar>
                        </div>
                        <div class="field">
                            <label for="montant">Montant du sinistre</label>
                            <inputNumber id="montant" [(ngModel)]="montantSinistreInformation" mode="currency" currency="XAF"
                                currencyDisplay="symbol" [minFractionDigits]="0" [maxFractionDigits]="0" [min]="0" [max]="100000000000000000" [showButtons]="true" />
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
export class InformationSinistre implements OnInit {
    labelInformation: string;
    raisonInformation: string;
    dateSurvenanceInformation: Date;
    montantSinistreInformation: number;

    constructor(public appMain: DeclarationSinistre, public declareSinistreService: DeclareSinistreService, public messageService: MessageService, private router: Router, private route: ActivatedRoute) {}

    ngOnInit() {
        this.labelInformation = this.declareSinistreService.getLabel();
        this.raisonInformation = this.declareSinistreService.getRaison();
        this.dateSurvenanceInformation = this.declareSinistreService.getDateSurvenance();
        this.montantSinistreInformation = this.declareSinistreService.getMontantSinistre();
    }

    nextPage() {
        if (this.labelInformation && this.raisonInformation && this.dateSurvenanceInformation && this.montantSinistreInformation) {
            this.declareSinistreService.setLabel(this.labelInformation);
            this.declareSinistreService.setRaison(this.raisonInformation);
            this.declareSinistreService.setDateSurvenance(this.dateSurvenanceInformation);
            this.declareSinistreService.setMontantSinistre(this.montantSinistreInformation);
            // Utilisation de la navigation relative
            this.router.navigate(['../documents'], { relativeTo: this.route }).then(() => {
                this.appMain.updateCurrentStep();
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Vous devez renseigner toutes les informations du sinistre.'
            });
        }
    }
}
