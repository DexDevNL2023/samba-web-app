import { DemandeRemboursementService } from './../../service/demande-remboursement.service';
import { Prestation, PrestationStatus } from './../../models/prestation.model';
import { FournisseurService } from '../../service/fournisseur.service';
import { Fournisseur } from '../../models/fournisseur.model';
import { Account } from '../../models/account.model';
import { AccountService } from '../../core/auth/account.service';
import { PrestationService } from '../../service/prestation.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-prestation-list',
    templateUrl: './prestation-list.component.html'
})
export class PrestationListComponent implements OnInit {
    prestations: Prestation[] = [];
    filteredPrestations: Prestation[] = [];
    searchQuery: string = '';
    prestationStatus = [
        { label: 'Non remboursé', value: PrestationStatus.NON_REMBOURSE },
        { label: 'En attente', value: PrestationStatus.EN_COURS },
        { label: 'Remboursé', value: PrestationStatus.REMBOURSE }
    ];

    constructor(
        public demandeRemboursementService: DemandeRemboursementService,
        private accountService: AccountService,
        private fournisseurService: FournisseurService,
        private prestationService: PrestationService,
        private router: Router
    ) {}

    ngOnInit(): void {
        // On recupere l'utilisateur actuel
        const account: Account = this.accountService.getCurrentAccount();
        if (account) {
            this.loadPrestations(account.id);
        } else {
            this.router.navigate(['/login']);
        }

        // S'abonne à l'état d'authentification pour obtenir le compte utilisateur
        this.accountService.getUserState().subscribe(account => {
            if (account) {
                this.loadPrestations(account.id);
            }
        });
    }

    // Charger les prestations à partir du service
    async loadPrestations(userId: number): Promise<void> {
        try {
            const fournisseur: Fournisseur = await this.fournisseurService.getFournisseurByUserId(userId).toPromise();
            if (fournisseur) {
                const data = await this.prestationService.getByFournisseurId(fournisseur.id).toPromise();
                this.prestations = data;
                this.filteredPrestations = data; // Initialement, tous les prestations sont affichés
            }
        } catch (error) {
            console.error('Erreur lors du chargement des prestations:', error);
            // Gérer l'erreur selon vos besoins (par exemple, afficher un message d'erreur)
        }
    }

    // Méthode pour filtrer les prestations en fonction de la recherche
    onGlobalFilter(): void {
        if (this.searchQuery) {
            this.filteredPrestations = this.prestations.filter(prestation =>
                prestation.label?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                (prestation.datePrestation ? prestation.datePrestation.toISOString().toLowerCase() : '').includes(this.searchQuery.toLowerCase()) ||
                (prestation.montant ? prestation.montant.toString().toLowerCase() : '').includes(this.searchQuery.toLowerCase()) ||
                prestation.numeroPrestation?.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        } else {
            this.filteredPrestations = this.prestations; // Réinitialiser si le champ de recherche est vide
        }
    }

    // Méthode pour gérer la sélection du prestation et rediriger vers le détail
    onSelectPrestation(payload: Prestation): void {
        this.demandeRemboursementService.setProductPrestation(payload);
        this.router.navigate(['/site/reclamation/prestation/steps/information']);
    }

    protected getEnumLabel(value: string) {
        const enumObj = this.prestationStatus.find((e: any) => e.value === value);
        return enumObj ? enumObj.label : value;
    }

    // Method to get the severity class based on the entity status
    protected getSeverity(status: string): string {
        switch (status) {
            case 'NON_REMBOURSE':
                return 'danger';
            case 'EN_COURS':
                return 'warning';
            case 'REMBOURSE':
                return 'success';
            default:
                return 'default';
        }
    }
}
