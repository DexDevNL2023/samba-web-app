import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { AccountService } from '../core/auth/account.service';
import { LoginService } from './login.service';
import { Login } from './login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export default class LoginComponent implements OnInit, AfterViewInit {
  // Décorateur pour accéder à l'élément du DOM avec la référence 'username'
  @ViewChild('username') username!: ElementRef;

  // Signal pour gérer l'état d'erreur d'authentification
  authenticationError = false;
  loginForm: FormGroup;
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

  // Injection des services nécessaires
  constructor(private fb: FormBuilder, private accountService: AccountService, private loginService: LoginService, private router: Router) {
    // Formulaire de connexion avec validation des champs
    this.loginForm = this.fb.group({
      username: ['', Validators.required],  // Champ 'username' obligatoire
      password: ['', Validators.required],  // Champ 'password' obligatoire
      rememberMe: [false, Validators.required], // Champ 'rememberMe' obligatoire
    });
  }

  // Méthode exécutée à l'initialisation du composant
  ngOnInit(): void {
    /* if (this.accountService.isAuthenticated()) {
      // Redirige vers la page d'acceuil si authentifié
      this.router.navigate(['/admin']);
    } */
  }

  // Méthode exécutée après l'initialisation de la vue
  ngAfterViewInit(): void {
    // Met le focus sur le champ 'username'
    this.username.nativeElement.focus();
  }

  // Méthode pour gérer la soumission du formulaire de connexion
  login(): void {
    // Récupère les valeurs du formulaire
    const loginData = this.loginForm.getRawValue();
    // Appelle le service de connexion avec les données du formulaire
    this.loginService.login(loginData).subscribe({
      next: () => {
        // Réinitialise l'état d'erreur d'authentification
        this.authenticationError = false;
        // Si aucune navigation en cours, redirige vers la page d'acceuil
        if (!this.router.getCurrentNavigation()) {
          this.router.navigate(['/admin']);
        }
      },
      // En cas d'erreur, met à jour l'état d'erreur d'authentification
      error: () => {
        this.authenticationError = true;
      }
    });
  }
}