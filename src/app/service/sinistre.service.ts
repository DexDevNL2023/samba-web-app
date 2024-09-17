import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sinistre } from '../models/sinistre.model';
import { GenericCrudService } from './generic.crud.service';
import { map, catchError } from 'rxjs/operators';
import { RessourceResponse } from './../models/ressource.response.model';

@Injectable({ providedIn: 'root' })
export class SinistreService extends GenericCrudService<Sinistre> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, '/api/sinistres');
    }

    // Récupérer les sinistres en fonction de la souscription
    getBySouscriptionId(souscriptionId: number): Observable<Sinistre[]> {
        return this.http.get<RessourceResponse<Sinistre[]>>(`${this.baseUrl}/find/by/souscription/${souscriptionId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer les sinistres par souscription')),
            catchError(error => this.handleError(error, 'Récupérer les sinistres par souscription'))
        );
    }

    // Récupérer un sinistre avec les prestations par ID
    getWithPrestationsById(prestationId: number): Observable<Sinistre> {
        return this.http.get<RessourceResponse<Sinistre>>(`${this.baseUrl}/find/by/prestation/${prestationId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer le sinistre avec prestations')),
            catchError(error => this.handleError(error, 'Récupérer le sinistre avec prestations'))
        );
    }

    // Récupérer un sinistre avec les documents par ID
    getWithDocumentsById(documentId: number): Observable<Sinistre> {
        return this.http.get<RessourceResponse<Sinistre>>(`${this.baseUrl}/find/by/document/${documentId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer le sinistre avec documents')),
            catchError(error => this.handleError(error, 'Récupérer le sinistre avec documents'))
        );
    }
}
