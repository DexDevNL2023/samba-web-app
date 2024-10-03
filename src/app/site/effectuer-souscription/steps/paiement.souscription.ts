import { PaymentMode } from '../../../models/paiement.model';
import { EffectuerSouscriptionService } from '../../../service/effectuer.souscription.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EffectuerSouscription } from '../effectuer-souscription';

@Component({
    template: `
        <div class="stepsdemo-content">
            <p-card>
                <ng-template pTemplate="title"> Mode de Paiement </ng-template>
                <ng-template pTemplate="subtitle"> Sélectionnez un mode de paiement </ng-template>
                <ng-template pTemplate="content">
                    <div class="p-fluid">
                        <div class="field">
                            <label for="mode">Mode de Paiement</label>
                            <p-dropdown
                                [options]="modes"
                                [(ngModel)]="modeInformation"
                                placeholder="Sélectionnez un mode"
                            ></p-dropdown>
                        </div>
                    </div>
                </ng-template>
                <ng-template pTemplate="footer">
                    <div class="grid grid-nogutter justify-content-between">
                        <p-button label="Retour" (onClick)="prevPage()" icon="pi pi-angle-left" [raised]="true" [rounded]="true" styleClass="p-button-info" />
                        <p-button label="Suivant" (onClick)="nextPage()" icon="pi pi-angle-right" iconPos="right" [raised]="true" [rounded]="true" styleClass="p-button-info" />
                    </div>
                </ng-template>
            </p-card>
        </div>
    `
})
export class ModePaiementSouscription implements OnInit {
    modes = [
        { label: 'Virement Bancaire', value: PaymentMode.BANK_TRANSFER },
        { label: 'Espèces', value: PaymentMode.CASH },
        { label: 'Stripe', value: PaymentMode.STRIPE },
        { label: 'PayPal', value: PaymentMode.PAYPAL },
        { label: 'Moov Money', value: PaymentMode.MOOV },
        { label: 'Airtel Money', value: PaymentMode.AIRTEL }
    ];
    modeInformation: PaymentMode;

    constructor(public appMain: EffectuerSouscription, public effectuerSouscriptionService: EffectuerSouscriptionService, public messageService: MessageService, private router: Router, private route: ActivatedRoute) {}

    ngOnInit() {
        this.modeInformation = this.effectuerSouscriptionService.getMode();
    }

    nextPage() {
        if (this.modeInformation) {
            this.effectuerSouscriptionService.setMode(this.modeInformation);
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

    prevPage() {
        this.router.navigate(['../frequence'], { relativeTo: this.route }).then(() => {
            this.appMain.updateCurrentStep();
        });
    }
}
