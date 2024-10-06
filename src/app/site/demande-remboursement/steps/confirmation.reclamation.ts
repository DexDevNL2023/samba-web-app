import { PrestationService } from './../../../service/prestation.service';
import { SinistreService } from './../../../service/sinistre.service';
import { Prestation } from './../../../models/prestation.model';
import { Sinistre } from './../../../models/sinistre.model';
import { TypeReclamation } from './../../../models/reclamation.model';
import { DemandeRemboursement } from './../demande-remboursement';
import { DemandeRemboursementService } from './../../../service/demande-remboursement.service';
import { PublicReclamationRequest } from '../../../models/public-reclamation.request';
import { Account } from '../../../models/account.model';
import { AccountService } from '../../../core/auth/account.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Souscription } from '../../../models/souscription.model';
import { DatePipe } from '@angular/common';

@Component({
    template: `
        <div class="stepsdemo-content">
            <p-card>
                <ng-template pTemplate="title">Confirmation</ng-template>
                <ng-template pTemplate="subtitle">Vérifiez les informations de votre reclamation</ng-template>
                <ng-template pTemplate="content">
                    <div class="field col-12">
                        <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Souscription : </label>
                        <b> {{ product?.numeroSouscription }} du {{ product?.dateSouscription | date:'shortDate' }}</b>
                    </div>
                    <div class="field col-12">
                        <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Type de reclamation : </label>
                        <b> <p-tag [value]="getTypeReclamationLabel(reclamationInformation?.type)"
                            [severity]="getTypeReclamationSeverity(reclamationInformation?.type)"></p-tag></b>
                    </div>
                    <div class="field col-12">
                        <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Description : </label>
                        <b> {{ reclamationInformation?.description ? reclamationInformation?.description : '-' }}</b>
                    </div>
                    <div class="field col-12">
                        <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Date de réclamation : </label>
                        <b> {{ reclamationInformation?.dateReclamation ? (reclamationInformation?.dateReclamation | date:'shortDate') : '-' }}</b>
                    </div>
                    <div class="field col-12">
                        <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Montant réclamé : </label>
                        <b> {{ reclamationInformation?.montantReclamation ? reclamationInformation?.montantReclamation : '-' }} XAF</b>
                    </div>
                    <div class="field col-12" *ngIf="reclamationInformation?.type === 'SINISTRE'">
                        <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Sinistre : </label>
                        <b> {{ buildSinistre() }}</b>
                    </div>
                    <div class="field col-12" *ngIf="reclamationInformation?.type === 'PRESTATION'">
                        <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Prestation : </label>
                        <b> {{ buildPrestation() }}</b>
                    </div>
                </ng-template>
                <ng-template pTemplate="footer">
                    <div class="grid grid-nogutter justify-content-between">
                        <p-button label="Retour" (onClick)="prevPage()" icon="pi pi-angle-left" [raised]="true" [rounded]="true" styleClass="p-button-info" />
                        <p-button label="Soumettre votre declaration" (onClick)="complete()" icon="pi pi-angle-right" iconPos="right" [raised]="true" [rounded]="true" styleClass="p-button-success" />
                    </div>
                </ng-template>
            </p-card>
        </div>
    `
})
export class ConfirmationReclamation implements OnInit {
    accountInformation: number;
    souscriptionInformation: number;
    product: Souscription = {} as Souscription;
    account: Account = {} as Account;
    reclamationInformation: PublicReclamationRequest = {} as PublicReclamationRequest;
    typeReclamations = [
        { label: 'Sinistre', value: TypeReclamation.SINISTRE },
        { label: 'Prestation', value: TypeReclamation.PRESTATION }
    ];
    sinistre: Sinistre = {} as Sinistre;
    prestation: Prestation = {} as Prestation;

    constructor(public appMain: DemandeRemboursement, public demandeRemboursementService: DemandeRemboursementService, private accountService: AccountService, public messageService: MessageService, private router: Router, private route: ActivatedRoute, private datePipe: DatePipe, private prestationService: PrestationService, private sinistreService: SinistreService) {}

    async ngOnInit() {
        this.product = this.demandeRemboursementService.getProduct();
        this.account = this.accountService.getCurrentAccount();
        if (this.account && this.product) {
            this.accountInformation = this.account.id;
            this.souscriptionInformation = this.product.id;
        }
        this.demandeRemboursementService.setAccount(this.accountInformation);
        this.demandeRemboursementService.setSouscription(this.souscriptionInformation);
        this.reclamationInformation = this.demandeRemboursementService.getReclamationInformation();
        if (this.reclamationInformation?.type === TypeReclamation.SINISTRE) {
            this.sinistre = await this.sinistreService.find(this.reclamationInformation?.sinistre).toPromise();
        } else {
            this.prestation = await this.prestationService.find(this.reclamationInformation?.prestation).toPromise();
        }
    }

    complete() {
        if (this.accountInformation && this.souscriptionInformation) {
            this.demandeRemboursementService.setAccount(this.accountInformation);
            this.demandeRemboursementService.setSouscription(this.souscriptionInformation);
            this.demandeRemboursementService.complete();
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Les informations de votre reclamation sont incomplètes.'
            });
        }
    }

    prevPage() {
        this.router.navigate(['../information'], { relativeTo: this.route }).then(() => {
            this.appMain.updateCurrentStep();
        });
    }

    getTypeReclamationLabel(value: string) {
        const reclamationObj = this.typeReclamations.find((e: any) => e.value === value);
        return reclamationObj ? reclamationObj.label : value;
    }

    getTypeReclamationSeverity(type: keyof typeof TypeReclamation | null): string {
        switch (type) {
            case 'SINISTRE':
                return 'warning';
            case 'PRESTATION':
                return 'success';
            default:
                return '';
        }
    }

    // Méthode pour formater et construire l'affichage du sinistre
    buildSinistre() {
        return this.sinistre && this.sinistre.numeroSinistre && this.sinistre.dateSurvenance
            ? `${this.sinistre.numeroSinistre} du ${this.formatDate(this.sinistre.dateSurvenance)}`
            : '-';
    }

    // Méthode pour formater et construire l'affichage de la prestation
    buildPrestation() {
        return this.prestation && this.prestation.numeroPrestation && this.prestation.datePrestation
            ? `${this.prestation.numeroPrestation} du ${this.formatDate(this.prestation.datePrestation)}`
            : '-';
    }

    // Méthode utilitaire pour formater les dates
    private formatDate(date: Date | string | null): string {
        return date ? this.datePipe.transform(date, 'dd/MM/yyyy') || '-' : '-';
    }
}