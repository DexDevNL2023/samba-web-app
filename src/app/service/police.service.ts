import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PoliceAssurance } from '../models/police-assurance.model';
import { Assurance } from '../models/assurance.model';
import { Garantie } from '../models/garantie.model';
import { Souscription } from '../models/souscription.model';
import { GenericCrudService } from './generic.crud.service';

@Injectable({ providedIn: 'root' })
export class PoliceAssuranceService extends GenericCrudService<PoliceAssurance> {

    constructor(http: HttpClient) {
        super(http, 'polices');
    }

    // Méthode pour récupérer l'assurance associée à une police d'assurance spécifique
    getAssurance(policeId: number): Observable<Assurance> {
        return this.http.get<Assurance>(`${this.baseUrl}/${this.endpoint}/${policeId}/assurance`);
    }

    // Méthode pour récupérer toutes les garanties associées à une police d'assurance
    getGaranties(policeId: number): Observable<Garantie[]> {
        return this.http.get<Garantie[]>(`${this.baseUrl}/${this.endpoint}/${policeId}/garanties`);
    }

    // Méthode pour récupérer toutes les souscriptions associées à une police d'assurance
    getSouscriptions(policeId: number): Observable<Souscription[]> {
        return this.http.get<Souscription[]>(`${this.baseUrl}/${this.endpoint}/${policeId}/souscriptions`);
    }
}
