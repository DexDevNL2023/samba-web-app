import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Assurance } from '../models/assurance.model';
import { GenericCrudService } from './generic.crud.service';
import { PoliceAssurance } from '../models/police-assurance.model';
import { Observable } from 'rxjs';
import { Rapport } from '../models/rapport.model';

@Injectable({ providedIn: 'root' })
export class AssuranceService extends GenericCrudService<Assurance> {

  constructor(http: HttpClient) {
      super(http, 'assurances');
  }

  // Méthode pour récupérer toutes les polices associées à une assurance
  getAllPolices(): Observable<PoliceAssurance[]> {
      return this.http.get<PoliceAssurance[]>(`${this.baseUrl}/${this.endpoint}/all/polices`);
  }

  // Méthode pour récupérer tous les rapports générés pour une assurance
  getAllRapports(): Observable<Rapport[]> {
      return this.http.get<Rapport[]>(`${this.baseUrl}/${this.endpoint}/all/rapports`);
  }
}
