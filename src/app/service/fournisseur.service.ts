import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fournisseur } from '../models/fournisseur.model';
import { PrestationSoin } from '../models/prestation-soin.model';
import { Sinistre } from '../models/sinistre.model';
import { GenericCrudService } from './generic.crud.service';

@Injectable({ providedIn: 'root' })
export class FournisseurService extends GenericCrudService<Fournisseur> {

    constructor(http: HttpClient) {
        super(http, 'fournisseurs');
    }

    // Méthode pour récupérer les prestations associées à un fournisseur spécifique
    getPrestations(fournisseurId: number): Observable<PrestationSoin[]> {
        return this.http.get<PrestationSoin[]>(`${this.baseUrl}/${this.endpoint}/${fournisseurId}/prestations`);
    }

    // Méthode pour récupérer les sinistres associés à un fournisseur spécifique
    getSinistres(fournisseurId: number): Observable<Sinistre[]> {
        return this.http.get<Sinistre[]>(`${this.baseUrl}/${this.endpoint}/${fournisseurId}/sinistres`);
    }
}
