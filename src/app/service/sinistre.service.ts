import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Sinistre } from '../models/sinistre.model';
import { GenericCrudService } from './generic.crud.service';
import { map, catchError } from 'rxjs/operators';
import { RessourceResponse } from './../models/ressource.response.model';

@Injectable({ providedIn: 'root' })
export class SinistreService extends GenericCrudService<Sinistre> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, 'api/sinistres');
    }

    // Récupérer les sinistres en fonction de la souscription
    getBySouscriptionId(souscriptionId: number): Observable<Sinistre[]> {
        return this.http.get<RessourceResponse<Sinistre[]>>(`${this.resourceUrl}/find/by/souscription/${souscriptionId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer les sinistres par souscription')),
            catchError(() => of([]))
        );
    }

    // Récupérer un sinistre avec les prestations par ID
    getWithPrestationsById(prestationId: number): Observable<Sinistre> {
        return this.http.get<RessourceResponse<Sinistre>>(`${this.resourceUrl}/find/by/prestation/${prestationId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer le sinistre avec prestations')),
            catchError(() => of(null))
        );
    }

    // Récupérer un sinistre avec les documents par ID
    getWithDocumentsById(documentId: number): Observable<Sinistre> {
        return this.http.get<RessourceResponse<Sinistre>>(`${this.resourceUrl}/find/by/document/${documentId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer le sinistre avec documents')),
            catchError(() => of(null))
        );
    }
}
