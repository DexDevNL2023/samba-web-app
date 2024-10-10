import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericCrudService } from './generic.crud.service';
import { Observable, of } from 'rxjs';
import { Assure } from '../models/assure.model';
import { map, catchError } from 'rxjs/operators';
import { RessourceResponse } from './../models/ressource.response.model';

@Injectable({ providedIn: 'root' })
export class AssureService extends GenericCrudService<Assure> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, 'api/assures');
    }

    // Fetch assures by dossier ID
    getAssureByUserId(userId: number): Observable<Assure> {
        return this.http.get<RessourceResponse<Assure>>(`${this.resourceUrl}/find/by/user/${userId}`).pipe(
            map(response => this.handleResponse(response, 'Assuré trouvés avec succès')),
            catchError(() => of(null))
        );
    }

    // Fetch assures by dossier ID
    getAssuresByDossierId(dossierId: number): Observable<Assure> {
        return this.http.get<RessourceResponse<Assure>>(`${this.resourceUrl}/find/by/dossier/${dossierId}`).pipe(
            map(response => this.handleResponse(response, 'Assurés trouvés avec succès')),
            catchError(() => of(null))
        );
    }

    // Fetch assures by souscription ID
    getAssuresBySouscriptionId(souscriptionId: number): Observable<Assure> {
        return this.http.get<RessourceResponse<Assure>>(`${this.resourceUrl}/find/by/souscription/${souscriptionId}`).pipe(
            map(response => this.handleResponse(response, 'Assurés trouvés avec succès')),
            catchError(() => of(null))
        );
    }

    getAll(): Observable<Assure[]> {
        return this.http.get<RessourceResponse<Assure[]>>(`${this.baseUrl}/api/public/assure`).pipe(
            map(response => this.handleResponse(response, 'Assurés trouvés avec succès')),
            catchError(() => of([]))
        );
    }

    getById(id: number): Observable<Assure> {
        return this.http.get<RessourceResponse<Assure>>(`${this.baseUrl}/api/public/assure/by/${id}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer toutes les polices d\'assurance')),
            catchError(() => of(null))
        );
    }
}
