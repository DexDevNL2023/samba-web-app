import { ContratAssuranceService } from './../../service/contrat-assurance.service';
import { PoliceAssuranceService } from './../../service/police-assurance.service';
import { PoliceAssurance } from './../../models/police-assurance.model';
import { ContratAssurance, ContratType } from './../../models/contrat-assurance.model';
import { SouscriptionService } from './../../service/souscription.service';
import { PaymentFrequency, Souscription, SubscriptionStatus } from './../../models/souscription.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Pour accéder aux paramètres de route
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-souscription-detail',
    templateUrl: './souscription-detail.component.html'
})
export class SouscriptionDetailComponent implements OnInit {
    souscriptionId!: number;
    souscription: Souscription = {} as Souscription;
    contrats: ContratAssurance[] = []; // Your list of contratss
    displayDialog: boolean = false;
    selectedContrat: ContratAssurance | null = {} as ContratAssurance;
    police: PoliceAssurance | null = {} as PoliceAssurance;
    frequencies = [
        { label: 'Annuel', value: PaymentFrequency.ANNUEL },
        { label: 'Mensuel', value: PaymentFrequency.MENSUEL },
        { label: 'Semestriel', value: PaymentFrequency.SEMESTRIEL },
        { label: 'Trimestriel', value: PaymentFrequency.TRIMESTRIEL }
    ];
    souscriptionStatus = [
        { label: 'On risk', value: SubscriptionStatus.ON_RISK },
        { label: 'Resiliee', value: SubscriptionStatus.RESILIE },
        { label: 'En attente', value: SubscriptionStatus.WAITING }
    ];
    contratTypes = [
        { label: 'Bien', value: ContratType.BIEN },
        { label: 'Agricole', value: ContratType.AGRICOLE },
        { label: 'Personne', value: ContratType.PERSONNE },
        { label: 'Santé', value: ContratType.SANTE }
    ];

    constructor(
        private souscriptionService: SouscriptionService,
        private policeService: PoliceAssuranceService,
        private contratsService: ContratAssuranceService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    async ngOnInit(): Promise<void> {
        try {
            // Récupérer les paramètres de la route
            const params = await firstValueFrom(this.route.params);
            this.souscriptionId = +params['id']; // 'id' correspond au paramètre de route

            // Charger les données associées à l'ID de la police d'police
            this.souscription = await this.souscriptionService.find(this.souscriptionId).toPromise();

            // Charger les informations d'police
            this.police = await this.policeService.getWithSouscriptionsById(this.souscriptionId).toPromise();

            // Charger les contrats associées
            this.contrats = await this.contratsService.getContratsBySouscriptionId(this.souscriptionId).toPromise();
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            // Gérer l'erreur selon vos besoins (par exemple, afficher un message d'erreur)
        }
    }

    refreshContratAssurances() {
        this.contratsService.getContratsBySouscriptionId(this.souscriptionId).subscribe((data: ContratAssurance[]) => {
            this.contrats = data;
        });
    }


    openDialog(contrats: ContratAssurance) {
        this.selectedContrat = contrats;
        this.displayDialog = true;
    }

    hideDialog() {
        this.displayDialog = false;
        this.selectedContrat = null;
    }

    declarerSinistre(id: number): void {
        this.router.navigate(['/site/declarer/sinistre', id]);
    }

    demanderRemboursement(id: number): void {
        this.router.navigate(['/site/demander/remboursement', id]);
    }

    payerPrime(id: number): void {
        this.router.navigate(['/site/payer/prime', id]);
    }

    protected getStatutEnumLabel(value: string) {
        const enumObj = this.souscriptionStatus.find((e: any) => e.value === value);
        return enumObj ? enumObj.label : value;
    }

    // Method to get the severity class based on the entity status
    protected getStatutSeverity(status: string): string {
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

    protected getFrequenceEnumLabel(value: string) {
        const enumObj = this.frequencies.find((e: any) => e.value === value);
        return enumObj ? enumObj.label : value;
    }

    // Method to get the severity class based on the entity status
    protected getFrequenceSeverity(frequencie: string): string {
        switch (frequencie) {
            // SubscriptionStatus
            case 'MENSUEL':
                return 'info';
            case 'TRIMESTRIEL':
                return 'success';
            case 'SEMESTRIEL':
                return 'warning';
            case 'ANNUEL':
                return 'danger';

            default:
                return 'default';
        }
    }

    protected getContratEnumLabel(value: string) {
        const enumObj = this.contratTypes.find((e: any) => e.value === value);
        return enumObj ? enumObj.label : value;
    }

    // Method to get the severity class based on the entity status
    protected getContratSeverity(frequencie: string): string {
        switch (frequencie) {
            // SubscriptionStatus
            case 'BIEN':
                return 'info';
            case 'AGRICOLE':
                return 'success';
            case 'PERSONNE':
                return 'warning';
            case 'SANTE':
                return 'danger';

            default:
                return 'default';
        }
    }
}
