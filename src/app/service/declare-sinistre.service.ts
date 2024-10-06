import { DocumentSinistre } from './../models/document-sinistre.model';
import { PublicSinistreRequest } from './../models/public-sinistre.request';
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
export class DeclareSinistreService {
    private sinistreInformation: PublicSinistreRequest = {
        label: null,
        raison: null,
        dateSurvenance: null,
        montantSinistre: null,
        account: null,
        souscription: null,
        documents: []
    };

    private sinistreComplete = new Subject<any>();
    sinistreComplete$ = this.sinistreComplete.asObservable();
    souscription: Souscription = {} as Souscription;
    protected baseUrl = environment.apiUrl;

    constructor(private http: HttpClient, private toastService: ToastService) {}

    // --- Méthodes set et get pour chaque champ de sinistreInformation ---
    setLabel(label: string | null) {
        this.sinistreInformation.label = label;
    }

    getLabel(): string | null {
        return this.sinistreInformation.label;
    }

    setRaison(raison: string | null) {
        this.sinistreInformation.raison = raison;
    }

    getRaison(): string | null {
        return this.sinistreInformation.raison;
    }

    setDateSurvenance(dateSurvenance: Date | null) {
        this.sinistreInformation.dateSurvenance = dateSurvenance;
    }

    getDateSurvenance(): Date | null {
        return this.sinistreInformation.dateSurvenance;
    }

    setMontantSinistre(montantSinistre: number | null) {
        this.sinistreInformation.montantSinistre = montantSinistre;
    }

    getMontantSinistre(): number | null {
        return this.sinistreInformation.montantSinistre;
    }

    // Method to add a document in DocumentSinistre format
    addDocument(document: DocumentSinistre) {
        this.sinistreInformation.documents.push(document);
    }

    setDocument(documents: DocumentSinistre[]) {
        this.sinistreInformation.documents = documents;
    }

    // Optionally, you may want to provide a method to get the documents
    getDocuments(): DocumentSinistre[] {
        return this.sinistreInformation.documents;
    }

    getAccount(): number | null {
        return this.sinistreInformation.account;
    }

    setAccount(value: number | null) {
        this.sinistreInformation.account = value;
    }

    getSouscription(): number | null {
        return this.sinistreInformation.souscription;
    }

    setSouscription(value: number | null) {
        this.sinistreInformation.souscription = value;
    }

    // Méthodes pour gérer la souscription
    getSinistreInformation(): PublicSinistreRequest | null {
        return this.sinistreInformation;
    }

    setSinistreInformation(value: PublicSinistreRequest | null) {
        this.sinistreInformation = value;
    }

    // Méthodes pour gérer le product (souscription)
    setProduct(payload: Souscription) {
        this.souscription = payload;
    }

    getProduct(): Souscription | null {
        return this.souscription;
    }

    // Méthode pour créer une nouvelle sinistre
    makeDeclarationSinistre(payload: PublicSinistreRequest): Observable<any> {
        return this.http.post<RessourceResponse<any>>(`${this.baseUrl}/api/public/make/declaration/sinistre`, payload).pipe(
            map((response) => this.handleResponse(response, 'Sinistre')),
            catchError((error) => this.handleError(error, 'Sinistre'))
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
    submitDeclarationSinitreAsync(payload: PublicSinistreRequest): Promise<any> {
        return this.makeDeclarationSinistre(payload).toPromise();
    }

    // Finaliser la déclaration
    complete() {
        this.sinistreComplete.next(this.sinistreInformation);
    }
}
