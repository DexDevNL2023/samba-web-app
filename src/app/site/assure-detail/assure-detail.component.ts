import { EffectuerPrestationService } from './../../service/effectuer-prestation.service';
import { SinistreService } from './../../service/sinistre.service';
import { DossierMedicalService } from './../../service/dossier-medical.service';
import { Sinistre, SinistreStatus } from './../../models/sinistre.model';
import { DossierMedical } from './../../models/dossier-medical.model';
import { Gender, Assure } from './../../models/assure.model';
import { PayerPrimeService } from '../../service/payer.prime.service';
import { AssureService } from '../../service/assure.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Pour accéder aux paramètres de route
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-assure-detail',
    templateUrl: './assure-detail.component.html'
})
export class AssureDetailComponent implements OnInit {
    assureId!: number;
    assure: Assure = {} as Assure;
    dossiers: DossierMedical[] = [];
    sinistres: Sinistre[] = [];
    displayDialog: boolean = false;
    selectedSinistre: Sinistre | null = {} as Sinistre;
    selectedDossierMedical: DossierMedical | null = {} as DossierMedical;
    genders = [
        { label: 'Male', value: Gender.MALE },
        { label: 'Female', value: Gender.FEMALE },
        { label: 'Other', value: Gender.OTHER }
    ];
    sinistreStatus = [
        { label: 'En cours', value: SinistreStatus.EN_COURS },
        { label: 'Approuvé', value: SinistreStatus.APPROUVE },
        { label: 'Clôturé', value: SinistreStatus.CLOTURE },
        { label: 'Rejeté', value: SinistreStatus.REJETE }
    ];
    sinistreColumns = [
        { field: 'numeroSinistre', header: 'Numéro de Sinistre' },
        { field: 'label', header: 'Type de Sinistre' },
        { field: 'raison', header: 'Raison du Sinistre' },
        { field: 'montantSinistre', header: 'Montant du Sinistre' },
        { field: 'montantAssure', header: 'Montant Assuré' },
        { field: 'dateSurvenance', header: 'Date de Survenance' },
        { field: 'dateDeclaration', header: 'Date de Déclaration' },
        { field: 'dateCloture', header: 'Date de Clôture' },
        { field: 'status', header: 'Statut' },  // Statut du sinistre (EN_COURS, CLOTURE, etc.)
        { field: 'actions', header: 'Actions' }
    ];
    dossierColumns = [
        { field: 'numDossierMedical', header: 'Numéro de Dossier Médical' },
        { field: 'dateUpdated', header: 'Date de Mise à Jour' },
        { field: 'maladiesChroniques', header: 'Maladies Chroniques' },
        { field: 'maladiesHereditaires', header: 'Maladies Héréditaires' },
        { field: 'interventionsChirurgicales', header: 'Interventions Chirurgicales' },
        { field: 'hospitalisations', header: 'Hospitalisations' },
        { field: 'allergies', header: 'Allergies' },
        { field: 'vaccins', header: 'Vaccins' },
        { field: 'habitudesAlimentaires', header: 'Habitudes Alimentaires' },
        { field: 'consommationAlcool', header: 'Consommation d\'Alcool' },
        { field: 'consommationTabac', header: 'Consommation de Tabac' },
        { field: 'niveauActivitePhysique', header: 'Activité Physique' },
        { field: 'revenusAnnuels', header: 'Revenus Annuels' },
        { field: 'chargesFinancieres', header: 'Charges Financières' },
        { field: 'declarationBonneSante', header: 'Déclaration de Bonne Santé' },
        { field: 'consentementCollecteDonnees', header: 'Consentement Données' },
        { field: 'declarationNonFraude', header: 'Déclaration de Non-Fraude' },
        { field: 'actions', header: 'Actions' }
    ];

    constructor(
        public effectuerPrestationService: EffectuerPrestationService,
        public payerPrimeService: PayerPrimeService,
        private assureService: AssureService,
        private dossierService: DossierMedicalService,
        private sinistresService: SinistreService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    async ngOnInit(): Promise<void> {
        try {
            // Récupérer les paramètres de la route
            const params = await firstValueFrom(this.route.params);
            this.assureId = +params['id']; // 'id' correspond au paramètre de route

            // Charger les données associées à l'ID de la dossier d'dossier
            this.assure = await this.assureService.find(this.assureId).toPromise();

            // Charger les informations d'dossier
            this.dossiers = await this.dossierService.getDossierMedicalWithPatientById(this.assureId).toPromise();

            // Charger les sinistres associées
            this.sinistres = await this.sinistresService.getByAssureId(this.assureId).toPromise();
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            // Gérer l'erreur selon vos besoins (par exemple, afficher un message d'erreur)
        }
    }

    refreshSinistres() {
        this.sinistresService.getByAssureId(this.assureId).subscribe((data: Sinistre[]) => {
            this.sinistres = data;
        });
    }

    refreshDossiers() {
        this.dossierService.getDossierMedicalWithPatientById(this.assureId).subscribe((data: Sinistre[]) => {
            this.dossiers = data;
        });
    }

    openDialog(dossier: DossierMedical) {
        this.selectedDossierMedical = dossier;
        this.displayDialog = true;
    }

    hideDialog() {
        this.displayDialog = false;
        this.selectedSinistre = null;
    }

    onSelectSinistre(payload: Sinistre): void {
        this.effectuerPrestationService.setProduct(payload);
        this.router.navigate(['/site/effectuer/prestation/steps/information']);
    }

    protected getGenderLabel(value: string) {
        const enumObj = this.genders.find((e: any) => e.value === value);
        return enumObj ? enumObj.label : value;
    }

    // Method to get the severity class based on the gender
    protected getGenderSeverity(status: string): string {
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

    protected getStatusEnumLabel(value: string) {
        const enumObj = this.sinistreStatus.find((e: any) => e.value === value);
        return enumObj ? enumObj.label : value;
    }

    // Method to get the severity class based on the sinistre status
    protected getStatusSeverity(status: string): string {
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

    // Méthode pour vérifier si une prestation peut être effectuée selon le statut du sinistre
    protected isPrestationAllowed(status: string): boolean {
        return status === 'APPROUVE';  // Active seulement si le statut est 'APPROUVE'
    }
}
