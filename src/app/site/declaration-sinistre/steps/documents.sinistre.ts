import { DeclarationSinistre } from './../declaration-sinistre';
import { DeclareSinistreService } from './../../../service/declare-sinistre.service';
import { DocumentSinistre } from './../../../models/document-sinistre.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
    template: `
        <div class="stepsdemo-content">
            <p-card>
                <ng-template pTemplate="title"> Documents de sinistre </ng-template>
                <ng-template pTemplate="subtitle"> Ajoutez les documents de preuves de votre sinistre </ng-template>
                <ng-template pTemplate="content">
                    <div class="p-fluid">
                        <div class="field">
                            <label for="documents">Documents de sinistre : </label>
                            <p-fileUpload
                                name="documents"
                                multiple="multiple"
                                (onUpload)="onUpload($event)"
                                accept="image/*,.pdf"
                                mode="advanced"
                                auto="true"
                                [maxFileSize]="1000000">
                            </p-fileUpload>
                            <ul *ngFor="let file of documentsInformation">
                                <li>{{ file.nom }}</li>
                            </ul>
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
export class DocumentsSinistre implements OnInit {
    documentsInformation: DocumentSinistre[];

    constructor(public appMain: DeclarationSinistre, public declareSinistreService: DeclareSinistreService, public messageService: MessageService, private router: Router, private route: ActivatedRoute) {}

    ngOnInit() {
        this.documentsInformation = this.declareSinistreService.getDocuments();
    }

    nextPage() {
        if (this.documentsInformation) {
            this.declareSinistreService.setDocument(this.documentsInformation);
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
        this.router.navigate(['../information'], { relativeTo: this.route }).then(() => {
            this.appMain.updateCurrentStep();
        });
    }

    // Assuming you want to set the nom to the file name
    onUpload(event: any) {
        for (const file of event.files) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                // Create a DocumentSinistre object
                const document: DocumentSinistre = {
                    nom: file.name,
                    url: e.target.result,
                };
                this.declareSinistreService.addDocument(document);
            };
            reader.readAsDataURL(file);
        }
        this.messageService.add({ severity: 'success', summary: 'Selectionnez un fichier', detail: 'Documents ajoutés avec succès.' });
    }
}
