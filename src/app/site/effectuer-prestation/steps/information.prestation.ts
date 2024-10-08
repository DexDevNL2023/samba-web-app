import { FinanceurService } from './../../../service/financeur.service';
import { Financeur } from './../../../models/financeur.model';
import { PrestationType } from './../../../models/prestation.model';
import { EffectuerPrestation } from './../effectuer-prestation';
import { EffectuerPrestationService } from './../../../service/effectuer-prestation.service';
import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    template: `
        <div class="stepsdemo-content">
            <p-card>
                <ng-template pTemplate="title">Information de la prestation</ng-template>
                <ng-template pTemplate="subtitle">Renseignez les détails de la prestation</ng-template>
                <ng-template pTemplate="content">
                    <div class="p-fluid">
                        <div class="field">
                            <label for="label">Libellé de la prestation</label>
                            <input id="label" [(ngModel)]="labelInformation" pInputText placeholder="Libellé" />
                        </div>
                        <div class="field">
                            <label for="type">Type de Prestation</label>
                            <p-dropdown id="type" [options]="prestationTypes" [(ngModel)]="typeInformation"
                                optionLabel="label" optionValue="value" [showClear]="true" appendTo="body"
                                placeholder="Sélectionnez un type de prestation"></p-dropdown>
                        </div>
                        <div class="field">
                            <label for="datePrestation">Date de la prestation</label>
                            <p-calendar id="datePrestation" [(ngModel)]="datePrestationInformation" [showIcon]="true" inputId="icon"
                                dateFormat="dd/mm/yy" [monthNavigator]="true" [yearNavigator]="true" yearRange="1900:{{ currentYear }}"
                                placeholder="Saisir la date de la prestation"></p-calendar>
                        </div>
                        <div class="field">
                            <label for="montant">Montant de la prestation</label>
                            <p-inputNumber
                                id="montant" placeholder="Saisir le montant de la prestation"
                                [(ngModel)]="montantPrestationInformation" mode="currency" currency="XAF"
                                currencyDisplay="symbol" [minFractionDigits]="0" [maxFractionDigits]="0"
                                [min]="0" [max]="100000000000000000" [showButtons]="true" />
                        </div>
                        <div class="field">
                            <label for="description">Description</label>
                            <textarea id="description" [(ngModel)]="descriptionInformation" pInputTextarea placeholder="Description" rows="5" cols="30"></textarea>
                        </div>
                        <div class="field">
                            <label for="financeurs">Financeurs</label>
                            <p-multiSelect id="montant" [options]="financeurs" [(ngModel)]="financeursInformation"
                                optionLabel="nom" optionValue="id" [showClear]="true"
                                appendTo="body" [style]="{'width':'100%'}" [panelStyle]="{'max-height':'200px'}"
                                placeholder="Sélectionnez les financeurs"></p-multiSelect>
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
export class InformationEffectuerPrestation implements OnInit {
    labelInformation: string | null;
    datePrestationInformation: Date | null;
    montantPrestationInformation: number | null;
    typeInformation: PrestationType | null;
    descriptionInformation: string | null;
    financeursInformation: number[] | null;
    prestationTypes = [
        { label: 'Bien', value: PrestationType.BIEN },
        { label: 'Agricole', value: PrestationType.AGRICOLE },
        { label: 'Personne', value: PrestationType.PERSONNE },
        { label: 'Santé', value: PrestationType.SANTE }
    ];
    financeurs: Financeur[] = [];

    constructor(
        private finaceurService: FinanceurService,
        public effectuerPrestationService: EffectuerPrestationService,
        public messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.loadFinanceurs();
        this.labelInformation = this.effectuerPrestationService.getLabel();
        this.datePrestationInformation = this.effectuerPrestationService.getDatePrestation();
        this.montantPrestationInformation = this.effectuerPrestationService.getMontant();
        this.typeInformation = this.effectuerPrestationService.getType();
        this.descriptionInformation = this.effectuerPrestationService.getDescription();
        this.financeursInformation = this.effectuerPrestationService.getFinanceurs();
    }

    nextPage() {
        if (
            this.labelInformation &&
            this.datePrestationInformation &&
            this.montantPrestationInformation &&
            this.typeInformation &&
            this.descriptionInformation &&
            this.financeursInformation?.length
        ) {
            this.effectuerPrestationService.setLabel(this.labelInformation);
            this.effectuerPrestationService.setDatePrestation(this.datePrestationInformation);
            this.effectuerPrestationService.setMontant(this.montantPrestationInformation);
            this.effectuerPrestationService.setType(this.typeInformation);
            this.effectuerPrestationService.setDescription(this.descriptionInformation);
            this.effectuerPrestationService.setFinanceurs(this.financeursInformation);
            this.router.navigate(['../documents'], { relativeTo: this.route });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Vous devez renseigner toutes les informations de la prestation.'
            });
        }
    }

    // Charger les souscriptions à partir du service
    async loadFinanceurs(): Promise<void> {
        try {
            const data = await this.finaceurService.query().toPromise();
            this.financeurs = data;
        } catch (error) {
            console.error('Erreur lors du chargement des financeurs:', error);
            // Gérer l'erreur selon vos besoins (par exemple, afficher un message d'erreur)
        }
    }
}