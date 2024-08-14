import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../core/auth/account.service';
import { Router } from '@angular/router';
import { AppMainComponent } from 'src/app/app.main.component';
import { PaymentFrequency, SubscriptionStatus } from '../../models/souscription.model';
import { UserData } from '../../models/user-data.model';
import { Account } from '../../models/account.model';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html'
})
export class ProfilComponent implements OnInit{
  
    account: Account | null = null; // Compte utilisateur actuel
    data: UserData | null = {
      rules: [
        {
          id: 1,
          moduleKey: 'SINISTRE_MODULE',
          libelle: 'Gestion des sinistres',
          permissions: [
            {
              id: 1,
              permissionKey: 'READ_PERMISSION',
              libelle: 'Consulter'
            },
            {
              id: 2,
              permissionKey: 'EDIT_PERMISSION',
              libelle: 'Modifier'
            },
            {
              id: 3,
              permissionKey: 'PRINT_PERMISSION',
              libelle: 'Imprimer'
            }
          ]
        },
        {
          id: 2,
          moduleKey: 'SUBSCRIPTION_MODULE',
          libelle: 'Gestion des souscription',
          permissions: [
            {
              id: 1,
              permissionKey: 'WRITE_PERMISSION',
              libelle: 'Ajouter'
            }, 
            {
              id: 2,
              permissionKey: 'DELET_PERMISSION',
              libelle: 'Supprimer'
            }
          ]
        }
      ],
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

    constructor(private accountService: AccountService, private router: Router, public appMain: AppMainComponent){}
 
    ngOnInit(): void {
        // Charge les données du compte utilisateur actuellement authentifié lors de l'initialisation du composant
        this.accountService.identity().subscribe(account => {
          if (account) {
            this.account = account;
            const userId = account?.id; // Remplacez par la logique pour obtenir l'ID de l'utilisateur actuel
            if (userId) {
              this.accountService.getUserDetails(userId).subscribe((data: UserData) => {
                this.data = data;
              });
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
}
