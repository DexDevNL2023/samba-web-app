import { MessageService } from 'primeng/api';
import { SignupRequest } from './../../models/signup.request';
import { AuthentificationService } from './../../service/authentification.service';
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

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
  imageUrlPreview: string | ArrayBuffer | null = null;

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
      fullName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100) // Ajout d'une limite de longueur pour fullName
      ]],
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
        Validators.minLength(8), // Minimum de 8 caractères pour le mot de passe pour plus de sécurité
        Validators.maxLength(50)
      ]],
      confirmPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50)
      ]],
      generatePassword: [false] // Défini par défaut à false
    }, {
      validator: this.matchPasswords('password', 'confirmPassword') // Validation personnalisée pour les mots de passe
    });
  }

  ngAfterViewInit(): void {
    // Met le focus sur le champ de nom d'utilisateur après l'initialisation de la vue
    this.login.nativeElement.focus();
  }

  // Méthode pour valider la correspondance des mots de passe
  matchPasswords(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors['mismatch']) {
        // Ne pas changer les erreurs existantes s'il y en a d'autres
        return null;
      }

      // Si les mots de passe ne correspondent pas
      if (passwordControl.value !== confirmPasswordControl.value) {
        this.doNotMatch = true;
        confirmPasswordControl.setErrors({ mismatch: true });
      } else {
        confirmPasswordControl.setErrors(null); // Réinitialiser les erreurs si ça correspond
      }
    };
  }

  // Méthode appelée lors de la soumission du formulaire d'inscription
  register(): void {
    // Réinitialisation des indicateurs d'erreur et de succès
    this.doNotMatch = false;
    this.error = false;
    this.errorEmailExists = false;
    this.errorUserExists = false;

    if (this.registerForm.valid) {
      const signupRequest: SignupRequest = {
        fullName: this.registerForm.value.fullName,
        login: this.registerForm.value.login,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        imageUrl: typeof this.imageUrlPreview === 'string' ? this.imageUrlPreview : '',
        generatePassword: this.registerForm.value.generatePassword
      };

      // Appel au service pour l'inscription avec signupRequest
      this.authentificationService.register(signupRequest).subscribe(
        (response) => {
          console.log('Inscription réussie', response);
          // Gérer le succès de l'inscription
          this.success = true;
          this.registerForm.reset(); // Réinitialise le formulaire
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Creation de compte',
            detail: 'Inscription réussie ! Veuillez vérifier votre email pour confirmation.' });
        },
        (error) => {
          console.error('Erreur lors de l\'inscription', error);
          // Gérer l'erreur lors de l'inscription
          this.processError(error);
        }
      );
    } else {
      console.log('Le formulaire est invalide');
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
          console.error('Le résultat de la lecture du fichier n\'est pas une chaîne');
          this.imageUrlPreview = null; // Ou gérer différemment
        }
      };
      reader.readAsDataURL(file);
    }
  }
}
