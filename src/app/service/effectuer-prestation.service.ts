import { PrestationType } from './../models/prestation.model';
import { PublicPrestationRequest } from './../models/public-prestation.request';
import { DocumentRequest } from '../models/document-request.model';
import { ToastService } from './toast.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, throwError, Subject } from 'rxjs';
import { RessourceResponse } from '../models/ressource.response.model';
import { map, catchError } from 'rxjs/operators';
import { Sinistre } from '../models/sinistre.model';

@Injectable({
    providedIn: 'root'
})
export class EffectuerPrestationService {
    private prestationInformation: PublicPrestationRequest = {
        label: null,
        datePrestation: null,
        montant: null,
        type: null,
        description: null,
        financeurs: [],
        account: null,
        sinistre: null,
        documents: []
    };

    private prestationComplete = new Subject<any>();
    prestationComplete$ = this.prestationComplete.asObservable();
    sinistre: Sinistre = {} as Sinistre;
    protected baseUrl = environment.apiUrl;

    constructor(private http: HttpClient, private toastService: ToastService) {}

    // --- Méthodes set et get pour chaque champ de prestationInformation ---
    setLabel(label: string | null) {
        this.prestationInformation.label = label;
    }

    getLabel(): string | null {
        return this.prestationInformation.label;
    }

    setDatePrestation(datePrestation: Date | null) {
        this.prestationInformation.datePrestation = datePrestation;
    }

    getDatePrestation(): Date | null {
        return this.prestationInformation.datePrestation;
    }

    setMontant(montant: number | null) {
        this.prestationInformation.montant = montant;
    }

    getMontant(): number | null {
        return this.prestationInformation.montant;
    }

    setType(type: PrestationType | null) {
        this.prestationInformation.type = type;
    }

    getType(): PrestationType | null {
        return this.prestationInformation.type;
    }

    setDescription(description: string | null) {
        this.prestationInformation.description = description;
    }

    getDescription(): string | null {
        return this.prestationInformation.description;
    }

    setFinanceurs(financeurs: number[] | null) {
        this.prestationInformation.financeurs = financeurs;
    }

    getFinanceurs(): number[] | null {
        return this.prestationInformation.financeurs;
    }

    setAccount(account: number | null) {
        this.prestationInformation.account = account;
    }

    getAccount(): number | null {
        return this.prestationInformation.account;
    }

    setSinistre(sinistre: number | null) {
        this.prestationInformation.sinistre = sinistre;
    }

    getSinistre(): number | null {
        return this.prestationInformation.sinistre;
    }

    setDocuments(documents: DocumentRequest[]) {
        this.prestationInformation.documents = documents;
    }

    getDocuments(): DocumentRequest[] {
        return this.prestationInformation.documents;
    }

    // Méthodes pour gérer le product (sinistre)
    setProduct(payload: Sinistre) {
        this.sinistre = payload;
    }

    getProduct(): Sinistre | null {
        return this.sinistre;
    }

    getPrestationInformation(): PublicPrestationRequest | null {
        return this.prestationInformation;
    }

    setPrestationInformation(value: PublicPrestationRequest | null) {
        this.prestationInformation = value;
    }

    // Méthode pour créer une nouvelle prestation
    makePrestation(payload: PublicPrestationRequest): Observable<any> {
        return this.http.post<RessourceResponse<any>>(`${this.baseUrl}/api/public/make/prestation`, payload).pipe(
            map((response) => this.handleResponse(response, 'Prestation')),
            catchError((error) => this.handleError(error, 'Prestation'))
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
    submitEffectuerPrestationAsync(payload: PublicPrestationRequest): Promise<any> {
        return this.makePrestation(payload).toPromise();
    }

    // Finaliser la déclaration
    complete() {
        this.prestationComplete.next(this.prestationInformation);
    }
}
