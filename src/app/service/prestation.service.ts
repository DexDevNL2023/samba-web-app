import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prestation } from '../models/prestation.model';
import { Fournisseur } from '../models/fournisseur.model';
import { Financeur } from '../models/financeur.model';
import { Sinistre } from '../models/sinistre.model';
import { GenericCrudService } from './generic.crud.service';

@Injectable({ providedIn: 'root' })
export class PrestationService extends GenericCrudService<Prestation> {

    constructor(http: HttpClient) {
        super(http, 'prestations-soin');
    }

    // Méthode pour récupérer le fournisseur associé à une prestation de soin spécifique
    getFournisseur(prestationId: number): Observable<Fournisseur> {
        return this.http.get<Fournisseur>(`${this.baseUrl}/${this.endpoint}/${prestationId}/fournisseur`);
    }

    // Méthode pour récupérer les financeurs associés à une prestation de soin spécifique
    getFinanceurs(prestationId: number): Observable<Financeur[]> {
        return this.http.get<Financeur[]>(`${this.baseUrl}/${this.endpoint}/${prestationId}/financeurs`);
    }

    // Méthode pour récupérer les sinistres associés à une prestation de soin spécifique
    getSinistre(prestationId: number): Observable<Sinistre> {
        return this.http.get<Sinistre>(`${this.baseUrl}/${this.endpoint}/${prestationId}/sinistre`);
    }
}
