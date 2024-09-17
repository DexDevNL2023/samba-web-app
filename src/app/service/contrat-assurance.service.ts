import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericCrudService } from './generic.crud.service';
import { Observable } from 'rxjs';
import { ContratAssurance } from '../models/contrat-assurance.model';
import { map, catchError } from 'rxjs/operators';
import { RessourceResponse } from './../models/ressource.response.model';

@Injectable({ providedIn: 'root' })
export class ContratAssuranceService extends GenericCrudService<ContratAssurance> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, '/api/contrats/assurances');
    }

    // Récupérer les contrats par souscription ID
    getContratsBySouscriptionId(souscriptionId: number): Observable<ContratAssurance[]> {
        return this.http.get<RessourceResponse<ContratAssurance[]>>(`${this.baseUrl}/find/by/souscription/${souscriptionId}`).pipe(
            map(response => this.handleResponse(response, 'Contrats récupérés avec succès')),
            catchError(error => this.handleError(error, 'Erreur lors de la récupération des contrats'))
        );
    }
}
