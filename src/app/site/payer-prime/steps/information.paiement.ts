import { PayerPrimeService } from '../../../service/payer.prime.service';
import { PayerPrime } from '../payer-prime';
import { PaymentMode } from '../../../models/paiement.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
    template: `
        <div class="stepsdemo-content">
            <p-card>
                <ng-template pTemplate="title"> Paiement de la prime </ng-template>
                <ng-template pTemplate="subtitle"> Renseignez les détails du paiement </ng-template>
                <ng-template pTemplate="content">
                    <div class="p-fluid">
                        <div class="field">
                            <label for="mode">Mode de Paiement</label>
                            <p-dropdown id="mode" [options]="modes" [(ngModel)]="modeInformation"
                                optionLabel="label" optionValue="value" [showClear]="true" appendTo="body"
                                placeholder="Sélectionnez un mode de paiement"></p-dropdown>
                        </div>
                    </div>
                </ng-template>
                <ng-template pTemplate="footer">
                    <div class="grid grid-nogutter justify-content-between">
                        <p-button label="Suivant" (onClick)="nextPage()" icon="pi pi-angle-right" iconPos="right" [raised]="true" [rounded]="true" styleClass="p-button-info" />
                    </div>
                </ng-template>
            </p-card>
        </div>
    `
})
export class InformationPaiement implements OnInit {
    modes = [
        { label: 'Virement Bancaire', value: PaymentMode.BANK_TRANSFER },
        { label: 'Espèces', value: PaymentMode.CASH },
        { label: 'Stripe', value: PaymentMode.STRIPE },
        { label: 'PayPal', value: PaymentMode.PAYPAL },
        { label: 'Moov Money', value: PaymentMode.MOOV },
        { label: 'Airtel Money', value: PaymentMode.AIRTEL }
    ];
    modeInformation: PaymentMode;

    constructor(public appMain: PayerPrime, public payerPrimeService: PayerPrimeService, public messageService: MessageService, private router: Router, private route: ActivatedRoute) {}

    ngOnInit() {
        this.modeInformation = this.payerPrimeService.getMode();
    }

    nextPage() {
        if (this.modeInformation) {
            this.payerPrimeService.setMode(this.modeInformation);
            this.router.navigate(['../confirmation'], { relativeTo: this.route }).then(() => {
                this.appMain.updateCurrentStep();
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Vous devez choisir un mode de paiement.'
            });
        }
    }
}
