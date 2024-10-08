import { MessageService } from 'primeng/api';
import { PaymentFrequency } from '../../../models/souscription.model';
import { EffectuerSouscriptionService } from '../../../service/effectuer-souscription.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EffectuerSouscription } from '../effectuer-souscription';

@Component({
    template: `
        <div class="stepsdemo-content">
            <p-card>
                <ng-template pTemplate="title"> Fréquence de Paiement </ng-template>
                <ng-template pTemplate="subtitle"> Choisissez la fréquence de paiement des primes </ng-template>
                <ng-template pTemplate="content">
                    <div class="p-fluid">
                        <div class="field">
                            <label for="frequence">Fréquence de Paiement</label>
                            <p-dropdown id="frequence" [options]="frequences" [(ngModel)]="frequenceInformation"
                                optionLabel="label" optionValue="value" [showClear]="true" appendTo="body"
                                placeholder="Sélectionnez une fréquence"
                            ></p-dropdown>
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
export class FrequencePaiementSouscription implements OnInit {
    frequences = [
        { label: 'Mensuel', value: PaymentFrequency.MENSUEL },
        { label: 'Trimestriel', value: PaymentFrequency.TRIMESTRIEL },
        { label: 'Semestriel', value: PaymentFrequency.SEMESTRIEL },
        { label: 'Annuel', value: PaymentFrequency.ANNUEL }
    ];
    frequenceInformation: PaymentFrequency;

    constructor(public appMain: EffectuerSouscription, public effectuerSouscriptionService: EffectuerSouscriptionService, public messageService: MessageService, private router: Router, private route: ActivatedRoute) {}

    ngOnInit() {
        this.frequenceInformation = this.effectuerSouscriptionService.getFrequence();
    }

    nextPage() {
        if (this.frequenceInformation) {
            this.effectuerSouscriptionService.setFrequence(this.frequenceInformation);
            // Utilisation de la navigation relative
            this.router.navigate(['../paiement'], { relativeTo: this.route }).then(() => {
                this.appMain.updateCurrentStep();
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Vous devez choisir une fréquence de paiement.'
            });
        }
    }
}
