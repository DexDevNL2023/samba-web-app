import { MessageService } from 'primeng/api';
import { AuthentificationService } from './../../../service/authentification.service';
import { Component, AfterViewInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-password-reset-init',
  templateUrl: './password-reset-init.component.html',
})
export default class PasswordResetInitComponent implements AfterViewInit {
  @ViewChild('email') email!: ElementRef;

  success = false; // Variable pour gérer l'état de succès initialisée à false
  resetRequestForm: FormGroup; // Formulaire réactif pour la demande de réinitialisation
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
    private authentificationService: AuthentificationService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    // Initialisation du formulaire réactif avec les champs nécessaires et validations
    this.resetRequestForm = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
    });
  }

  ngAfterViewInit(): void {
    this.email.nativeElement.focus(); // Définit le focus sur l'élément email après l'initialisation de la vue
  }

  // Méthode pour soumettre la demande de réinitialisation du mot de passe
  requestReset(): void {
    if (this.resetRequestForm.valid) { // Vérifie si le formulaire est valide avant de soumettre
      const email: string = this.resetRequestForm.get('email')!.value; // Récupère la valeur de l'email depuis le formulaire

      // Appel du service pour sauvegarder la demande de réinitialisation
      this.authentificationService.forgotPassword(email).subscribe(() => {
        this.success = true; // Définit l'état de succès à true après une réponse réussie
        this.resetRequestForm.reset(); // Réinitialise le formulaire
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Reinitialisation du mot de passe',
          detail: 'Vérifiez votre e-mail pour les détails sur la réinitialisation de votre mot de passe.' });
      });
    }
  }
}
