import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../core/auth/account.service';
import { Router } from '@angular/router';
import { AppMainComponent } from 'src/app/app.main.component';
import { UserData } from '../../models/user-data.model';
import { Account } from '../../models/account.model';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html'
})
export class ProfilComponent implements OnInit{

    account: Account | null = null; // Compte utilisateur actuel
    data: UserData | null = null; // donnees utilisateur actuel

    constructor(public accountService: AccountService, private router: Router, public appMain: AppMainComponent){}

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

    // Méthode pour rediriger vers les paramètres
    goToSettings(): void {
      this.router.navigate(['/admin/setting']);
    }
}
