import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Souscription } from '../models/souscription.model';
import { GenericCrudService } from './generic.crud.service';
import { map, catchError } from 'rxjs/operators';
import { RessourceResponse } from './../models/ressource.response.model';

@Injectable({ providedIn: 'root' })
export class SouscriptionService extends GenericCrudService<Souscription> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, '/api/souscriptions');
    }

    getAllByAssureId(assureId: number): Observable<Souscription[]> {
        return this.http.get<RessourceResponse<Souscription[]>>(`${this.baseUrl}/find/by/assure/${assureId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer les souscriptions par assuré')),
            catchError(error => this.handleError(error, 'Récupérer les souscriptions par assuré'))
        );
    }

    getAllByPoliceId(policeId: number): Observable<Souscription[]> {
        return this.http.get<RessourceResponse<Souscription[]>>(`${this.baseUrl}/find/by/police/${policeId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer les souscriptions par police')),
            catchError(error => this.handleError(error, 'Récupérer les souscriptions par police'))
        );
    }

    getWithContratsById(contratId: number): Observable<Souscription> {
        return this.http.get<RessourceResponse<Souscription>>(`${this.baseUrl}/find/by/contrat/${contratId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer les souscriptions avec contrats')),
            catchError(error => this.handleError(error, 'Récupérer les souscriptions avec contrats'))
        );
    }

    getWithSinistresById(sinistreId: number): Observable<Souscription> {
        return this.http.get<RessourceResponse<Souscription>>(`${this.baseUrl}/find/by/sinistre/${sinistreId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer les souscriptions avec sinistres')),
            catchError(error => this.handleError(error, 'Récupérer les souscriptions avec sinistres'))
        );
    }

    getWithPrestationsById(prestationId: number): Observable<Souscription> {
        return this.http.get<RessourceResponse<Souscription>>(`${this.baseUrl}/find/by/prestation/${prestationId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer les souscriptions avec prestations')),
            catchError(error => this.handleError(error, 'Récupérer les souscriptions avec prestations'))
        );
    }

    getWithPaiementsById(paiementId: number): Observable<Souscription> {
        return this.http.get<RessourceResponse<Souscription>>(`${this.baseUrl}/find/by/paiement/${paiementId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer les souscriptions avec paiements')),
            catchError(error => this.handleError(error, 'Récupérer les souscriptions avec paiements'))
        );
    }

    getWithReclamationsById(reclamationId: number): Observable<Souscription> {
        return this.http.get<RessourceResponse<Souscription>>(`${this.baseUrl}/find/by/reclamation/${reclamationId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer les souscriptions avec réclamations')),
            catchError(error => this.handleError(error, 'Récupérer les souscriptions avec réclamations'))
        );
    }
}
