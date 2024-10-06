import { DeclareSinistreService } from './../../service/declare-sinistre.service';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'app-declaration-sinistre',
    templateUrl: '../generic/generic-routing-steps.html'
})
export class DeclarationSinistre implements OnInit {
    steps: any[];
    currentStepId: string;
    subscription: Subscription;

    constructor(
    public declareSinistreService: DeclareSinistreService,
    private router: Router,
    private messageService: MessageService
    ) {}

    ngOnInit() {
        // Définition des étapes du processus
        this.steps = [
            {
                id: 'information',
                label: 'Information du Sinistre',
                routerLink: 'steps/information',
                description: 'Renseigner les informations du sinistre',
                icon: 'pi pi-exclamation-triangle'
            },
            {
                id: 'documents',
                label: 'Choisir les documents',
                routerLink: 'steps/documents',
                description: 'Sélectionnez les documents de preuve pour le sinistre',
                icon: 'pi pi-file'
            },
            {
                id: 'confirmation',
                label: 'Confirmation',
                routerLink: 'steps/confirmation',
                description: 'Confirmer les informations et soumettre votre declaration de sinistre',
                icon: 'pi pi-check'
            }
        ];

        // Écouter les changements de route pour mettre à jour currentStep
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.updateCurrentStep();
            }
        });

        // Initialiser currentStep
        this.updateCurrentStep();

        this.subscription = this.declareSinistreService.sinistreComplete$.subscribe((sinistreInformation) => {
            // Submit to API with product ID
            this.submitSinistre();
        });
    }

    // Soumission finale du sinistre
    async submitSinistre() {
        const sinistreData = this.declareSinistreService.getSinistreInformation();
        try {
            await this.declareSinistreService.submitDeclarationSinitreAsync(sinistreData);
            this.messageService.add({
                severity: 'success',
                summary: 'Déclaration réussie',
                detail: 'Votre sinistre a été déclaré avec succès !'
            });
            this.router.navigate(['/home']);
        } catch (error) {
                this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Erreur lors de la soumission du sinistre.'
            });
        }
    }

    // Méthode pour mettre à jour l'étape actuelle en fonction de la route
    public updateCurrentStep() {
        const currentUrl = this.router.url; // Récupérer l'URL actuelle
        const currentRoute = currentUrl.split('/').pop(); // Extraire le dernier segment de l'URL
        const currentItem = this.steps.find(item => item.routerLink.endsWith(currentRoute)); // Trouver l'étape actuelle
        // Mettre à jour currentStepId
        this.currentStepId = currentItem ? currentItem.id : this.steps[0].id; // Si aucune étape trouvée, réinitialiser à la première étape
    }

    // Méthode pour déterminer l'icône de l'étape en fonction de son état
    getStepIcon(stepId: string): string {
        const step = this.steps.find(item => item.id === stepId);
        if (!step) return '';

        if (this.steps.findIndex(item => item.id === this.currentStepId) > this.steps.findIndex(item => item.id === stepId)) {
            return `${step.icon} text-green-500`; // Icône passée
        } else if (this.currentStepId === stepId) {
            return `${step.icon} text-blue-600`; // Icône actuelle
        } else {
            return `${step.icon} text-600`; // Icône future
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
