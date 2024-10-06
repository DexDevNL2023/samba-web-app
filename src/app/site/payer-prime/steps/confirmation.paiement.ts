import { Souscription } from './../../../models/souscription.model';
import { PayerPrime } from '../payer-prime';
import { PayerPrimeService } from '../../../service/payer.prime.service';
import { PaymentMode } from '../../../models/paiement.model';
import { PublicPaiementRequest } from '../../../models/public-paiement.request';
import { Account } from '../../../models/account.model';
import { AccountService } from '../../../core/auth/account.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
    template: `
        <div class="stepsdemo-content">
        <p-card>
            <ng-template pTemplate="title">Confirmation</ng-template>
            <ng-template pTemplate="subtitle">Vérifiez les informations de votre paiement</ng-template>
            <ng-template pTemplate="content">
                <div class="field col-12">
                    <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Souscription : </label>
                    <b> {{ product?.numeroSouscription }} - {{ product?.label }}</b>
                </div>
                <div class="field col-12">
                    <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Mode de paiement : </label>
                    <b><p-tag [value]="getPaymentModeLabel(paiementInformation?.mode)"
                                [severity]="getPaymentModeSeverity(paiementInformation?.mode)"></p-tag></b>
                </div>
                <div class="field col-12">
                    <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Montant de la prime : </label>
                    <b> {{ paiementInformation?.montant ? paiementInformation?.montant : '-' }} XAF</b>
                </div>
            </ng-template>
            <ng-template pTemplate="footer">
                <div class="grid grid-nogutter justify-content-between">
                    <p-button label="Retour" (onClick)="prevPage()" icon="pi pi-angle-left" [raised]="true" [rounded]="true" styleClass="p-button-info" />
                    <p-button label="Souscrire" (onClick)="complete()" icon="pi pi-angle-right" iconPos="right" [raised]="true" [rounded]="true" styleClass="p-button-success" />
                </div>
            </ng-template>
        </p-card>
        </div>
    `
})
export class ConfirmationPaiement implements OnInit {
    accountInformation: number;
    souscriptionInformation: number;
    montantInformation: number;
    product: Souscription = {} as Souscription;
    account: Account = {} as Account;
    paiementInformation: PublicPaiementRequest = {} as PublicPaiementRequest;
    modes = [
        { label: 'Virement Bancaire', value: PaymentMode.BANK_TRANSFER },
        { label: 'Espèces', value: PaymentMode.CASH },
        { label: 'Stripe', value: PaymentMode.STRIPE },
        { label: 'PayPal', value: PaymentMode.PAYPAL },
        { label: 'Moov Money', value: PaymentMode.MOOV },
        { label: 'Airtel Money', value: PaymentMode.AIRTEL }
    ];

    constructor(public appMain: PayerPrime, public payerPrimeService: PayerPrimeService, private accountService: AccountService, public messageService: MessageService, private router: Router, private route: ActivatedRoute) {}

    ngOnInit() {
        this.product = this.payerPrimeService.getProduct();
        this.account = this.accountService.getCurrentAccount();
        if (this.account && this.product) {
            this.accountInformation = this.account.id;
            this.souscriptionInformation = this.product.id;
            this.montantInformation = this.product.montantCotisation;
        }
        this.payerPrimeService.setAccount(this.accountInformation);
        this.payerPrimeService.setSouscription(this.souscriptionInformation);
        this.payerPrimeService.setMontant(this.montantInformation);
        this.paiementInformation = this.payerPrimeService.getPaiementInformation();
    }

    complete() {
        if (this.accountInformation && this.souscriptionInformation && this.montantInformation) {
            this.payerPrimeService.setAccount(this.accountInformation);
            this.payerPrimeService.setSouscription(this.souscriptionInformation);
            this.payerPrimeService.setMontant(this.montantInformation);
            this.payerPrimeService.complete();
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Les informations de votre paiement sont incomplètes.'
            });
        }
    }

    prevPage() {
        this.router.navigate(['../information'], { relativeTo: this.route }).then(() => {
            this.appMain.updateCurrentStep();
        });
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