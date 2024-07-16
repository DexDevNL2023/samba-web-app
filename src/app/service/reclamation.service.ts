import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reclamation } from '../models/reclamation.model';
import { Sinistre } from '../models/sinistre.model';
import { GenericCrudService } from './generic.crud.service';

@Injectable({ providedIn: 'root' })
export class ReclamationService extends GenericCrudService<Reclamation> {

    constructor(http: HttpClient) {
        super(http, 'reclamations');
    }

    // Méthode pour récupérer le sinistre associé à une réclamation spécifique
    getSinistre(reclamationId: number): Observable<Sinistre> {
        return this.http.get<Sinistre>(`${this.baseUrl}/${this.endpoint}/${reclamationId}/sinistre`);
    }
}
