import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Financeur } from '../models/financeur.model';
import { GenericCrudService } from './generic.crud.service';
import { map, catchError } from 'rxjs/operators';
import { RessourceResponse } from './../models/ressource.response.model';

@Injectable({ providedIn: 'root' })
export class FinanceurService extends GenericCrudService<Financeur> {

    constructor(http: HttpClient, toastService: ToastService) {
    super(http, toastService, 'api/financeurs');
    }

    // Récupérer les financeurs avec leurs prestations en fonction de l'ID de la prestation
    getFinanceurWithPrestationsById(prestationId: number): Observable<Financeur[]> {
        return this.http.get<RessourceResponse<Financeur[]>>(`${this.resourceUrl}/find/by/prestation/${prestationId}`).pipe(
            map(response => this.handleResponse(response, 'Financeur avec prestations trouvé')),
            catchError(() => of([]))
        );
    }
}
