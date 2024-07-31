import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paiement, RecuPaiement } from '../models/paiement.model';
import { Souscription } from '../models/souscription.model';
import { GenericCrudService } from './generic.crud.service';

@Injectable({ providedIn: 'root' })
export class PaiementService extends GenericCrudService<Paiement> {

    constructor(http: HttpClient) {
        super(http, 'paiements');
    }
    
    // Méthode pour récupérer la souscription associée à un paiement spécifique
    getAllSouscriptions(): Observable<Souscription[]> {
        return this.http.get<Souscription[]>(`${this.baseUrl}/${this.endpoint}/all/souscriptions`);
    }

    // Méthode pour récupérer la reçu de paiement associée à un paiement spécifique
    getAllRecuPaiements(): Observable<RecuPaiement[]> {
        return this.http.get<RecuPaiement[]>(`${this.baseUrl}/${this.endpoint}/all/recu-paiements`);
    }
}
