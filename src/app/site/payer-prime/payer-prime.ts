import { PayerPrimeService } from './../../service/payer.prime.service';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'app-payer-prime',
    templateUrl: '../generic/generic-routing-steps.html'
})
export class PayerPrime implements OnInit {
    steps: any[];
    currentStepId: string; // Identifiant de l'étape actuelle

    subscription: Subscription;

    constructor(public messageService: MessageService, public payerPrimeService: PayerPrimeService, private router: Router) {}

    ngOnInit() {
        // Définir les étapes avec des identifiants uniques
        this.steps = [
            {
                id: 'information',
                label: 'Paiement de la prime',
                routerLink: 'steps/information',
                description: 'Renseigner les informations de paiement',
                icon: 'pi pi-id-card'
            },
            {
                id: 'confirmation',
                label: 'Confirmation',
                routerLink: 'steps/confirmation',
                description: 'Confirmer les informations et effectuer le paiement',
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

        this.subscription = this.payerPrimeService.paiementComplete$.subscribe((paiementInformation) => {
            // Submit to API with product ID
            this.submitPaiement();
        });
    }

    // Submit the paiement to API using async/await
    async submitPaiement() {
        const paiementData = this.payerPrimeService.getPaiementInformation();

        try {
            // Await the API response
            const response = await this.payerPrimeService.submitPaiementAsync(paiementData);
            this.messageService.add({
                severity: 'success',
                summary: 'Paiement',
                detail: 'Paiement soumis avec succès !'
            });
            this.router.navigate(['/site']);
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Une erreur est survenue lors de la soumission du paiement.'
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