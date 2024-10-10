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
            console.log('Début de ngOnInit');

            // Récupérer les paramètres de la route
            const params = await firstValueFrom(this.route.params);
            this.assureId = +params['id']; // 'id' correspond au paramètre de route
            console.log(`ID de l'assuré récupéré depuis les paramètres de la route : ${this.assureId}`);

            // Charger les données associées à l'ID de la dossier d'assure
            this.assure = await this.assureService.getById(this.assureId).toPromise();
            console.log('Données de l\'assuré récupérées:', this.assure);

            // Charger les informations de dossier
            this.dossiers = await this.dossierService.getDossierMedicalWithPatientById(this.assureId).toPromise();
            console.log('Dossiers médicaux récupérés:', this.dossiers);

            // Charger les sinistres associées
            this.sinistres = await this.sinistresService.getByAssureId(this.assureId).toPromise();
            console.log('Sinistres récupérés:', this.sinistres);

            console.log('Fin de ngOnInit');
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            // Gérer l'erreur selon vos besoins (par exemple, afficher un message d'erreur)
        }
    }

    refreshSinistres() {
        console.log('Début de refreshSinistres pour l\'ID de l\'assuré:', this.assureId);
        this.sinistresService.getByAssureId(this.assureId).subscribe({
            next: (data: Sinistre[]) => {
                this.sinistres = data;
                console.log('Sinistres mis à jour:', this.sinistres);
            },
            error: (error) => {
                console.error('Erreur lors de la mise à jour des sinistres:', error);
            },
            complete: () => {
                console.log('Fin de refreshSinistres');
            }
        });
    }

    refreshDossiers() {
        console.log('Début de refreshDossiers pour l\'ID de l\'assuré:', this.assureId);
        this.dossierService.getDossierMedicalWithPatientById(this.assureId).subscribe({
            next: (data: DossierMedical[]) => {
                this.dossiers = data;
                console.log('Dossiers mis à jour:', this.dossiers);
            },
            error: (error) => {
                console.error('Erreur lors de la mise à jour des dossiers:', error);
            },
            complete: () => {
                console.log('Fin de refreshDossiers');
            }
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

    getDossiersColumnWidth(field: string): string {
        switch (field) {
            case 'numDossierMedical':
                return '150px'; // Exemple de largeur pour le numéro de dossier
            case 'dateUpdated':
                return '120px'; // Exemple de largeur pour la date
            case 'maladiesChroniques':
                return '200px'; // Exemple de largeur pour les maladies chroniques
            case 'maladiesHereditaires':
                return '200px'; // Exemple de largeur pour les maladies héréditaires
            case 'interventionsChirurgicales':
                return '200px'; // Exemple de largeur pour les interventions chirurgicales
            case 'hospitalisations':
                return '150px'; // Exemple de largeur pour les hospitalisations
            case 'allergies':
                return '150px'; // Exemple de largeur pour les allergies
            case 'vaccins':
                return '150px'; // Exemple de largeur pour les vaccins
            case 'habitudesAlimentaires':
                return '200px'; // Exemple de largeur pour les habitudes alimentaires
            case 'consommationAlcool':
                return '150px'; // Exemple de largeur pour la consommation d'alcool
            case 'consommationTabac':
                return '150px'; // Exemple de largeur pour la consommation de tabac
            case 'niveauActivitePhysique':
                return '150px'; // Exemple de largeur pour le niveau d'activité physique
            case 'revenusAnnuels':
                return '150px'; // Exemple de largeur pour les revenus annuels
            case 'chargesFinancieres':
                return '150px'; // Exemple de largeur pour les charges financières
            case 'declarationBonneSante':
            case 'consentementCollecteDonnees':
            case 'declarationNonFraude':
                return '100px'; // Largeur uniforme pour les booléens
            default:
                return 'auto'; // Largeur par défaut
        }
    }

    getSinistresColumnWidth(field: string): string {
        switch (field) {
            case 'numeroSinistre':
                return '150px'; // Exemple de largeur pour le numéro de sinistre
            case 'label':
                return '200px'; // Exemple de largeur pour le label
            case 'raison':
                return '250px'; // Exemple de largeur pour la raison
            case 'montantSinistre':
            case 'montantAssure':
                return '150px'; // Largeur uniforme pour les montants
            case 'dateSurvenance':
            case 'dateDeclaration':
            case 'dateCloture':
                return '120px'; // Largeur uniforme pour les dates
            case 'status':
                return '150px'; // Largeur pour le statut
            default:
                return 'auto'; // Largeur par défaut
        }
    }
}
