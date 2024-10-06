import { TypeReclamation } from './../models/reclamation.model';
import { PublicReclamationRequest } from './../models/public-reclamation.request';
import { ToastService } from './toast.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, throwError, Subject } from 'rxjs';
import { RessourceResponse } from '../models/ressource.response.model';
import { map, catchError } from 'rxjs/operators';
import { Souscription } from '../models/souscription.model';

@Injectable({
    providedIn: 'root'
})
export class DemandeRemboursementService {
    private reclamationInformation: PublicReclamationRequest = {
        type: null,
        dateReclamation: null,
        description: null,
        montantReclame: null,
        account: null,
        souscription: null,
        sinistre: null,
        prestation: null
    };

    private reclamationComplete = new Subject<any>();
    reclamationComplete$ = this.reclamationComplete.asObservable();
    souscription: Souscription = {} as Souscription;
    protected baseUrl = environment.apiUrl;

    constructor(private http: HttpClient, private toastService: ToastService) {}

    // --- Méthodes set et get pour chaque champ de reclamationInformation ---
    getType(): TypeReclamation | null {
        return this.reclamationInformation.type;
    }

    setType(value: TypeReclamation | null) {
        this.reclamationInformation.type = value;
    }

    getDateReclamation(): Date | null {
        return this.reclamationInformation.dateReclamation;
    }

    setDateReclamation(value: Date | null) {
        this.reclamationInformation.dateReclamation = value;
    }

    getDescription(): string | null {
        return this.reclamationInformation.description;
    }

    setDescription(value: string | null) {
        this.reclamationInformation.description = value;
    }

    getMontantReclame(): number | null {
        return this.reclamationInformation.montantReclame;
    }

    setMontantReclame(value: number | null) {
        this.reclamationInformation.montantReclame = value;
    }

    getSinistre(): number | null {
        return this.reclamationInformation.sinistre;
    }

    setSinistre(value: number | null) {
        this.reclamationInformation.sinistre = value;
    }

    getPrestation(): number | null {
        return this.reclamationInformation.prestation;
    }

    setPrestation(value: number | null) {
        this.reclamationInformation.prestation = value;
    }

    getAccount(): number | null {
        return this.reclamationInformation.account;
    }

    setAccount(value: number | null) {
        this.reclamationInformation.account = value;
    }

    getSouscription(): number | null {
        return this.reclamationInformation.souscription;
    }

    setSouscription(value: number | null) {
        this.reclamationInformation.souscription = value;
    }

    // Méthodes pour gérer la souscription
    getReclamationInformation(): PublicReclamationRequest | null {
        return this.reclamationInformation;
    }

    setReclamationInformation(value: PublicReclamationRequest | null) {
        this.reclamationInformation = value;
    }

    // Méthodes pour gérer le product (souscription)
    setProduct(payload: Souscription) {
        this.souscription = payload;
    }

    getProduct(): Souscription | null {
        return this.souscription;
    }

    // Méthode pour créer une nouvelle reclamation
    makeDemandeRemboursement(payload: PublicReclamationRequest): Observable<any> {
        return this.http.post<RessourceResponse<any>>(`${this.baseUrl}/api/public/make/demande/remboursement`, payload).pipe(
            map((response) => this.handleResponse(response, 'Reclamation')),
            catchError((error) => this.handleError(error, 'Reclamation'))
        );
    }

    // Gestion de la réponse API
    protected handleResponse<T>(response: RessourceResponse<T>, action: string): T {
        if (response.success) {
            this.toastService.showToast('success', `${action} réussie`, response.message);
        } else {
            this.toastService.showToast('error', `${action} échouée`, response.message);
        }
        return response.content as T;
    }

    // Gestion des erreurs
    protected handleError(error: any, action: string): Observable<never> {
        this.toastService.showToast('error', `${action} échouée`, 'Une erreur est survenue.');
        return throwError(error);
    }

    // Convert to Promise (si nécessaire)
    submitDemandeRemboursementeAsync(payload: PublicReclamationRequest): Promise<any> {
        return this.makeDemandeRemboursement(payload).toPromise();
    }

    // Finaliser la déclaration
    complete() {
        this.reclamationComplete.next(this.reclamationInformation);
    }
}
