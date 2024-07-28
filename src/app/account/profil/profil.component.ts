import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../core/auth/account.service';
import { Account } from '../../core/auth/account.model';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppMainComponent } from 'src/app/app.main.component';
import { PaymentFrequency, SubscriptionStatus } from '../../models/souscription.model';
import { UserData } from '../../models/user-data.model';
import { AssureService } from '../../service/assure.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html'
})
export class ProfilComponent implements OnInit{
    account: Account | null = null; // Compte utilisateur actuel
    form: FormGroup | null = null;
    data: UserData | null = {
      registrant: {
        id: 1,
        numeroRegistrant: '2024-RG-5678',
        branche: { id: 1,  ville: 'Douala'},
        partenaire: { id: 1, nom: 'Pharmacie du soliel' }
      },
      dossiers: [
        {
          id: 1,
          numDossierMedical: 'MR123456',
          dateUpdated: new Date('2024-01-01')
        },
        {
          id: 2,
          numDossierMedical: 'MR123457',
          dateUpdated: new Date('2024-02-01')
        }
      ],
      souscriptions: [
        {
          id: 1,
          numeroSouscription: 'SUB123456',
          dateSouscription: new Date('2023-01-01'),
          dateExpiration: new Date('2024-01-01'),
          status: SubscriptionStatus.ACTIVE,
          frequencePaiement: PaymentFrequency.MENSUEL
        },
        {
          id: 2,
          numeroSouscription: 'SUB123457',
          dateSouscription: new Date('2023-02-01'),
          dateExpiration: new Date('2024-02-01'),
          status: SubscriptionStatus.RESILIE,
          frequencePaiement: PaymentFrequency.ANNUEL
        }
      ]
    }; // donnees utilisateur actuel

    constructor(private accountService: AccountService, private assureService: AssureService, private router: Router, public appMain: AppMainComponent){}
 
    ngOnInit(): void {
        // Charge les données du compte utilisateur actuellement authentifié lors de l'initialisation du composant
        this.accountService.identity().subscribe(account => {
          if (account) {
            this.account = account;
            const userId = account?.id; // Remplacez par la logique pour obtenir l'ID de l'utilisateur actuel
            if (userId) {
              if(this.hasAuthority(['ROLE_CLIENT'])) {
                this.assureService.getUserDetails(userId).subscribe((data: UserData) => {
                  this.data = data;
                });
              }
            }
          }
        });
        this.updateBreadcrumb(); // Mettre à jour le breadcrumb initial
    }

    private updateBreadcrumb() {
      // Mettre à jour le breadcrumb en fonction du contexte
      const breadcrumbItems = [
        { icon: 'pi pi-home', routerLink: '/admin' },
        { label: 'Profile', routerLink: '/admin/profile' }
      ];
  
      this.appMain.setBreadcrumbItems(breadcrumbItems); // Call the public method instead
    }

    // Méthode pour obtenir les autorisations de l'utilisateur sous forme de texte
    getAuthoritiesAsText(): string {
      return this.account.authorities.join(', ');
    }

    // Méthode pour vérifier si l'utilisateur a toutes les autorisations dans une liste
    hasAuthority(authorities: string[]): boolean {
      return this.account.authorities?.some(auth => authorities.includes(auth)) || false;
    }
 
    // Méthode pour rediriger vers les paramètres
    goToSettings(): void {
      this.router.navigate(['/admin/setting']);
    }

    updatePermission(id: number, event: any){
      if(this.hasAuthority(['ROLE_ADMINISTRATOR'])) {
        this.form = new FormGroup({
          "id": new FormControl(id),
          "haveAccess": new FormControl(event.checked, [Validators.required]),
        })
  
        this.accountService.changePermission(this.form.value).subscribe(data => {
          this.ngOnInit();    
        });
      }
    }
}
