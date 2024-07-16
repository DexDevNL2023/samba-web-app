import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericCrudService } from './generic.crud.service';
import { Observable } from 'rxjs';
import { Branche } from '../models/branche.model';
import { Fournisseur } from '../models/fournisseur.model';

@Injectable({ providedIn: 'root' })
export class BrancheService extends GenericCrudService<Branche> {

  constructor(http: HttpClient) {
      super(http, 'branches');
  }

  // Méthode pour récupérer toutes les partenaires associées à une branche
  getAllPartners(branchId: number): Observable<Fournisseur[]> {
      return this.http.get<Fournisseur[]>(`${this.baseUrl}/${this.endpoint}/${branchId}/partners`);
  }
}
