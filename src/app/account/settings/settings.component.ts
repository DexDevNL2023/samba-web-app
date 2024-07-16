import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LANGUAGES } from '../../config/language.constants';
import { UserExtra } from 'src/app/models/user-extra.model';
import { UserExtraService } from '../../service/utilisateur.service';
import { ActivatedRoute } from '@angular/router';
import { Authority } from '../../config/authority.constants';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})
export default class SettingsComponent implements OnInit {
  success = false; // Indicateur pour afficher le succès de la sauvegarde des paramètres
  languages = LANGUAGES; // Liste des langues disponibles
  settingsForm: FormGroup; // Formulaire de paramètres utilisateur
  user: UserExtra | null = null; // Utilisateur
  authorities: any[]; // Utilisez un tableau d'objets pour p-multiSelect
  currentYear: number = new Date().getFullYear();

  constructor(
    private formBuilder: FormBuilder, // Service FormBuilder pour la construction du formulaire
    private userService: UserExtraService, // Service UserExtraService pour la gestion du compte utilisateur
    private route: ActivatedRoute // Service ActivatedRoute pour accéder aux paramètres de la route
  ) {
    // Mapping des valeurs de l'énumération avec des libellés personnalisés
    this.authorities = Object.values(Authority).map(key => ({
      value: key,
      label: this.getLabelForAuthority(key) // Utilisation d'une fonction pour obtenir le libellé
    }));

    // Initialisation du formulaire avec les champs et validateurs nécessaires
    this.settingsForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(254)]],
      langKey: ['', Validators.required],
      activated: [false, Validators.required],
      authorities: [[]],
      imageUrl: [''],
      login: ['', Validators.required],
      numNiu: [''],
      dateNaissance: [''],
      numCni: ['', Validators.required],
      sexe: [''],
      telephone: ['', Validators.required],
      addresse: [''],
      ville: [''],
      pays: [''],
      signature: [''],
    });
  }
  
  ngOnInit(): void {
    // Récupère l'ID de l'utilisateur à partir des paramètres de la route
    this.route.paramMap.subscribe(params => {
      const userId = +params.get('id')!;
      if (userId) {
        this.userService.find(userId).subscribe((user: UserExtra) => {
          this.user = user;
          this.settingsForm.patchValue(user); // Remplir le formulaire avec les données de l'utilisateur
        });
      }
    });
  }

  getLabelForAuthority(authority: string): string {
    // Fonction pour obtenir le libellé correspondant à chaque autorité
    switch (authority) {
      case Authority.CLIENT:
        return 'Client';
      case Authority.AGENT:
        return 'Agent';
      case Authority.ADMINISTRATOR:
        return 'Administrateur';
      case Authority.PROVIDER:
        return 'Partenaire';
      default:
        return 'Inconnu';
    }
  }

  // Méthode pour sauvegarder les paramètres utilisateur modifiés
  save(): void {
    this.success = false;

    if (this.user) {
      // Fusionne les données du compte avec les valeurs actuelles du formulaire
      const user = { ...this.user, ...this.settingsForm.getRawValue() };
      
      // Appel du service pour sauvegarder les modifications du compte
      this.userService.create(user).subscribe(() => {
        this.success = true; // Affiche le succès de la sauvegarde
      });
    }
  }

  // Méthode appelée lorsqu'un fichier est sélectionné pour imageUrl ou signature
  onFileSelected(field: string, event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Met à jour la valeur du champ dans le formulaire avec le fichier sélectionné
      this.settingsForm.patchValue({
        [field]: file
      });
    }
  }

  // Méthode pour vérifier si l'utilisateur a toutes les autorisations dans une liste
  hasAuthority(rules: string[]): boolean {
    // Récupère les autorisations actuelles de l'utilisateur depuis le formulaire
    const authorities = this.settingsForm.get('authorities')?.value;
    // Vérifie si l'autorité spécifiée est présente dans la liste des autorisations
    return rules.every(authority => authorities?.includes(authority));
  }
}
