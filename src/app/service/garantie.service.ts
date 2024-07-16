import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Garantie } from '../models/garantie.model';
import { PoliceAssurance } from '../models/police-assurance.model';
import { GenericCrudService } from './generic.crud.service';

@Injectable({ providedIn: 'root' })
export class GarantieService extends GenericCrudService<Garantie> {

    constructor(http: HttpClient) {
        super(http, 'garanties');
    }

    // Méthode pour récupérer les polices d'assurance associées à une garantie spécifique
    getPolices(garantieId: number): Observable<PoliceAssurance[]> {
        return this.http.get<PoliceAssurance[]>(`${this.baseUrl}/${this.endpoint}/${garantieId}/polices`);
    }
}
