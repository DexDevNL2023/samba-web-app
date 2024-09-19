import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericCrudService } from './generic.crud.service';
import { Observable, of } from 'rxjs';
import { Branche } from '../models/branche.model';
import { map, catchError } from 'rxjs/operators';
import { RessourceResponse } from './../models/ressource.response.model';

@Injectable({ providedIn: 'root' })
export class BrancheService extends GenericCrudService<Branche> {

  constructor(http: HttpClient, toastService: ToastService) {
    super(http, toastService, 'api/branches'); // Updated endpoint
  }

  // Fetch branch details by registrant ID
  getBrancheWithRegistrantsById(registrantId: number): Observable<Branche> {
    return this.http.get<RessourceResponse<Branche>>(`${this.resourceUrl}/find/by/registrant/${registrantId}`).pipe(
      map(response => this.handleResponse(response, 'Branche retrouvée avec succès!')),
      catchError(() => of(null))
    );
  }
}
