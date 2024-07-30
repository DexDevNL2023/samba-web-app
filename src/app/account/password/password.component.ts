import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { PasswordService } from './password.service';
import { AccountService } from '../../core/auth/account.service';
import { AppMainComponent } from '../../app.main.component';
import { Account } from '../../models/account.model';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
})
export default class PasswordComponent implements OnInit {
  doNotMatch = false; // Indicateur pour afficher une erreur si les nouveaux mots de passe ne correspondent pas
  error = false; // Indicateur pour afficher une erreur générale lors de la modification du mot de passe
  success = false; // Indicateur pour afficher un message de succès après la modification du mot de passe
  account: Account | null = null; // Compte utilisateur actuel
  passwordForm: FormGroup; // Formulaire de modification du mot de passe

  constructor(
    private formBuilder: FormBuilder, // Service FormBuilder pour la construction de formulaires
    private passwordService: PasswordService, // Service PasswordService pour la gestion du mot de passe
    private accountService: AccountService, // Service AccountService pour la gestion du compte utilisateur
    public appMain: AppMainComponent
  ) {
    // Initialisation du formulaire de modification du mot de passe avec des champs et des validateurs
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required]], // Champ pour le mot de passe actuel, requis
      newPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]], // Champ pour le nouveau mot de passe, requis avec une longueur minimale et maximale
      confirmPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]], // Champ pour la confirmation du nouveau mot de passe, requis avec une longueur minimale et maximale
    });
  }
 
  ngOnInit(): void {
    // Charge les données du compte utilisateur actuellement authentifié lors de l'initialisation du composant
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;
      }
    });
    this.updateBreadcrumb(); // Mettre à jour le breadcrumb initial
  }

  private updateBreadcrumb() {
    // Mettre à jour le breadcrumb en fonction du contexte
    const breadcrumbItems = [
      { icon: 'pi pi-home', routerLink: '/admin' },
      { label: 'Change password', routerLink: '/admin/password' }
    ];

    this.appMain.setBreadcrumbItems(breadcrumbItems); // Call the public method instead
  }

  // Méthode appelée lors de la soumission du formulaire de modification du mot de passe
  changePassword(): void {
    this.error = false; // Réinitialise l'indicateur d'erreur générale
    this.success = false; // Réinitialise l'indicateur de succès
    this.doNotMatch = false; // Réinitialise l'indicateur d'erreur de non-correspondance des mots de passe

    const { newPassword, confirmPassword, currentPassword } = this.passwordForm.value; // Récupère les valeurs des champs du formulaire

    // Vérifie si les nouveaux mots de passe ne correspondent pas
    if (newPassword !== confirmPassword) {
      this.doNotMatch = true; // Active l'indicateur de non-correspondance des mots de passe
    } else {
      // Appelle le service pour sauvegarder le nouveau mot de passe
      this.passwordService.save(newPassword, currentPassword).subscribe({
        next: () => {
          this.success = true; // Affiche un message de succès après la modification du mot de passe
          this.passwordForm.reset(); // Réinitialise le formulaire
        },
        error: () => {
          this.error = true; // Affiche une erreur en cas d'échec de la modification du mot de passe
        },
      });
    }
  }
}
