import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedicalRecord } from '../models/medical-record.model';
import { MedicalDocument } from '../models/medical-document.model';
import { UserExtra } from '../models/user-extra.model';
import { GenericCrudService } from './generic.crud.service';

@Injectable({ providedIn: 'root' })
export class MedicalRecordService extends GenericCrudService<MedicalRecord> {

    constructor(http: HttpClient) {
        super(http, 'medical-records');
    }

    // Méthode pour récupérer tous les documents médicaux associés à un dossier médical spécifique
    getMedicalDocuments(medicalRecordId: number): Observable<MedicalDocument[]> {
        return this.http.get<MedicalDocument[]>(`${this.baseUrl}/${this.endpoint}/${medicalRecordId}/documents`);
    }

    // Méthode pour récupérer le patient associé à un dossier médical spécifique
    getPatient(medicalRecordId: number): Observable<UserExtra> {
        return this.http.get<UserExtra>(`${this.baseUrl}/${this.endpoint}/${medicalRecordId}/patient`);
    }
}
