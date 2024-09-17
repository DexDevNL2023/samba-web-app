import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fournisseur } from '../models/fournisseur.model';
import { GenericCrudService } from './generic.crud.service';
import { map, catchError } from 'rxjs/operators';
import { RessourceResponse } from './../models/ressource.response.model';

@Injectable({ providedIn: 'root' })
export class FournisseurService extends GenericCrudService<Fournisseur> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, '/api/fournisseurs');
    }

    // Récupérer les fournisseurs avec leurs branches
    getFournisseurWithBranchesById(brancheId: number): Observable<Fournisseur> {
        return this.http.get<RessourceResponse<Fournisseur>>(`${this.baseUrl}/find/by/branche/${brancheId}`).pipe(
            map(response => this.handleResponse(response, 'Fournisseur retrouvé avec branches')),
            catchError(error => this.handleError(error, 'Fournisseur retrouvé avec branches'))
        );
    }

    // Récupérer les fournisseurs avec leurs prestations
    getFournisseurWithPrestationsById(prestationId: number): Observable<Fournisseur> {
        return this.http.get<RessourceResponse<Fournisseur>>(`${this.baseUrl}/find/by/prestation/${prestationId}`).pipe(
            map(response => this.handleResponse(response, 'Fournisseur retrouvé avec prestations')),
            catchError(error => this.handleError(error, 'Fournisseur retrouvé avec prestations'))
        );
    }

    // Récupérer les fournisseurs avec leurs registrants
    getFournisseurWithRegistrantsById(registrantId: number): Observable<Fournisseur> {
        return this.http.get<RessourceResponse<Fournisseur>>(`${this.baseUrl}/find/by/registrant/${registrantId}`).pipe(
            map(response => this.handleResponse(response, 'Fournisseur retrouvé avec registrants')),
            catchError(error => this.handleError(error, 'Fournisseur retrouvé avec registrants'))
        );
    }
}
