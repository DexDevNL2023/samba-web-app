import { PublicSouscriptionRequest } from '../models/public-souscription.request';
import { ToastService } from './toast.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, throwError, Subject } from 'rxjs';
import { RessourceResponse } from '../models/ressource.response.model';
import { map, catchError } from 'rxjs/operators';
import { PaymentFrequency } from '../models/souscription.model';
import { PaymentMode } from '../models/paiement.model';
import { PoliceAssurance } from '../models/police-assurance.model';

@Injectable({
    providedIn: 'root'
})
export class EffectuerSouscriptionService {
    // Mise à jour de ticketInformation en souscriptionInformation
    private souscriptionInformation: PublicSouscriptionRequest = {
        frequencePaiement: null,
        account: null,
        police: null,
        mode: null,
        montant: null
    };

    private souscriptionComplete = new Subject<any>();
    souscriptionComplete$ = this.souscriptionComplete.asObservable();
    product: PoliceAssurance = {} as PoliceAssurance;
    protected baseUrl = environment.apiUrl;

    constructor(private http: HttpClient, private toastService: ToastService) {}

    setProduct(payload: PoliceAssurance) {
        this.product = payload;
    }

    getProduct(): PoliceAssurance | null {
        return this.product;
    }

    getSouscriptionInformation(): PublicSouscriptionRequest | null {
        return this.souscriptionInformation;
    }

    setSouscriptionInformation(value: PublicSouscriptionRequest | null) {
        this.souscriptionInformation = value;
    }

    // Getters et Setters pour chaque propriété de souscriptionInformation
    getFrequence(): PaymentFrequency | null {
        return this.souscriptionInformation.frequencePaiement;
    }

    setFrequence(value: PaymentFrequency | null) {
        this.souscriptionInformation.frequencePaiement = value;
    }

    getAccount(): number | null {
        return this.souscriptionInformation.account;
    }

    setAccount(value: number | null) {
        this.souscriptionInformation.account = value;
    }

    getPolice(): number | null {
        return this.souscriptionInformation.police;
    }

    setPolice(value: number | null) {
        this.souscriptionInformation.police = value;
    }

    getMode(): PaymentMode | null {
        return this.souscriptionInformation.mode;
    }

    setMode(value: PaymentMode | null) {
        this.souscriptionInformation.mode = value;
    }

    getMontant(): number | null {
        return this.souscriptionInformation.montant;
    }

    setMontant(value: number | null) {
        this.souscriptionInformation.montant = value;
    }

    // Méthode pour créer une nouvelle souscription
    makeSouscription(payload: PublicSouscriptionRequest): Observable<any> {
        return this.http.post<RessourceResponse<any>>(`${this.baseUrl}/api/public/make/souscription`, payload).pipe(
            map((response) => this.handleResponse(response, 'Souscription')),
            catchError((error) => this.handleError(error, 'Souscription'))
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

    // Convert to Promise (if using an Observable-based API)
    submitSouscriptionAsync(payload: PublicSouscriptionRequest): Promise<any> {
        return this.makeSouscription(payload).toPromise();
    }

    complete() {
        this.souscriptionComplete.next(this.souscriptionInformation); // Utiliser souscriptionInformation
    }
}
