import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Assurance } from '../models/assurance.model';
import { GenericCrudService } from './generic.crud.service';
import { PoliceAssurance } from '../models/police-assurance.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AssuranceService extends GenericCrudService<Assurance> {

  constructor(http: HttpClient, toastService: ToastService) {
      super(http, toastService, 'assurances');
  }

  // Méthode pour récupérer toutes les polices associées à une assurance
  getAllPolices(): Observable<PoliceAssurance[]> {
      return this.http.get<PoliceAssurance[]>(`${this.baseUrl}/${this.endpoint}/all/polices`);
  }
}
