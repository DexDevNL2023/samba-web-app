import { EffectuerSouscriptionService } from './../../service/effectuer.souscription.service';
import { PublicSouscriptionRequest } from './../../models/public-souscription.request';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'app-effectuer-souscription',
    templateUrl: './effectuer-souscription.html'
})
export class EffectuerSouscription implements OnInit {
    items: any[];
    currentStepId: string; // Identifiant de l'étape actuelle

    subscription: Subscription;

    constructor(public messageService: MessageService, public effectuerSouscriptionService: EffectuerSouscriptionService, private router: Router) {}

    ngOnInit() {
        // Définir les étapes avec des identifiants uniques
        this.items = [
            {
                id: 'frequence',
                label: 'Fréquence',
                routerLink: 'steps/frequence',
                description: 'Choisir la fréquence de paiement des primes',
                icon: 'pi pi-calendar' // Custom icon for this step
            },
            {
                id: 'paiement',
                label: 'Paiement',
                routerLink: 'steps/paiement',
                description: 'Choisir le mode de paiement des primes',
                icon: 'pi pi-wallet' // Custom icon for this step
            },
            {
                id: 'confirmation',
                label: 'Confirmation',
                routerLink: 'steps/confirmation',
                description: 'Confirmer les informations de souscription',
                icon: 'pi pi-check' // Custom icon for this step
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

        this.subscription = this.effectuerSouscriptionService.souscriptionComplete$.subscribe((souscroptionInformation) => {
            // Submit to API with product ID
            this.submitSouscription();
        });
    }

    // Submit the souscription to API using async/await
    async submitSouscription() {
        const payload: PublicSouscriptionRequest = {
            ... this.effectuerSouscriptionService.getSouscriptionInformation()
        };

        try {
            // Await the API response
            const response = await this.effectuerSouscriptionService.submitSouscriptionAsync(payload);
            this.messageService.add({
                severity: 'success',
                summary: 'Souscription',
                detail: 'Souscription submitted successfully!'
            });
            this.router.navigate(['/site']);
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'There was an error submitting the souscription.'
            });
        }
    }

    // Méthode pour mettre à jour l'étape actuelle en fonction de la route
    public updateCurrentStep() {
        const currentUrl = this.router.url; // Récupérer l'URL actuelle
        const currentRoute = currentUrl.split('/').pop(); // Extraire le dernier segment de l'URL
        const currentItem = this.items.find(item => item.routerLink.endsWith(currentRoute)); // Trouver l'étape actuelle

        // Log pour le débogage
        console.log('Current URL:', currentUrl);
        console.log('Current Step ID:', currentItem ? currentItem.id : 'none');

        // Mettre à jour currentStepId
        this.currentStepId = currentItem ? currentItem.id : this.items[0].id; // Si aucune étape trouvée, réinitialiser à la première étape
    }

    // Méthode pour déterminer l'icône de l'étape en fonction de son état
    getStepIcon(stepId: string): string {
        const step = this.items.find(item => item.id === stepId);
        if (!step) return '';

        if (this.items.findIndex(item => item.id === this.currentStepId) > this.items.findIndex(item => item.id === stepId)) {
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