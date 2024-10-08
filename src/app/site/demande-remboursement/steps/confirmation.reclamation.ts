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
import { DatePipe } from '@angular/common';

@Component({
    template: `
        <div class="stepsdemo-content">
            <p-card>
                <ng-template pTemplate="title">Confirmation</ng-template>
                <ng-template pTemplate="subtitle">Vérifiez les informations de votre reclamation</ng-template>
                <ng-template pTemplate="content">
                    <div class="field col-12">
                        <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Sinistre : </label>
                        <span> {{ buildSinistre() }}</span>
                    </div>
                    <div class="field col-12">
                        <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Date de réclamation : </label>
                        <span> {{ reclamationInformation?.dateReclamation ? (reclamationInformation?.dateReclamation | date:'dd/MM/yyyy') : '-' }}</span>
                    </div>
                    <div class="field col-12">
                        <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Type de reclamation : </label>
                        <span> <p-tag [value]="getTypeReclamationLabel(reclamationInformation?.type)"
                            [severity]="getTypeReclamationSeverity(reclamationInformation?.type)"></p-tag></span>
                    </div>
                    <div class="field col-12">
                        <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Description : </label>
                        <span> {{ reclamationInformation?.description ? reclamationInformation?.description : '-' }}</span>
                    </div>
                    <div class="field col-12">
                        <label [ngClass]="{'p-text-bold': true, 'block': true, 'text-900': true, 'mb-2': true}">Montant réclamé : </label>
                        <span> {{ reclamationInformation?.montantReclame ? reclamationInformation?.montantReclame : '-' }} XAF</span>
                    </div>
                </ng-template>
                <ng-template pTemplate="footer">
                    <div class="grid grid-nogutter justify-content-between">
                        <p-button label="Retour" (onClick)="prevPage()" icon="pi pi-angle-left" [raised]="true" [rounded]="true" styleClass="p-button-info" />
                        <p-button label="Soumettre votre reclamation" (onClick)="complete()" icon="pi pi-angle-right" iconPos="right" [raised]="true" [rounded]="true" styleClass="p-button-success" />
                    </div>
                </ng-template>
            </p-card>
        </div>
    `
})
export class ConfirmationReclamation implements OnInit {
    accountInformation: number;
    sinistreformation: number;
    account: Account = {} as Account;
    sinistre: Sinistre = {} as Sinistre;
    reclamationInformation: PublicReclamationRequest = {} as PublicReclamationRequest;
    typeReclamations = [
        { label: 'Sinistre', value: TypeReclamation.SINISTRE },
        { label: 'Sinistre', value: TypeReclamation.PRESTATION }
    ];

    constructor(public appMain: DemandeRemboursement, public demandeRemboursementService: DemandeRemboursementService, private accountService: AccountService, public messageService: MessageService, private router: Router, private route: ActivatedRoute, private datePipe: DatePipe) {}

    ngOnInit() {
        // Récupérer le compte actuel
        this.account = this.accountService.getCurrentAccount();
        console.log('Compte actuel:', this.account);

        // Récupérer les informations de sinistre
        this.sinistre = this.demandeRemboursementService.getProductSinistre();
        console.log('Sinistre récupéré:', this.sinistre);

        if (this.account && this.sinistre) {
            // Mettre à jour les informations de compte et de sinistre
            this.accountInformation = this.account.id;
            this.sinistreformation = this.sinistre.id;
            console.log('ID du compte:', this.accountInformation);
            console.log('ID du sinistre:', this.sinistreformation);

            // Mettre à jour reclamationInformation
            this.demandeRemboursementService.setAccount(this.accountInformation);
            this.demandeRemboursementService.setSinistre(this.sinistreformation);
            this.reclamationInformation = this.demandeRemboursementService.getReclamationInformation();
            console.log('Reclamation Information mise à jour:', this.reclamationInformation);
        } else {
            console.warn('Aucune information de compte ou de sinistre trouvée.');
        }
    }

    complete() {
        if (this.accountInformation && this.sinistreformation) {
            this.demandeRemboursementService.setAccount(this.accountInformation);
            this.demandeRemboursementService.setSinistre(this.sinistreformation);
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

    // Méthode utilitaire pour formater les dates
    private formatDate(date: Date | string | null): string {
        return date ? this.datePipe.transform(date, 'dd/MM/yyyy') || '-' : '-';
    }
}