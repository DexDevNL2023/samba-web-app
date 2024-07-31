import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { Account, Authority } from '../../models/account.model';
import { Gender } from '../../models/assure.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})
export default class SettingsComponent implements OnInit {
  success = false; // Indicateur pour afficher le succès de la sauvegarde des paramètres
  settingsForm: FormGroup; // Formulaire de paramètres utilisateur
  user: any | null = {
    id: 1,
    // Champ commun
    email: 'victor.nlang@teleo.com',
    telephone: '1234567890',

    // Admin et agent
    activated: true,
    authorities: ['ROLE_CLIENT'],
    fullName: 'Victor Nlang',
    langKey: 'en',
    login: 'victor.nlang',
    imageUrl: '',

    // Client
      numNiu: 'NIU123456789',
      lastName: 'Doe',
      firstName: 'John',
      dateNaissance: new Date('1985-01-15'),
      numCni: 'CNI12345678',
      sexe: Gender.MALE,
      addresse: '123 Main St, Douala',
      signature: 'john_doe_signature.png',

    // Provider
      nom: 'Clinique Santé Plus',
      adresse: '123 Rue de la Santé, Libreville - Gabon',
      servicesFournis: 'Consultations, Soins Paramédicaux'
  }; // Utilisateur actuel
  currentYear: number = new Date().getFullYear();
  languages = [
    { label: 'Francais', value: 'fr' },
    { label: 'Anglais', value: 'en' }
  ];
  genders = [
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' },
    { label: 'Other', value: 'OTHER' }
  ];
  authorities = [
    { label: 'Assuré', value: Authority.CLIENT },
    { label: 'Agent', value: Authority.AGENT },
    { label: 'Administrateur', value: Authority.ADMIN },
    { label: 'Fournisseur', value: Authority.PROVIDER }
  ];
  selectedAuthorities: string[] = [];
  imageUrlPreview: string | ArrayBuffer | null = null;
  signatureUrlPreview: string | ArrayBuffer | null = null;
  account: Account | null = null;

  constructor(
    private accountService: AccountService, // Service pour la gestion du compte utilisateur
    private formBuilder: FormBuilder, // Service FormBuilder pour la construction du formulaire
    public appMain: AppMainComponent
  ) {
    // Initialisation du formulaire avec les champs et validateurs nécessaires
    this.settingsForm = this.formBuilder.group({});
  } 
  
  ngOnInit(): void {
    // Charge les données du compte utilisateur actuellement authentifié lors de l'initialisation du composant
    this.accountService.identity().subscribe(account => {
      this.account = account;
      console.log(this.account.authorities);
      this.selectedAuthorities = this.account.authorities;
      console.log(this.selectedAuthorities);
      if (this.account) {
        const userId = this.account.id; // Remplacez par la logique pour obtenir l'ID de l'utilisateur actuel
        if (userId) {
          this.accountService.findUser(userId).subscribe((user: any) => {
            this.user = user;
          });
        }
      }
    });
    // Remplir le formulaire avec les données de l'utilisateur
    this.rebuildFormBasedOnAuthorities();
    this.settingsForm.patchValue(this.user);
    this.updateBreadcrumb(); // Mettre à jour le breadcrumb initial
  }

  private rebuildFormBasedOnAuthorities(): void {
    if (this.account?.authorities.includes(Authority.PROVIDER)) {
      this.buildProviderForm();
    } else if (this.account?.authorities.includes(Authority.CLIENT)) {
      this.buildAssureForm();
    } else {
      this.buildDefaultUserForm();
    }
  }

  private buildProviderForm(): void {
    this.settingsForm.addControl('nom', this.formBuilder.control('', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]));
    this.settingsForm.addControl('telephone', this.formBuilder.control('', Validators.required));
    this.settingsForm.addControl('email', this.formBuilder.control('', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(254)]));
    this.settingsForm.addControl('adresse', this.formBuilder.control(''));
    this.settingsForm.addControl('servicesFournis', this.formBuilder.control(''));
    this.settingsForm.addControl('branches', this.formBuilder.control([]));
  }

  private buildAssureForm(): void {
    this.settingsForm.addControl('numNiu', this.formBuilder.control(''));
    this.settingsForm.addControl('firstName', this.formBuilder.control('', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]));
    this.settingsForm.addControl('lastName', this.formBuilder.control('', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]));
    this.settingsForm.addControl('email', this.formBuilder.control('', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(254)]));
    this.settingsForm.addControl('dateNaissance', this.formBuilder.control(''));
    this.settingsForm.addControl('numCni', this.formBuilder.control('', Validators.required));
    this.settingsForm.addControl('sexe', this.formBuilder.control(''));
    this.settingsForm.addControl('telephone', this.formBuilder.control('', Validators.required));
    this.settingsForm.addControl('addresse', this.formBuilder.control(''));
    this.settingsForm.addControl('signature', this.formBuilder.control(''));
    this.settingsForm.addControl('dossiers', this.formBuilder.control([]));
  }

  private buildDefaultUserForm(): void {
    this.settingsForm.addControl('fullName', this.formBuilder.control('', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]));
    this.settingsForm.addControl('email', this.formBuilder.control('', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(254)]));
    this.settingsForm.addControl('langKey', this.formBuilder.control('', Validators.required));
    this.settingsForm.addControl('activated', this.formBuilder.control(false, Validators.required));
    this.settingsForm.addControl('authorities', this.formBuilder.control([]));
    this.settingsForm.addControl('imageUrl', this.formBuilder.control(''));
    this.settingsForm.addControl('login', this.formBuilder.control(''));
  }

  private updateBreadcrumb() {
    // Mettre à jour le breadcrumb en fonction du contexte
    const breadcrumbItems = [
      { icon: 'pi pi-home', routerLink: '/admin' },
      { label: 'Profile setting', routerLink: '/admin/setting' }
    ];

    this.appMain.setBreadcrumbItems(breadcrumbItems); // Call the public method instead
  }

  // Méthode pour sauvegarder les paramètres utilisateur modifiés
  save(): void {
    this.success = false;

    if (this.user) {
      // Fusionne les données du compte avec les valeurs actuelles du formulaire
      const user = { ...this.user, ...this.settingsForm.getRawValue() };
      
      // Charge les données du compte utilisateur actuellement authentifié lors de l'initialisation du composant
      this.accountService.identity().subscribe(account => {
        this.account = account;
        console.log(this.account.authorities);
        this.selectedAuthorities = this.account.authorities;
        console.log(this.selectedAuthorities);
        if (this.account) {
          const userId = this.account.id; // Remplacez par la logique pour obtenir l'ID de l'utilisateur actuel
          if (userId) {
            // Appel du service pour sauvegarder les modifications du compte
            this.accountService.updateUser(userId, user).subscribe(() => {
              this.success = true; // Affiche le succès de la sauvegarde
            });
          }
        }
      });
    }
  }

  onFileSelected(field: string, event: any): void {
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (field === 'imageUrl') {
          this.imageUrlPreview = reader.result;
        } else if (field === 'signature') {
          this.signatureUrlPreview = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  hasAuthority(authorities: string[]): boolean {
    return this.account.authorities?.some(auth => authorities.includes(auth)) || false;
  }
}
