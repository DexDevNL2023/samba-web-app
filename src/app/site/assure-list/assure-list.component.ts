import { Gender } from './../../models/assure.model';
import { AssureService } from '../../service/assure.service';
import { Assure } from '../../models/assure.model';
import { AccountService } from '../../core/auth/account.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-assure-list',
    templateUrl: './assure-list.component.html'
})
export class AssureListComponent implements OnInit {
    assures: Assure[] = [];
    filteredAssures: Assure[] = [];
    searchQuery: string = '';
    genders = [
        { label: 'Male', value: Gender.MALE },
        { label: 'Female', value: Gender.FEMALE },
        { label: 'Other', value: Gender.OTHER }
    ];

    constructor(
        private accountService: AccountService,
        private assureService: AssureService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.loadAssures();
    }

    // Charger les assures à partir du service
    async loadAssures(): Promise<void> {
        try {
            const data = await this.assureService.getAll().toPromise();
            this.assures = data;
            this.filteredAssures = data; // Initialement, tous les assures sont affichés
        } catch (error) {
            console.error('Erreur lors du chargement des assures:', error);
            // Gérer l'erreur selon vos besoins (par exemple, afficher un message d'erreur)
        }
    }

    // Méthode pour filtrer les assures en fonction de la recherche
    onGlobalFilter(): void {
        if (this.searchQuery) {
            this.filteredAssures = this.assures.filter(assure =>
                (assure.numNiu ? assure.numNiu.toLowerCase().includes(this.searchQuery.toLowerCase()) : false) ||
                (assure.lastName ? assure.lastName.toLowerCase().includes(this.searchQuery.toLowerCase()) : false) ||
                (assure.firstName ? assure.firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) : false) ||
                (assure.dateNaissance ? assure.dateNaissance.toISOString().toLowerCase().includes(this.searchQuery.toLowerCase()) : false) ||
                (assure.numCni ? assure.numCni.toLowerCase().includes(this.searchQuery.toLowerCase()) : false) ||
                (assure.sexe ? assure.sexe.toLowerCase().includes(this.searchQuery.toLowerCase()) : false) ||
                (assure.email ? assure.email.toLowerCase().includes(this.searchQuery.toLowerCase()) : false) ||
                (assure.telephone ? assure.telephone.toLowerCase().includes(this.searchQuery.toLowerCase()) : false) ||
                (assure.addresse ? assure.addresse.toLowerCase().includes(this.searchQuery.toLowerCase()) : false)
            );
        } else {
            this.filteredAssures = this.assures; // Réinitialiser si le champ de recherche est vide
        }
    }

    // Méthode pour gérer la sélection du assure et rediriger vers le détail
    onSelectAssure(id: number): void {
        this.router.navigate(['/site/assure/detail', id]);
    }

    protected getEnumLabel(value: string) {
        const enumObj = this.genders.find((e: any) => e.value === value);
        return enumObj ? enumObj.label : value;
    }

    // Method to get the severity class based on the gender
    protected getSeverity(status: string): string {
        switch (status) {
            case 'MALE':
                return 'info';
            case 'FEMALE':
                return 'success';
            case 'OTHER':
                return 'warning';
            default:
                return 'default';
        }
    }
}
