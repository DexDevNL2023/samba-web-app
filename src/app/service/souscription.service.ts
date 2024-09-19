import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Souscription } from '../models/souscription.model';
import { GenericCrudService } from './generic.crud.service';
import { map, catchError } from 'rxjs/operators';
import { RessourceResponse } from './../models/ressource.response.model';

@Injectable({ providedIn: 'root' })
export class SouscriptionService extends GenericCrudService<Souscription> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, 'api/souscriptions');
    }

    getAllByAssureId(assureId: number): Observable<Souscription[]> {
        return this.http.get<RessourceResponse<Souscription[]>>(`${this.resourceUrl}/find/by/assure/${assureId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer les souscriptions par assuré')),
            catchError(() => of([]))
        );
    }

    getAllByPoliceId(policeId: number): Observable<Souscription[]> {
        return this.http.get<RessourceResponse<Souscription[]>>(`${this.resourceUrl}/find/by/police/${policeId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer les souscriptions par police')),
            catchError(() => of([]))
        );
    }

    getWithContratsById(contratId: number): Observable<Souscription> {
        return this.http.get<RessourceResponse<Souscription>>(`${this.resourceUrl}/find/by/contrat/${contratId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer les souscriptions avec contrats')),
            catchError(() => of(null))
        );
    }

    getWithSinistresById(sinistreId: number): Observable<Souscription> {
        return this.http.get<RessourceResponse<Souscription>>(`${this.resourceUrl}/find/by/sinistre/${sinistreId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer les souscriptions avec sinistres')),
            catchError(() => of(null))
        );
    }

    getWithPrestationsById(prestationId: number): Observable<Souscription> {
        return this.http.get<RessourceResponse<Souscription>>(`${this.resourceUrl}/find/by/prestation/${prestationId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer les souscriptions avec prestations')),
            catchError(() => of(null))
        );
    }

    getWithPaiementsById(paiementId: number): Observable<Souscription> {
        return this.http.get<RessourceResponse<Souscription>>(`${this.resourceUrl}/find/by/paiement/${paiementId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer les souscriptions avec paiements')),
            catchError(() => of(null))
        );
    }

    getWithReclamationsById(reclamationId: number): Observable<Souscription> {
        return this.http.get<RessourceResponse<Souscription>>(`${this.resourceUrl}/find/by/reclamation/${reclamationId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer les souscriptions avec réclamations')),
            catchError(() => of(null))
        );
    }

    // Récupérer les souscriptions par user ID
    getByUserId(userId: number): Observable<Souscription[]> {
        return this.http.get<RessourceResponse<Souscription[]>>(`${this.resourceUrl}/find/by/user/${userId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer les souscriptions par user ID')),
            catchError(() => of([]))
        );
    }
}
