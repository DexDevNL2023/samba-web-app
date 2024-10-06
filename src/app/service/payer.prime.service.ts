import { PublicPaiementRequest } from './../models/public-paiement.request';
import { Souscription } from './../models/souscription.model';
import { ToastService } from './toast.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, throwError, Subject } from 'rxjs';
import { RessourceResponse } from '../models/ressource.response.model';
import { map, catchError } from 'rxjs/operators';
import { PaymentMode } from '../models/paiement.model';

@Injectable({
    providedIn: 'root'
})
export class PayerPrimeService {
    // Mise à jour de ticketInformation en paiementInformation
    private paiementInformation: PublicPaiementRequest = {
        mode: null,
        montant: null,
        account: null,
        souscription: null
    };

    private paiementComplete = new Subject<any>();
    paiementComplete$ = this.paiementComplete.asObservable();
    souscription: Souscription = {} as Souscription;
    protected baseUrl = environment.apiUrl;

    constructor(private http: HttpClient, private toastService: ToastService) {}

    // Getters et Setters pour chaque propriété de paiementInformation
    getMode(): PaymentMode | null {
        return this.paiementInformation.mode;
    }

    setMode(value: PaymentMode | null) {
        this.paiementInformation.mode = value;
    }

    getMontant(): number | null {
        return this.paiementInformation.montant;
    }

    setMontant(value: number | null) {
        this.paiementInformation.montant = value;
    }

    getAccount(): number | null {
        return this.paiementInformation.account;
    }

    setAccount(value: number | null) {
        this.paiementInformation.account = value;
    }

    getSouscription(): number | null {
        return this.paiementInformation.souscription;
    }

    setSouscription(value: number | null) {
        this.paiementInformation.souscription = value;
    }

    // Méthodes pour gérer le product (souscription)
    setProduct(payload: Souscription) {
        this.souscription = payload;
    }

    getProduct(): Souscription | null {
        return this.souscription;
    }

    getPaiementInformation(): PublicPaiementRequest | null {
        return this.paiementInformation;
    }

    setPaiementInformation(value: PublicPaiementRequest | null) {
        this.paiementInformation = value;
    }

    // Méthode pour créer une nouvelle paiement
    makePaiement(payload: PublicPaiementRequest): Observable<any> {
        return this.http.post<RessourceResponse<any>>(`${this.baseUrl}/api/public/make/paiement`, payload).pipe(
            map((response) => this.handleResponse(response, 'Paiement')),
            catchError((error) => this.handleError(error, 'Paiement'))
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
    submitPaiementAsync(payload: PublicPaiementRequest): Promise<any> {
        return this.makePaiement(payload).toPromise();
    }

    complete() {
        this.paiementComplete.next(this.paiementInformation); // Utiliser paiementInformation
    }
}
