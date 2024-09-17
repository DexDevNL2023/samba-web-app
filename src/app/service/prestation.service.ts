import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prestation } from '../models/prestation.model';
import { GenericCrudService } from './generic.crud.service';
import { map, catchError } from 'rxjs/operators';
import { RessourceResponse } from './../models/ressource.response.model';

@Injectable({ providedIn: 'root' })
export class PrestationService extends GenericCrudService<Prestation> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, '/api/prestations');
    }

    // Récupérer les prestations par souscription
    getBySouscriptionId(souscriptionId: number): Observable<Prestation[]> {
        return this.http.get<RessourceResponse<Prestation[]>>(`${this.baseUrl}/${this.endpoint}/find/by/souscription/${souscriptionId}`).pipe(
        map(response => this.handleResponse(response, 'Prestations par souscription')),
        catchError(error => this.handleError(error, 'Erreur lors de la récupération des prestations par souscription'))
        );
    }

    // Récupérer les prestations par sinistre
    getBySinistreId(sinistreId: number): Observable<Prestation[]> {
        return this.http.get<RessourceResponse<Prestation[]>>(`${this.baseUrl}/${this.endpoint}/find/by/sinistre/${sinistreId}`).pipe(
        map(response => this.handleResponse(response, 'Prestations par sinistre')),
        catchError(error => this.handleError(error, 'Erreur lors de la récupération des prestations par sinistre'))
        );
    }

    // Récupérer une prestation avec ses documents
    getWithDocumentsById(documentId: number): Observable<Prestation> {
        return this.http.get<RessourceResponse<Prestation>>(`${this.baseUrl}/${this.endpoint}/find/by/document/${documentId}`).pipe(
        map(response => this.handleResponse(response, 'Prestation avec documents')),
        catchError(error => this.handleError(error, 'Erreur lors de la récupération de la prestation avec documents'))
        );
    }

    // Récupérer les prestations par fournisseur
    getByFournisseurId(fournisseurId: number): Observable<Prestation[]> {
        return this.http.get<RessourceResponse<Prestation[]>>(`${this.baseUrl}/${this.endpoint}/find/by/fournisseur/${fournisseurId}`).pipe(
        map(response => this.handleResponse(response, 'Prestations par fournisseur')),
        catchError(error => this.handleError(error, 'Erreur lors de la récupération des prestations par fournisseur'))
        );
    }

    // Récupérer une prestation avec financeurs
    getWithFinanceursById(financeurId: number): Observable<Prestation> {
        return this.http.get<RessourceResponse<Prestation>>(`${this.baseUrl}/${this.endpoint}/find/by/financeur/${financeurId}`).pipe(
        map(response => this.handleResponse(response, 'Prestation avec financeurs')),
        catchError(error => this.handleError(error, 'Erreur lors de la récupération de la prestation avec financeurs'))
        );
    }
}
