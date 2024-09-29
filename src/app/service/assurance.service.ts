import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Assurance, InsuranceType } from '../models/assurance.model';
import { GenericCrudService } from './generic.crud.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RessourceResponse } from './../models/ressource.response.model';

@Injectable({
  providedIn: 'root',
})
export class AssuranceService extends GenericCrudService<Assurance> {
  constructor(http: HttpClient, toastService: ToastService) {
    super(http, toastService, 'api/assurances'); // Changer l'endpoint de base
  }

  // Récupérer une assurance avec ses polices par ID
  getAssuranceWithPolicesById(policeId: number): Observable<Assurance> {
    return this.http.get<RessourceResponse<Assurance>>(`${this.resourceUrl}/find/by/police/${policeId}`).pipe(
      map((response) => this.handleResponse(response, 'Récupérer une assurance avec ses polices')),
      catchError(() => of(null))
    );
  }

  // Récupérer les assurances par type
  getAssurancesByType(type: InsuranceType): Observable<Assurance[]> {
    return this.http.get<RessourceResponse<Assurance[]>>(`${this.resourceUrl}/find/by/type/${type}`).pipe(
      map((response) => this.handleResponse(response, 'Récupérer les assurances par type')),
      catchError(() => of([]))
    );
  }

  // Récupérer toutes les polices d'assurance liées à une assurance donnée
  getAll(): Observable<Assurance[]> {
      return this.http.get<RessourceResponse<Assurance[]>>(`${this.baseUrl}/api/public/assurance`).pipe(
          map(response => this.handleResponse(response, 'Récupérer toutes les polices d\'assurance')),
          catchError(() => of([]))
      );
  }

  // Récupérer toutes les polices d'assurance liées à une assurance donnée
  getById(id: number): Observable<Assurance> {
      return this.http.get<RessourceResponse<Assurance>>(`${this.baseUrl}/api/public/assurance/by/${id}`).pipe(
          map(response => this.handleResponse(response, 'Récupérer toutes les polices d\'assurance')),
          catchError(() => of(null))
      );
  }

  // Récupérer une assurance avec ses polices par ID
  getAssuranceByPoliceId(policeId: number): Observable<Assurance> {
    return this.http.get<RessourceResponse<Assurance>>(`${this.baseUrl}/api/public/assurance/by/police/${policeId}`).pipe(
      map((response) => this.handleResponse(response, 'Récupérer une assurance avec ses polices')),
      catchError(() => of(null))
    );
  }
}
