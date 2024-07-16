import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedicalDocument } from '../models/medical-document.model';
import { MedicalRecord } from '../models/medical-record.model';
import { GenericCrudService } from './generic.crud.service';

@Injectable({ providedIn: 'root' })
export class MedicalDocumentService extends GenericCrudService<MedicalDocument> {

    constructor(http: HttpClient) {
        super(http, 'medical-documents');
    }

    // Méthode pour récupérer le dossier médical associé à un document médical spécifique
    getMedicalRecord(medicalDocumentId: number): Observable<MedicalRecord> {
        return this.http.get<MedicalRecord>(`${this.baseUrl}/${this.endpoint}/${medicalDocumentId}/dossier`);
    }
}
