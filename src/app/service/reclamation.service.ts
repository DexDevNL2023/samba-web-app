import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Reclamation } from '../models/reclamation.model';
import { GenericCrudService } from './generic.crud.service';
import { map, catchError } from 'rxjs/operators';
import { RessourceResponse } from './../models/ressource.response.model';

@Injectable({ providedIn: 'root' })
export class ReclamationService extends GenericCrudService<Reclamation> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, 'api/reclamations');
    }

    // Récupérer les réclamations par souscription
    getBySouscriptionId(souscriptionId: number): Observable<Reclamation[]> {
        return this.http.get<RessourceResponse<Reclamation[]>>(`${this.resourceUrl}/find/by/souscription/${souscriptionId}`).pipe(
            map(response => this.handleResponse(response, 'Réclamations récupérées par souscription')),
            catchError(() => of([]))
        );
    }

    // Récupérer les réclamations par sinistre
    getAllBySinistreId(sinistreId: number): Observable<Reclamation[]> {
        return this.http.get<RessourceResponse<Reclamation[]>>(`${this.resourceUrl}/find/by/sinistre/${sinistreId}`).pipe(
            map(response => this.handleResponse(response, 'Réclamations récupérées par sinistre')),
            catchError(() => of([]))
        );
    }

    // Récupérer les réclamations par prestation
    getAllByPrestationId(prestationId: number): Observable<Reclamation[]> {
        return this.http.get<RessourceResponse<Reclamation[]>>(`${this.resourceUrl}/find/by/prestation/${prestationId}`).pipe(
            map(response => this.handleResponse(response, 'Réclamations récupérées par prestation')),
            catchError(() => of([]))
        );
    }

    // Récupérer les réclamations avec paiements par paiementId
    getWithPaiementsById(paiementId: number): Observable<Reclamation> {
        return this.http.get<RessourceResponse<Reclamation>>(`${this.resourceUrl}/find/by/paiement/${paiementId}`).pipe(
            map(response => this.handleResponse(response, 'Réclamations récupérées avec paiements')),
            catchError(() => of(null))
        );
    }
}
