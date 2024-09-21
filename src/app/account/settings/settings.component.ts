import { MessageService } from 'primeng/api';
import { UserRequest } from './../../models/user.request.model';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { Account, Authority } from '../../models/account.model';
import { Gender } from '../../models/assure.model';
import { AccountCrudService } from '../../service/account.crud.service';
import { UserResponse } from '../../models/user.response.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})
export default class SettingsComponent implements OnInit {
  success = false; // Indicateur pour afficher le succès de la sauvegarde des paramètres
  settingsForm: FormGroup; // Formulaire de paramètres utilisateur
  user: UserResponse | null = null; // Utilisateur actuel
  currentYear: number = new Date().getFullYear();
  languages = [
    { label: 'Francais', value: 'fr' },
    { label: 'Anglais', value: 'en' }
  ];
  genders = [
    { label: 'Male', value: Gender.MALE },
    { label: 'Female', value: Gender.FEMALE },
    { label: 'Other', value: Gender.OTHER }
  ];
  authorities = [
    { label: 'Assuré', value: Authority.CLIENT },
    { label: 'Agent', value: Authority.AGENT },
    { label: 'Administrateur', value: Authority.ADMIN },
    { label: 'Fournisseur', value: Authority.PROVIDER }
  ];
  imageUrlPreview: string | ArrayBuffer | null = null;
  signatureUrlPreview: string | ArrayBuffer | null = null;
  account: Account | null = null;

  constructor(
    public accountCrudService: AccountCrudService,
    public accountService: AccountService, // Service pour la gestion du compte utilisateur
    private formBuilder: FormBuilder, // Service FormBuilder pour la construction du formulaire
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    public appMain: AppMainComponent
  ) {
    // Initialisation du formulaire avec les champs et validateurs nécessaires
    this.settingsForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    // Charge les données du compte utilisateur actuellement authentifié lors de l'initialisation du composant
    this.accountService.getUserState().subscribe(account => {
      if (account) {
        this.account = account;
        const userId = this.account?.id; // Remplacez par la logique pour obtenir l'ID de l'utilisateur actuel
        if (userId) {
          this.accountCrudService.getProfile(userId).subscribe(
            (user: UserResponse) => {
              console.log(user);
              if (user) {
                this.user = user;
                this.rebuildFormBasedOnAuthorities();
                const userAuthority = this.user.authority ? [this.user.authority] : [];
                const userLanguage = this.user.langKey ? this.user.langKey : 'fr';
                this.settingsForm.patchValue({
                  ...this.user,
                  authority: userAuthority,
                  langKey: userLanguage
                });
                this.cdr.detectChanges();
              }
            },
            (error) => {
              console.error('Erreur lors de la récupération du profil utilisateur:', error);
            }
          );
        }
      }
    });

    // Remplir le formulaire avec les données de l'utilisateur
    this.rebuildFormBasedOnAuthorities();
    this.settingsForm.patchValue(this.user);

    // Force change detection
    this.cdr.detectChanges();

    this.updateBreadcrumb(); // Mettre à jour le breadcrumb initial
  }

  private rebuildFormBasedOnAuthorities(): void {
    if (this.account?.authority) { // Vérifiez si 'authority' est défini
      if (this.account.authority === Authority.PROVIDER) {
        console.log('fournisseur');
        this.buildProviderForm();
      } else if (this.account.authority === Authority.CLIENT) {
        console.log('assure');
        this.buildAssureForm();
      } else {
        console.log('agent ou admin');
        this.buildDefaultUserForm();
      }
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
    this.settingsForm.addControl('adresse', this.formBuilder.control(''));
    this.settingsForm.addControl('signature', this.formBuilder.control(''));
    this.settingsForm.addControl('dossiers', this.formBuilder.control([]));
  }

  private buildDefaultUserForm(): void {
    this.settingsForm.addControl('fullName', this.formBuilder.control('', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]));
    this.settingsForm.addControl('email', this.formBuilder.control('', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(254)]));
    this.settingsForm.addControl('langKey', this.formBuilder.control('', Validators.required));
    this.settingsForm.addControl('actived', this.formBuilder.control(false, Validators.required));
    this.settingsForm.addControl('authority', this.formBuilder.control(''));
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
      let user: UserRequest;

      // Vérifier l'autorité de l'utilisateur
      switch (this.user.authority) {
        case Authority.PROVIDER:
          user = {
            ...this.user,
            fullName: this.settingsForm.getRawValue().nom, // Utiliser le nom du fournisseur
            ...this.settingsForm.getRawValue() // Inclure les autres paramètres
          };
          break;

        case Authority.CLIENT:
          user = {
            ...this.user,
            fullName: `${this.settingsForm.getRawValue().firstName} ${this.settingsForm.getRawValue().lastName}`, // Concatenation du prénom et du nom
            ...this.settingsForm.getRawValue() // Inclure les autres paramètres
          };
          break;

        default:
          user = { ...this.user, ...this.settingsForm.getRawValue() }; // Utiliser les valeurs par défaut
          break;
      }

      // Appel du service pour sauvegarder les modifications du compte
      this.accountCrudService.updateProfile(user).subscribe(() => {
        this.success = true; // Affiche le succès de la sauvegarde
        //this.settingsForm.reset(); // Réinitialise le formulaire
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Modification du profil',
          detail: 'Mise à jour du profil avec succès' });

        // Recharge les données du compte utilisateur authentifié
        this.accountService.identity(true);
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
}
