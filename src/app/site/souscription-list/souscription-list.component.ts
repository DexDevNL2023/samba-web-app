import { AssureService } from './../../service/assure.service';
import { Assure } from './../../models/assure.model';
import { Account } from './../../models/account.model';
import { AccountService } from './../../core/auth/account.service';
import { Souscription, SubscriptionStatus } from './../../models/souscription.model';
import { SouscriptionService } from './../../service/souscription.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-souscription-list',
    templateUrl: './souscription-list.component.html'
})
export class SouscriptionListComponent implements OnInit {
    souscriptions: Souscription[] = [];
    filteredSouscriptions: Souscription[] = [];
    searchQuery: string = '';
    souscriptionStatus = [
        { label: 'On risk', value: SubscriptionStatus.ON_RISK },
        { label: 'Resiliee', value: SubscriptionStatus.RESILIE },
        { label: 'En attente', value: SubscriptionStatus.WAITING }
    ];

    constructor(
        private accountService: AccountService,
        private assureService: AssureService,
        private souscriptionService: SouscriptionService,
        private router: Router
    ) {}

    ngOnInit(): void {
        // On recupere l'utilisateur actuel
        const account: Account = this.accountService.getCurrentAccount();
        if (account) {
            this.loadSouscriptions(account.id);
        } else {
            this.router.navigate(['/login']);
        }

        // S'abonne à l'état d'authentification pour obtenir le compte utilisateur
        this.accountService.getUserState().subscribe(account => {
            if (account) {
                this.loadSouscriptions(account.id);
            }
        });
        console.info('Chargement des souscriptions reussi');
    }

    // Charger les souscriptions à partir du service
    async loadSouscriptions(userId: number): Promise<void> {
        try {
            const assure: Assure = await this.assureService.getAssureByUserId(userId).toPromise();
            if (assure) {
                const data = await this.souscriptionService.getAllByAssureId(assure.id).toPromise();
                this.souscriptions = data;
                this.filteredSouscriptions = data; // Initialement, tous les souscriptions sont affichés
            }
        } catch (error) {
            console.error('Erreur lors du chargement des souscriptions:', error);
            // Gérer l'erreur selon vos besoins (par exemple, afficher un message d'erreur)
        }
    }

    // Méthode pour filtrer les souscriptions en fonction de la recherche
    onGlobalFilter(): void {
        if (this.searchQuery) {
            this.filteredSouscriptions = this.souscriptions.filter(souscription =>
                (souscription.dateSouscription ? souscription.dateSouscription.toISOString().toLowerCase() : '').includes(this.searchQuery.toLowerCase()) ||
                (souscription.dateExpiration ? souscription.dateExpiration.toISOString().toLowerCase() : '').includes(this.searchQuery.toLowerCase()) ||
                (souscription.montantCotisation ? souscription.montantCotisation.toString().toLowerCase() : '').includes(this.searchQuery.toLowerCase()) ||
                souscription.numeroSouscription?.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        } else {
            this.filteredSouscriptions = this.souscriptions; // Réinitialiser si le champ de recherche est vide
        }
    }

    // Méthode pour gérer la sélection du souscription et rediriger vers le détail
    onSelectSouscription(id: number): void {
        this.router.navigate(['/souscription/detail', id]);
    }

    protected getEnumLabel(value: string) {
        const enumObj = this.souscriptionStatus.find((e: any) => e.value === value);
        return enumObj ? enumObj.label : value;
    }

    // Method to get the severity class based on the entity status
    protected getSeverity(status: string): string {
        switch (status) {
            // SubscriptionStatus
            case 'ACTIVE':
                return 'info';
            case 'ON_RISK':
                return 'success';
            case 'WAITING':
                return 'warning';
            case 'RESILIE':
                return 'danger';

            default:
                return 'default';
        }
    }
}
