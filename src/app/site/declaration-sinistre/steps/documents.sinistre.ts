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
                            <p-fileUpload id="documents" [multiple]="true" chooseLabel="Choisir un document de preuve" accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.xls,.xlsx"
                                (onSelect)="onSelectedFiles($event)" [showUploadButton]="false" [showCancelButton]="true" [auto]="true"></p-fileUpload>
                            <div *ngIf="documentsInformation?.length > 0">
                                <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                                    <div *ngFor="let file of documentsInformation" class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
                                        <div>
                                            <img role="presentation" [alt]="file.name" [src]="file.imageUrl" width="100" height="50" />
                                        </div>
                                        <span class="font-semibold">{{ file.nom }}</span>
                                        <p-button icon="pi pi-times" (onClick)="removeFiles(file)" [outlined]="true" [rounded]="true" severity="danger" />
                                    </div>
                                </div>
                            </div>
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
    documentsInformation: DocumentSinistre[] = [];

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

    onSelectedFiles(event: any): void {
        const files = event.files; // Assurez-vous de lire `event.files`
        if (files && files.length > 0) {
            const file = files[0]; // Prendre le premier fichier
            // Lecture du fichier pour une prévisualisation
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64String = (reader.result as string);

                // Créer un objet DocumentSinistre et l'ajouter à documentsInformation
                const document: DocumentSinistre = {
                    imageUrl: file.objectURL,
                    nom: file.name,
                    url: base64String,
                };

                // Ajouter le nouveau document directement
                this.documentsInformation.push(document);
            };
            reader.readAsDataURL(file);
        }
    }

    removeFiles(file: DocumentSinistre): void {
        // Recherche de l'index du fichier dans la liste documentsInformation
        const index = this.documentsInformation.indexOf(file);

        if (index !== -1) {
            // Suppression du fichier si trouvé
            this.documentsInformation.splice(index, 1);
        }
    }
}
