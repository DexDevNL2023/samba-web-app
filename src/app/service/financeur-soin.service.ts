import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FinanceurSoin } from '../models/financeur-soin.model';
import { PrestationSoin } from '../models/prestation-soin.model';
import { GenericCrudService } from './generic.crud.service';

@Injectable({ providedIn: 'root' })
export class FinanceurSoinService extends GenericCrudService<FinanceurSoin> {

    constructor(http: HttpClient) {
        super(http, 'financeurs-soin');
    }

    // Méthode pour récupérer les prestations associées à un financeur de soin spécifique
    getPrestations(financeurId: number): Observable<PrestationSoin[]> {
        return this.http.get<PrestationSoin[]>(`${this.baseUrl}/${this.endpoint}/${financeurId}/prestations`);
    }
}
