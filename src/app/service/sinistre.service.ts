import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sinistre } from '../models/sinistre.model';
import { Souscription } from '../models/souscription.model';
import { Fournisseur } from '../models/fournisseur.model';
import { Prestation } from '../models/prestation.model';
import { Reclamation } from '../models/reclamation.model';
import { DocumentSinistre } from '../models/document.model';
import { GenericCrudService } from './generic.crud.service';

@Injectable({ providedIn: 'root' })
export class SinistreService extends GenericCrudService<Sinistre> {

    constructor(http: HttpClient) {
        super(http, 'sinistres');
    }

    // Méthode pour récupérer la souscription associée à un sinistre spécifique
    getSouscription(sinistreId: number): Observable<Souscription> {
        return this.http.get<Souscription>(`${this.baseUrl}/${this.endpoint}/${sinistreId}/souscription`);
    }

    // Méthode pour récupérer le fournisseur associé à un sinistre spécifique
    getFournisseur(sinistreId: number): Observable<Fournisseur> {
        return this.http.get<Fournisseur>(`${this.baseUrl}/${this.endpoint}/${sinistreId}/fournisseur`);
    }

    // Méthode pour récupérer la prestation de soin associée à un sinistre spécifique
    getPrestations(sinistreId: number): Observable<Prestation[]> {
        return this.http.get<Prestation[]>(`${this.baseUrl}/${this.endpoint}/${sinistreId}/prestations`);
    }

    // Méthode pour récupérer les réclamations associées à un sinistre spécifique
    getReclamations(sinistreId: number): Observable<Reclamation[]> {
        return this.http.get<Reclamation[]>(`${this.baseUrl}/${this.endpoint}/${sinistreId}/reclamations`);
    }

    // Méthode pour récupérer les documents de sinistre associés à un sinistre spécifique
    getDocuments(sinistreId: number): Observable<DocumentSinistre[]> {
        return this.http.get<DocumentSinistre[]>(`${this.baseUrl}/${this.endpoint}/${sinistreId}/documents`);
    }
}
