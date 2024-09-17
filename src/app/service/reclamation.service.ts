import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reclamation } from '../models/reclamation.model';
import { GenericCrudService } from './generic.crud.service';
import { map, catchError } from 'rxjs/operators';
import { RessourceResponse } from './../models/ressource.response.model';

@Injectable({ providedIn: 'root' })
export class ReclamationService extends GenericCrudService<Reclamation> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, '/api/reclamations');
    }

    // Récupérer les réclamations par souscription
    getBySouscriptionId(souscriptionId: number): Observable<Reclamation[]> {
        return this.http.get<RessourceResponse<Reclamation[]>>(`${this.baseUrl}/${this.endpoint}/find/by/souscription/${souscriptionId}`).pipe(
            map(response => this.handleResponse(response, 'Réclamations récupérées par souscription')),
            catchError(error => this.handleError(error, 'Erreur lors de la récupération des réclamations par souscription'))
        );
    }

    // Récupérer les réclamations par sinistre
    getAllBySinistreId(sinistreId: number): Observable<Reclamation[]> {
        return this.http.get<RessourceResponse<Reclamation[]>>(`${this.baseUrl}/${this.endpoint}/find/by/sinistre/${sinistreId}`).pipe(
            map(response => this.handleResponse(response, 'Réclamations récupérées par sinistre')),
            catchError(error => this.handleError(error, 'Erreur lors de la récupération des réclamations par sinistre'))
        );
    }

    // Récupérer les réclamations par prestation
    getAllByPrestationId(prestationId: number): Observable<Reclamation[]> {
        return this.http.get<RessourceResponse<Reclamation[]>>(`${this.baseUrl}/${this.endpoint}/find/by/prestation/${prestationId}`).pipe(
            map(response => this.handleResponse(response, 'Réclamations récupérées par prestation')),
            catchError(error => this.handleError(error, 'Erreur lors de la récupération des réclamations par prestation'))
        );
    }

    // Récupérer les réclamations avec paiements par paiementId
    getWithPaiementsById(paiementId: number): Observable<Reclamation> {
        return this.http.get<RessourceResponse<Reclamation>>(`${this.baseUrl}/${this.endpoint}/find/by/paiement/${paiementId}`).pipe(
            map(response => this.handleResponse(response, 'Réclamations récupérées avec paiements')),
            catchError(error => this.handleError(error, 'Erreur lors de la récupération des réclamations avec paiements'))
        );
    }
}
