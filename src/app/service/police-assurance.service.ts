import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { PoliceAssurance } from '../models/police-assurance.model';
import { GenericCrudService } from './generic.crud.service';
import { map, catchError } from 'rxjs/operators';
import { RessourceResponse } from './../models/ressource.response.model';

@Injectable({ providedIn: 'root' })
export class PoliceAssuranceService extends GenericCrudService<PoliceAssurance> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, 'api/polices/assurances');
    }

    // Récupérer toutes les polices d'assurance liées à une assurance donnée
    getAllWithAssuranceById(assuranceId: number): Observable<PoliceAssurance[]> {
        return this.http.get<RessourceResponse<PoliceAssurance[]>>(`${this.resourceUrl}/find/by/assurance/${assuranceId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer toutes les polices d\'assurance par assurance ID')),
            catchError(() => of([]))
        );
    }

    // Récupérer les polices d'assurance liées à une garantie spécifique
    getWithGarantiesById(garantieId: number): Observable<PoliceAssurance[]> {
        return this.http.get<RessourceResponse<PoliceAssurance[]>>(`${this.resourceUrl}/find/by/garantie/${garantieId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer les polices d\'assurance par garantie ID')),
            catchError(() => of([]))
        );
    }

    // Récupérer les polices d'assurance liées à une souscription spécifique
    getWithSouscriptionsById(souscriptionId: number): Observable<PoliceAssurance> {
        return this.http.get<RessourceResponse<PoliceAssurance>>(`${this.resourceUrl}/find/by/souscription/${souscriptionId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer les polices d\'assurance par souscription ID')),
            catchError(() => of(null))
        );
    }

    // Récupérer toutes les polices d'assurance liées à une assurance donnée
    getAll(): Observable<PoliceAssurance[]> {
        return this.http.get<RessourceResponse<PoliceAssurance[]>>(`${this.baseUrl}/api/public/police/assurance`).pipe(
            map(response => this.handleResponse(response, 'Récupérer toutes les polices d\'assurance')),
            catchError(() => of([]))
        );
    }

    // Récupérer toutes les polices d'assurance liées à une assurance donnée
    getById(id: number): Observable<PoliceAssurance> {
        return this.http.get<RessourceResponse<PoliceAssurance>>(`${this.baseUrl}/api/public/police/assurance/by/${id}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer toutes les polices d\'assurance')),
            catchError(() => of(null))
        );
    }
}
