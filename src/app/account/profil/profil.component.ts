import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../core/auth/account.service';
import { Account } from '../../core/auth/account.model';
import { Router } from '@angular/router';
import { Permission } from '../../models/permission.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppMainComponent } from 'src/app/app.main.component';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html'
})
export class ProfilComponent implements OnInit{
    account: Account | null = null; // Compte utilisateur actuel
    form: FormGroup | null = null;

    constructor(private accountService: AccountService, private router: Router, public appMain: AppMainComponent){}
 
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
        { label: 'Profile', routerLink: '/admin/profile' }
      ];
  
      this.appMain.setBreadcrumbItems(breadcrumbItems); // Call the public method instead
    }

    // Méthode pour obtenir les autorisations de l'utilisateur sous forme de texte
    getAuthoritiesAsText(): string {
      return this.account.authorities.join(', ');
    }

    // Méthode pour vérifier si l'utilisateur a toutes les autorisations dans une liste
    hasAuthority(rules: string[]): boolean {
      // Vérifie si l'autorité spécifiée est présente dans la liste des autorisations
      return rules.every(authority => this.account?.authorities?.includes(authority));
    }

    // Méthode pour rediriger vers les paramètres
    goToSettings(): void {
      const userId = this.account?.id; // Remplacez par la logique pour obtenir l'ID de l'utilisateur actuel
      this.router.navigate(['/admin/setting', userId]);
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
