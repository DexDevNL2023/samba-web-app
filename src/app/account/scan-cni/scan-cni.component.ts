import { ScanRequest } from './../../models/scan.request';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthentificationService } from './../../service/authentification.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-scan-cni',
    templateUrl: './scan-cni.component.html'
})
export class ScanCniComponent {
    imageUrlPreview: string | ArrayBuffer | null = null;
    error = false; // Indicateur d'erreur générique
    success = false; // Indicateur pour afficher le succès de l'inscription
    errorImageNotExists = false;
    errorEmailExists = false; // Indicateur d'erreur pour l'adresse e-mail déjà utilisée

    registerForm: FormGroup; // Formulaire d'inscription
    items: any = [
        {
            imageUrl: '../../assets/layout/images/claim-declaration.webp',
            title: 'Déclaration de Sinistre',
            description: 'Soumettez vos déclarations de sinistre facilement et suivez leur traitement en temps réel.'
        },
        {
            imageUrl: '../../assets/layout/images/medical-care.png',
            title: 'Prestation de Soins Médicaux',
            description: 'Accédez à une large gamme de services médicaux couverts par vos polices d\'assurance.'
        },
        {
            imageUrl: '../../assets/layout/images/insurance-subscription.png',
            title: 'Souscription et Paiement des Primes',
            description: 'Souscrivez à de nouvelles polices d\'assurance et gérez le paiement de vos primes en ligne.'
        },
        {
            imageUrl: '../../assets/layout/images/claim-refund.png',
            title: 'Réclamation et Remboursement',
            description: 'Suivez le processus de réclamation et recevez vos remboursements de manière efficace et transparente.'
        }
    ];

    constructor(
        private fb: FormBuilder, // Service FormBuilder pour la construction du formulaire
        private authentificationService: AuthentificationService, // Service RegisterService pour la gestion de l'inscription
        private messageService: MessageService
    ) {
    // Initialisation du formulaire d'inscription avec les champs et les validateurs nécessaires
    this.registerForm = this.fb.group({
        email: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(254),
        Validators.email
        ]],
        password: ['', [
        Validators.required,
        Validators.minLength(8), // Minimum de 8 caractères pour le mot de passe pour plus de sécurité
        Validators.maxLength(50)
        ]],
        generatePassword: [false] // Défini par défaut à false
    });
    }

    // Méthode appelée lors de la soumission du formulaire d'inscription
    register(): void {
        // Réinitialisation des indicateurs d'erreur et de succès
        this.error = false;
        this.errorImageNotExists = false;

        if (!this.imageUrlPreview) {
            this.errorImageNotExists = true;
            return;
        }

        if (this.registerForm.valid) {
            const signupRequest: ScanRequest = {
                email: this.registerForm.value.email,
                password: this.registerForm.value.password,
                imageUrl: typeof this.imageUrlPreview === 'string' ? this.imageUrlPreview : '',
                generatePassword: this.registerForm.value.generatePassword
            };

            // Appel au service pour l'inscription avec signupRequest
            this.authentificationService.scanCniRegister(signupRequest).subscribe(
                (response) => {
                    this.success = true;
                    this.registerForm.reset(); // Réinitialise le formulaire
                    this.messageService.add({ key: 'tst', severity: 'success', summary: 'Succès', detail: 'Inscription réussie !' });
                },
                (error) => {
                    // Gérer l'erreur lors de l'inscription
                    this.processError(error);
                    this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erreur', detail: 'Échec de l\'inscription !' });
                }
            );
        }
    }

    // Méthode privée pour traiter les erreurs HTTP
    private processError(response: HttpErrorResponse): void {
        // Vérification du statut de la réponse et du type d'erreur
        if (response.status === 401) {
            this.errorEmailExists = true; // Affichage de l'erreur si l'e-mail est déjà utilisé
        } else {
            this.error = true; // Affichage d'une erreur générique pour d'autres cas
        }
    }

    onFileSelected(event: any): void {
        const file = event.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = reader.result as string; // `result` est de type `string | ArrayBuffer`
            if (typeof result === 'string') { // Assurez-vous que `result` est une chaîne
            this.imageUrlPreview = result;
            } else {
            // Vous pouvez gérer le cas où `result` n'est pas une chaîne si nécessaire
            this.imageUrlPreview = null; // Ou gérer différemment
            }
        };
        reader.readAsDataURL(file);
        }
    }
}
