import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericCrudService } from './generic.crud.service';
import { Observable } from 'rxjs';
import { Assure } from '../models/assure.model';
import { map, catchError } from 'rxjs/operators';
import { RessourceResponse } from './../models/ressource.response.model';

@Injectable({ providedIn: 'root' })
export class AssureService extends GenericCrudService<Assure> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, '/api/assures');
    }

    // Fetch assures by dossier ID
    getAssuresByDossierId(dossierId: number): Observable<Assure[]> {
    return this.http.get<RessourceResponse<Assure[]>>(`${this.baseUrl}/find/by/dossier/${dossierId}`).pipe(
            map(response => this.handleResponse(response, 'Assurés trouvés avec succès')),
            catchError(error => this.handleError(error, 'Erreur lors de la récupération des assurés par dossier'))
        );
    }

    // Fetch assures by souscription ID
    getAssuresBySouscriptionId(souscriptionId: number): Observable<Assure[]> {
    return this.http.get<RessourceResponse<Assure[]>>(`${this.baseUrl}/find/by/souscription/${souscriptionId}`).pipe(
            map(response => this.handleResponse(response, 'Assurés trouvés avec succès')),
            catchError(error => this.handleError(error, 'Erreur lors de la récupération des assurés par souscription'))
        );
    }
}
