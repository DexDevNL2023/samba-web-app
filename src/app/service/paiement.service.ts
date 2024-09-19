import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Paiement } from '../models/paiement.model';
import { GenericCrudService } from './generic.crud.service';
import { map, catchError } from 'rxjs/operators';
import { RessourceResponse } from './../models/ressource.response.model';

@Injectable({ providedIn: 'root' })
export class PaiementService extends GenericCrudService<Paiement> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, 'api/paiements');
    }

    // Trouver les paiements par ID de souscription
    getPaiementsBySouscriptionId(souscriptionId: number): Observable<Paiement[]> {
        return this.http.get<RessourceResponse<Paiement[]>>(`${this.resourceUrl}/find/by/souscription/${souscriptionId}`).pipe(
            map(response => this.handleResponse(response, 'Paiements récupérés avec succès')),
            catchError(() => of([]))
        );
    }

    // Trouver un paiement par ID de réclamation
    getPaiementByReclamationId(reclamationId: number): Observable<Paiement[]> {
        return this.http.get<RessourceResponse<Paiement[]>>(`${this.resourceUrl}/find/by/reclamation/${reclamationId}`).pipe(
            map(response => this.handleResponse(response, 'Paiement récupéré avec succès')),
            catchError(() => of([]))
        );
    }

    // Trouver un paiement par ID de reçu
    getPaiementByRecuPaiementId(recuPaiementId: number): Observable<Paiement> {
        return this.http.get<RessourceResponse<Paiement>>(`${this.resourceUrl}/find/by/recu/${recuPaiementId}`).pipe(
            map(response => this.handleResponse(response, 'Paiement récupéré avec succès')),
            catchError(() => of(null))
        );
    }
}
