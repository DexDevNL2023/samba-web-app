import { PaymentMode } from './../../../models/paiement.model';
import { PaymentFrequency } from './../../../models/souscription.model';
import { PublicSouscriptionRequest } from './../../../models/public-souscription.request';
import { PoliceAssurance } from '../../../models/police-assurance.model';
import { Account } from '../../../models/account.model';
import { AccountService } from '../../../core/auth/account.service';
import { EffectuerSouscriptionService } from '../../../service/effectuer.souscription.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EffectuerSouscription } from '../effectuer-souscription';

@Component({
    template: `
        <div class="stepsdemo-content">
        <p-card>
            <ng-template pTemplate="title">Confirmation</ng-template>
            <ng-template pTemplate="subtitle">Vérifiez les informations de votre souscription</ng-template>
            <ng-template pTemplate="content">
                <div class="field col-12">
                    <label for="montant">Police d'assurance : </label>
                    <b> {{ product?.numeroPolice }} - {{ product?.label }}</b>
                </div>
                <div class="field col-12">
                    <label for="montant">Duree de couverture : </label>
                    <b> {{ product?.dureeCouverture ? product?.dureeCouverture : '-' }} mois</b>
                </div>
                <div class="field col-12">
                    <label for="frequence">Fréquence de paiement : </label>
                    <b><p-tag [value]="getPaymentFrequencyLabel(souscriptionInformation?.frequencePaiement)"
                                [severity]="getPaymentFrequencySeverity(souscriptionInformation?.frequencePaiement)"></p-tag></b>
                </div>
                <div class="field col-12">
                    <label for="mode">Mode de paiement : </label>
                    <b><p-tag [value]="getPaymentModeLabel(souscriptionInformation?.mode)"
                                [severity]="getPaymentModeSeverity(souscriptionInformation?.mode)"></p-tag></b>
                </div>
                <div class="field col-12">
                    <label for="montant">Montant : </label>
                    <b> {{ souscriptionInformation?.montant ? souscriptionInformation?.montant : '-' }}</b>
                </div>
            </ng-template>
            <ng-template pTemplate="footer">
                <div class="grid grid-nogutter justify-content-between">
                    <p-button label="Retour" (onClick)="prevPage()" icon="pi pi-angle-left" [raised]="true" [rounded]="true" styleClass="p-button-info" />
                    <p-button label="Confirmer" (onClick)="complete()" icon="pi pi-angle-right" iconPos="right" [raised]="true" [rounded]="true" styleClass="p-button-success" />
                </div>
            </ng-template>
        </p-card>
        </div>
    `
})
export class ConfirmationSouscription implements OnInit {
    accountInformation: number;
    policeInformation: number;
    montantInformation: number;
    product: PoliceAssurance = {} as PoliceAssurance;
    account: Account = {} as Account;
    souscriptionInformation: PublicSouscriptionRequest = {} as PublicSouscriptionRequest;
    frequences = [
        { label: 'Mensuel', value: PaymentFrequency.MENSUEL },
        { label: 'Trimestriel', value: PaymentFrequency.TRIMESTRIEL },
        { label: 'Semestriel', value: PaymentFrequency.SEMESTRIEL },
        { label: 'Annuel', value: PaymentFrequency.ANNUEL }
    ];
    modes = [
        { label: 'Virement Bancaire', value: PaymentMode.BANK_TRANSFER },
        { label: 'Espèces', value: PaymentMode.CASH },
        { label: 'Stripe', value: PaymentMode.STRIPE },
        { label: 'PayPal', value: PaymentMode.PAYPAL },
        { label: 'Moov Money', value: PaymentMode.MOOV },
        { label: 'Airtel Money', value: PaymentMode.AIRTEL }
    ];

    constructor(public appMain: EffectuerSouscription, private accountService: AccountService, public effectuerSouscriptionService: EffectuerSouscriptionService, public messageService: MessageService, private router: Router, private route: ActivatedRoute) {}

    ngOnInit() {
        this.product = this.effectuerSouscriptionService.getProduct();
        this.account = this.accountService.getCurrentAccount();
        if (this.account && this.product) {
            this.accountInformation = this.account.id;
            this.policeInformation = this.product.id;
            this.montantInformation = this.product.montantSouscription;
            console.log("1 : "+this.montantInformation);
            console.log("2 : "+this.product.montantSouscription);
        }
        this.effectuerSouscriptionService.setAccount(this.accountInformation);
        this.effectuerSouscriptionService.setPolice(this.policeInformation);
        this.effectuerSouscriptionService.setMontant(this.montantInformation);
        this.souscriptionInformation = this.effectuerSouscriptionService.getSouscriptionInformation();
    }

    complete() {
        if (this.accountInformation && this.policeInformation && this.montantInformation) {
            this.effectuerSouscriptionService.setAccount(this.accountInformation);
            this.effectuerSouscriptionService.setPolice(this.policeInformation);
            this.effectuerSouscriptionService.setMontant(this.montantInformation);
            this.effectuerSouscriptionService.complete();
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Les informations de votre souscription sont incomplètes.'
            });
        }
    }

    prevPage() {
        this.router.navigate(['../paiement'], { relativeTo: this.route }).then(() => {
            this.appMain.updateCurrentStep();
        });
    }

    protected getPaymentFrequencyLabel(value: string): string {
        const enumObj = this.frequences.find((e: any) => e.value === value);
        return enumObj ? enumObj.label : value;
    }

    getPaymentFrequencySeverity(type: keyof typeof PaymentFrequency | null): string {
        switch (type) {
            case 'MENSUEL':
                return 'info';
            case 'TRIMESTRIEL':
                return 'success';
            case 'SEMESTRIEL':
                return 'warning';
            case 'ANNUEL':
                return 'danger';
            default:
                return '';
        }
    }

    protected getPaymentModeLabel(value: string): string {
        const enumObj = this.modes.find((e: any) => e.value === value);
        return enumObj ? enumObj.label : value;
    }

    getPaymentModeSeverity(type: keyof typeof PaymentMode | null): string {
        switch (type) {
            case 'BANK_TRANSFER':
                return 'info';
            case 'CASH':
                return 'success';
            case 'STRIPE':
                return 'primary';
            case 'PAYPAL':
                return 'warning';
            case 'MOOV':
                return 'danger';
            case 'AIRTEL':
                return 'secondary';
            default:
                return '';
        }
    }
}