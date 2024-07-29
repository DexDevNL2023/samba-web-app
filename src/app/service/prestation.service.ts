import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prestation } from '../models/prestation.model';
import { Fournisseur } from '../models/fournisseur.model';
import { Financeur } from '../models/financeur.model';
import { Sinistre } from '../models/sinistre.model';
import { GenericCrudService } from './generic.crud.service';
import { Document } from '../models/document.model';

@Injectable({ providedIn: 'root' })
export class PrestationService extends GenericCrudService<Prestation> {

    constructor(http: HttpClient) {
        super(http, 'prestations-soin');
    }

    // Méthode pour récupérer le fournisseur associé à une prestation de soin spécifique
    getAllFournisseurs(): Observable<Fournisseur[]> {
        return this.http.get<Fournisseur[]>(`${this.baseUrl}/${this.endpoint}/all/fournisseurs`);
    }

    // Méthode pour récupérer les financeurs associés à une prestation de soin spécifique
    getAllFinanceurs(): Observable<Financeur[]> {
        return this.http.get<Financeur[]>(`${this.baseUrl}/${this.endpoint}/all/financeurs`);
    }

    // Méthode pour récupérer les sinistres associés à une prestation de soin spécifique
    getAllSinistres(): Observable<Sinistre[]> {
        return this.http.get<Sinistre[]>(`${this.baseUrl}/${this.endpoint}/all/sinistrse`);
    }

    // Méthode pour récupérer les documents associés à une prestation de soin spécifique
    getAllDocuments(): Observable<Document[]> {
        return this.http.get<Document[]>(`${this.baseUrl}/${this.endpoint}/all/documents`);
    }
}
