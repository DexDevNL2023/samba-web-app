import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Document } from '../models/document.model';
import { GenericCrudService } from './generic.crud.service';
import { map, catchError } from 'rxjs/operators';
import { RessourceResponse } from './../models/ressource.response.model';

@Injectable({ providedIn: 'root' })
export class DocumentService extends GenericCrudService<Document> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, '/api/documents');
    }

    // Récupère tous les documents par ID de sinistre
    getAllBySinistreId(sinistreId: number): Observable<Document[]> {
        return this.http.get<RessourceResponse<Document[]>>(`${this.baseUrl}/${this.endpoint}/find/by/sinistre/${sinistreId}`).pipe(
            map(response => this.handleResponse(response, 'Documents récupérés avec succès !')),
            catchError(error => this.handleError(error, 'Échec de la récupération des documents par ID de sinistre'))
        );
    }

    // Récupère tous les documents par ID de prestation
    getAllByPrestationId(prestationId: number): Observable<Document[]> {
        return this.http.get<RessourceResponse<Document[]>>(`${this.baseUrl}/${this.endpoint}/find/by/prestation/${prestationId}`).pipe(
            map(response => this.handleResponse(response, 'Documents récupérés avec succès !')),
            catchError(error => this.handleError(error, 'Échec de la récupération des documents par ID de prestation'))
        );
    }
}
