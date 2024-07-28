import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Souscription } from '../models/souscription.model';
import { UserExtra } from '../models/assure.model';
import { PoliceAssurance } from '../models/police-assurance.model';
import { Paiement } from '../models/paiement.model';
import { Sinistre } from '../models/sinistre.model';
import { GenericCrudService } from './generic.crud.service';

@Injectable({ providedIn: 'root' })
export class SouscriptionService extends GenericCrudService<Souscription> {

    constructor(http: HttpClient) {
        super(http, 'souscriptions');
    }

    // Méthode pour récupérer l'utilisateur associé à une souscription spécifique
    getAssure(souscriptionId: number): Observable<UserExtra> {
        return this.http.get<UserExtra>(`${this.baseUrl}/${this.endpoint}/${souscriptionId}/assure`);
    }

    // Méthode pour récupérer la police d'assurance associée à une souscription spécifique
    getPoliceAssurance(souscriptionId: number): Observable<PoliceAssurance> {
        return this.http.get<PoliceAssurance>(`${this.baseUrl}/${this.endpoint}/${souscriptionId}/police`);
    }

    // Méthode pour récupérer les paiements associés à une souscription spécifique
    getPaiements(souscriptionId: number): Observable<Paiement[]> {
        return this.http.get<Paiement[]>(`${this.baseUrl}/${this.endpoint}/${souscriptionId}/paiements`);
    }

    // Méthode pour récupérer les sinistres associés à une souscription spécifique
    getSinistres(souscriptionId: number): Observable<Sinistre[]> {
        return this.http.get<Sinistre[]>(`${this.baseUrl}/${this.endpoint}/${souscriptionId}/sinistres`);
    }
}
