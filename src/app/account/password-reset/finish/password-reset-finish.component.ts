import { MessageService } from 'primeng/api';
import { AuthentificationService } from './../../../service/authentification.service';
import { Component, Inject, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-password-reset-finish',
  templateUrl: './password-reset-finish.component.html',
})
export default class PasswordResetFinishComponent implements OnInit, AfterViewInit {
  @ViewChild('newPassword') newPassword!: ElementRef; // Vue enfant pour accéder au champ de nouveau mot de passe dans le template

  initialized = false; // Indicateur pour suivre l'état d'initialisation du composant
  doNotMatch = false; // Indicateur pour afficher une erreur si les nouveaux mots de passe ne correspondent pas
  error = false; // Indicateur pour afficher une erreur générale lors de la réinitialisation du mot de passe
  success = false; // Indicateur pour afficher un message de succès après la réinitialisation du mot de passe
  key = '1234'; // Clé unique utilisée pour identifier la demande de réinitialisation du mot de passe

  passwordForm: FormGroup; // Formulaire de réinitialisation du mot de passe
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
    private formBuilder: FormBuilder, // Service FormBuilder pour la construction de formulaires
    private authentificationService: AuthentificationService, // Service PasswordResetFinishService pour la gestion de la réinitialisation du mot de passe
    private route: ActivatedRoute, // Service ActivatedRoute pour accéder aux paramètres de l'URL
    private messageService: MessageService
  ) {
    // Initialisation du formulaire de réinitialisation du mot de passe avec des champs et des validateurs
    this.passwordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]], // Champ pour le nouveau mot de passe, requis avec une longueur minimale et maximale
      confirmPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]], // Champ pour la confirmation du nouveau mot de passe, requis avec une longueur minimale et maximale
    });
  }

  ngOnInit(): void {
    // Abonne à la modification des paramètres d'URL
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.key = params['token']; // Récupère la clé unique à partir des paramètres d'URL
      }
      this.initialized = true; // Marque l'initialisation du composant comme terminée
    });
  }

  ngAfterViewInit(): void {
    // Focus sur le champ de nouveau mot de passe après l'affichage de la vue
    this.newPassword.nativeElement.focus();
  }

  // Méthode appelée lors de la soumission du formulaire de réinitialisation du mot de passe
  finishReset(): void {
    this.doNotMatch = false; // Réinitialise l'indicateur d'erreur de non-correspondance des mots de passe
    this.error = false; // Réinitialise l'indicateur d'erreur générale

    const { newPassword, confirmPassword } = this.passwordForm.value; // Récupère les valeurs des champs du formulaire

    // Vérifie si les nouveaux mots de passe ne correspondent pas
    if (newPassword !== confirmPassword) {
      this.doNotMatch = true; // Active l'indicateur de non-correspondance des mots de passe
    } else {
      // Appelle le service pour sauvegarder le nouveau mot de passe
      this.authentificationService.resetPassword(this.key, newPassword).subscribe({
        next: () => {
          this.success = true; // Affiche un message de succès après la réinitialisation du mot de passe
          this.passwordForm.reset(); // Réinitialise le formulaire
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Reinitialisation du mot de passe',
            detail: 'Votre mot de passe a été réinitialisé. Veuillez vous!' });
        },
        error: () => {
          this.error = true; // Affiche une erreur en cas d'échec de la réinitialisation du mot de passe
        },
      });
    }
  }
}
