import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Garantie } from '../models/garantie.model';
import { GenericCrudService } from './generic.crud.service';
import { map, catchError } from 'rxjs/operators';
import { RessourceResponse } from './../models/ressource.response.model';

@Injectable({ providedIn: 'root' })
export class GarantieService extends GenericCrudService<Garantie> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, '/api/garanties');
    }

    // Récupérer les garanties avec une police donnée
    getGarantieWithPolicesById(policeId: number): Observable<Garantie[]> {
        return this.http.get<RessourceResponse<Garantie[]>>(`${this.baseUrl}/${this.endpoint}/find/by/police/${policeId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer les garanties avec une police donnée')),
            catchError(error => this.handleError(error, 'Récupérer les garanties avec une police donnée'))
        );
    }

    // Vérifier si la garantie est valide à une date de sinistre
    checkIfGarantieIsValid(garantieId: number, dateSinistre: Date): Observable<boolean> {
        return this.http.get<RessourceResponse<boolean>>(`${this.baseUrl}/${this.endpoint}/check/if/isvalid/${garantieId}`, {
            params: { dateSinistre: dateSinistre.toISOString().split('T')[0] }
        }).pipe(
            map(response => this.handleResponse(response, 'Vérifier si la garantie est valide')),
            catchError(error => this.handleError(error, 'Vérifier si la garantie est valide'))
        );
    }

    // Vérifier si le plafond assuré est atteint
    checkIfPlafondAssureAtteint(souscriptionId: number): Observable<boolean> {
    return this.http.get<RessourceResponse<boolean>>(`${this.baseUrl}/${this.endpoint}/check/if/plafond/atteint/${souscriptionId}`).pipe(
        map(response => this.handleResponse(response, 'Vérifier si le plafond assuré est atteint')),
        catchError(error => this.handleError(error, 'Vérifier si le plafond assuré est atteint'))
    );
    }

    // Calculer le montant assuré pour un sinistre
    calculateMontantAssure(garantieId: number, montantSinistre: number): Observable<number> {
    return this.http.get<RessourceResponse<number>>(`${this.baseUrl}/${this.endpoint}/calculate/montant/assure/${garantieId}`, {
        params: { montantSinistre: montantSinistre.toString() }
    }).pipe(
        map(response => this.handleResponse(response, 'Calculer le montant assuré pour un sinistre')),
        catchError(error => this.handleError(error, 'Calculer le montant assuré pour un sinistre'))
    );
    }
}
