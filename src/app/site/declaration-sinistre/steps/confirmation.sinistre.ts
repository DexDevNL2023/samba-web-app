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
                        <b> {{ product?.numeroSouscription }} du {{ product?.dateSouscription | date:'shortDate' }}</b>
                    </div>
                    <div class="field col-12">
                        <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Libellé : </label>
                        <b> {{ sinistreInformation?.label ? sinistreInformation?.label : '-' }}</b>
                    </div>
                    <div class="field col-12">
                        <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Raison : </label>
                        <p> {{ sinistreInformation?.raison ? sinistreInformation?.raison : '-' }}</p>
                    </div>
                    <div class="field col-12">
                        <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Date de survenance : </label>
                        <b> {{ sinistreInformation?.dateSurvenance ? sinistreInformation?.dateSurvenance : '-' | date:'shortDate' }}</b>
                    </div>
                    <div class="field col-12">
                        <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Montant du sinistre : </label>
                        <b> {{ sinistreInformation?.montantSinistre ? sinistreInformation?.montantSinistre : '-' }} XAF</b>
                    </div>
                    <div class="field col-12">
                        <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Documents de sinistre : </label>
                        <ul *ngFor="let file of sinistreInformation?.documents">
                            <li>{{ file.nom }}</li>
                        </ul>
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
        }
        this.declareSinistreService.setAccount(this.accountInformation);
        this.declareSinistreService.setSouscription(this.souscriptionInformation);
        this.sinistreInformation = this.declareSinistreService.getSinistreInformation();
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