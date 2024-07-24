import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentSinistre } from '../models/document-sinistre.model';
import { Sinistre } from '../models/sinistre.model';
import { GenericCrudService } from './generic.crud.service';

@Injectable({ providedIn: 'root' })
export class DocumentSinistreService extends GenericCrudService<DocumentSinistre> {

    constructor(http: HttpClient) {
        super(http, 'documents-sinistres');
    }

    // Méthode pour récupérer le sinistre associé à un document sinistre spécifique
    getAllSinistres(): Observable<Sinistre[]> {
        return this.http.get<Sinistre[]>(`${this.baseUrl}/${this.endpoint}/all/sinistre`);
    }
}
