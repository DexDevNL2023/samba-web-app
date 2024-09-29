import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Document } from '../models/document.model';
import { GenericCrudService } from './generic.crud.service';
import { map, catchError } from 'rxjs/operators';
import { RessourceResponse } from './../models/ressource.response.model';

@Injectable({ providedIn: 'root' })
export class DocumentService extends GenericCrudService<Document> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, 'api/documents');
    }

    // Récupère tous les documents par ID de sinistre
    getAllBySinistreId(sinistreId: number): Observable<Document[]> {
        return this.http.get<RessourceResponse<Document[]>>(`${this.resourceUrl}/find/by/sinistre/${sinistreId}`).pipe(
            map(response => this.handleResponse(response, 'Documents récupérés avec succès !')),
            catchError(() => of([]))
        );
    }

    // Récupère tous les documents par ID de prestation
    getAllByPrestationId(prestationId: number): Observable<Document[]> {
        return this.http.get<RessourceResponse<Document[]>>(`${this.resourceUrl}/find/by/prestation/${prestationId}`).pipe(
            map(response => this.handleResponse(response, 'Documents récupérés avec succès !')),
            catchError(() => of([]))
        );
    }

    // Download the file by URL
    downloadFile(fileUrl: string): Observable<Blob> {
        return this.http.get(`${this.resourceUrl}/download`, { params: { filePath: fileUrl }, responseType: 'blob' }).pipe(
            map(blob => blob),
            catchError(() => of(null))
        );
    }
}
