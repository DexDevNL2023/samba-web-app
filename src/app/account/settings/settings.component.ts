import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { liteUser } from 'src/app/models/user-extra.model';
import { UserExtraService } from '../../service/utilisateur.service';
import { Authority } from '../../config/authority.constants';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})
export default class SettingsComponent implements OnInit {
  success = false; // Indicateur pour afficher le succès de la sauvegarde des paramètres
  settingsForm: FormGroup; // Formulaire de paramètres utilisateur
  user: liteUser | null = {
    id: 1,
    numNiu: '123456789',
    activated: true,
    langKey: 'en',
    imageUrl: 'https://example.com/profile.jpg',
    login: 'johndoe',
    lastName: 'Doe',
    firstName: 'John',
    email: 'johndoe@example.com',
    dateNaissance: new Date('1990-01-01'),
    numCni: 'CNI123456',
    sexe: 'MALE',
    telephone: '+1234567890',
    addresse: '123 Main St',
    ville: 'Sample City',
    pays: 'Sample Country',
    authorities: [Authority.CLIENT],
    signature: 'https://example.com/signature.jpg'
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
    { label: 'Client', value: Authority.CLIENT },
    { label: 'Agent', value: Authority.AGENT },
    { label: 'Administrator', value: Authority.ADMINISTRATOR },
    { label: 'Provider', value: Authority.PROVIDER }
  ];
  selectedAuthorities: string[] = [];
  imageUrlPreview: string | ArrayBuffer | null = null;
  signatureUrlPreview: string | ArrayBuffer | null = null;

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder, // Service FormBuilder pour la construction du formulaire
    private userService: UserExtraService, // Service UserExtraService pour la gestion du compte utilisateur
    public appMain: AppMainComponent
  ) {
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
    // Charge les données du compte utilisateur actuellement authentifié lors de l'initialisation du composant
    this.accountService.identity().subscribe(account => {
      if (account) {
        const userId = account?.id; // Remplacez par la logique pour obtenir l'ID de l'utilisateur actuel
        if (userId) {
          this.userService.find(userId).subscribe((user: liteUser) => {
            this.user = user;
            this.selectedAuthorities = user.authorities || [];
          });
        }
      }
    });
    this.settingsForm.patchValue(this.user); // Remplir le formulaire avec les données de l'utilisateur
    this.updateBreadcrumb(); // Mettre à jour le breadcrumb initial
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
      
      // Appel du service pour sauvegarder les modifications du compte
      this.userService.create(user).subscribe(() => {
        this.success = true; // Affiche le succès de la sauvegarde
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
    return this.user.authorities?.some(auth => authorities.includes(auth)) || false;
  }
}
