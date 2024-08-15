import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { RegisterService } from './register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export default class RegisterComponent implements AfterViewInit {
  @ViewChild('login') login!: ElementRef; // Référence à l'élément d'entrée de nom d'utilisateur dans le template

  doNotMatch = false; // Indicateur pour vérifier si les mots de passe ne correspondent pas
  error = false; // Indicateur d'erreur générique
  errorEmailExists = false; // Indicateur d'erreur pour l'adresse e-mail déjà utilisée
  errorUserExists = false; // Indicateur d'erreur pour le nom d'utilisateur déjà utilisé
  success = false; // Indicateur pour afficher le succès de l'inscription

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
    private registerService: RegisterService // Service RegisterService pour la gestion de l'inscription
  ) {
    // Initialisation du formulaire d'inscription avec les champs et les validateurs nécessaires
    this.registerForm = this.fb.group({
      login: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$')
      ]],
      email: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(254),
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50)
      ]],
      confirmPassword: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50)
      ]]
    });
  }

  ngAfterViewInit(): void {
    // Met le focus sur le champ de nom d'utilisateur après l'initialisation de la vue
    this.login.nativeElement.focus();
  }

  // Méthode appelée lors de la soumission du formulaire d'inscription
  register(): void {
    // Réinitialisation des indicateurs d'erreur et de succès
    this.doNotMatch = false;
    this.error = false;
    this.errorEmailExists = false;
    this.errorUserExists = false;

    // Récupération des valeurs du formulaire (mot de passe et confirmation)
    const { password, confirmPassword } = this.registerForm.getRawValue();

    // Vérification si les mots de passe ne correspondent pas
    if (password !== confirmPassword) {
      this.doNotMatch = true;
    } else {
      // Récupération des valeurs de nom d'utilisateur et d'e-mail
      const { login, email } = this.registerForm.getRawValue();

      // Appel du service pour sauvegarder l'inscription avec les données fournies
      this.registerService.save({ login, email, password, imageUrl: '' })
        .subscribe({
          next: () => this.success = true, // Affichage du succès si l'inscription est réussie
          error: response => this.processError(response) // Gestion des erreurs en cas d'échec
        });
    }
  }

  // Méthode privée pour traiter les erreurs HTTP
  private processError(response: HttpErrorResponse): void {
    // Vérification du statut de la réponse et du type d'erreur
    if (response.status === 401) {
      this.errorUserExists = true; // Affichage de l'erreur si le nom d'utilisateur est déjà utilisé
    } else if (response.status === 402) {
      this.errorEmailExists = true; // Affichage de l'erreur si l'e-mail est déjà utilisé
    } else {
      this.error = true; // Affichage d'une erreur générique pour d'autres cas
    }
  }
}
