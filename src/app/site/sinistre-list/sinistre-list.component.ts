import { DemandeRemboursementService } from '../../service/demande-remboursement.service';
import { Sinistre, SinistreStatus } from '../../models/sinistre.model';
import { AssureService } from '../../service/assure.service';
import { Assure } from '../../models/assure.model';
import { Account } from '../../models/account.model';
import { AccountService } from '../../core/auth/account.service';
import { SinistreService } from '../../service/sinistre.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sinistre-list',
    templateUrl: './sinistre-list.component.html'
})
export class SinistreListComponent implements OnInit {
    sinistres: Sinistre[] = [];
    filteredSinistres: Sinistre[] = [];
    searchQuery: string = '';
    sinistreStatus = [
        { label: 'En cours', value: SinistreStatus.EN_COURS },
        { label: 'Approuvé', value: SinistreStatus.APPROUVE },
        { label: 'Clôturé', value: SinistreStatus.CLOTURE },
        { label: 'Rejeté', value: SinistreStatus.REJETE }
    ];

    constructor(
        public demandeRemboursementService: DemandeRemboursementService,
        private accountService: AccountService,
        private assureService: AssureService,
        private sinistreService: SinistreService,
        private router: Router
    ) {}

    ngOnInit(): void {
        // On recupere l'utilisateur actuel
        const account: Account = this.accountService.getCurrentAccount();
        if (account) {
            this.loadSinistres(account.id);
        } else {
            this.router.navigate(['/login']);
        }

        // S'abonne à l'état d'authentification pour obtenir le compte utilisateur
        this.accountService.getUserState().subscribe(account => {
            if (account) {
                this.loadSinistres(account.id);
            }
        });
    }

    // Charger les sinistres à partir du service
    async loadSinistres(userId: number): Promise<void> {
        try {
            const assure: Assure = await this.assureService.getAssureByUserId(userId).toPromise();
            if (assure) {
                const data = await this.sinistreService.getByAssureId(assure.id).toPromise();
                this.sinistres = data;
                this.filteredSinistres = data; // Initialement, tous les sinistres sont affichés
            }
        } catch (error) {
            console.error('Erreur lors du chargement des sinistres:', error);
            // Gérer l'erreur selon vos besoins (par exemple, afficher un message d'erreur)
        }
    }

    // Méthode pour filtrer les sinistres en fonction de la recherche
    onGlobalFilter(): void {
        if (this.searchQuery) {
            this.filteredSinistres = this.sinistres.filter(sinistre =>
                sinistre.label?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                (sinistre.dateSurvenance ? sinistre.dateSurvenance.toISOString().toLowerCase() : '').includes(this.searchQuery.toLowerCase()) ||
                (sinistre.montantSinistre ? sinistre.montantSinistre.toString().toLowerCase() : '').includes(this.searchQuery.toLowerCase()) ||
                sinistre.numeroSinistre?.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        } else {
            this.filteredSinistres = this.sinistres; // Réinitialiser si le champ de recherche est vide
        }
    }

    // Méthode pour gérer la sélection du sinistre et rediriger vers le détail
    onSelectSinistre(payload: Sinistre): void {
        this.demandeRemboursementService.setProductSinistre(payload);
        this.router.navigate(['/site/demander/remboursement/steps/information']);
    }

    protected getEnumLabel(value: string) {
        const enumObj = this.sinistreStatus.find((e: any) => e.value === value);
        return enumObj ? enumObj.label : value;
    }

    // Method to get the severity class based on the sinistre status
    protected getSeverity(status: string): string {
        switch (status) {
            case 'EN_COURS':
                return 'warning';
            case 'APPROUVE':
                return 'success';
            case 'CLOTURE':
                return 'info';
            case 'REJETE':
                return 'danger';
            default:
                return 'default';
        }
    }
}
