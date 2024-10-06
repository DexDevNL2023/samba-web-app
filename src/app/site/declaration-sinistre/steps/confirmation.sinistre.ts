import { DeclareSinistreService } from './../../../service/declare-sinistre.service';
import { DeclarationSinistre } from './../declaration-sinistre';
import { PublicSinistreRequest } from './../../../models/public-sinistre.request';
import { Account } from '../../../models/account.model';
import { AccountService } from '../../../core/auth/account.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Souscription } from '../../../models/souscription.model';

@Component({
    template: `
        <div class="stepsdemo-content">
            <p-card>
                <ng-template pTemplate="title">Confirmation</ng-template>
                <ng-template pTemplate="subtitle">Vérifiez les informations de votre sinistre</ng-template>
                <ng-template pTemplate="content">
                    <div class="field col-12">
                        <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Souscription : </label>
                        <span> {{ product?.numeroSouscription }} du {{ (product?.dateSouscription | date:'dd/MM/yyyy') }}</span>
                    </div>
                    <div class="field col-12">
                        <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Libellé : </label>
                        <span> {{ sinistreInformation?.label ? sinistreInformation?.label : '-' }}</span>
                    </div>
                    <div class="field col-12">
                        <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Raison : </label>
                        <span> {{ sinistreInformation?.raison ? sinistreInformation?.raison : '-' }}</span>
                    </div>
                    <div class="field col-12">
                        <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Date de survenance : </label>
                        <span> {{ sinistreInformation?.dateSurvenance ? (sinistreInformation?.dateSurvenance | date:'dd/MM/yyyy') : '-' }}</span>
                    </div>
                    <div class="field col-12">
                        <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Montant du sinistre : </label>
                        <span> {{ sinistreInformation?.montantSinistre ? sinistreInformation?.montantSinistre : '-' }} XAF</span>
                    </div>
                    <div class="field col-12">
                        <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Documents de sinistre : </label>
                        <div *ngIf="sinistreInformation?.documents?.length > 0">
                            <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                                <div *ngFor="let file of sinistreInformation?.documents" class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
                                    <div>
                                        <img role="presentation" [alt]="file.name" [src]="file.imageUrl" width="100" height="50" />
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
export class ConfirmationSinistre implements OnInit {
    accountInformation: number;
    souscriptionInformation: number;
    product: Souscription = {} as Souscription;
    account: Account = {} as Account;
    sinistreInformation: PublicSinistreRequest = {} as PublicSinistreRequest;

    constructor(public appMain: DeclarationSinistre, public declareSinistreService: DeclareSinistreService, private accountService: AccountService, public messageService: MessageService, private router: Router, private route: ActivatedRoute) {}

    ngOnInit() {
        this.product = this.declareSinistreService.getProduct();
        this.account = this.accountService.getCurrentAccount();
        if (this.account && this.product) {
            this.accountInformation = this.account.id;
            this.souscriptionInformation = this.product.id;

            // Mettre a jour sinistreInformation
            this.declareSinistreService.setAccount(this.accountInformation);
            this.declareSinistreService.setSouscription(this.souscriptionInformation);
            this.sinistreInformation = this.declareSinistreService.getSinistreInformation();
        }
    }

    complete() {
        if (this.accountInformation && this.souscriptionInformation) {
            this.declareSinistreService.setAccount(this.accountInformation);
            this.declareSinistreService.setSouscription(this.souscriptionInformation);
            this.declareSinistreService.complete();
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Les informations de votre sinistre sont incomplètes.'
            });
        }
    }

    prevPage() {
        this.router.navigate(['../documents'], { relativeTo: this.route }).then(() => {
            this.appMain.updateCurrentStep();
        });
    }
}