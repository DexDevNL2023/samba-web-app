import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DossierMedical } from '../models/dossier-medical.model';
import { GenericCrudService } from './generic.crud.service';
import { map, catchError } from 'rxjs/operators';
import { RessourceResponse } from './../models/ressource.response.model';

@Injectable({ providedIn: 'root' })
export class DossierMedicalService extends GenericCrudService<DossierMedical> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, '/api/dossiers/medicaux');
    }

    // Récupérer les dossiers médicaux d'un patient via son ID
    getDossierMedicalWithPatientById(patientId: number): Observable<DossierMedical[]> {
        return this.http.get<RessourceResponse<DossierMedical[]>>(`${this.baseUrl}/${this.endpoint}/find/by/patient/${patientId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer les dossiers médicaux')),
            catchError(error => this.handleError(error, 'Récupérer les dossiers médicaux'))
        );
    }

    // Récupérer les dossiers médicaux entre deux dates
    getDossierMedicalByDateUpdatedBetween(startDate: string, endDate: string): Observable<DossierMedical[]> {
        return this.http.get<RessourceResponse<DossierMedical[]>>(`${this.baseUrl}/${this.endpoint}/find/by/between/date`, {
        params: { startDate, endDate }
        }).pipe(
            map(response => this.handleResponse(response, 'Récupérer les dossiers médicaux par date')),
            catchError(error => this.handleError(error, 'Récupérer les dossiers médicaux par date'))
        );
    }
}
