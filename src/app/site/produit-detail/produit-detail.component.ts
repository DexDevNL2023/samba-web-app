import { Account } from './../../models/account.model';
import { AccountService } from './../../core/auth/account.service';
import { EffectuerSouscriptionService } from '../../service/effectuer-souscription.service';
import { AssuranceService } from './../../service/assurance.service';
import { GarantieService } from './../../service/garantie.service';
import { Garantie, GarantieStatus } from './../../models/garantie.model';
import { Assurance, InsuranceType } from './../../models/assurance.model';
import { PoliceAssurance } from './../../models/police-assurance.model';
import { PoliceAssuranceService } from './../../service/police-assurance.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Pour accéder aux paramètres de route
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-produit-detail',
    templateUrl: './produit-detail.component.html'
})
export class ProduitDetailComponent implements OnInit {
    produitId!: number;
    produit: PoliceAssurance = {} as PoliceAssurance;
    garanties: Garantie[] = []; // Your list of garanties
    displayDialog: boolean = false;
    selectedGarantie: Garantie | null = {} as Garantie;
    assurance: Assurance | null = {} as Assurance;
    // Liste des types d'assurance pour l'interface utilisateur
    insuranceTypes = [
        { label: 'Personne', value: InsuranceType.PERSONNE },
        { label: 'Bien', value: InsuranceType.BIEN },
        { label: 'Agricole', value: InsuranceType.AGRICOLE },
        { label: 'Automobile', value: InsuranceType.AUTOMOBILE },
        { label: 'Habitation', value: InsuranceType.HABITATION },
        { label: 'Vie', value: InsuranceType.VIE },
        { label: 'Accident', value: InsuranceType.ACCIDENT },
        { label: 'Voyage', value: InsuranceType.VOYAGE },
        { label: 'Santé', value: InsuranceType.SANTE }
    ];
    garantieStatus = [
        { label: 'Activée', value: GarantieStatus.ACTIVEE },
        { label: 'Expirée', value: GarantieStatus.EXPIREE },
        { label: 'Suspendue', value: GarantieStatus.SUSPENDUE }
    ];
    columns = [
        { field: 'label', header: 'Label' },
        { field: 'percentage', header: 'Pourcentage' },
        { field: 'plafondAssure', header: 'Plafond Assuré' },
        { field: 'dateDebut', header: 'Date de Début' },
        { field: 'dateFin', header: 'Date de Fin' },
        { field: 'status', header: 'Status' },
        { field: 'termes', header: 'Termes' }
    ];

    constructor(
        private accountService: AccountService,
        private productService: PoliceAssuranceService,
        private assuranceService: AssuranceService,
        private garantieService: GarantieService,
        private route: ActivatedRoute,
        private router: Router,
        private effectuerSouscriptionService: EffectuerSouscriptionService
    ) {}

    async ngOnInit(): Promise<void> {
        try {
            // Récupérer les paramètres de la route
            const params = await firstValueFrom(this.route.params);
            this.produitId = +params['id']; // 'id' correspond au paramètre de route

            // On recupere l'utilisateur actuel
            const account: Account = this.accountService.getCurrentAccount();
            if (account) {
                // Charger les données associées à l'ID de la police d'assurance
                this.produit = await this.productService.getById(this.produitId).toPromise();

                // Charger les informations d'assurance
                this.assurance = await this.assuranceService.getAssuranceByPoliceId(this.produitId).toPromise();

                // Charger les garanties associées
                this.garanties = await this.garantieService.getGarantieByPoliceId(this.produitId).toPromise();
            } else {
                this.router.navigate(['/login']);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            // Gérer l'erreur selon vos besoins (par exemple, afficher un message d'erreur)
        }
    }

    refreshGaranties() {
        this.garantieService.getGarantieByPoliceId(this.produitId).subscribe((data: Garantie[]) => {
            this.garanties = data;
        });
    }


    openDialog(garantie: Garantie) {
        this.selectedGarantie = garantie;
        this.displayDialog = true;
    }

    hideDialog() {
        this.displayDialog = false;
        this.selectedGarantie = null;
    }

    protected getGarantieEnumLabel(value: string) {
        const enumObj = this.garantieStatus.find((e: any) => e.value === value);
        return enumObj ? enumObj.label : value;
    }

    getGarantieSeverity(status: keyof typeof GarantieStatus): string {
        switch (status) {
            case 'ACTIVEE':
            return 'success';
            case 'EXPIREE':
            return 'danger';
            case 'SUSPENDUE':
            return 'warning';
            default:
            return '';
        }
    }

    protected getAssuranceEnumLabel(value: string) {
        const enumObj = this.insuranceTypes.find((e: any) => e.value === value);
        return enumObj ? enumObj.label : value;
    }

    getAssuranceSeverity(type: keyof typeof InsuranceType | null): string {
        switch (type) {
            case 'PERSONNE':
                return 'info';
            case 'BIEN':
                return 'success';
            case 'AGRICOLE':
                return 'warning';
            case 'SANTE':
                return 'danger';
            default:
                return '';
        }
    }

    souscrire(payload: PoliceAssurance): void {
        this.effectuerSouscriptionService.setProduct(payload);
        this.router.navigate(['/site/effectuer/souscription/steps/frequence']);
    }

    formatConditions(conditions: string): string {
        return conditions ? conditions.replace(/\n/g, '<br><br>') : '';
    }
}
