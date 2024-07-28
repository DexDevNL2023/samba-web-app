import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DossierMedical } from '../models/medical-record.model';
import { Assure } from '../models/assure.model';
import { GenericCrudService } from './generic.crud.service';

@Injectable({ providedIn: 'root' })
export class MedicalRecordService extends GenericCrudService<DossierMedical> {

    constructor(http: HttpClient) {
        super(http, 'medical-records');
    }

    // Méthode pour récupérer le patient associé à un dossier médical spécifique
    getPatient(medicalRecordId: number): Observable<Assure> {
        return this.http.get<Assure>(`${this.baseUrl}/${this.endpoint}/${medicalRecordId}/patient`);
    }
}
