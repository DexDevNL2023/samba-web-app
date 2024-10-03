import { PoliceAssurance } from './../../models/police-assurance.model';
import { PoliceAssuranceService } from './../../service/police-assurance.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-produit',
    templateUrl: './produit.component.html'
})
export class ProduitComponent implements OnInit {
    produits: PoliceAssurance[] = [];
    filteredProduits: PoliceAssurance[] = [];
    searchQuery: string = '';

    constructor(
        private productService: PoliceAssuranceService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.loadProduits();
    }

    // Charger les produits à partir du service
    async loadProduits(): Promise<void> {
        try {
            const data = await this.productService.getAll().toPromise();
            this.produits = data;
            this.filteredProduits = data; // Initialement, tous les produits sont affichés
        } catch (error) {
            console.error('Erreur lors du chargement des produits:', error);
            // Gérer l'erreur selon vos besoins (par exemple, afficher un message d'erreur)
        }
    }

    // Méthode pour filtrer les produits en fonction de la recherche
    onGlobalFilter(): void {
        if (this.searchQuery) {
            this.filteredProduits = this.produits.filter(product =>
                product.label?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                product.conditions?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                product.numeroPolice?.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        } else {
            this.filteredProduits = this.produits; // Réinitialiser si le champ de recherche est vide
        }
    }

    // Méthode pour gérer la sélection du produit et rediriger vers le détail
    onSelectProduct(id: number): void {
        this.router.navigate(['/site/produit/detail', id]);
    }

    formatConditions(conditions: string): string {
        return conditions ? conditions.replace(/\n/g, '<br>') : '';
    }

    // Méthode pour tronquer le texte si la longueur dépasse 200 caractères
    eclipseConditions(conditions: string): string {
        const maxLength = 200; // Limite à 200 caractères
        if (!conditions) {
            return 'Conditions non disponibles.';
        }
        // Si le texte est plus long que la limite, tronquer et ajouter "..."
        return conditions.length > maxLength ? conditions.slice(0, maxLength) + '...' : conditions;
    }
}
