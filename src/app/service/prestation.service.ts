import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Prestation } from '../models/prestation.model';
import { GenericCrudService } from './generic.crud.service';
import { map, catchError } from 'rxjs/operators';
import { RessourceResponse } from './../models/ressource.response.model';

@Injectable({ providedIn: 'root' })
export class PrestationService extends GenericCrudService<Prestation> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, 'api/prestations');
    }

    // Récupérer les prestations par souscription
    getBySouscriptionId(souscriptionId: number): Observable<Prestation[]> {
        return this.http.get<RessourceResponse<Prestation[]>>(`${this.resourceUrl}/find/by/souscription/${souscriptionId}`).pipe(
        map(response => this.handleResponse(response, 'Récupération des prestations par souscription')),
        catchError(() => of([]))
        );
    }

    // Récupérer les prestations par sinistre
    getBySinistreId(sinistreId: number): Observable<Prestation[]> {
        return this.http.get<RessourceResponse<Prestation[]>>(`${this.resourceUrl}/find/by/sinistre/${sinistreId}`).pipe(
        map(response => this.handleResponse(response, 'Récupération des prestations par sinistre')),
        catchError(() => of([]))
        );
    }

    // Récupérer une prestation avec ses documents
    getWithDocumentsById(documentId: number): Observable<Prestation> {
        return this.http.get<RessourceResponse<Prestation>>(`${this.resourceUrl}/find/by/document/${documentId}`).pipe(
        map(response => this.handleResponse(response, 'Récupération des prestation avec documents')),
        catchError(() => of(null))
        );
    }

    // Récupérer les prestations par fournisseur
    getByFournisseurId(fournisseurId: number): Observable<Prestation[]> {
        return this.http.get<RessourceResponse<Prestation[]>>(`${this.resourceUrl}/find/by/fournisseur/${fournisseurId}`).pipe(
        map(response => this.handleResponse(response, 'Récupération des prestations par fournisseur')),
        catchError(() => of([]))
        );
    }

    // Récupérer une prestation avec financeurs
    getWithFinanceursById(financeurId: number): Observable<Prestation[]> {
        return this.http.get<RessourceResponse<Prestation[]>>(`${this.resourceUrl}/find/by/financeur/${financeurId}`).pipe(
        map(response => this.handleResponse(response, 'Récupération des prestation avec financeurs')),
        catchError(() => of([]))
        );
    }
}
