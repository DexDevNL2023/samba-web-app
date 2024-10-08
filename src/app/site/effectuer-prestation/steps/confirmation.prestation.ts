import { PublicPrestationRequest } from './../../../models/public-prestation.request';
import { EffectuerPrestation } from './../effectuer-prestation';
import { EffectuerPrestationService } from './../../../service/effectuer-prestation.service';
import { Account } from '../../../models/account.model';
import { AccountService } from '../../../core/auth/account.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Sinistre } from '../../../models/sinistre.model';

@Component({
    template: `
        <div class="stepsdemo-content">
            <p-card>
                <ng-template pTemplate="title">Confirmation</ng-template>
                <ng-template pTemplate="subtitle">Vérifiez les informations de votre prestation</ng-template>
                <ng-template pTemplate="content">
                    <div class="field col-12">
                        <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Sinistre : </label>
                        <span> {{ product?.numeroSinistre }} du {{ (product?.dateSinistre | date:'dd/MM/yyyy') }}</span>
                    </div>
                    <div class="field col-12">
                        <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Libellé : </label>
                        <span> {{ prestationInformation?.label ? prestationInformation?.label : '-' }}</span>
                    </div>
                    <div class="field col-12">
                        <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Date de prestation : </label>
                        <span> {{ prestationInformation?.datePrestation ? (prestationInformation?.datePrestation | date:'dd/MM/yyyy') : '-' }}</span>
                    </div>
                    <div class="field col-12">
                        <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Montant : </label>
                        <span> {{ prestationInformation?.montant ? prestationInformation?.montant : '-' }} XAF</span>
                    </div>
                    <div class="field col-12">
                        <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Type de prestation : </label>
                        <span> {{ prestationInformation?.type ? prestationInformation?.type : '-' }}</span>
                    </div>
                    <div class="field col-12">
                        <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Description : </label>
                        <span> {{ prestationInformation?.description ? prestationInformation?.description : '-' }}</span>
                    </div>
                    <div class="field col-12">
                        <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Documents de prestation : </label>
                        <div *ngIf="prestationInformation?.documents?.length > 0">
                            <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                                <div *ngFor="let file of prestationInformation?.documents" class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
                                    <div>
                                        <img role="presentation" [alt]="file.nom" [src]="file.imageUrl" width="100" height="50" />
                                    </div>
                                    <span class="font-semibold">{{ file.nom }}</span>
                                </div>
                            </div>
                        </div>
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
export class ConfirmationEffectuerPrestation implements OnInit {
    accountInformation: number;
    sinistreInformation: number;
    product: Sinistre = {} as Sinistre;
    account: Account = {} as Account;
    prestationInformation: PublicPrestationRequest = {} as PublicPrestationRequest;

    constructor(public appMain: EffectuerPrestation, public effectuerPrestationService: EffectuerPrestationService, private accountService: AccountService, public messageService: MessageService, private router: Router, private route: ActivatedRoute) {}

    ngOnInit() {
        this.product = this.effectuerPrestationService.getProduct();
        this.account = this.accountService.getCurrentAccount();
        if (this.account && this.product) {
            this.accountInformation = this.account.id;
            this.sinistreInformation = this.product.id;

            // Mettre à jour prestationInformation
            this.effectuerPrestationService.setAccount(this.accountInformation);
            this.effectuerPrestationService.setSinistre(this.sinistreInformation);
            this.prestationInformation = this.effectuerPrestationService.getPrestationInformation();
        }
    }

    complete() {
        if (this.accountInformation && this.sinistreInformation) {
            this.effectuerPrestationService.setAccount(this.accountInformation);
            this.effectuerPrestationService.setSinistre(this.sinistreInformation);
            this.effectuerPrestationService.complete();
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Les informations de votre prestation sont incomplètes.'
            });
        }
    }

    prevPage() {
        this.router.navigate(['../documents'], { relativeTo: this.route }).then(() => {
            this.appMain.updateCurrentStep();
        });
    }
}
