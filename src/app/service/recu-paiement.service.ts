import { RecuPaiement } from './../models/Recu-paiement.model';
import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { GenericCrudService } from './generic.crud.service';
import { map, catchError } from 'rxjs/operators';
import { RessourceResponse } from './../models/ressource.response.model';

@Injectable({
providedIn: 'root'
})
export class RecuPaiementService extends GenericCrudService<RecuPaiement> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, 'api/recus/paiements');
    }

    // Get receipt by numeroRecu
    getRecuPaiementByNumeroRecu(numeroRecu: string): Observable<RecuPaiement> {
        return this.http.get<RessourceResponse<RecuPaiement>>(`${this.resourceUrl}/find/by/numero/${numeroRecu}`).pipe(
            map(response => this.handleResponse(response, 'Reçu de paiement retrouvé avec succès!')),
            catchError(() => of(null))
        );
    }

    // Get receipts by date range
    getRecuPaiementsByDateRange(startDate: string, endDate: string): Observable<RecuPaiement[]> {
        return this.http.get<RessourceResponse<RecuPaiement[]>>(`${this.resourceUrl}/find/by/date/range?startDate=${startDate}&endDate=${endDate}`).pipe(
            map(response => this.handleResponse(response, 'Reçus de paiements retrouvés avec succès!')),
            catchError(() => of([]))
        );
    }

    // Get receipts by montant range
    getRecuPaiementsByMontantRange(minMontant: number, maxMontant: number): Observable<RecuPaiement[]> {
        return this.http.get<RessourceResponse<RecuPaiement[]>>(`${this.resourceUrl}/find/by/montant/range?minMontant=${minMontant}&maxMontant=${maxMontant}`).pipe(
            map(response => this.handleResponse(response, 'Reçus de paiements retrouvés avec succès!')),
            catchError(() => of([]))
        );
    }

    // Get receipt by paiement ID
    getByPaiementId(paiementId: number): Observable<RecuPaiement> {
        return this.http.get<RessourceResponse<RecuPaiement>>(`${this.resourceUrl}/find/by/paiement/${paiementId}`).pipe(
            map(response => this.handleResponse(response, 'Reçu de paiement retrouvé avec succès!')),
            catchError(() => of(null))
        );
    }
}
